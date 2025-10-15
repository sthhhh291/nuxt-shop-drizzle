// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  devServer: {
    port: 3000,
  },

  modules: [
    "@nuxt/content",
    "@nuxt/eslint",
    "@nuxt/image",
    "@nuxt/scripts",
    "@nuxt/test-utils",
    "@nuxt/ui",
    "@sidebase/nuxt-auth",
  ],
  auth: {
    baseURL: `${process.env.AUTH_ORIGIN}/api/auth`,
    provider: {
      type: "authjs",
    },
    sessionRefresh: {
      enablePeriodically: false,
      enableOnWindowFocus: false,
    },
    globalAppMiddleware: false,
    disableServerSideAuth: true,
  },
});
