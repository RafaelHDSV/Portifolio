import react from '@vitejs/plugin-react'
import path from 'path'
import type { Plugin } from 'vite'
import { defineConfig } from 'vite'

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

export default defineConfig({
  plugins: [react(), googleSiteVerificationPlugin()],
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
})
