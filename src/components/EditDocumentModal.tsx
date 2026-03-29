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
import Chip from '@mui/material/Chip'
import CloseIcon from '@mui/icons-material/Close'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import LinkIcon from '@mui/icons-material/Link'
import type { RETDocument, AppUser } from '../types'
import { editDocument } from '../services/documents'
import { uploadFile, validateFile, formatFileSize, ALLOWED_TYPES } from '../services/cloudinary'

interface Props {
  document: RETDocument | null
  open: boolean
  onClose: () => void
  onSuccess: () => void
  user: AppUser
}

const DOC_TYPES = ['Research','Extension','Technology','Financial','Proposal','Administrative','MOA','Other']
const DEPARTMENTS = [
  'Office of the Research Director',
  'Office of the Knowledge Technology Transfer',
  'Office of the Extension Director',
]

const LABEL_PROPS = {
  shrink: true,
  style: { fontSize: '0.8rem', color: '#a8bfd4', background: '#0f1e2e', padding: '0 4px' }
}

const FIELD_SX = {
  '& .MuiOutlinedInput-root': {
    '& fieldset': { borderColor: 'rgba(245,168,0,0.3)' },
    '&:hover fieldset': { borderColor: 'rgba(245,168,0,0.6)' },
    '&.Mui-focused fieldset': { borderColor: '#F5A800' },
  },
  '& .MuiInputLabel-root.Mui-focused': { color: '#F5A800' },
}

const TEXT_SX = {
  ...FIELD_SX,
  '& .MuiInputBase-input::placeholder': { color: '#6a8aaa', opacity: 1 },
  '& .MuiInputBase-inputMultiline::placeholder': { color: '#6a8aaa', opacity: 1 },
}

const MENU_PROPS = {
  PaperProps: {
    sx: {
      bgcolor: '#0f1e2e',
      border: '1px solid #2a3545',
      '& .MuiMenuItem-root': {
        fontSize: '0.85rem', color: '#f0e8d0',
        '&:hover': { bgcolor: '#1a2535' },
        '&.Mui-selected': { bgcolor: '#1e2a38', color: '#F5A800', '&:hover': { bgcolor: '#243040' } }
      }
    }
  }
}

export const EditDocumentModal: React.FC<Props> = ({ document: doc, open, onClose, onSuccess, user }) => {
  const [form, setForm] = useState({ title: '', type: '', department: '', remarks: '' })
  const [file, setFile] = useState<File | null>(null)
  const [replaceFile, setReplaceFile] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (doc && open) {
      setForm({
        title: doc.title || '',
        type: doc.type || '',
        department: doc.department || '',
        remarks: doc.remarks || '',
      })
      setFile(null)
      setReplaceFile(false)
      setError('')
      setProgress(0)
    }
  }, [doc, open])

  if (!doc) return null

  const field = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleFile = (f: File) => {
    const err = validateFile(f)
    if (err) { setError(err); return }
    setFile(f); setError('')
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragging(false)
    const f = e.dataTransfer.files[0]; if (f) handleFile(f)
  }

  const handleClose = () => {
    if (uploading) return
    setFile(null); setError(''); setProgress(0); setReplaceFile(false); onClose()
  }

  const handleSave = async () => {
    if (!form.title.trim()) { setError('Document title is required.'); return }
    if (!form.type)         { setError('Please select a document type.'); return }
    if (!form.department.trim()) { setError('Department is required.'); return }
    setError(''); setUploading(true); setProgress(10)
    try {
      let fileUrl: string | null = doc.fileUrl
      let fileName: string | null = doc.fileName

      if (replaceFile && file) {
        setProgress(30)
        const r = await uploadFile(file)
        fileUrl = r.url; fileName = r.fileName
        setProgress(65)
      }

      setProgress(80)
      await editDocument({
        docId: doc.id, retId: doc.retId, docTitle: doc.title,
        title: form.title.trim(), type: form.type,
        department: form.department.trim(), remarks: form.remarks.trim(),
        fileUrl, fileName,
        staffName: user.displayName, staffEmail: user.email,
        currentHistory: doc.history || [],
      })
      setProgress(100)
      await new Promise((r) => setTimeout(r, 300))
      handleClose(); onSuccess()
    } catch (e: any) {
      setError(e.message || 'Update failed.')
    } finally { setUploading(false) }
  }

  const hasChanges =
    form.title !== (doc.title || '') ||
    form.type !== (doc.type || '') ||
    form.department !== (doc.department || '') ||
    form.remarks !== (doc.remarks || '') ||
    (replaceFile && !!file)

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth PaperProps={{ sx: { bgcolor: '#0f1e2e' } }}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', pb: 1.5, borderBottom: '1px solid #243040' }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <EditIcon sx={{ fontSize: 18, color: '#F5A800' }} />
            <Typography sx={{ fontWeight: 700, color: '#fff', fontSize: '1rem' }}>Edit Document</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Typography sx={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '0.6rem', color: '#c9952a', letterSpacing: '1px' }}>
              {doc.retId}
            </Typography>
            <Typography sx={{ fontSize: '0.6rem', color: '#8fa3b8' }}>·</Typography>
            <Typography sx={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '0.6rem', color: '#8fa3b8' }}>
              Saving will reset status to Pending
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={handleClose} disabled={uploading} size="small" sx={{ color: '#8fa3b8', mt: -0.5 }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3.5, pb: 3 }}>
        {error && <Alert severity="error" sx={{ mb: 2, fontSize: '0.78rem' }}>{error}</Alert>}
        {uploading && (
          <Box sx={{ mb: 2 }}>
            <Typography sx={{ fontSize: '0.7rem', color: '#8fa3b8', mb: 0.5 }}>
              {progress < 65 ? 'Uploading new file...' : progress < 85 ? 'Saving changes...' : 'Finalizing...'}
            </Typography>
            <LinearProgress variant="determinate" value={progress} />
          </Box>
        )}

        <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
          <Grid item xs={12}>
            <TextField
              label="Document Title *" fullWidth
              value={form.title} onChange={field('title')} disabled={uploading}
              placeholder="e.g., Q1 Budget Request FY 2024"
              InputLabelProps={LABEL_PROPS}
              inputProps={{ style: { fontSize: '0.85rem', color: '#f0e8d0' } }}
              sx={TEXT_SX}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select label="Document Type *" fullWidth
              value={form.type} onChange={field('type')} disabled={uploading}
              InputLabelProps={LABEL_PROPS}
              inputProps={{ style: { fontSize: '0.85rem', color: '#f0e8d0' } }}
              sx={{ ...FIELD_SX, '& .MuiSelect-icon': { color: '#a8bfd4' }, '& .MuiSelect-select': { color: form.type ? '#f0e8d0' : '#6a8aaa', fontSize: '0.85rem' } }}
              SelectProps={{ displayEmpty: true, MenuProps: MENU_PROPS }}
            >
              <MenuItem value="" sx={{ fontSize: '0.85rem', color: '#6a8aaa', fontStyle: 'italic' }}>Select type...</MenuItem>
              {DOC_TYPES.map((t) => <MenuItem key={t} value={t} sx={{ fontSize: '0.85rem' }}>{t}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select label="Department / Office *" fullWidth
              value={form.department} onChange={field('department')} disabled={uploading}
              InputLabelProps={LABEL_PROPS}
              inputProps={{ style: { fontSize: '0.85rem', color: '#f0e8d0' } }}
              sx={{ ...FIELD_SX, '& .MuiSelect-icon': { color: '#a8bfd4' }, '& .MuiSelect-select': { color: form.department ? '#f0e8d0' : '#6a8aaa', fontSize: '0.85rem' } }}
              SelectProps={{ displayEmpty: true, MenuProps: MENU_PROPS }}
            >
              <MenuItem value="" sx={{ fontSize: '0.85rem', color: '#6a8aaa', fontStyle: 'italic' }}>Select department...</MenuItem>
              {DEPARTMENTS.map((d) => <MenuItem key={d} value={d} sx={{ fontSize: '0.85rem' }}>{d}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Remarks / Notes" fullWidth multiline minRows={3}
              value={form.remarks} onChange={field('remarks')} disabled={uploading}
              placeholder="Optional — any notes for the VP..."
              InputLabelProps={LABEL_PROPS}
              inputProps={{ style: { fontSize: '0.85rem', color: '#f0e8d0' } }}
              sx={TEXT_SX}
            />
          </Grid>

          {/* File section */}
          <Grid item xs={12}>
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '1.5px', color: '#8fa3b8', textTransform: 'uppercase', mb: 1.2 }}>
              Attached File
            </Typography>

            {/* Current file */}
            {doc.fileUrl && !replaceFile && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: '12px 16px', border: '1px solid #243040', borderRadius: 1.5, bgcolor: '#111f2e', mb: 1.5 }}>
                <InsertDriveFileIcon sx={{ color: '#c9952a', fontSize: 24 }} />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontSize: '0.8rem', color: '#f0e8d0', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {doc.fileName || 'Attached file'}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mt: 0.3 }}>
                    <Chip label="Current" size="small" sx={{ fontSize: '0.55rem', height: 18, bgcolor: '#1e2a38', color: '#F5A800', fontWeight: 700 }} />
                    {doc.fileUrl && (
                      <Box component="a" href={doc.fileUrl} target="_blank" rel="noopener noreferrer"
                        sx={{ display: 'flex', alignItems: 'center', gap: 0.4, color: '#8fa3b8', fontSize: '0.62rem', textDecoration: 'none', '&:hover': { color: '#c9952a' } }}>
                        <LinkIcon sx={{ fontSize: 12 }} /> View file
                      </Box>
                    )}
                  </Box>
                </Box>
                <Button
                  size="small" variant="outlined"
                  onClick={() => setReplaceFile(true)}
                  disabled={uploading}
                  sx={{ fontSize: '0.62rem', py: 0.4, px: 1.2, borderColor: 'rgba(245,168,0,0.3)', color: '#c9952a', '&:hover': { borderColor: '#c9952a', bgcolor: '#162030' }, flexShrink: 0 }}
                >
                  Replace File
                </Button>
              </Box>
            )}

            {/* No current file OR replacing */}
            {(!doc.fileUrl || replaceFile) && (
              <>
                {replaceFile && (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: '#4fc3f7' }}>Replacing current file — select a new one below</Typography>
                    <Button size="small" onClick={() => { setReplaceFile(false); setFile(null) }} disabled={uploading}
                      sx={{ fontSize: '0.62rem', color: '#8fa3b8', textTransform: 'none' }}>
                      Cancel Replace
                    </Button>
                  </Box>
                )}
                {file ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 2, border: '1px solid rgba(245,168,0,0.3)', borderRadius: 1.5, bgcolor: '#141f2a' }}>
                    <InsertDriveFileIcon sx={{ color: '#c9952a', fontSize: 28 }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#fff' }}>{file.name}</Typography>
                      <Typography sx={{ fontSize: '0.68rem', color: '#8fa3b8', fontFamily: "'IBM Plex Mono',monospace" }}>{formatFileSize(file.size)}</Typography>
                    </Box>
                    <IconButton onClick={() => setFile(null)} disabled={uploading} size="small" sx={{ color: '#ef5350' }}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ) : (
                  <Box
                    onClick={() => !uploading && fileRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleDrop}
                    sx={{ border: `2px dashed ${dragging ? '#c9952a' : '#2a3545'}`, borderRadius: 1.5, p: 4, textAlign: 'center', cursor: uploading ? 'not-allowed' : 'pointer', bgcolor: dragging ? '#141f2a' : 'transparent', transition: 'all 0.15s', '&:hover': { borderColor: '#c9952a' } }}
                  >
                    <CloudUploadIcon sx={{ fontSize: 32, color: '#8fa3b8', mb: 1 }} />
                    <Typography sx={{ fontSize: '0.82rem', color: '#8fa3b8' }}>
                      Drag & drop or <Box component="span" sx={{ color: '#c9952a', fontWeight: 600 }}>click to browse</Box>
                    </Typography>
                    <Typography sx={{ fontSize: '0.68rem', color: '#8fa3b8', mt: 0.5 }}>{ALLOWED_TYPES.join(', ')} — max 10 MB</Typography>
                  </Box>
                )}
                <input ref={fileRef} type="file" hidden accept={ALLOWED_TYPES.join(',')} onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
              </>
            )}
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 2, borderTop: '1px solid #243040', gap: 1 }}>
        <Button onClick={handleClose} disabled={uploading} variant="outlined" sx={{ fontSize: '0.72rem' }}>Cancel</Button>
        <Button
          onClick={handleSave} disabled={uploading || !hasChanges}
          variant="contained" sx={{ fontSize: '0.72rem', minWidth: 160 }}
        >
          {uploading ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
