import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'

function getCanonicalSiteUrl(value: string | undefined): string | undefined {
  if (!value?.trim()) return undefined

  let url: URL
  try {
    url = new URL(value)
  } catch {
    throw new Error('VITE_SITE_URL must be the confirmed HTTPS custom-domain root URL.')
  }

  const hostname = url.hostname.toLowerCase()
  if (
    url.protocol !== 'https:' ||
    url.username ||
    url.password ||
    url.port ||
    url.pathname !== '/' ||
    url.search ||
    url.hash ||
    !hostname.includes('.') ||
    hostname === 'localhost' ||
    hostname.endsWith('.vercel.app') ||
    hostname === 'example.com' ||
    hostname.endsWith('.example.com')
  ) {
    throw new Error('VITE_SITE_URL must be the confirmed HTTPS custom-domain root, not a preview or placeholder URL.')
  }

  return `${url.origin}/`
}

function seoPlugin(siteUrl: string | undefined, isBuild: boolean, configurationError?: Error): Plugin {
  let outputDirectory = resolve(process.cwd(), 'dist')

  return {
    name: 'bold-bright-space-seo',
    configResolved(config) {
      outputDirectory = resolve(config.root, config.build.outDir)
    },
    renderStart: {
      order: 'post',
      handler() {
        // Vite clears the output directory in its pre renderStart hook. Defer
        // invalid build configuration errors until after that hook so a failed
        // build cannot leave stale canonical output in dist.
        if (configurationError) throw configurationError
      },
    },
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        if (!siteUrl) return html

        return {
          html,
          tags: [
            { tag: 'link', attrs: { rel: 'canonical', href: siteUrl }, injectTo: 'head' },
            { tag: 'meta', attrs: { property: 'og:url', content: siteUrl }, injectTo: 'head' },
          ],
        }
      },
    },
    async closeBundle() {
      if (!isBuild || !siteUrl) return

      const sitemap = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        `  <url><loc>${siteUrl}</loc></url>`,
        '</urlset>',
        '',
      ].join('\n')
      const robots = [
        'User-agent: *',
        'Allow: /',
        `Sitemap: ${new URL('sitemap.xml', siteUrl).href}`,
        '',
      ].join('\n')

      await Promise.all([
        writeFile(resolve(outputDirectory, 'sitemap.xml'), sitemap, 'utf8'),
        writeFile(resolve(outputDirectory, 'robots.txt'), robots, 'utf8'),
      ])
    },
  }
}

export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  let siteUrl: string | undefined
  let configurationError: Error | undefined
  try {
    siteUrl = getCanonicalSiteUrl(env.VITE_SITE_URL)
  } catch (error) {
    if (command !== 'build' || !(error instanceof Error)) throw error
    configurationError = error
  }

  return {
    plugins: [tailwindcss(), react(), seoPlugin(siteUrl, command === 'build', configurationError)],
  }
})
