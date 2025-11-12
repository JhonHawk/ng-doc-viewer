import { ViewerOptions, IViewer } from '../types';
import { createLoader, createErrorElement, encodeViewerUrl } from '../utils';

/**
 * Office Document Viewer for XLS, XLSX, DOC, DOCX, PPT, PPTX files
 * Uses Google Docs Viewer or Microsoft Office Online Viewer
 */
export class OfficeViewer implements IViewer {
  private container: HTMLElement;
  private options: ViewerOptions;
  private iframe: HTMLIFrameElement | null = null;

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

      // Create iframe
      this.iframe = document.createElement('iframe');
      this.iframe.style.cssText = `
        width: 100%;
        height: 100%;
        border: none;
      `;

      // Set iframe source based on viewer preference
      const viewerUrl = this.getViewerUrl();
      this.iframe.src = viewerUrl;

      // Handle iframe load
      this.iframe.onload = () => {
        if (this.options.showLoader !== false) {
          const loader = this.container.querySelector('.doc-viewer-loader');
          if (loader) {
            loader.remove();
          }
        }

        if (this.options.onLoad) {
          this.options.onLoad();
        }
      };

      // Handle iframe error
      this.iframe.onerror = () => {
        this.handleError(new Error('Failed to load document in viewer'));
      };

      // Add iframe to container
      this.container.appendChild(this.iframe);
    } catch (error) {
      this.handleError(error as Error);
    }
  }

  private getViewerUrl(): string {
    const encodedUrl = encodeViewerUrl(this.options.url);

    // Use Microsoft Office Online Viewer if specified
    if (this.options.useMicrosoftViewer) {
      return `https://view.officeapps.live.com/op/embed.aspx?src=${encodedUrl}`;
    }

    // Default to Google Docs Viewer
    return `https://docs.google.com/viewer?url=${encodedUrl}&embedded=true`;
  }

  private handleError(error: Error): void {
    this.container.innerHTML = '';
    const errorElement = createErrorElement(
      `Failed to load Office document: ${error.message}`
    );
    this.container.appendChild(errorElement);

    if (this.options.onError) {
      this.options.onError(error);
    }
  }

  async reload(): Promise<void> {
    if (this.iframe) {
      this.iframe.src = this.getViewerUrl();
    } else {
      this.destroy();
      await this.render();
    }
  }

  destroy(): void {
    if (this.iframe) {
      this.iframe.onload = null;
      this.iframe.onerror = null;
      this.iframe = null;
    }
    this.container.innerHTML = '';
  }
}
