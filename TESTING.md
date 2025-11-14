# Testing the Universal Document Viewer

Esta guía te ayudará a probar la librería localmente.

## Prerequisitos

```bash
# Instalar dependencias (si aún no lo has hecho)
npm install

# Compilar la librería
npm run build
```

## Opciones para Probar

### Opción 1: Servidor HTTP Simple

Necesitas un servidor HTTP para probar los archivos HTML. No puedes abrirlos directamente con `file://` debido a las restricciones de CORS y módulos ES.

**Con Python 3:**
```bash
python3 -m http.server 8000
```

Luego abre en tu navegador:
- http://localhost:8000/simple-test.html (prueba básica con logs)
- http://localhost:8000/example.html (ejemplo completo)
- http://localhost:8000/debug.html (modo debug con console detallado)
- http://localhost:8000/test-pdf.html (prueba específica de PDF)

**Con Node.js (npx):**
```bash
npx serve .
```

**Con http-server (Node.js):**
```bash
npm install -g http-server
http-server
```

### Opción 2: VS Code Live Server

Si usas Visual Studio Code:
1. Instala la extensión "Live Server"
2. Haz clic derecho en cualquier archivo HTML
3. Selecciona "Open with Live Server"

## Archivos de Prueba Disponibles

### simple-test.html
El más simple, ideal para debugging básico:
- Console log visible en pantalla
- Botones para probar Image, Text y PDF
- Muestra errores claramente

### debug.html
Versión con logging extensivo:
- Console detallado en pantalla
- Muestra cada paso del proceso
- Útil para identificar problemas específicos

### example.html
Ejemplo completo con todas las funcionalidades:
- Todos los tipos de documentos
- Interfaz pulida
- Incluye documentos Office (Excel, Word, PowerPoint)

### test-pdf.html
Prueba específica para PDFs:
- Carga automática de un PDF
- Verifica que PDF.js se cargue correctamente desde CDN

## Verificación de la Compilación

Después de ejecutar `npm run build`, deberías tener:

```bash
dist/
├── index.js           # CommonJS build
├── index.esm.js       # ES Module build (usado en navegador)
├── index.d.ts         # TypeScript definitions
├── *.d.ts.map         # Source maps
└── viewers/           # Type definitions para viewers
```

## Problemas Comunes

### 1. "Failed to load PDF.js library"

**Solución:** La librería ahora carga PDF.js automáticamente desde CDN. Verifica que:
- Estés usando un servidor HTTP (no `file://`)
- Tengas conexión a internet
- No haya bloqueadores de scripts en tu navegador

### 2. "Container element not found"

**Solución:** Verifica que el selector del container sea correcto:
```javascript
new DocumentViewer({
  container: '#viewer-container', // ← debe existir en el HTML
  url: 'document.pdf'
})
```

### 3. Documentos Office no cargan

**Causa:** Los documentos deben ser públicamente accesibles en internet.

**Solución:**
- Usa URLs públicas (no archivos locales)
- Verifica que el documento no requiera autenticación
- Prueba con la opción `useMicrosoftViewer: true` si Google Docs Viewer falla

### 4. Errores de CORS

**Causa:** El documento está en un servidor que no permite CORS.

**Solución:**
- Usa documentos de servidores que permitan CORS
- Para PDFs locales en desarrollo, considera usar un proxy
- Imágenes y textos: asegúrate que el servidor tenga CORS configurado

## Ejemplos de Código para Probar

### Imagen
```javascript
const viewer = new DocumentViewer({
  container: '#viewer',
  url: 'https://download.samplelib.com/png/sample-boat-400x300.png',
  type: 'png'
});
await viewer.render();
```

### Texto
```javascript
const viewer = new DocumentViewer({
  container: '#viewer',
  url: 'https://example-files.online-convert.com/document/txt/example.txt',
  type: 'txt'
});
await viewer.render();
```

### PDF
```javascript
const viewer = new DocumentViewer({
  container: '#viewer',
  url: 'https://pdfobject.com/pdf/sample.pdf',
  type: 'pdf'
});
await viewer.render();
```

## Debugging en el Navegador

1. Abre las DevTools (F12)
2. Ve a la pestaña Console
3. Deberías ver logs de:
   - Importación del módulo
   - Creación del viewer
   - Carga del documento
   - Errores (si los hay)

## Verificar que TODO Funciona

Abre `simple-test.html` y:
1. Haz clic en "Load Image" → Debería mostrar un placeholder
2. Haz clic en "Load Text" → Debería mostrar texto ASCII
3. Haz clic en "Load PDF" → Debería cargar PDF.js desde CDN y mostrar el PDF

Si los 3 funcionan, ¡la librería está funcionando correctamente!
