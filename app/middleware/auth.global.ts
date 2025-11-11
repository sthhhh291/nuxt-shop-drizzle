export default defineNuxtRouteMiddleware(async (to, from) => {
  // Only run on client-side to avoid SSR issues
  if (process.server) return;

  const isUserNavigatingToTheApp =
    to.path.startsWith("/") && !to.path.startsWith("/auth");
  if (!isUserNavigatingToTheApp) {
    return;
  }

  // If coming from login page, give more time for auth state to propagate
  const isComingFromLogin = from?.path === "/auth/login";

  const { isAuthenticated, loading, initSession } = useBetterAuth();

  console.log(
    "Auth middleware - to:",
    to.path,
    "from:",
    from?.path,
    "isAuthenticated:",
    isAuthenticated.value,
    "loading:",
    loading.value
  );

  // If not loading and not authenticated, try to initialize once
  if (!loading.value && !isAuthenticated.value) {
    await initSession();
  }

  // Give the auth system more time if coming from login
  const waitTime = isComingFromLogin ? 1000 : 300;
  if (loading.value) {
    await new Promise((resolve) => setTimeout(resolve, waitTime));
  }

  console.log(
    "Auth middleware after wait - isAuthenticated:",
    isAuthenticated.value
  );

  // After initialization attempt, redirect if still not authenticated
  if (!isAuthenticated.value) {
    console.log("Redirecting to login from middleware");
    return navigateTo("/auth/login");
  }
});
