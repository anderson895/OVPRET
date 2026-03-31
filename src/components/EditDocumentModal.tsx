import React, { useState, useRef, useEffect } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import LinearProgress from '@mui/material/LinearProgress'
import IconButton from '@mui/material/IconButton'
import Grid from '@mui/material/Grid'
import CloseIcon from '@mui/icons-material/Close'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import DeleteIcon from '@mui/icons-material/Delete'
import type { RETDocument, AppUser } from '../types'
import { editDocument } from '../services/documents'
import { uploadFile, validateFile, formatFileSize, ALLOWED_TYPES } from '../services/cloudinary'
import { logError } from '../services/errorLogger'

interface Props {
  document: RETDocument | null; open: boolean
  onClose: () => void; onSuccess: () => void; user: AppUser
}

const DOC_TYPES = [
  'Accomplishment Report',
  'Request for Incentives',
  'Request for Training / Research Activities',
  'Financial',
  'Proposals',
  'Memorandums',
  'Endorsements',
]

const OFFICES = [
  'Office of the Research Director',
  'Office of the Knowledge and Technology Transfer',
  'Office of the Extension Director',
]

export const EditDocumentModal: React.FC<Props> = ({ document: doc, open, onClose, onSuccess, user }) => {
  const [form, setForm] = useState({ title: '', type: '', department: '', remarks: '' })
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (doc) {
      setForm({ title: doc.title || '', type: doc.type || '', department: doc.department || '', remarks: doc.remarks || '' })
      setFile(null); setError('')
    }
  }, [doc])

  if (!doc) return null

  const field = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleFile = (f: File) => {
    const err = validateFile(f)
    if (err) { setError(err); return }
    setError(''); setFile(f)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragging(false)
    const f = e.dataTransfer.files[0]; if (f) handleFile(f)
  }

  const handleClose = () => { if (!uploading) { setError(''); setFile(null); onClose() } }

  const handleSave = async () => {
    if (!form.title.trim()) { setError('Document title is required.'); return }
    if (!form.type) { setError('Please select a document type.'); return }
    if (!form.department.trim()) { setError('Office is required.'); return }
    setError(''); setUploading(true)
    try {
      let fileUrl = doc.fileUrl
      let fileName = doc.fileName
      if (file) {
        const r = await uploadFile(file)
        fileUrl = r.url; fileName = r.fileName
      }
      await editDocument({
        docId: doc.id, retId: doc.retId, docTitle: doc.title,
        title: form.title.trim(), type: form.type,
        department: form.department.trim(), remarks: form.remarks.trim(),
        fileUrl, fileName,
        staffName: user.displayName, staffEmail: user.email,
        currentHistory: doc.history || [],
      })
      handleClose(); onSuccess()
    } catch (e: any) {
      const msg = e.message || 'Failed to save changes.'
      setError(msg)
      logError({ message: msg, error: e, component: 'EditDocumentModal', action: 'edit_document', userId: user.uid, userEmail: user.email, userRole: user.role })
    } finally { setUploading(false) }
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', pb: 1.5, borderBottom: '1px solid rgba(123,28,46,0.1)' }}>
        <Box>
          <Typography sx={{ fontWeight: 700, color: '#1C0A0E', fontSize: '1rem' }}>Edit Document</Typography>
          <Typography sx={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '0.65rem', color: '#c9952a', mt: 0.3 }}>{doc.retId}</Typography>
        </Box>
        <IconButton onClick={handleClose} disabled={uploading} size="small" sx={{ color: '#8B7A6B' }}><CloseIcon fontSize="small" /></IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3, pb: 3 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {uploading && <LinearProgress sx={{ mb: 2 }} />}

        <Alert severity="info" sx={{ mb: 2.5, fontSize: '0.75rem' }}>
          Editing will reset the document status to <strong>Pending</strong> for re-review by the VP.
        </Alert>

        <Grid container spacing={2.5}>
          <Grid item xs={12}>
            <TextField label="Document Title *" fullWidth value={form.title} onChange={field('title')} disabled={uploading} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField select label="Document Type *" fullWidth value={form.type} onChange={field('type')} disabled={uploading} SelectProps={{ displayEmpty: true }}>
              <MenuItem value="">Select type...</MenuItem>
              {DOC_TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField select label="Office *" fullWidth value={form.department} onChange={field('department')} disabled={uploading} SelectProps={{ displayEmpty: true }}>
              <MenuItem value="">Select office...</MenuItem>
              {OFFICES.map((d) => <MenuItem key={d} value={d}>{d}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField label="Remarks / Notes" fullWidth multiline minRows={3} value={form.remarks} onChange={field('remarks')} disabled={uploading} />
          </Grid>
          <Grid item xs={12}>
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '1.5px', color: '#6B4050', textTransform: 'uppercase', mb: 1 }}>
              Replace Attached File {doc.fileName && <span style={{ fontWeight: 400, textTransform: 'none' }}>(current: {doc.fileName})</span>}
            </Typography>
            {file ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 2, border: '1px solid rgba(123,28,46,0.15)', borderRadius: 1.5, bgcolor: '#F9F6F1' }}>
                <InsertDriveFileIcon sx={{ color: '#c9952a', fontSize: 28 }} />
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: '0.82rem', fontWeight: 600 }}>{file.name}</Typography>
                  <Typography sx={{ fontSize: '0.68rem', color: '#8B7A6B', fontFamily: "'IBM Plex Mono',monospace" }}>{formatFileSize(file.size)}</Typography>
                </Box>
                <IconButton onClick={() => setFile(null)} disabled={uploading} size="small" sx={{ color: '#c62828' }}><DeleteIcon fontSize="small" /></IconButton>
              </Box>
            ) : (
              <Box
                onClick={() => !uploading && fileRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                sx={{ border: `2px dashed ${dragging ? '#c9952a' : 'rgba(123,28,46,0.2)'}`, borderRadius: 1.5, p: 3, textAlign: 'center', cursor: uploading ? 'not-allowed' : 'pointer', bgcolor: dragging ? '#F9F6F1' : 'transparent', transition: 'all 0.15s', '&:hover': { borderColor: '#c9952a' } }}
              >
                <CloudUploadIcon sx={{ fontSize: 28, color: '#8B7A6B', mb: 0.5 }} />
                <Typography sx={{ fontSize: '0.78rem', color: '#6B4050' }}>
                  Drag & drop or <Box component="span" sx={{ color: '#c9952a', fontWeight: 600 }}>click to browse</Box>
                </Typography>
              </Box>
            )}
            <input ref={fileRef} type="file" hidden accept={ALLOWED_TYPES.join(',')} onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 2, borderTop: '1px solid rgba(123,28,46,0.1)', gap: 1 }}>
        <Button onClick={handleClose} disabled={uploading} variant="outlined" sx={{ fontSize: '0.72rem' }}>Cancel</Button>
        <Button onClick={handleSave} disabled={uploading} variant="contained" color="secondary" sx={{ fontSize: '0.72rem', minWidth: 160 }}>
          {uploading ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
