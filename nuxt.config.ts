// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/main.css"],
  modules: [
    "@nuxt/content",
    "@nuxt/eslint",
    "@nuxt/image",
    "@nuxt/scripts",
    "@nuxt/test-utils",
    "@nuxt/ui",
  ],

  // Runtime config for client-side access
  runtimeConfig: {
    public: {
      disableAuth: process.env.DISABLE_AUTH === "true",
      authUrl: process.env.BETTER_AUTH_URL || "http://localhost:3000",
    },
  },

  // Color mode for Nuxt UI
  colorMode: {
    preference: "dark",
  },

  // Optimize build performance and bundle size
  vite: {
    optimizeDeps: {
      // Pre-bundle these dependencies
      include: ["better-auth", "drizzle-orm"],
    },
  },

  // Server-side rendering optimizations
  ssr: true,
  nitro: {
    // Ensure Node.js packages stay server-side
    experimental: {
      wasm: true,
    },
  },
});
