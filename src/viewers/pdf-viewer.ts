import { ViewerOptions, IViewer } from '../types';
import { createLoader, createErrorElement } from '../utils';

/**
 * PDF Viewer implementation using PDF.js
 */
export class PDFViewer implements IViewer {
  private container: HTMLElement;
  private options: ViewerOptions;
  private canvas: HTMLCanvasElement | null = null;
  private pdfDoc: any = null;
  private currentPage: number = 1;
  private controls: HTMLElement | null = null;

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

      // Load PDF.js
      const pdfjsLib = await this.loadPdfJs();

      // Load PDF document
      const loadingTask = pdfjsLib.getDocument(this.options.url);
      this.pdfDoc = await loadingTask.promise;

      // Clear container
      this.container.innerHTML = '';

      // Create controls
      this.createControls();

      // Create canvas for rendering
      this.canvas = document.createElement('canvas');
      this.canvas.style.cssText = `
        display: block;
        margin: 0 auto;
        max-width: 100%;
      `;
      this.container.appendChild(this.canvas);

      // Render first page
      await this.renderPage(1);

      // Call success callback
      if (this.options.onLoad) {
        this.options.onLoad();
      }
    } catch (error) {
      this.handleError(error as Error);
    }
  }

  private async loadPdfJs(): Promise<any> {
    // Check if PDF.js is already loaded
    if ((window as any).pdfjsLib) {
      return (window as any).pdfjsLib;
    }

    // Try to load from npm package first (for bundled environments)
    try {
      const pdfjsLib = await import('pdfjs-dist');

      // Set worker source
      const workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

      return pdfjsLib;
    } catch (importError) {
      // Fall back to loading from CDN (for browser environments)
      return this.loadPdfJsFromCDN();
    }
  }

  private loadPdfJsFromCDN(): Promise<any> {
    return new Promise((resolve, reject) => {
      // Check if already loaded
      if ((window as any).pdfjsLib) {
        resolve((window as any).pdfjsLib);
        return;
      }

      // Check if script is already being loaded
      const existingScript = document.querySelector('script[src*="pdf.js"]');
      if (existingScript) {
        existingScript.addEventListener('load', () => {
          if ((window as any).pdfjsLib) {
            resolve((window as any).pdfjsLib);
          } else {
            reject(new Error('PDF.js loaded but not available'));
          }
        });
        return;
      }

      // Load PDF.js from CDN
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      script.async = true;

      script.onload = () => {
        const pdfjsLib = (window as any).pdfjsLib;
        if (pdfjsLib) {
          // Set worker source
          pdfjsLib.GlobalWorkerOptions.workerSrc =
            'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
          resolve(pdfjsLib);
        } else {
          reject(new Error('PDF.js failed to load from CDN'));
        }
      };

      script.onerror = () => {
        reject(new Error('Failed to load PDF.js from CDN'));
      };

      document.head.appendChild(script);
    });
  }

  private createControls(): void {
    if (!this.pdfDoc) return;

    this.controls = document.createElement('div');
    this.controls.style.cssText = `
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 10px;
      background: #f5f5f5;
      border-bottom: 1px solid #ddd;
      gap: 10px;
    `;

    const prevBtn = this.createButton('Previous', () => this.previousPage());
    const pageInfo = document.createElement('span');
    pageInfo.id = 'page-info';
    pageInfo.textContent = `Page ${this.currentPage} of ${this.pdfDoc.numPages}`;
    const nextBtn = this.createButton('Next', () => this.nextPage());

    this.controls.appendChild(prevBtn);
    this.controls.appendChild(pageInfo);
    this.controls.appendChild(nextBtn);

    this.container.appendChild(this.controls);
  }

  private createButton(text: string, onClick: () => void): HTMLButtonElement {
    const button = document.createElement('button');
    button.textContent = text;
    button.onclick = onClick;
    button.style.cssText = `
      padding: 5px 15px;
      background: #3498db;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    `;
    button.onmouseover = () => {
      button.style.background = '#2980b9';
    };
    button.onmouseout = () => {
      button.style.background = '#3498db';
    };
    return button;
  }

  private async renderPage(pageNum: number): Promise<void> {
    if (!this.pdfDoc || !this.canvas) return;

    const page = await this.pdfDoc.getPage(pageNum);
    const viewport = page.getViewport({ scale: 1.5 });

    const context = this.canvas.getContext('2d');
    if (!context) return;

    this.canvas.height = viewport.height;
    this.canvas.width = viewport.width;

    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };

    await page.render(renderContext).promise;

    // Update page info
    const pageInfo = document.getElementById('page-info');
    if (pageInfo) {
      pageInfo.textContent = `Page ${pageNum} of ${this.pdfDoc.numPages}`;
    }
  }

  private async nextPage(): Promise<void> {
    if (!this.pdfDoc) return;

    if (this.currentPage < this.pdfDoc.numPages) {
      this.currentPage++;
      await this.renderPage(this.currentPage);
    }
  }

  private async previousPage(): Promise<void> {
    if (this.currentPage > 1) {
      this.currentPage--;
      await this.renderPage(this.currentPage);
    }
  }

  private handleError(error: Error): void {
    this.container.innerHTML = '';
    const errorElement = createErrorElement(
      `Failed to load PDF: ${error.message}`
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
    this.container.innerHTML = '';
    this.canvas = null;
    this.pdfDoc = null;
    this.controls = null;
    this.currentPage = 1;
  }
}
