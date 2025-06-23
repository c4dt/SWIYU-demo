// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },

  devtools: { enabled: true },

  vite: {
    plugins: [tailwindcss()],
    server: {
      watch: {
        usePolling: true,
        interval: 2500,
      },
      allowedHosts: ['swiyu.elghareeb.space', 'localhost'],
    },
  },

  css: ['~/assets/css/main.css'],
  modules: ['@nuxt/image', '@nuxt/eslint'],

  runtimeConfig: {
    public: {
      swiyuIssuerInternal: process.env.SWIYU_ISSUER_INTERNAL,
      swiyuVerifierInternal: process.env.SWIYU_VERIFIER_INTERNAL,
    },
  },
});
