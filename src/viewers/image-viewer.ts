import { ViewerOptions, IViewer } from '../types';
import { createLoader, createErrorElement } from '../utils';
import { fetchAsBlob, revokeBlobUrl, isCorsError } from '../blob-utils';

/**
 * Image Viewer for PNG, JPG, JPEG files
 */
export class ImageViewer implements IViewer {
  private container: HTMLElement;
  private options: ViewerOptions;
  private image: HTMLImageElement | null = null;
  private blobUrl: string | null = null;

  constructor(container: HTMLElement, options: ViewerOptions) {
    this.container = container;
    this.options = options;
  }

  async render(): Promise<void> {
    try {
      // Show loader
      if (this.options.showLoader !== false) {
        const loader = createLoader(this.options.loadingMessage);
        this.container.appendChild(loader);
      }

      // Create image element
      this.image = document.createElement('img');
      this.image.style.cssText = `
        max-width: 100%;
        max-height: 100%;
        display: block;
        margin: 0 auto;
        object-fit: contain;
      `;

      // Load image
      await this.loadImage();

      // Clear container and add image
      this.container.innerHTML = '';
      this.container.appendChild(this.image);

      // Call success callback
      if (this.options.onLoad) {
        this.options.onLoad();
      }
    } catch (error) {
      this.handleError(error as Error);
    }
  }

  private async loadImage(): Promise<void> {
    if (!this.image) {
      throw new Error('Image element not initialized');
    }

    try {
      // First attempt: Direct URL loading
      await this.loadImageDirect(this.options.url);
    } catch (error) {
      // Check if we should try blob fallback
      const useBlobFallback = this.options.useBlobFallback !== false; // Default to true

      if (useBlobFallback && (isCorsError(error as Error) || this.options.useBlobFallback === true)) {
        // Fallback: Load as blob
        console.log('Direct image loading failed, trying blob fallback...');
        const result = await fetchAsBlob(this.options.url);
        this.blobUrl = result.blobUrl;
        await this.loadImageDirect(this.blobUrl);
      } else {
        throw error;
      }
    }
  }

  private loadImageDirect(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.image) {
        reject(new Error('Image element not initialized'));
        return;
      }

      this.image.onload = () => resolve();
      this.image.onerror = () => reject(new Error('Failed to load image'));
      this.image.src = url;
    });
  }

  private handleError(error: Error): void {
    this.container.innerHTML = '';
    const errorElement = createErrorElement(
      `Failed to load image: ${error.message}`
    );
    this.container.appendChild(errorElement);

    if (this.options.onError) {
      this.options.onError(error);
    }
  }

  async reload(): Promise<void> {
    this.destroy();
    await this.render();
  }

  destroy(): void {
    if (this.image) {
      this.image.onload = null;
      this.image.onerror = null;
      this.image = null;
    }
    // Clean up blob URL to prevent memory leaks
    if (this.blobUrl) {
      revokeBlobUrl(this.blobUrl);
      this.blobUrl = null;
    }
    this.container.innerHTML = '';
  }
}
