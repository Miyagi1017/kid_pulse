import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { existsSync } from 'node:fs';
import type { IncomingMessage } from 'node:http';
import path from 'node:path';
import { defineConfig, loadEnv, type Plugin, type ViteDevServer } from 'vite';

function vercelApiDev(): Plugin {
  const resolveRoute = (pathname: string) => {
    const base = path.join(process.cwd(), pathname.replace(/^\/+/, ''));
    return [`${base}.ts`, path.join(base, 'index.ts')].find(existsSync);
  };

  const readBody = (req: IncomingMessage) =>
    new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];
      req.on('data', (c: Buffer) => chunks.push(c));
      req.on('end', () => resolve(Buffer.concat(chunks)));
      req.on('error', reject);
    });

  return {
    name: 'vercel-api-dev',
    configureServer(server: ViteDevServer) {
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`);
        if (!url.pathname.startsWith('/api/')) return next();
        const file = resolveRoute(url.pathname);
        if (!file) {
          res.statusCode = 404;
          return res.end(JSON.stringify({ error: 'Route inconnue.' }));
        }
        try {
          const mod = await server.ssrLoadModule(file);
          const handler = mod[req.method ?? 'GET'];
          if (typeof handler !== 'function') {
            res.statusCode = 405;
            return res.end(JSON.stringify({ error: 'Méthode non autorisée.' }));
          }
          const headers = new Headers();
          for (const [k, v] of Object.entries(req.headers)) {
            if (typeof v === 'string') headers.set(k, v);
            else if (Array.isArray(v)) headers.set(k, v.join(', '));
          }
          const hasBody = req.method !== 'GET' && req.method !== 'HEAD';
          const request = new Request(url, {
            method: req.method,
            headers,
            body: hasBody ? new Uint8Array(await readBody(req)) : undefined
          });
          const response: Response = await handler(request);
          res.statusCode = response.status;
          response.headers.forEach((value, key) => {
            if (key !== 'set-cookie') res.setHeader(key, value);
          });
          const cookies = response.headers.getSetCookie();
          if (cookies.length) res.setHeader('Set-Cookie', cookies);
          res.end(Buffer.from(await response.arrayBuffer()));
        } catch (err) {
          server.ssrFixStacktrace(err as Error);
          console.error(err);
          res.statusCode = 500;
          res.end(JSON.stringify({ error: 'Erreur interne (dev).' }));
        }
      });
    }
  };
}

export default defineConfig(({ mode }) => {
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''));
  return {
    plugins: [react(), tailwindcss(), vercelApiDev()],
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
