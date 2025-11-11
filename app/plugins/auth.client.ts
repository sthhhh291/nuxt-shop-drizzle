export default defineNuxtPlugin(() => {
  // Initialize auth state on app startup (client-side only)
  if (process.client) {
    // Pre-initialize auth to avoid delays
    const { initSession } = useBetterAuth()
    initSession()
  }
})