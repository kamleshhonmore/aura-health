import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Plugin to strip `crossorigin` attribute from HTML script/link tags
// to prevent Android System WebView from blocking local scripts under CORS policy
const removeCrossoriginPlugin = () => ({
  name: 'remove-crossorigin',
  transformIndexHtml(html: string) {
    return html.replace(/ crossorigin/g, '');
  },
});

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss(), removeCrossoriginPlugin()],
  build: {
    target: ['es2015', 'chrome74'],
    cssTarget: ['es2015', 'chrome74'],
    modulePreload: false,
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
  },
});
