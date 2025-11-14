# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-14

### Added

#### Core Features
- Framework-agnostic document viewer library for JavaScript and TypeScript
- Support for multiple document formats:
  - PDF files (via PDF.js)
  - Office documents (XLS, XLSX, DOC, DOCX, PPT, PPTX)
  - Images (PNG, JPG, JPEG)
  - Text files (TXT)
- Automatic document type detection from URL extensions
- Manual document type override option

#### PDF Viewer
- Client-side PDF rendering using PDF.js
- Page navigation controls (previous/next buttons, page counter)
- Canvas-based rendering
- Hierarchical PDF.js loading strategy:
  - Global window.pdfjsLib detection
  - Bundled pdfjs-dist npm package
  - CDN fallback (cdnjs.cloudflare.com)

#### Office Document Viewer
- Iframe-based rendering using third-party viewers
- Google Docs Viewer integration (default)
- Microsoft Office Online Viewer option
- Configurable viewer selection

#### Image & Text Viewers
- Direct image rendering with object-fit contain
- Text file rendering with monospace font styling
- Blob/memory fallback support for CORS issues

#### CORS Handling
- Automatic blob/memory fallback system
- Detects CORS errors and retries with blob URL
- Downloads files to browser memory when needed
- Automatic blob URL cleanup

#### Developer Experience
- Full TypeScript support with complete type definitions
- Dual build output (CommonJS + ES Module)
- Tree-shakeable ES Module build
- Zero runtime dependencies (except optional pdfjs-dist)
- Async-first API design
- Comprehensive API with lifecycle methods:
  - `render()` - Initial rendering
  - `reload()` - Reload current document
  - `destroy()` - Cleanup resources
  - `changeDocument()` - Switch to different document
- Quick start helper function: `createViewer()`

#### Customization Options
- Configurable container (CSS selector or HTMLElement)
- Custom width and height
- Custom CSS styles
- Loading spinner with customizable message
- Success and error callbacks
- Office viewer selection (Google Docs vs Microsoft)
- CORS fallback toggle

#### Framework Integration
- Examples for React (with hooks)
- Examples for Vue 3 (Composition API)
- Examples for Angular
- Examples for Svelte
- Vanilla JavaScript examples

#### Documentation
- Comprehensive README with API reference
- Framework integration guides
- Troubleshooting section
- Browser compatibility information
- Development and testing guide (TESTING.md)

#### Build System
- Rollup-based build configuration
- TypeScript compilation with strict mode
- Source maps generation
- Automatic build before npm publish (prepublishOnly hook)

### Technical Details
- Target: ES2020
- Browser APIs: DOM
- Package size: ~35 kB (compressed)
- Unpacked size: ~188 kB

[1.0.0]: https://github.com/JhonHawk/ng-doc-viewer/releases/tag/v1.0.0
