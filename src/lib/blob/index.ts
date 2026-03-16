import { put, del, list, head } from '@vercel/blob';

export interface UploadResult {
  url: string;
  pathname: string;
}

// Generate a signed URL for private blob access (valid for 1 hour)
export function getSignedUrl(blobUrl: string): string {
  // For private blobs, we need to create a download endpoint
  // The URL will be proxied through our API
  return `/api/blob/download?url=${encodeURIComponent(blobUrl)}`;
}

// Upload file to Vercel Blob
export async function uploadFile(file: File, folder: string = 'uploads'): Promise<UploadResult> {
  const filename = `${folder}/${Date.now()}-${file.name}`;
  
  const blob = await put(filename, file, { access: 'private' });

  return {
    url: blob.url,
    pathname: blob.pathname,
  };
}

// Upload file to Vercel Blob with public access (for public pages like Project Showcase)
export async function uploadPublicFile(file: File, folder: string = 'public-uploads'): Promise<UploadResult> {
  const filename = `${folder}/${Date.now()}-${file.name}`;

  try {
    const blob = await put(filename, file, { access: 'public' });
    return {
      url: blob.url,
      pathname: blob.pathname,
    };
  } catch (error) {
    // Some blob stores are configured as private-only; fall back to private upload.
    const blob = await put(filename, file, { access: 'private' });
    return {
      url: blob.url,
      pathname: blob.pathname,
    };
  }
}

// Upload buffer to Vercel Blob
export async function uploadBuffer(buffer: Buffer, filename: string, folder: string = 'documents'): Promise<UploadResult> {
  const pathname = `${folder}/${Date.now()}-${filename}`;
  
  const blob = await put(pathname, buffer, { access: 'private' });

  return {
    url: blob.url,
    pathname: blob.pathname,
  };
}

// Delete file from Vercel Blob
export async function deleteFile(url: string): Promise<void> {
  await del(url);
}

// List files in a folder
export async function listFiles(prefix?: string) {
  const blobs = await list({
    prefix,
  });
  return blobs.blobs;
}

// Upload signature image
export async function uploadSignature(file: File, userId: string): Promise<UploadResult> {
  return uploadFile(file, `signatures/${userId}`);
}

// Upload daily report
export async function uploadDailyReport(file: File, projectId: string, memberId: string): Promise<UploadResult> {
  return uploadFile(file, `reports/${projectId}/${memberId}`);
}

// Upload deliverable document
export async function uploadDeliverable(file: File, projectId: string): Promise<UploadResult> {
  return uploadFile(file, `deliverables/${projectId}`);
}

// Upload certificate (private access - served via API endpoint)
export async function uploadCertificate(buffer: Buffer, certificateCode: string): Promise<UploadResult> {
  const pathname = `certificates/${Date.now()}-certificate-${certificateCode}.pdf`;
  
  const blob = await put(pathname, buffer, { access: 'private' });

  return {
    url: blob.url,
    pathname: blob.pathname,
  };
}

// Upload confirmation report
export async function uploadConfirmationReport(buffer: Buffer, projectId: string, memberId: string): Promise<UploadResult> {
  return uploadBuffer(buffer, `confirmation-${projectId}-${memberId}.pdf`, 'confirmation-reports');
}
