import { defineConfig } from 'vitepress'

const DESCRIPTION = 'Open source video transformation API'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "StreamPot",
  description: DESCRIPTION,
  srcDir: 'src',
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    [
      'script',
      {},
      `window.$crisp=[];window.CRISP_WEBSITE_ID="3f4d50bb-b8a8-4fa5-ae8d-80e61b99ad9a";(function(){d=document;s=d.createElement("script");s.src="https://client.crisp.chat/l.js";s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();`,
    ],
    [
      'script',
      { async: '', defer: '', src: 'https://scripts.simpleanalyticscdn.com/latest.js' },
    ],
    // social media meta tags
    ['meta', { property: 'og:title', content: 'StreamPot' }],
    ['meta', { property: 'og:description', content: DESCRIPTION }],
    ['meta', { property: 'og:image', content: '/og-image.png' }],
    ['meta', { property: 'og:url', content: 'https://streampot.io' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: 'StreamPot' }],
    ['meta', { name: 'twitter:description', content: DESCRIPTION }],
    ['meta', { name: 'twitter:image', content: '/og-image.png' }],
  ],
  themeConfig: {
    search: {
      provider: 'local'
    },
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      // { text: 'Specification 📄', link: '/methods' },
      { text: 'Sign Up', link: 'https://streampot.io/register' },
      { text: 'Log In', link: 'https://streampot.io/login' },
    ],
    logoLink: 'https://streampot.io',
    sidebar: [
      {

        items: [
          {
            text: 'Getting started',
            link: '/getting-started',
          },
          {
            text: 'List of methods',
            link: '/specification',
          }
        ],
      },
      {
        text: 'Examples',
        items: [
          { text: '✄ Trim video', link: 'examples#trim-a-video' },
          { text: '🔄 Convert video', link: 'examples#convert-a-video' },
          { text: '🎞️ Concatenate videos', link: 'examples#concatenate-different-videos' },
          { text: '🎥 Watermark video', link: 'examples#add-watermark' },
          { text: '🔊 Add audio to video', link: 'examples#add-audio-to-a-video' },
          { text: '🎚️ Change volume', link: 'examples#lower-volume-of-video' },
          { text: '🎨 Change resolution', link: 'examples#change-resolution' },
          { text: '🎞️ Crop video', link: 'examples#crop-video-dimensions' },
          { text: '🔄 Convert audio', link: 'examples#convert-audio' },
          { text: '🔊 Extract audio', link: 'examples#extract-audio-from-video' },
          { text: '🎞️ Extract frames', link: 'examples#get-frame' },
          { text: '🔄 Convert frames to video', link: 'examples#make-video-from-an-image' },
          // { text: '🎞️ Overlay videos', link: 'examples#overlay-videos' },
          // { text: '🎞️ Reverse video', link: 'examples#reverse-video' },
          // { text: '🎞️ Speed up video', link: 'examples#speed-up-video' },
          // { text: '🎞️ Slow down video', link: 'examples#slow-down-video' },
          // { text: '🎞️ Split video', link: 'examples#split-video' },
          // { text: '🎞️ Stitch videos', link: 'examples#stitch-videos' },
          // { text: '🎞️ Trim video', link: 'examples#trim-video' },
          // { text: '🎞️ Zoom video', link: 'examples#zoom-video' },
          // { text: '🎞️ Rotate video', link: 'examples#rotate-video' },
          // { text: '🎞️ Mirror video', link: 'examples#mirror-video' },
          // { text: '🎞️ Blur video', link: 'examples#blur-video' },
          // { text: '🎞️ Brighten video', link: 'examples#brighten-video' },
          // { text: '🎞️ Darken video', link: 'examples#darken-video' },
          // { text: '🎞️ Sharpen video', link: 'examples#sharpen-video' },
          // { text: '🎞️ Denoise video', link: 'examples#denoise-video' },
        ]
      },
      {
        text: 'Self-hosting',
        items: [
          { text: 'Installation', link: '/installation' },
          { text: 'Docker Compose', link: '/docker-compose' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/jackbridger/streampot' }
    ]
  }
})
