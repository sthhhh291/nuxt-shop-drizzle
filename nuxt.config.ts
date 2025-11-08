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
    // "@sidebase/nuxt-auth",
  ],
  // auth: {
  //   // globalAppMiddleware: true,
  //   baseURL: process.env.NUXT_PUBLIC_API_URL,
  //   provider: {
  //     type: "local",
  //     // endpoints: {
  //     //   signIn: { path: "/signin", method: "post" },
  //     //   signOut: { path: "/identity/accounts/logout", method: "get" },
  //     //   signUp: { path: "/register", method: "post" },
  //     //   getSession: { path: "/identity/me", method: "get" },
  //     // },
  //     // pages: {
  //     //   login: "/login",
  //     //   logout: "/",
  //     //   home: "/",
  //     //   profile: "/profile",
  //     //   register: "/register",
  //     // },
  //     token: {
  //       signInResponseTokenPointer: "/accessToken",
  //     },
  //     sessionDataType: {},
  //   },
  //   enableSessionRefreshPeriodically: 5000,
  //   enableSessionRefreshOnWindowFocus: true,
  //   globalMiddlewareOptions: {
  //     allow404WithoutAuth: true, // Defines if the 404 page will be accessible while unauthenticated
  //     addDefaultCallbackUrl: "/", // Where authenticated user will be redirected to by default
  //   },
  // },
});
