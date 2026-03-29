const CLOUD_NAME    = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

export const ALLOWED_TYPES = ['.pdf','.doc','.docx','.xls','.xlsx','.ppt','.pptx','.png','.jpg','.jpeg']
export const MAX_SIZE      = 10 * 1024 * 1024 // 10 MB

export interface UploadResult { url: string; fileName: string; bytes: number }

export function validateFile(file: File): string | null {
  const ext = '.' + file.name.split('.').pop()?.toLowerCase()
  if (!ALLOWED_TYPES.includes(ext)) return `File type not allowed. Accepted: ${ALLOWED_TYPES.join(', ')}`
  if (file.size > MAX_SIZE) return 'File too large. Maximum is 10 MB.'
  return null
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export async function uploadFile(file: File): Promise<UploadResult> {
  const fd = new FormData()
  fd.append('file', file)
  fd.append('upload_preset', UPLOAD_PRESET)
  const res  = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`, { method: 'POST', body: fd })
  if (!res.ok) throw new Error('File upload to Cloudinary failed.')
  const data = await res.json()
  return { url: data.secure_url, fileName: file.name, bytes: data.bytes }
}
