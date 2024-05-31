// https://vitepress.dev/guide/custom-theme
import { h, watch } from 'vue'
import { useRoute } from 'vitepress';
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './custom.css'
import CodeExample from './CodeExample.vue'

export default {
    extends: DefaultTheme,
    setup() {
        const route = useRoute();
        watch(
            () => route.path,
            (to, from) => {
                window.posthog?.capture(
                    '$pageleave',
                    {
                        to: to,
                        $current_url: from
                    }
                )
                window.posthog?.capture(
                    '$pageview',
                    {
                        from: from,
                        $current_url: to
                    }
                )
            },
        );
    },
    Layout: () => {
        return h(DefaultTheme.Layout, null, {
            // https://vitepress.dev/guide/extending-default-theme#layout-slots
            'home-hero-image': () => h(CodeExample)
        })
    },
    enhanceApp({ app, router, siteData }) {
        // ...
    }
} satisfies Theme