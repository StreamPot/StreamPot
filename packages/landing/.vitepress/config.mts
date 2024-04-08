import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "StreamPot (alpha)",
  description: "Easiest way to convert media",
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
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/jackbridger/streampot' }
    ]
  }
})
