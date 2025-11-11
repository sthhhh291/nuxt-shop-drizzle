export default defineNuxtRouteMiddleware(async (to) => {
	// Only run on client-side to avoid SSR issues
	if (process.server) return

	const isUserNavigatingToTheApp = to.path.startsWith('/') && !to.path.startsWith('/auth')
	if (!isUserNavigatingToTheApp) {
		return
	}

	const { isAuthenticated, loading, initSession } = useBetterAuth()
	
	// Ensure auth is initialized, but don't block if it's already loading
	if (!loading.value && !isAuthenticated.value) {
		// Try to initialize once more if not authenticated
		await initSession()
	}
	
	// Use a timeout instead of infinite loop
	const maxWaitTime = 3000 // 3 seconds max
	const startTime = Date.now()
	
	while (loading.value && (Date.now() - startTime) < maxWaitTime) {
		await new Promise(resolve => setTimeout(resolve, 100))
	}

	if (!isAuthenticated.value) {
		return navigateTo('/auth/login')
	}
})