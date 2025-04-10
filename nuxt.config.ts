export default defineNuxtConfig({
  app: {
    head: {
      title: "Канбан дошка",
      htmlAttrs: {
        lang: "uk",
      },
    },
  },

  devtools: { enabled: true },

  modules: ["@nuxt/ui", "@nuxt/eslint", "@pinia/nuxt"],

  css: ["~/assets/css/main.css"],

  future: {
    compatibilityVersion: 4,
  },

  compatibilityDate: "2024-11-27",

  pinia: {
    storesDirs: ["./app/stores/**"],
  },
});
