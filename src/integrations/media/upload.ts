/**
 * Media upload service for Wix Media Manager
 * Handles file uploads to Wix Media Manager
 */

interface UploadResult {
  url: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}

/**
 * Upload a file to Wix Media Manager
 * @param file - The file to upload
 * @returns Promise with upload result containing the file URL
 */
export async function uploadMedia(file: File): Promise<UploadResult> {
  try {
    // Create FormData for file upload
    const formData = new FormData();
    formData.append('media', file);

    // Upload to Wix Media Manager API
    const response = await fetch('/_api/upload/file', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Upload failed:', response.status, errorText);
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const data = await response.json();

    // Return standardized result
    return {
      url: data.file?.url || data.url,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
    };
  } catch (error) {
    console.error('Media upload error:', error);
    throw new Error('Failed to upload file. Please try again.');
  }
}

/**
 * Validate file before upload
 * @param file - The file to validate
 * @param maxSizeMB - Maximum file size in MB
 * @param allowedTypes - Array of allowed MIME types
 */
export function validateFile(
  file: File,
  maxSizeMB: number,
  allowedTypes: string[]
): { valid: boolean; error?: string } {
  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `File size must be less than ${maxSizeMB}MB`,
    };
  }

  // Check file type
  const isAllowedType = allowedTypes.some((type) => {
    if (type.endsWith('/*')) {
      const prefix = type.split('/')[0];
      return file.type.startsWith(prefix + '/');
    }
    return file.type === type;
  });

  if (!isAllowedType) {
    return {
      valid: false,
      error: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`,
    };
  }

  return { valid: true };
}
