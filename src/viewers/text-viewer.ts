import { ViewerOptions, IViewer } from '../types';
import { createLoader, createErrorElement } from '../utils';

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

      // Fetch text content
      const response = await fetch(this.options.url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const text = await response.text();

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
