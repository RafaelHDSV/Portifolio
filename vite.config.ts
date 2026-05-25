import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import { fetchLinkedInPosts } from './lib/linkedin/fetchPosts'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      {
        name: 'linkedin-api-dev',
        configureServer (server) {
          server.middlewares.use(async (req, res, next) => {
            if (req.url !== '/api/linkedin-posts') {
              next()
              return
            }

            try {
              process.env.LINKEDIN_RSS_URL = env.LINKEDIN_RSS_URL
              process.env.LINKEDIN_ACCESS_TOKEN = env.LINKEDIN_ACCESS_TOKEN
              process.env.LINKEDIN_MEMBER_URN = env.LINKEDIN_MEMBER_URN

              const posts = await fetchLinkedInPosts()
              res.setHeader('Content-Type', 'application/json')
              res.setHeader('Cache-Control', 'no-store')
              res.end(JSON.stringify({ posts }))
            } catch (err) {
              console.error(err)
              res.statusCode = 500
              res.end(JSON.stringify({ posts: [] }))
            }
          })
        }
      }
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/styles/variables.scss" as *;`
        }
      }
    }
  }
})
