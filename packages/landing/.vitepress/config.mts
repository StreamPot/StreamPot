import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "StreamPot",
  description: "Easiest way to convert media",
  head: [['link', { rel: 'icon', href: '../favicon.ico' }]],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home 🏠', link: '/' },
      { text: 'Specification 📄', link: '/methods' },
      { text: 'Examples 🌟', link: '/examples' },
    ],

    sidebar: [
      {
        text: 'Introduction',
        items: [
          { text: 'Getting Started', link: '/getting-started' },
          {
            text: 'Available Methods',
            link: '/methods',
          },
        ],
      },
      {
        text: 'Examples',
        items: [
          { text: '✄ Trim a video', link: 'examples#trim-a-video' },
          { text: '🔄 Convert a video', link: '/convert-video' }
        ]
      },
      {
        text: 'Self-hosting',
        items: [
          { text: 'Docker Compose', link: '/docker-compose' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/jackbridger/streampot' }
    ]
  }
})
