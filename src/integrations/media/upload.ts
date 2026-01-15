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
    // Convert file to base64 for Wix upload
    const base64 = await fileToBase64(file);
    
    // Upload to Wix Media Manager using the correct endpoint
    const response = await fetch('https://www.wixapis.com/media-manager/v1/files/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getWixAuthToken(),
      },
      body: JSON.stringify({
        file: {
          content: base64.split(',')[1], // Remove data:mime;base64, prefix
          name: file.name,
        },
        mimeType: file.type,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Upload failed:', response.status, errorText);
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const data = await response.json();

    // Return standardized result
    return {
      url: data.file?.url || data.url || data.fileUrl,
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
 * Convert File to base64 string
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Get Wix authentication token from the current session
 */
function getWixAuthToken(): string {
  // In Wix environment, the auth token is available in the window object
  // This is automatically injected by Wix
  return (window as any).__WIXCODE_INSTANCE__ || '';
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
