import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'iddaa-mcp',
  description: 'Instant Match Intelligence for MCP workflows',
  base: '/iddaa-mcp/',
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'GitHub', link: 'https://github.com/borakilicoglu/iddaa-mcp' },
      { text: 'npm', link: 'https://www.npmjs.com/package/iddaa-mcp' },
    ],
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Getting Started', link: '/guide/getting-started' },
          { text: 'Transports', link: '/guide/transports' },
          { text: 'Tools', link: '/guide/tools' },
        ],
      },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/borakilicoglu/iddaa-mcp' },
    ],
  },
})
