import { sentryVitePlugin } from '@sentry/vite-plugin'
import react from '@vitejs/plugin-react'
import path from 'path'
import type { Plugin } from 'vite'
import { defineConfig, loadEnv } from 'vite'
import { viteApiDevPlugin } from './lib/vite-api-dev-plugin'

function googleSiteVerificationPlugin (): Plugin {
  return {
    name: 'google-site-verification',
    transformIndexHtml (html) {
      const token = process.env.VITE_GOOGLE_SITE_VERIFICATION?.trim()
      if (!token || html.includes('google-site-verification')) return html

      return html.replace(
        '<meta charset="UTF-8" />',
        `<meta charset="UTF-8" />\n    <meta name="google-site-verification" content="${token}" />`
      )
    }
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const release = env.VERCEL_GIT_COMMIT_SHA ?? ''
  const uploadSourceMaps = Boolean(env.SENTRY_AUTH_TOKEN && env.SENTRY_ORG && env.SENTRY_PROJECT)

  return {
  plugins: [
    react(),
    viteApiDevPlugin(),
    googleSiteVerificationPlugin(),
    ...(uploadSourceMaps
      ? [
          sentryVitePlugin({
            authToken: env.SENTRY_AUTH_TOKEN,
            org: env.SENTRY_ORG,
            project: env.SENTRY_PROJECT,
            release: release ? { name: release } : undefined,
            sourcemaps: { filesToDeleteAfterUpload: ['./dist/**/*.map'] },
            telemetry: false
          })
        ]
      : [])
  ],
  define: {
    'import.meta.env.VITE_SENTRY_RELEASE': JSON.stringify(release)
  },
  optimizeDeps: {
    exclude: ['@vieira/institucional', '@vieira/analytics']
  },
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
  },
  build: {
    sourcemap: uploadSourceMaps ? 'hidden' : false,
    rollupOptions: {
      output: {
        manualChunks (id) {
          if (!id.includes('node_modules')) return

          if (id.includes('@emailjs')) return 'emailjs'
          if (id.includes('@phosphor-icons')) return 'phosphor'
          if (id.includes('react-icons')) return 'react-icons'
          if (id.includes('react-awesome-reveal')) return 'reveal'
          if (id.includes('i18next') || id.includes('react-i18next')) return 'i18n'
        }
      }
    }
  }
  }
})
