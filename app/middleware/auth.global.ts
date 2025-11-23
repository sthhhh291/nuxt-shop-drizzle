export default defineNuxtRouteMiddleware(async (to, from) => {
  // Skip middleware for auth pages
  if (to.path.startsWith("/auth")) {
    return;
  }

  // Check if auth is disabled in development
  const config = useRuntimeConfig();
  if (config.public.disableAuth) {
    return;
  }

  // Only run on client-side to avoid SSR issues, but with better hydration handling
  if (process.server) {
    return;
  }

  // Wait for hydration to complete
  await nextTick();

  const { isAuthenticated, loading, initSession } = useBetterAuth();

  // Always try to initialize session if not already done
  if (!isAuthenticated.value && !loading.value) {
    try {
      await initSession();

      // Give some time for session state to update
      await new Promise((resolve) => setTimeout(resolve, 100));
    } catch (error) {
      console.error("Auth initialization failed:", error);
    }
  }

  // Wait a bit more if still loading
  if (loading.value) {
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  // Final check - redirect if not authenticated
  if (!isAuthenticated.value && !loading.value) {
    console.log("Redirecting to login - not authenticated");
    return navigateTo("/auth/login");
  }
});
