import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
// @ts-ignore
import busArrivalHandler from './api/bus-arrival.js';
// @ts-ignore
import healthHandler from './api/health.js';

function apiDevServerPlugin(): Plugin {
  return {
    name: 'api-dev-server',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const urlStr = req.url || '';
        const parsedUrl = new URL(urlStr, 'http://localhost');
        const pathname = parsedUrl.pathname;

        const lower = pathname.toLowerCase();
        if (lower === '/api/health' || lower === '/api/health.js') {
          // Provide req.query for compatibility
          (req as any).query = Object.fromEntries(parsedUrl.searchParams.entries());
          await healthHandler(req, res);
          return;
        }

        if (
          lower === '/api/bus-arrival' ||
          lower === '/api/bus-arrival.js' ||
          lower === '/api/busarrival' ||
          lower === '/api/busarrival.js'
        ) {
          // Provide req.query for compatibility
          (req as any).query = Object.fromEntries(parsedUrl.searchParams.entries());
          await busArrivalHandler(req, res);
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apiDevServerPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
