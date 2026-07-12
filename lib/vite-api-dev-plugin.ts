import path from 'node:path'
import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Plugin, ViteDevServer } from 'vite'
import { loadEnv } from 'vite'

const API_ROUTES: Record<string, string> = {
  '/api/linkedin-posts': 'api/linkedin-posts.ts',
  '/api/linkedin-media': 'api/linkedin-media.ts'
}

function applyServerEnv (mode: string, root: string): void {
  const env = loadEnv(mode, root, '')

  for (const [key, value] of Object.entries(env)) {
    process.env[key] ??= value
  }
}

async function runApiHandler (
  server: ViteDevServer,
  handlerFile: string,
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> {
  const handlerPath = path.resolve(server.config.root, handlerFile)
  const module = await server.ssrLoadModule(handlerPath)
  const handler = module.default as (
    req: IncomingMessage,
    res: ServerResponse
  ) => Promise<void>

  await handler(req, res)
}

export function viteApiDevPlugin (): Plugin {
  return {
    name: 'vite-api-dev',
    configureServer (server) {
      applyServerEnv(server.config.mode, server.config.root)

      server.middlewares.use(async (req, res, next) => {
        const url = req.url ?? ''
        const pathname = url.split('?')[0]
        const handlerFile = API_ROUTES[pathname]

        if (!handlerFile) {
          next()
          return
        }

        try {
          await runApiHandler(server, handlerFile, req, res)
        } catch (error) {
          console.error('Falha no middleware de API local', error)
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          res.end(JSON.stringify({ error: 'internal_error' }))
        }
      })
    }
  }
}
