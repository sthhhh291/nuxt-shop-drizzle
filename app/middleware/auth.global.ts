export default defineNuxtRouteMiddleware(async (to) => {
	// Only run on client-side to avoid SSR issues
	if (process.server) return

	const isUserNavigatingToTheApp = to.path.startsWith('/') && !to.path.startsWith('/auth')
	if (!isUserNavigatingToTheApp) {
		return
	}

	const { isAuthenticated, loading, initSession } = useBetterAuth()
	
	// If not loading and not authenticated, try to initialize once
	if (!loading.value && !isAuthenticated.value) {
		await initSession()
	}
	
	// Give the auth system a moment to respond, but don't block indefinitely
	if (loading.value) {
		await new Promise(resolve => setTimeout(resolve, 300)) // Max 300ms wait
	}

	// After initialization attempt, redirect if still not authenticated
	if (!isAuthenticated.value) {
		return navigateTo('/auth/login')
	}
})