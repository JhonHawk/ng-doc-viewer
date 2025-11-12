import { ViewerOptions, IViewer, DocumentType } from './types';
import {
  resolveContainer,
  getDocumentType,
  isImageType,
  isOfficeDocument,
} from './utils';
import { PDFViewer } from './viewers/pdf-viewer';
import { ImageViewer } from './viewers/image-viewer';
import { TextViewer } from './viewers/text-viewer';
import { OfficeViewer } from './viewers/office-viewer';

/**
 * Main DocumentViewer class that coordinates all viewers
 */
export class DocumentViewer {
  private container: HTMLElement;
  private options: ViewerOptions;
  private currentViewer: IViewer | null = null;
  private documentType: DocumentType | null = null;

  /**
   * Creates a new DocumentViewer instance
   * @param options - Configuration options for the viewer
   */
  constructor(options: ViewerOptions) {
    // Resolve container element
    this.container = resolveContainer(options.container);

    // Set default options
    this.options = {
      ...options,
      width: options.width || '100%',
      height: options.height || '600px',
      showLoader: options.showLoader !== false,
      loadingMessage: options.loadingMessage || 'Loading document...',
      useGoogleDocsViewer: options.useGoogleDocsViewer !== false,
      useMicrosoftViewer: options.useMicrosoftViewer || false,
    };

    // Apply container styles
    this.applyContainerStyles();

    // Determine document type
    this.documentType = options.type || getDocumentType(options.url);

    if (!this.documentType) {
      throw new Error(
        'Unable to determine document type. Please specify the type option.'
      );
    }
  }

  /**
   * Applies styles to the container element
   */
  private applyContainerStyles(): void {
    this.container.style.width = this.options.width!;
    this.container.style.height = this.options.height!;
    this.container.style.position = 'relative';
    this.container.style.overflow = 'auto';

    // Apply custom styles if provided
    if (this.options.styles) {
      Object.assign(this.container.style, this.options.styles);
    }
  }

  /**
   * Creates the appropriate viewer for the document type
   */
  private createViewer(): IViewer {
    if (!this.documentType) {
      throw new Error('Document type not set');
    }

    switch (this.documentType) {
      case 'pdf':
        return new PDFViewer(this.container, this.options);

      case 'png':
      case 'jpg':
      case 'jpeg':
        return new ImageViewer(this.container, this.options);

      case 'txt':
        return new TextViewer(this.container, this.options);

      case 'xls':
      case 'xlsx':
      case 'doc':
      case 'docx':
      case 'ppt':
      case 'pptx':
        return new OfficeViewer(this.container, this.options);

      default:
        throw new Error(`Unsupported document type: ${this.documentType}`);
    }
  }

  /**
   * Renders the document in the container
   */
  async render(): Promise<void> {
    try {
      // Create and store the viewer
      this.currentViewer = this.createViewer();

      // Render the document
      await this.currentViewer.render();
    } catch (error) {
      if (this.options.onError) {
        this.options.onError(error as Error);
      } else {
        throw error;
      }
    }
  }

  /**
   * Reloads the current document
   */
  async reload(): Promise<void> {
    if (this.currentViewer) {
      await this.currentViewer.reload();
    } else {
      await this.render();
    }
  }

  /**
   * Destroys the viewer and cleans up resources
   */
  destroy(): void {
    if (this.currentViewer) {
      this.currentViewer.destroy();
      this.currentViewer = null;
    }
  }

  /**
   * Changes the document URL and re-renders
   * @param url - New document URL
   * @param type - Optional document type (if not provided, will be inferred)
   */
  async changeDocument(url: string, type?: DocumentType): Promise<void> {
    // Destroy current viewer
    this.destroy();

    // Update options
    this.options.url = url;
    this.documentType = type || getDocumentType(url);

    if (!this.documentType) {
      throw new Error(
        'Unable to determine document type. Please specify the type parameter.'
      );
    }

    // Render new document
    await this.render();
  }

  /**
   * Gets the current document type
   */
  getDocumentType(): DocumentType | null {
    return this.documentType;
  }

  /**
   * Checks if the viewer is currently showing an image
   */
  isImage(): boolean {
    return this.documentType ? isImageType(this.documentType) : false;
  }

  /**
   * Checks if the viewer is currently showing an Office document
   */
  isOfficeDocument(): boolean {
    return this.documentType ? isOfficeDocument(this.documentType) : false;
  }

  /**
   * Checks if the viewer is currently showing a PDF
   */
  isPDF(): boolean {
    return this.documentType === 'pdf';
  }
}
