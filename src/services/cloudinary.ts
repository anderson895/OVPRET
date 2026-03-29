const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'demo';
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'demo';
const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';

export interface UploadResult {
  url: string;
  publicId: string;
  fileName: string;
  format: string;
  bytes: number;
}

export async function uploadFile(file: File): Promise<UploadResult> {
  if (DEMO_MODE || CLOUD_NAME === 'demo') {
    // Simulate upload in demo mode
    await new Promise((r) => setTimeout(r, 1200));
    return {
      url: `https://res.cloudinary.com/demo/raw/upload/${encodeURIComponent(file.name)}`,
      publicId: `demo/${file.name}`,
      fileName: file.name,
      format: file.name.split('.').pop() || 'file',
      bytes: file.size,
    };
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('resource_type', 'auto');

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
    { method: 'POST', body: formData }
  );

  if (!response.ok) {
    throw new Error('File upload failed. Please try again.');
  }

  const data = await response.json();
  return {
    url: data.secure_url,
    publicId: data.public_id,
    fileName: file.name,
    format: data.format,
    bytes: data.bytes,
  };
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export const ALLOWED_FILE_TYPES = [
  '.pdf', '.doc', '.docx', '.xls', '.xlsx',
  '.ppt', '.pptx', '.png', '.jpg', '.jpeg', '.gif',
];
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export function validateFile(file: File): string | null {
  const ext = '.' + file.name.split('.').pop()?.toLowerCase();
  if (!ALLOWED_FILE_TYPES.includes(ext)) {
    return `File type not allowed. Allowed: ${ALLOWED_FILE_TYPES.join(', ')}`;
  }
  if (file.size > MAX_FILE_SIZE) {
    return `File too large. Maximum size is 10 MB.`;
  }
  return null;
}
