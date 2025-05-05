// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  alias: {
    // pinia: "/node_modules/@pinia/nuxt/node_modules/pinia/dist/pinia.mjs"
  },
  app: {
    baseURL: "/niem-toolbox/",
    head: {
      htmlAttrs: {
        lang: "en-US"
      },
      link: [
        {
          rel: "icon",
          type: "image/x-icon",
          href: "favicon.ico"
        }
      ],
      title: "NIEM Toolbox"
    },
    rootId: "toolbox-app"
  },
  compatibilityDate: '2024-04-03',
  css: [
    "~/assets/styles/main.scss"
  ],
  devtools: {
    enabled: true
  },
  icon: {
    provider: "iconify",
    customCollections: [
      {
        prefix: "app",
        dir: "./assets/icons"
      }
    ]
  },
  // TODO: include module '@vite-pwa/nuxt'
  modules: ['@nuxt/ui', '@pinia/nuxt', "@vueuse/nuxt", "@nuxt/content"],
  nitro: {
    prerender: {
      // failOnError: false
    }
  },
  // pwa: {
  //   // registerType: "autoUpdate",
  //   base: "",
  //   client: {
  //     // installPrompt: true
  //   },
  //   manifest: {
  //     name: "NIEM Toolbox",
  //     lang: "en-US"
  //   },
  //   scope: "/",
  //   workbox: {
  //     navigateFallback: undefined
  //   }
  // },
  routeRules: {
    "/public/**": {
      headers: {
        "Access-Control-Allow-Origin": "*"
      }
    }
  },
  router: {
    options: {
      // hashMode: true
    }
  },
  sourcemap: true,
  ssr: true,
  // ui: {
  //   theme: {
  //     colors: ["primary", "secondary", "success", "warning", "error", "info", "neutral"]
  //   }
  // },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: "@use '~/assets/styles/variables.scss' as *;",
          api: "modern-compiler"
        }
      }
    },
    server: {
      cors: true  // For dev
    }
  }
});
