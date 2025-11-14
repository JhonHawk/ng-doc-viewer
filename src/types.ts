/**
 * Supported document types
 */
export type DocumentType =
  | 'pdf'
  | 'xls'
  | 'xlsx'
  | 'doc'
  | 'docx'
  | 'txt'
  | 'png'
  | 'jpg'
  | 'jpeg'
  | 'ppt'
  | 'pptx';

/**
 * Document viewer configuration options
 */
export interface ViewerOptions {
  /**
   * The container element where the document will be rendered
   */
  container: HTMLElement | string;

  /**
   * The URL or path to the document
   */
  url: string;

  /**
   * The type of document (if not provided, will be inferred from URL)
   */
  type?: DocumentType;

  /**
   * Custom styles to apply to the viewer container
   */
  styles?: Partial<CSSStyleDeclaration>;

  /**
   * Width of the viewer (default: '100%')
   */
  width?: string;

  /**
   * Height of the viewer (default: '600px')
   */
  height?: string;

  /**
   * Whether to show loading indicator (default: true)
   */
  showLoader?: boolean;

  /**
   * Custom loading message
   */
  loadingMessage?: string;

  /**
   * Error callback
   */
  onError?: (error: Error) => void;

  /**
   * Success callback
   */
  onLoad?: () => void;

  /**
   * Use Google Docs Viewer for Office documents (default: true)
   */
  useGoogleDocsViewer?: boolean;

  /**
   * Use Microsoft Office Online Viewer for Office documents (default: false)
   */
  useMicrosoftViewer?: boolean;

  /**
   * Use blob/memory fallback when direct URL loading fails (useful for CORS issues)
   * (default: true)
   */
  useBlobFallback?: boolean;
}

/**
 * Viewer instance interface
 */
export interface IViewer {
  /**
   * Renders the document
   */
  render(): Promise<void>;

  /**
   * Destroys the viewer and cleans up resources
   */
  destroy(): void;

  /**
   * Reloads the document
   */
  reload(): Promise<void>;
}
