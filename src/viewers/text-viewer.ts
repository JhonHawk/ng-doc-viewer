import { ViewerOptions, IViewer } from '../types';
import { createLoader, createErrorElement } from '../utils';
import { fetchAsText, isCorsError } from '../blob-utils';

/**
 * Text Viewer for TXT files
 */
export class TextViewer implements IViewer {
  private container: HTMLElement;
  private options: ViewerOptions;
  private textElement: HTMLPreElement | null = null;

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

      let text: string;

      try {
        // First attempt: Direct fetch
        const response = await fetch(this.options.url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        text = await response.text();
      } catch (error) {
        // Check if we should try blob fallback
        const useBlobFallback = this.options.useBlobFallback !== false; // Default to true

        if (useBlobFallback && (isCorsError(error as Error) || this.options.useBlobFallback === true)) {
          // Fallback: Use fetchAsText utility
          console.log('Direct text loading failed, trying blob fallback...');
          text = await fetchAsText(this.options.url);
        } else {
          throw error;
        }
      }

      // Create text element
      this.textElement = document.createElement('pre');
      this.textElement.style.cssText = `
        width: 100%;
        height: 100%;
        overflow: auto;
        padding: 20px;
        margin: 0;
        font-family: 'Courier New', monospace;
        font-size: 14px;
        line-height: 1.5;
        background: #f8f8f8;
        border: 1px solid #ddd;
        white-space: pre-wrap;
        word-wrap: break-word;
      `;
      this.textElement.textContent = text;

      // Clear container and add text element
      this.container.innerHTML = '';
      this.container.appendChild(this.textElement);

      // Call success callback
      if (this.options.onLoad) {
        this.options.onLoad();
      }
    } catch (error) {
      this.handleError(error as Error);
    }
  }

  private handleError(error: Error): void {
    this.container.innerHTML = '';
    const errorElement = createErrorElement(
      `Failed to load text file: ${error.message}`
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
    this.textElement = null;
    this.container.innerHTML = '';
  }
}
