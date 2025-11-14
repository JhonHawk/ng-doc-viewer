/**
 * Angular Example for Universal Document Viewer
 *
 * Usage:
 * 1. Install: npm install universal-doc-viewer
 * 2. Create a component as shown below
 */

import { Component, ElementRef, Input, OnInit, OnDestroy, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { DocumentViewer } from 'universal-doc-viewer';

// Component TypeScript
@Component({
  selector: 'app-document-viewer',
  template: `
    <div class="document-viewer-wrapper">
      <div *ngIf="error" class="error-message">
        Error: {{ error }}
      </div>
      <div #viewerContainer class="viewer-container"></div>
    </div>
  `,
  styles: [`
    .document-viewer-wrapper {
      width: 100%;
    }

    .viewer-container {
      border: 1px solid #ddd;
      border-radius: 4px;
      overflow: hidden;
    }

    .error-message {
      padding: 15px;
      background: #ffe6e6;
      color: #cc0000;
      border-radius: 4px;
      margin-bottom: 20px;
    }
  `]
})
export class DocumentViewerComponent implements OnInit, OnDestroy, OnChanges {
  @Input() url: string;
  @Input() type?: string;
  @Input() height: string = '600px';

  @ViewChild('viewerContainer', { static: true }) viewerContainer: ElementRef;

  private viewer: DocumentViewer | null = null;
  error: string | null = null;

  ngOnInit() {
    this.initializeViewer();
  }

  ngOnChanges(changes: SimpleChanges) {
    if ((changes['url'] || changes['type']) && !changes['url']?.firstChange) {
      this.updateDocument();
    }
  }

  ngOnDestroy() {
    if (this.viewer) {
      this.viewer.destroy();
    }
  }

  private initializeViewer() {
    if (!this.url) return;

    try {
      this.viewer = new DocumentViewer({
        container: this.viewerContainer.nativeElement,
        url: this.url,
        type: this.type as any,
        height: this.height,
        onLoad: () => {
          this.error = null;
        },
        onError: (err) => {
          this.error = err.message;
        }
      });

      this.viewer.render();
    } catch (err) {
      this.error = (err as Error).message;
    }
  }

  private async updateDocument() {
    if (!this.viewer || !this.url) return;

    try {
      this.error = null;
      await this.viewer.changeDocument(this.url, this.type as any);
    } catch (err) {
      this.error = (err as Error).message;
    }
  }
}

// Example App Component
@Component({
  selector: 'app-root',
  template: `
    <div class="app-container">
      <h1>Universal Document Viewer - Angular Example</h1>

      <div class="controls">
        <button
          *ngFor="let doc of documents"
          (click)="loadDocument(doc)"
          class="btn"
        >
          {{ doc.name }}
        </button>
      </div>

      <app-document-viewer
        [url]="currentUrl"
        [type]="currentType"
        height="700px"
      ></app-document-viewer>

      <div *ngIf="currentDoc" class="info">
        <p><strong>Current Document:</strong> {{ currentDoc.name }}</p>
        <p><strong>Type:</strong> {{ currentDoc.type }}</p>
      </div>
    </div>
  `,
  styles: [`
    .app-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    h1 {
      color: #333;
      margin-bottom: 20px;
    }

    .controls {
      margin-bottom: 20px;
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .btn {
      padding: 10px 20px;
      background: #dd0031;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    }

    .btn:hover {
      background: #c50028;
    }

    .info {
      margin-top: 20px;
      padding: 15px;
      background: #e8f4f8;
      border-left: 4px solid #dd0031;
      border-radius: 4px;
    }

    .info p {
      margin: 5px 0;
      color: #555;
    }
  `]
})
export class AppComponent {
  documents = [
    {
      name: 'Sample PDF',
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      type: 'pdf'
    },
    {
      name: 'Sample Image',
      url: 'https://file-examples.com/storage/fe783befa4d1bd58bb72a02/2017/10/file_example_PNG_500kB.png',
      type: 'png'
    },
    {
      name: 'Sample Text',
      url: 'https://www.w3.org/TR/PNG/iso_8859-1.txt',
      type: 'txt'
    }
  ];

  currentUrl = this.documents[0].url;
  currentType = this.documents[0].type;
  currentDoc = this.documents[0];

  loadDocument(doc: any) {
    this.currentUrl = doc.url;
    this.currentType = doc.type;
    this.currentDoc = doc;
  }
}

// Module (app.module.ts)
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    DocumentViewerComponent
  ],
  imports: [
    BrowserModule,
    CommonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
