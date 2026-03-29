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

interface Props {
  open: boolean; onClose: () => void
  onSuccess: (retId: string) => void; user: AppUser
}

const DOC_TYPES = ['Research','Extension','Technology','Financial','Proposal','Administrative','MOA','Other']
const DEPARTMENTS = [
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
    if (!form.department.trim()) { setError('Department is required.'); return }
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
      setError(e.message || 'Submission failed.')
    } finally { setUploading(false) }
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth PaperProps={{ sx: { bgcolor: '#0f1e2e' } }}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', pb: 1.5, borderBottom: '1px solid rgba(245,168,0,0.2)' }}>
        <Box>
          <Typography sx={{ fontWeight: 700, color: '#fff', fontSize: '1rem' }}>Submit RET Document</Typography>
          <Typography sx={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '0.6rem', color: '#8fa3b8', mt: 0.3, letterSpacing: '1px' }}>
            Process 1.0 — VP will be notified via email upon submission
          </Typography>
        </Box>
        <IconButton onClick={handleClose} disabled={uploading} size="small" sx={{ color: '#8fa3b8', mt: -0.5 }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {uploading && (
          <Box sx={{ mb: 2 }}>
            <Typography sx={{ fontSize: '0.7rem', color: '#8fa3b8', mb: 0.5 }}>
              {progress < 65 ? 'Uploading file...' : progress < 85 ? 'Saving document...' : 'Sending notification to VP...'}
            </Typography>
            <LinearProgress variant="determinate" value={progress} />
          </Box>
        )}

        <Grid container spacing={2.5}>
          <Grid item xs={12}>
            <TextField label="Document Title *" fullWidth value={form.title} onChange={field('title')} disabled={uploading} placeholder="e.g., Q1 Budget Request FY 2024" InputLabelProps={{ shrink: true }} inputProps={{ style: { fontSize: '0.85rem', color: '#f0e8d0' } }} sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(245,168,0,0.3)' }, '&:hover fieldset': { borderColor: 'rgba(245,168,0,0.6)' }, '&.Mui-focused fieldset': { borderColor: '#F5A800' }, '& input::placeholder': { color: '#6a8aaa', opacity: 1 }, '& textarea::placeholder': { color: '#6a8aaa', opacity: 1 } }, '& .MuiInputLabel-root': { color: '#a8bfd4', fontSize: '0.8rem', bgcolor: '#0f1e2e', px: 0.5 }, '& .MuiInputLabel-root.Mui-focused': { color: '#F5A800' } }} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField select label="Document Type *" fullWidth value={form.type} onChange={field('type')} disabled={uploading} InputLabelProps={{ shrink: true }} inputProps={{ style: { fontSize: '0.85rem', color: '#f0e8d0' } }}
              sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(245,168,0,0.3)' }, '&:hover fieldset': { borderColor: 'rgba(245,168,0,0.6)' }, '&.Mui-focused fieldset': { borderColor: '#F5A800' } }, '& .MuiSelect-icon': { color: '#a8bfd4' }, '& .MuiSelect-select': { color: '#f0e8d0', fontSize: '0.85rem' }, '& .MuiInputLabel-root': { color: '#a8bfd4', fontSize: '0.8rem', bgcolor: '#0f1e2e', px: 0.5 }, '& .MuiInputLabel-root.Mui-focused': { color: '#F5A800' } }}
              SelectProps={{ displayEmpty: true, MenuProps: { PaperProps: { sx: { bgcolor: '#0f1e2e', border: '1px solid rgba(245,168,0,0.25)', '& .MuiMenuItem-root': { fontSize: '0.85rem', color: '#f0e8d0', '&:hover': { bgcolor: 'rgba(245,168,0,0.1)' }, '&.Mui-selected': { bgcolor: 'rgba(245,168,0,0.15)', color: '#F5A800', '&:hover': { bgcolor: 'rgba(245,168,0,0.2)' } } } } } } }}>
              <MenuItem value="" sx={{ fontSize: '0.85rem', color: '#6a8aaa', fontStyle: 'italic' }}>Select type...</MenuItem>
              {DOC_TYPES.map((t) => <MenuItem key={t} value={t} sx={{ fontSize: '0.85rem' }}>{t}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField select label="Department / Office *" fullWidth value={form.department} onChange={field('department')} disabled={uploading} InputLabelProps={{ shrink: true }} inputProps={{ style: { fontSize: '0.85rem', color: '#f0e8d0' } }}
              sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(245,168,0,0.3)' }, '&:hover fieldset': { borderColor: 'rgba(245,168,0,0.6)' }, '&.Mui-focused fieldset': { borderColor: '#F5A800' } }, '& .MuiSelect-icon': { color: '#a8bfd4' }, '& .MuiSelect-select': { color: '#f0e8d0', fontSize: '0.85rem' }, '& .MuiInputLabel-root': { color: '#a8bfd4', fontSize: '0.8rem', bgcolor: '#0f1e2e', px: 0.5 }, '& .MuiInputLabel-root.Mui-focused': { color: '#F5A800' } }}
              SelectProps={{ displayEmpty: true, MenuProps: { PaperProps: { sx: { bgcolor: '#0f1e2e', border: '1px solid rgba(245,168,0,0.25)', '& .MuiMenuItem-root': { fontSize: '0.85rem', color: '#f0e8d0', '&:hover': { bgcolor: 'rgba(245,168,0,0.1)' }, '&.Mui-selected': { bgcolor: 'rgba(245,168,0,0.15)', color: '#F5A800', '&:hover': { bgcolor: 'rgba(245,168,0,0.2)' } } } } } } }}>
              <MenuItem value="" sx={{ fontSize: '0.85rem', color: '#6a8aaa', fontStyle: 'italic' }}>Select department...</MenuItem>
              {DEPARTMENTS.map((d) => <MenuItem key={d} value={d} sx={{ fontSize: '0.85rem' }}>{d}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField label="Remarks / Notes" fullWidth multiline minRows={3} value={form.remarks} onChange={field('remarks')} disabled={uploading} placeholder="Optional — any notes for the VP..." InputLabelProps={{ shrink: true }} inputProps={{ style: { fontSize: '0.85rem', color: '#f0e8d0' } }} sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(245,168,0,0.3)' }, '&:hover fieldset': { borderColor: 'rgba(245,168,0,0.6)' }, '&.Mui-focused fieldset': { borderColor: '#F5A800' }, '& input::placeholder': { color: '#6a8aaa', opacity: 1 }, '& textarea::placeholder': { color: '#6a8aaa', opacity: 1 } }, '& .MuiInputLabel-root': { color: '#a8bfd4', fontSize: '0.8rem', bgcolor: '#0f1e2e', px: 0.5 }, '& .MuiInputLabel-root.Mui-focused': { color: '#F5A800' } }} />
          </Grid>
          <Grid item xs={12}>
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '1.5px', color: '#8fa3b8', textTransform: 'uppercase', mb: 1 }}>Attach Document</Typography>
            {file ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 2, border: '1px solid rgba(245,168,0,0.3)', borderRadius: 1.5, bgcolor: 'rgba(245,168,0,0.05)' }}>
                <InsertDriveFileIcon sx={{ color: '#c9952a', fontSize: 28 }} />
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#fff' }}>{file.name}</Typography>
                  <Typography sx={{ fontSize: '0.68rem', color: '#8fa3b8', fontFamily: "'IBM Plex Mono',monospace" }}>{formatFileSize(file.size)}</Typography>
                </Box>
                <IconButton onClick={() => setFile(null)} disabled={uploading} size="small" sx={{ color: '#ef5350' }}><DeleteIcon fontSize="small" /></IconButton>
              </Box>
            ) : (
              <Box onClick={() => !uploading && fileRef.current?.click()} onDragOver={(e) => { e.preventDefault(); setDragging(true) }} onDragLeave={() => setDragging(false)} onDrop={handleDrop}
                sx={{ border: `2px dashed ${dragging ? '#c9952a' : 'rgba(245,168,0,0.25)'}`, borderRadius: 1.5, p: 4, textAlign: 'center', cursor: uploading ? 'not-allowed' : 'pointer', bgcolor: dragging ? 'rgba(245,168,0,0.05)' : 'transparent', transition: 'all 0.15s', '&:hover': { borderColor: '#c9952a' } }}>
                <CloudUploadIcon sx={{ fontSize: 34, color: '#8fa3b8', mb: 1 }} />
                <Typography sx={{ fontSize: '0.82rem', color: '#8fa3b8' }}>
                  Drag & drop or <Box component="span" sx={{ color: '#c9952a', fontWeight: 600 }}>click to browse</Box>
                </Typography>
                <Typography sx={{ fontSize: '0.68rem', color: '#8fa3b8', mt: 0.5 }}>{ALLOWED_TYPES.join(', ')} — max 10 MB</Typography>
              </Box>
            )}
            <input ref={fileRef} type="file" hidden accept={ALLOWED_TYPES.join(',')} onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 2, borderTop: '1px solid rgba(245,168,0,0.2)', gap: 1 }}>
        <Button onClick={handleClose} disabled={uploading} variant="outlined" sx={{ fontSize: '0.72rem' }}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={uploading} variant="contained" sx={{ fontSize: '0.72rem', minWidth: 180 }}>
          {uploading ? 'Submitting...' : 'Submit for VP Approval'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
