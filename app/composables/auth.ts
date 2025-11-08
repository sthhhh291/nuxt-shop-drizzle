import { authClient } from '~/lib/auth-client'

export const useAuthClient = () => {
	return authClient
}

// Global reactive state to ensure all components stay in sync
const globalAuthState = reactive({
	session: null as any,
	loading: true,
	initialized: false
})

export const useBetterAuth = () => {
	const client = useAuthClient()
	
	// Computed values based on global state
	const user = computed(() => globalAuthState.session?.user ?? null)
	const isAuthenticated = computed(() => !!globalAuthState.session?.user)
	const session = computed(() => globalAuthState.session)
	const loading = computed(() => globalAuthState.loading)
	
	// Initialize session data only once
	const initSession = async () => {
		if (globalAuthState.initialized) return
		
		try {
			const result = await client.useSession(useFetch)
			globalAuthState.session = result.data.value
			globalAuthState.loading = result.isPending
			globalAuthState.initialized = true
			console.log('Auth initialized:', { user: globalAuthState.session?.user, loading: globalAuthState.loading })
		} catch (error) {
			console.error('Failed to initialize session:', error)
			globalAuthState.loading = false
			globalAuthState.initialized = true
		}
	}
	
	// Refresh session data
	const refresh = async () => {
		console.log('Refreshing auth state...')
		globalAuthState.loading = true
		try {
			const result = await client.useSession(useFetch)
			globalAuthState.session = result.data.value
			console.log('Auth refreshed:', { user: globalAuthState.session?.user })
		} catch (error) {
			console.error('Failed to refresh session:', error)
			globalAuthState.session = null
		} finally {
			globalAuthState.loading = false
		}
	}
	
	const signOut = async () => {
		try {
			console.log('Signing out...')
			await client.signOut()
			globalAuthState.session = null // Clear session immediately
			console.log('Signed out, session cleared')
		} catch (error) {
			console.error('Sign out failed:', error)
			// Clear session anyway on error
			globalAuthState.session = null
		} finally {
			globalAuthState.loading = false
		}
	}
	
	// Initialize on first use (client-side only)
	if (process.client && !globalAuthState.initialized) {
		nextTick(() => {
			initSession()
		})
	}
	
	return {
		session,
		loading,
		user,
		isAuthenticated,
		signOut,
		refresh
	}
}

export const useAuthUser = async () => {
	const client = useAuthClient()

	return {
		user: (await client.useSession(useFetch)).data.value?.user,
	}
}