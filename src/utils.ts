import { DocumentType } from './types';

/**
 * Extracts file extension from URL
 */
export function getFileExtension(url: string): string {
  const urlWithoutQuery = url.split('?')[0];
  const parts = urlWithoutQuery.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
}

/**
 * Determines document type from URL
 */
export function getDocumentType(url: string): DocumentType | null {
  const extension = getFileExtension(url);
  const validTypes: DocumentType[] = [
    'pdf',
    'xls',
    'xlsx',
    'doc',
    'docx',
    'txt',
    'png',
    'jpg',
    'jpeg',
    'ppt',
    'pptx',
  ];

  if (validTypes.includes(extension as DocumentType)) {
    return extension as DocumentType;
  }

  return null;
}

/**
 * Checks if a document type is an image
 */
export function isImageType(type: DocumentType): boolean {
  return ['png', 'jpg', 'jpeg'].includes(type);
}

/**
 * Checks if a document type is an Office document
 */
export function isOfficeDocument(type: DocumentType): boolean {
  return ['xls', 'xlsx', 'doc', 'docx', 'ppt', 'pptx'].includes(type);
}

/**
 * Resolves a container element from string selector or HTMLElement
 */
export function resolveContainer(container: HTMLElement | string): HTMLElement {
  if (typeof container === 'string') {
    const element = document.querySelector(container);
    if (!element) {
      throw new Error(`Container element not found: ${container}`);
    }
    return element as HTMLElement;
  }
  return container;
}

/**
 * Creates a loader element
 */
export function createLoader(message: string = 'Loading document...'): HTMLElement {
  const loader = document.createElement('div');
  loader.className = 'doc-viewer-loader';
  loader.style.cssText = `
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    font-family: Arial, sans-serif;
    color: #333;
  `;

  const spinner = document.createElement('div');
  spinner.style.cssText = `
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
  `;

  const text = document.createElement('p');
  text.textContent = message;
  text.style.cssText = 'margin-top: 16px;';

  loader.appendChild(spinner);
  loader.appendChild(text);

  // Add animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);

  return loader;
}

/**
 * Creates an error element
 */
export function createErrorElement(message: string): HTMLElement {
  const error = document.createElement('div');
  error.className = 'doc-viewer-error';
  error.style.cssText = `
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    font-family: Arial, sans-serif;
    color: #e74c3c;
    padding: 20px;
    text-align: center;
  `;

  const icon = document.createElement('div');
  icon.textContent = '⚠️';
  icon.style.cssText = 'font-size: 48px; margin-bottom: 16px;';

  const text = document.createElement('p');
  text.textContent = message;

  error.appendChild(icon);
  error.appendChild(text);

  return error;
}

/**
 * Encodes URL for use in iframe viewers
 */
export function encodeViewerUrl(url: string): string {
  return encodeURIComponent(url);
}
