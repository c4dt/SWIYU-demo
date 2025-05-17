// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4
  },

  devtools: { enabled: true },

  vite: {
    plugins: [tailwindcss()]
  },

  css: ["~/assets/css/main.css"],
  modules: ["@nuxt/image"],
  runtimeConfig: {
    public: {
      swiyuIssuerInternal: process.env.SWIYU_ISSUER_INTERNAL
    }
  }
})
