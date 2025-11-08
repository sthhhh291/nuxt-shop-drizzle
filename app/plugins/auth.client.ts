export default defineNuxtPlugin(() => {
  // Initialize auth state on app startup (client-side only)
  if (process.client) {
    // The auth composable will auto-initialize when first used
    const { user, loading } = useBetterAuth()
    
    // Log initial auth state
    console.log('Auth plugin: Initial auth state loaded')
    
    // Watch for auth changes and log them
    watch(user, (newUser) => {
      console.log('Auth plugin: User changed to:', newUser)
    }, { immediate: true })
  }
})