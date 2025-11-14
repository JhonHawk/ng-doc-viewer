# Universal Document Viewer

A framework-agnostic document viewer library for JavaScript and TypeScript that allows you to display various document formats in your web applications.

## Features

- **Framework Independent**: Works with vanilla JavaScript, React, Vue, Angular, Svelte, and any other framework
- **TypeScript Support**: Fully typed for better developer experience
- **Multiple Formats**: Supports PDF, Office documents (XLS/XLSX, DOC/DOCX, PPT/PPTX), images (PNG, JPG/JPEG), and text files
- **Easy to Use**: Simple API with minimal configuration
- **Customizable**: Flexible styling and configuration options
- **Lightweight**: Minimal dependencies

## Supported Formats

- PDF (`.pdf`)
- Excel (`.xls`, `.xlsx`)
- Word (`.doc`, `.docx`)
- PowerPoint (`.ppt`, `.pptx`)
- Images (`.png`, `.jpg`, `.jpeg`)
- Text (`.txt`)

## Installation

```bash
npm install universal-doc-viewer
```

Or with yarn:

```bash
yarn add universal-doc-viewer
```

### Development / Local Testing

If you're working with the source code:

```bash
# Clone the repository
git clone <repository-url>
cd ng-doc-viewer

# Install dependencies
npm install

# Build the library (REQUIRED before testing)
npm run build

# Test with a local HTTP server
python3 -m http.server 8000
# Then open http://localhost:8000/simple-test.html
```

See [TESTING.md](./TESTING.md) for detailed testing instructions.

## Quick Start

### Vanilla JavaScript

```javascript
import { DocumentViewer } from 'universal-doc-viewer';

const viewer = new DocumentViewer({
  container: '#viewer-container',
  url: 'https://pdfobject.com/pdf/sample.pdf',
  width: '100%',
  height: '800px'
});

viewer.render();
```

### Using the Helper Function

```javascript
import { createViewer } from 'universal-doc-viewer';

const viewer = await createViewer({
  container: '#viewer-container',
  url: 'https://pdfobject.com/pdf/sample.pdf'
});
```

### HTML

```html
<!DOCTYPE html>
<html>
<head>
  <title>Document Viewer</title>
</head>
<body>
  <div id="viewer-container"></div>

  <script type="module">
    import { DocumentViewer } from 'universal-doc-viewer';

    const viewer = new DocumentViewer({
      container: '#viewer-container',
      url: 'https://pdfobject.com/pdf/sample.pdf',
      height: '90vh'
    });

    viewer.render();
  </script>
</body>
</html>
```

## Framework Integration

### React

```jsx
import { useEffect, useRef } from 'react';
import { DocumentViewer } from 'universal-doc-viewer';

function DocumentViewerComponent({ url }) {
  const containerRef = useRef(null);
  const viewerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      viewerRef.current = new DocumentViewer({
        container: containerRef.current,
        url: url,
        height: '600px'
      });

      viewerRef.current.render();
    }

    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy();
      }
    };
  }, [url]);

  return <div ref={containerRef}></div>;
}
```

### Vue 3

```vue
<template>
  <div ref="viewerContainer"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { DocumentViewer } from 'universal-doc-viewer';

const props = defineProps({
  url: String
});

const viewerContainer = ref(null);
let viewer = null;

onMounted(() => {
  viewer = new DocumentViewer({
    container: viewerContainer.value,
    url: props.url,
    height: '600px'
  });

  viewer.render();
});

onUnmounted(() => {
  if (viewer) {
    viewer.destroy();
  }
});

watch(() => props.url, (newUrl) => {
  if (viewer) {
    viewer.changeDocument(newUrl);
  }
});
</script>
```

### Angular

```typescript
import { Component, ElementRef, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { DocumentViewer } from 'universal-doc-viewer';

@Component({
  selector: 'app-document-viewer',
  template: '<div #viewerContainer></div>'
})
export class DocumentViewerComponent implements OnInit, OnDestroy {
  @Input() url: string;
  @ViewChild('viewerContainer', { static: true }) viewerContainer: ElementRef;

  private viewer: DocumentViewer;

  ngOnInit() {
    this.viewer = new DocumentViewer({
      container: this.viewerContainer.nativeElement,
      url: this.url,
      height: '600px'
    });

    this.viewer.render();
  }

  ngOnDestroy() {
    if (this.viewer) {
      this.viewer.destroy();
    }
  }
}
```

### Svelte

```svelte
<script>
  import { onMount, onDestroy } from 'svelte';
  import { DocumentViewer } from 'universal-doc-viewer';

  export let url;

  let viewerContainer;
  let viewer;

  onMount(() => {
    viewer = new DocumentViewer({
      container: viewerContainer,
      url: url,
      height: '600px'
    });

    viewer.render();
  });

  onDestroy(() => {
    if (viewer) {
      viewer.destroy();
    }
  });

  $: if (viewer && url) {
    viewer.changeDocument(url);
  }
</script>

<div bind:this={viewerContainer}></div>
```

## API Reference

### DocumentViewer

The main class for creating document viewers.

#### Constructor

```typescript
new DocumentViewer(options: ViewerOptions)
```

#### Options

```typescript
interface ViewerOptions {
  // Required
  container: HTMLElement | string;  // Container element or selector
  url: string;                       // Document URL

  // Optional
  type?: DocumentType;               // Document type (auto-detected if not provided)
  width?: string;                    // Viewer width (default: '100%')
  height?: string;                   // Viewer height (default: '600px')
  styles?: Partial<CSSStyleDeclaration>; // Custom styles
  showLoader?: boolean;              // Show loading indicator (default: true)
  loadingMessage?: string;           // Custom loading message
  useGoogleDocsViewer?: boolean;     // Use Google Docs for Office files (default: true)
  useMicrosoftViewer?: boolean;      // Use Microsoft viewer for Office files (default: false)
  useBlobFallback?: boolean;         // Use blob/memory fallback for CORS issues (default: true)
  onLoad?: () => void;               // Success callback
  onError?: (error: Error) => void;  // Error callback
}
```

#### Methods

##### render()
Renders the document in the container.

```typescript
await viewer.render();
```

##### reload()
Reloads the current document.

```typescript
await viewer.reload();
```

##### destroy()
Destroys the viewer and cleans up resources.

```typescript
viewer.destroy();
```

##### changeDocument(url, type?)
Changes the document and re-renders.

```typescript
await viewer.changeDocument('https://example.com/new-document.pdf');
```

##### getDocumentType()
Gets the current document type.

```typescript
const type = viewer.getDocumentType(); // 'pdf' | 'xlsx' | etc.
```

##### isPDF(), isImage(), isOfficeDocument()
Helper methods to check document type.

```typescript
if (viewer.isPDF()) {
  console.log('Viewing a PDF');
}
```

## Advanced Usage

### Custom Styling

```javascript
const viewer = new DocumentViewer({
  container: '#viewer',
  url: 'document.pdf',
  styles: {
    border: '2px solid #333',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  }
});
```

### Error Handling

```javascript
const viewer = new DocumentViewer({
  container: '#viewer',
  url: 'document.pdf',
  onError: (error) => {
    console.error('Failed to load document:', error);
    alert('Could not load the document. Please try again.');
  },
  onLoad: () => {
    console.log('Document loaded successfully!');
  }
});
```

### Office Document Viewer Selection

```javascript
// Use Microsoft Office Online Viewer
const viewer = new DocumentViewer({
  container: '#viewer',
  url: 'spreadsheet.xlsx',
  useMicrosoftViewer: true
});

// Use Google Docs Viewer (default)
const viewer2 = new DocumentViewer({
  container: '#viewer2',
  url: 'presentation.pptx',
  useGoogleDocsViewer: true
});
```

### Dynamic Document Switching

```javascript
const viewer = new DocumentViewer({
  container: '#viewer',
  url: 'initial-document.pdf',
  height: '700px'
});

await viewer.render();

// Later, change to a different document
document.getElementById('changeBtn').addEventListener('click', async () => {
  await viewer.changeDocument('new-document.docx');
});
```

## Using Individual Viewers

You can also use individual viewer classes directly:

```javascript
import { PDFViewer, ImageViewer, TextViewer, OfficeViewer } from 'universal-doc-viewer';

// PDF Viewer
const pdfViewer = new PDFViewer(containerElement, {
  container: containerElement,
  url: 'document.pdf'
});
await pdfViewer.render();

// Image Viewer
const imageViewer = new ImageViewer(containerElement, {
  container: containerElement,
  url: 'image.png'
});
await imageViewer.render();
```

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Important Notes

### Office Documents
Office documents (Excel, Word, PowerPoint) are displayed using online viewers:
- **Google Docs Viewer** (default): Free, no authentication required
- **Microsoft Office Online Viewer**: Alternative option

**Note**: Both viewers require the document to be publicly accessible via a URL. Local files or authentication-protected files may not work with these viewers.

### PDF Files
PDF files are rendered using [PDF.js](https://mozilla.github.io/pdf.js/), which provides:
- Client-side rendering
- Page navigation controls
- High-quality rendering

**Loading Strategy:**
The library automatically loads PDF.js in one of two ways:

1. **Bundled environments** (Webpack, Rollup, etc.): If you're using a bundler, you can optionally install `pdfjs-dist` as a dependency:
   ```bash
   npm install pdfjs-dist
   ```
   The library will use the bundled version automatically.

2. **Browser/CDN usage**: If `pdfjs-dist` is not installed or the import fails, the library automatically falls back to loading PDF.js from CDN (cdnjs.cloudflare.com). No additional configuration needed!

This dual approach ensures the library works seamlessly in any environment, whether you're using it directly in the browser or with a build tool.

### CORS Considerations and Blob Fallback

When loading documents from external URLs, CORS (Cross-Origin Resource Sharing) restrictions may prevent direct loading. To handle this, the library includes an **automatic blob/memory fallback** feature.

#### How Blob Fallback Works

When direct URL loading fails (typically due to CORS errors), the library automatically:
1. Downloads the file to browser memory using `fetch()`
2. Creates a blob URL from the downloaded data
3. Uses the blob URL to render the document

This feature is **enabled by default** for PDFs, images, and text files. It works automatically without any configuration.

#### Controlling Blob Fallback

```javascript
// Default behavior - blob fallback is automatic on CORS errors
const viewer = new DocumentViewer({
  container: '#viewer',
  url: 'https://example.com/document.pdf'
});

// Explicitly enable blob fallback (force download to memory)
const viewer2 = new DocumentViewer({
  container: '#viewer',
  url: 'https://example.com/document.pdf',
  useBlobFallback: true  // Always use blob fallback
});

// Disable blob fallback (fail if direct loading doesn't work)
const viewer3 = new DocumentViewer({
  container: '#viewer',
  url: 'https://example.com/document.pdf',
  useBlobFallback: false  // Never use blob fallback
});
```

#### Testing Blob Fallback

Open `test-blob-fallback.html` in your browser to test the blob fallback functionality:

```bash
python3 -m http.server 8000
# Open http://localhost:8000/test-blob-fallback.html
```

The test page includes buttons to:
- Load documents normally (with automatic fallback)
- Force blob fallback mode
- View detailed console logs of the fallback process

#### Important Notes

- **Office Documents**: Blob fallback does NOT work for Office documents (Excel, Word, PowerPoint) because they use third-party viewers (Google Docs Viewer or Microsoft Office Online) which require the URL to be publicly accessible from their servers.
- **Memory Usage**: When using blob fallback, the entire document is loaded into browser memory. For large files, this may consume significant memory.
- **Browser Support**: Blob fallback uses standard browser APIs (`fetch`, `URL.createObjectURL`) and works in all modern browsers.

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues and questions, please open an issue on the GitHub repository.
