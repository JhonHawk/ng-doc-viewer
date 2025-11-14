/**
 * Utilities for handling blob/memory fallback when direct URL loading fails
 */

export interface FetchResult {
  blob: Blob;
  blobUrl: string;
  arrayBuffer?: ArrayBuffer;
}

/**
 * Downloads a file as blob with retry logic
 * Useful for CORS issues or when direct URL loading fails
 */
export async function fetchAsBlob(url: string): Promise<FetchResult> {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    return {
      blob,
      blobUrl,
    };
  } catch (error) {
    throw new Error(`Failed to fetch file as blob: ${(error as Error).message}`);
  }
}

/**
 * Downloads a file as ArrayBuffer (useful for PDFs)
 */
export async function fetchAsArrayBuffer(url: string): Promise<ArrayBuffer> {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.arrayBuffer();
  } catch (error) {
    throw new Error(`Failed to fetch file as ArrayBuffer: ${(error as Error).message}`);
  }
}

/**
 * Downloads a file as text
 */
export async function fetchAsText(url: string): Promise<string> {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.text();
  } catch (error) {
    throw new Error(`Failed to fetch file as text: ${(error as Error).message}`);
  }
}

/**
 * Revokes a blob URL to free memory
 */
export function revokeBlobUrl(blobUrl: string): void {
  if (blobUrl && blobUrl.startsWith('blob:')) {
    URL.revokeObjectURL(blobUrl);
  }
}

/**
 * Checks if an error is likely a CORS error
 */
export function isCorsError(error: Error): boolean {
  const message = error.message.toLowerCase();
  return (
    message.includes('cors') ||
    message.includes('cross-origin') ||
    message.includes('network error') ||
    message.includes('failed to fetch')
  );
}
