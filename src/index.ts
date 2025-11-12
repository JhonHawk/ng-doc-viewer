/**
 * Universal Document Viewer Library
 * A framework-agnostic document viewer for JavaScript and TypeScript
 *
 * Supports: PDF, XLS/XLSX, DOC/DOCX, PPT/PPTX, TXT, PNG, JPG/JPEG
 */

export { DocumentViewer } from './document-viewer';
export { PDFViewer } from './viewers/pdf-viewer';
export { ImageViewer } from './viewers/image-viewer';
export { TextViewer } from './viewers/text-viewer';
export { OfficeViewer } from './viewers/office-viewer';

export type {
  DocumentType,
  ViewerOptions,
  IViewer,
} from './types';

export {
  getFileExtension,
  getDocumentType,
  isImageType,
  isOfficeDocument,
} from './utils';

/**
 * Quick start function to create and render a document viewer
 * @param options - Viewer configuration options
 * @returns DocumentViewer instance
 *
 * @example
 * ```typescript
 * import { createViewer } from 'universal-doc-viewer';
 *
 * const viewer = await createViewer({
 *   container: '#viewer',
 *   url: 'https://example.com/document.pdf'
 * });
 * ```
 */
export async function createViewer(options: import('./types').ViewerOptions) {
  const { DocumentViewer } = await import('./document-viewer');
  const viewer = new DocumentViewer(options);
  await viewer.render();
  return viewer;
}

// Default export
import { DocumentViewer } from './document-viewer';
export default DocumentViewer;
