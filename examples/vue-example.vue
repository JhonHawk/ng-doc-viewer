<!--
  Vue 3 Example for Universal Document Viewer

  Usage:
  1. Install: npm install universal-doc-viewer
  2. Import and use the component as shown below
-->

<template>
  <div class="document-viewer-app">
    <h1>Universal Document Viewer - Vue Example</h1>

    <div class="controls">
      <button
        v-for="doc in documents"
        :key="doc.url"
        @click="loadDocument(doc)"
        class="btn"
      >
        {{ doc.name }}
      </button>
    </div>

    <div v-if="error" class="error-message">
      Error: {{ error }}
    </div>

    <div ref="viewerContainer" class="viewer-container"></div>

    <div v-if="currentDoc" class="info">
      <p><strong>Current Document:</strong> {{ currentDoc.name }}</p>
      <p><strong>Type:</strong> {{ currentDoc.type }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { DocumentViewer } from 'universal-doc-viewer';

const viewerContainer = ref(null);
const currentDoc = ref(null);
const error = ref(null);
let viewer = null;

const documents = [
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

const loadDocument = async (doc) => {
  error.value = null;
  currentDoc.value = doc;

  try {
    if (viewer) {
      await viewer.changeDocument(doc.url, doc.type);
    } else {
      viewer = new DocumentViewer({
        container: viewerContainer.value,
        url: doc.url,
        type: doc.type,
        height: '600px',
        onLoad: () => {
          error.value = null;
        },
        onError: (err) => {
          error.value = err.message;
        }
      });
      await viewer.render();
    }
  } catch (err) {
    error.value = err.message;
  }
};

onMounted(() => {
  // Load first document by default
  loadDocument(documents[0]);
});

onUnmounted(() => {
  if (viewer) {
    viewer.destroy();
  }
});
</script>

<style scoped>
.document-viewer-app {
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
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn:hover {
  background: #35925f;
}

.viewer-container {
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
  min-height: 600px;
}

.error-message {
  padding: 15px;
  background: #ffe6e6;
  color: #cc0000;
  border-radius: 4px;
  margin-bottom: 20px;
}

.info {
  margin-top: 20px;
  padding: 15px;
  background: #e8f4f8;
  border-left: 4px solid #42b983;
  border-radius: 4px;
}

.info p {
  margin: 5px 0;
  color: #555;
}
</style>
