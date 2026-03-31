import React, { useState, useRef } from 'react'
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
import type { AppUser } from '../types'
import { submitDocument } from '../services/documents'
import { uploadFile, validateFile, formatFileSize, ALLOWED_TYPES } from '../services/cloudinary'
import { logError } from '../services/errorLogger'

interface Props {
  open: boolean; onClose: () => void
  onSuccess: (retId: string) => void; user: AppUser
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
  'Office of the Knowledge Technology Transfer',
  'Office of the Extension Director',
]

export const SubmitDocumentModal: React.FC<Props> = ({ open, onClose, onSuccess, user }) => {
  const [form, setForm] = useState({ title: '', type: '', department: user.department || '', remarks: '' })
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

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

  const handleClose = () => {
    if (uploading) return
    setForm({ title: '', type: '', department: user.department || '', remarks: '' })
    setFile(null); setError(''); setProgress(0); onClose()
  }

  const handleSubmit = async () => {
    if (!form.title.trim()) { setError('Document title is required.'); return }
    if (!form.type)         { setError('Please select a document type.'); return }
    if (!form.department.trim()) { setError('Office is required.'); return }
    setError(''); setUploading(true); setProgress(10)
    try {
      let fileUrl: string | null = null
      let fileName: string | null = null
      if (file) {
        setProgress(30)
        const r = await uploadFile(file)
        fileUrl = r.url; fileName = r.fileName
        setProgress(65)
      }
      setProgress(80)
      const retId = await submitDocument({
        title: form.title.trim(), type: form.type,
        department: form.department.trim(), remarks: form.remarks.trim(),
        fileUrl, fileName,
        submittedBy: user.displayName, submittedByEmail: user.email, submittedByUid: user.uid,
      })
      setProgress(100)
      await new Promise((r) => setTimeout(r, 300))
      handleClose(); onSuccess(retId)
    } catch (e: any) {
      const msg = e.message || 'Submission failed.'
      setError(msg)
      logError({ message: msg, error: e, component: 'SubmitDocumentModal', action: 'submit', userId: user.uid, userEmail: user.email, userRole: user.role })
    } finally { setUploading(false) }
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', pb: 1.5, borderBottom: '1px solid rgba(123,28,46,0.1)' }}>
        <Box>
          <Typography sx={{ fontWeight: 700, color: '#1C0A0E', fontSize: '1rem' }}>Submit RET Document</Typography>
          <Typography sx={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '0.6rem', color: '#8B7A6B', mt: 0.5, letterSpacing: '1px' }}>
            OVPRET · Document Tracking System
          </Typography>
        </Box>
        <IconButton onClick={handleClose} disabled={uploading} size="small" sx={{ color: '#8B7A6B', mt: -0.5 }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3, pb: 3 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {uploading && (
          <Box sx={{ mb: 2 }}>
            <Typography sx={{ fontSize: '0.7rem', color: '#6B4050', mb: 0.5 }}>
              {progress < 65 ? 'Uploading file...' : progress < 85 ? 'Saving document...' : 'Sending notification...'}
            </Typography>
            <LinearProgress variant="determinate" value={progress} />
          </Box>
        )}

        <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
          <Grid item xs={12}>
            <TextField
              label="Document Title *" fullWidth
              value={form.title} onChange={field('title')} disabled={uploading}
              placeholder="e.g., Q1 Accomplishment Report FY 2024"
              inputProps={{ style: { fontSize: '0.85rem' } }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select label="Document Type *" fullWidth
              value={form.type} onChange={field('type')} disabled={uploading}
              SelectProps={{ displayEmpty: true }}
            >
              <MenuItem value="" sx={{ fontSize: '0.85rem', color: '#8B7A6B', fontStyle: 'italic' }}>Select type...</MenuItem>
              {DOC_TYPES.map((t) => <MenuItem key={t} value={t} sx={{ fontSize: '0.85rem' }}>{t}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select label="Office *" fullWidth
              value={form.department} onChange={field('department')} disabled={uploading}
              SelectProps={{ displayEmpty: true }}
            >
              <MenuItem value="" sx={{ fontSize: '0.85rem', color: '#8B7A6B', fontStyle: 'italic' }}>Select office...</MenuItem>
              {OFFICES.map((d) => <MenuItem key={d} value={d} sx={{ fontSize: '0.85rem' }}>{d}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Remarks / Notes" fullWidth multiline minRows={3}
              value={form.remarks} onChange={field('remarks')} disabled={uploading}
              placeholder="Optional — any notes for the VP..."
              inputProps={{ style: { fontSize: '0.85rem' } }}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '1.5px', color: '#6B4050', textTransform: 'uppercase', mb: 1 }}>Attach Document</Typography>
            {file ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 2, border: '1px solid rgba(123,28,46,0.15)', borderRadius: 1.5, bgcolor: '#F9F6F1' }}>
                <InsertDriveFileIcon sx={{ color: '#c9952a', fontSize: 28 }} />
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#1C0A0E' }}>{file.name}</Typography>
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
                sx={{ border: `2px dashed ${dragging ? '#c9952a' : 'rgba(123,28,46,0.2)'}`, borderRadius: 1.5, p: 4, textAlign: 'center', cursor: uploading ? 'not-allowed' : 'pointer', bgcolor: dragging ? '#F9F6F1' : 'transparent', transition: 'all 0.15s', '&:hover': { borderColor: '#c9952a' } }}
              >
                <CloudUploadIcon sx={{ fontSize: 34, color: '#8B7A6B', mb: 1 }} />
                <Typography sx={{ fontSize: '0.82rem', color: '#6B4050' }}>
                  Drag & drop or <Box component="span" sx={{ color: '#c9952a', fontWeight: 600 }}>click to browse</Box>
                </Typography>
                <Typography sx={{ fontSize: '0.68rem', color: '#8B7A6B', mt: 0.5 }}>{ALLOWED_TYPES.join(', ')} — max 10 MB</Typography>
              </Box>
            )}
            <input ref={fileRef} type="file" hidden accept={ALLOWED_TYPES.join(',')} onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 2, borderTop: '1px solid rgba(123,28,46,0.1)', gap: 1 }}>
        <Button onClick={handleClose} disabled={uploading} variant="outlined" sx={{ fontSize: '0.72rem' }}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={uploading} variant="contained" color="secondary" sx={{ fontSize: '0.72rem', minWidth: 180 }}>
          {uploading ? 'Submitting...' : 'Submit Document'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
