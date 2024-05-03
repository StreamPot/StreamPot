import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "StreamPot (alpha)",
  description: "Easiest way to convert media",
  head: [['link', { rel: 'icon', href: '../favicon.ico' }]],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/examples' }
    ],

    sidebar: [
      {
        text: 'Introduction',
        items: [
          { text: 'Getting Started', link: '/getting-started' },
        ],
      },
      {
        text: 'Examples',
        items: [
          // { text: 'Markdown Examples', link: '/examples' },
          { text: 'Trim a video', link: '/trim-video-example' }
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
