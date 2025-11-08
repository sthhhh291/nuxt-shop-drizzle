export default defineNuxtRouteMiddleware(async (to) => {
	// Only run on client-side to avoid SSR issues
	if (process.server) return

	const isUserNavigatingToTheApp = to.path.startsWith('/') && !to.path.startsWith('/auth')
	if (!isUserNavigatingToTheApp) {
		return
	}

	const { isAuthenticated, loading } = useBetterAuth()
	
	// Wait for auth to finish loading
	while (loading.value) {
		await new Promise(resolve => setTimeout(resolve, 50))
	}

	if (!isAuthenticated.value) {
		return navigateTo('/auth/login')
	}
})