import { put, del, list } from '@vercel/blob';

export interface UploadResult {
  url: string;
  pathname: string;
}

// Upload file to Vercel Blob
export async function uploadFile(file: File, folder: string = 'uploads'): Promise<UploadResult> {
  const filename = `${folder}/${Date.now()}-${file.name}`;
  
  const blob = await put(filename, file, {
    access: 'public',
  });

  return {
    url: blob.url,
    pathname: blob.pathname,
  };
}

// Upload buffer to Vercel Blob
export async function uploadBuffer(buffer: Buffer, filename: string, folder: string = 'documents'): Promise<UploadResult> {
  const pathname = `${folder}/${Date.now()}-${filename}`;
  
  const blob = await put(pathname, buffer, {
    access: 'public',
  });

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

// Upload certificate
export async function uploadCertificate(buffer: Buffer, certificateCode: string): Promise<UploadResult> {
  return uploadBuffer(buffer, `certificate-${certificateCode}.pdf`, 'certificates');
}

// Upload confirmation report
export async function uploadConfirmationReport(buffer: Buffer, projectId: string, memberId: string): Promise<UploadResult> {
  return uploadBuffer(buffer, `confirmation-${projectId}-${memberId}.pdf`, 'confirmation-reports');
}
