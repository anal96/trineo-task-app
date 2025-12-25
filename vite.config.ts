import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  
  return {
    plugins: [
      // The React and Tailwind plugins are both required for Make, even if
      // Tailwind is not being actively used – do not remove them
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        // Alias @ to the src directory
        '@': path.resolve(__dirname, './src'),
      },
    },
    publicDir: 'public',
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: !isProduction,
      minify: isProduction ? 'esbuild' : false,
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'ui-vendor': ['lucide-react'],
          },
        },
      },
      chunkSizeWarningLimit: 1000,
    },
    server: {
      host: '0.0.0.0', // Allow access from network (for port forwarding)
      port: 5173,
      proxy: {
        '/api': {
          target: process.env.VITE_API_URL || 'http://localhost:5000',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path, // Keep /api in the path
          configure: (proxy, _options) => {
            proxy.on('error', (err, _req, _res) => {
              console.error('❌ Proxy error:', err);
            });
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              console.log('🔄 Proxying:', req.method, req.url, '→ ' + (process.env.VITE_API_URL || 'http://localhost:5000') + req.url);
            });
            proxy.on('proxyRes', (proxyRes, req, _res) => {
              console.log('✅ Proxy response:', proxyRes.statusCode, req.url);
            });
          },
        },
      },
    },
  }
})
