# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Universal Document Viewer** is a framework-agnostic TypeScript library for embedding document viewers in web applications. It supports PDF, Office documents (XLS/XLSX, DOC/DOCX, PPT/PPTX), images (PNG, JPG/JPEG), and text files. The library can be used with vanilla JS, React, Vue, Angular, Svelte, or any other framework.

**Key characteristics:**
- Zero runtime dependencies (except optional `pdfjs-dist` peer dependency)
- Pure vanilla JS implementation
- Built with Rollup (NOT Angular CLI or ng-packagr)
- Dual build output: CommonJS + ES Module (tree-shakeable)
- TypeScript with full type definitions

## Build & Development Commands

```bash
# Development
npm run dev          # Watch mode - Rollup rebuilds on file changes

# Production
npm run build        # One-time build to dist/ directory

# Testing
npm test             # Run Jest tests

# Manual testing
python3 -m http.server 8000   # Start local server, then visit test HTML files

# Publishing
npm publish          # Auto-triggers prepublishOnly hook (runs build first)
```

## Architecture

### High-Level Design Pattern: Strategy Pattern

The library uses the **Strategy Pattern** where `DocumentViewer` acts as the orchestrator/context and delegates rendering to specific viewer implementations based on document type.

```
DocumentViewer (orchestrator)
    ↓
createViewer() factory method
    ↓
IViewer interface implementations:
    ├── PDFViewer (pdf-viewer.ts, 265 lines)
    ├── ImageViewer (image-viewer.ts, 120 lines)
    ├── TextViewer (text-viewer.ts, 100 lines)
    └── OfficeViewer (office-viewer.ts, 105 lines)
```

### Core Module Structure

- **`src/document-viewer.ts`** (193 lines): Main orchestrator class
  - Container resolution (selector string or HTMLElement)
  - Document type detection/inference from URL extension
  - Default options setup and container styling
  - Lifecycle management: `render()`, `reload()`, `destroy()`, `changeDocument()`

- **`src/viewers/`**: Document-type-specific implementations
  - All implement `IViewer` interface: `render()`, `destroy()`, `reload()`
  - Each viewer is self-contained with its own rendering logic

- **`src/blob-utils.ts`**: CORS fallback system (see below)

- **`src/utils.ts`**: Shared utilities (UI helpers, type detection, container helpers)

- **`src/types.ts`**: TypeScript type definitions

- **`src/index.ts`**: Main barrel export (classes, types, utilities)

### PDF.js Loading Strategy (Hierarchical Fallback)

PDFViewer uses a multi-level loading approach for PDF.js:

1. **Check global**: `window.pdfjsLib` (already loaded by user?)
2. **Try npm package**: Bundled `pdfjs-dist` (if installed as peer dependency)
3. **Fallback to CDN**: Load from cdnjs.cloudflare.com v3.11.174
4. **Set worker source**: `GlobalWorkerOptions.workerSrc` points to CDN worker

This ensures PDF viewing works even if user doesn't install the optional peer dependency.

### Blob/Memory Fallback for CORS Issues

**Problem**: Cross-origin URLs blocked by browser CORS policy

**Solution**: Automatic blob/memory fallback system
1. Attempt direct URL loading first
2. If CORS error detected (`isCorsError()` checks error patterns):
   - Download file to browser memory via `fetch()`
   - Create blob URL with `URL.createObjectURL()`
   - Render using blob URL instead of original URL
3. Clean up blob URL after use with `URL.revokeObjectURL()`

**Files**: `src/blob-utils.ts` provides:
- `fetchAsBlob()`, `fetchAsArrayBuffer()`, `fetchAsText()`
- `revokeBlobUrl()` for cleanup
- `isCorsError()` for error detection

**Configuration**: `useBlobFallback: boolean` (default: true)

**Note**: Office viewers DON'T support blob fallback (external iframe viewers can't access blob URLs)

### Office Document Rendering

Office documents use **iframe-based third-party viewers** (NOT client-side rendering):

- **Google Docs Viewer** (default): `https://docs.google.com/viewer?url=...`
- **Microsoft Office Online**: `https://view.officeapps.live.com/op/embed.aspx?src=...`

**Limitation**: Requires publicly accessible URLs (no local files, no blob fallback)

## Build System

**Bundler**: Rollup (configured in `rollup.config.js`)

**Input**: `src/index.ts`

**Outputs**:
- `dist/index.js` (CommonJS) - Referenced in package.json `main`
- `dist/index.esm.js` (ES Module) - Referenced in package.json `module`
- `dist/index.d.ts` + source maps (TypeScript declarations) - Referenced in package.json `types`

**Rollup plugins**:
- `@rollup/plugin-typescript`: Compiles TypeScript with declaration generation
- `@rollup/plugin-node-resolve`: Resolves npm dependencies
- `@rollup/plugin-commonjs`: Handles CommonJS modules

**External dependencies**: `pdfjs-dist` marked as external (not bundled, users install separately if needed)

## TypeScript Configuration

`tsconfig.json` settings:
- Target: ES2020 (modern browsers only)
- Module: ESNext (Rollup handles CJS conversion)
- Strict mode enabled
- Declaration files and source maps generated

## Testing Workflow

Manual test files in project root:
- `simple-test.html`: Minimal test with console output
- `debug.html`: Verbose debugging mode
- `example.html`: Full-featured example
- `test-pdf.html`: PDF-specific test
- `test-blob-fallback.html`: CORS fallback verification

**Workflow**:
```bash
npm run build
python3 -m http.server 8000
# Visit http://localhost:8000/[test-file].html
```

## Important Technical Notes

1. **Async-first API**: All viewer methods return Promises (`render()`, `reload()`, `changeDocument()`)

2. **Memory management**: Always clean up resources
   - Call `viewer.destroy()` when done
   - Blob URLs automatically revoked
   - Event listeners removed

3. **Framework integration**: Library is framework-agnostic
   - See `examples/` directory for React, Vue, Angular examples
   - Always call `destroy()` in cleanup lifecycle hooks

4. **Document type detection**: Automatic from URL extension
   - `getDocumentType()` strips query params, extracts extension
   - Can be overridden with explicit `type` option

5. **No external CSS**: All styling done with inline CSS and CSS-in-JS
   - Custom styles via `styles` option in ViewerOptions

6. **Tree-shakeable**: ES Module build supports tree-shaking for optimal bundle size
