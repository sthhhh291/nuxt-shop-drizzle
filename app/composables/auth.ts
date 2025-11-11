import { authClient } from '~/lib/auth-client'

export const useAuthClient = () => {
	return authClient
}

// Global reactive state to ensure all components stay in sync
const globalAuthState = reactive({
	session: null as any,
	loading: true,
	initialized: false,
	initPromise: null as Promise<void> | null
})

export const useBetterAuth = () => {
	const client = useAuthClient()
	
	// Computed values based on global state
	const user = computed(() => globalAuthState.session?.user ?? null)
	const isAuthenticated = computed(() => !!globalAuthState.session?.user)
	const session = computed(() => globalAuthState.session)
	const loading = computed(() => globalAuthState.loading)
	
	// Initialize session data only once with promise caching
	const initSession = async () => {
		if (globalAuthState.initialized) return
		if (globalAuthState.initPromise) return globalAuthState.initPromise
		
		globalAuthState.initPromise = (async () => {
			try {
				const result = await client.useSession(useFetch)
				globalAuthState.session = result.data.value
				globalAuthState.loading = result.isPending
				globalAuthState.initialized = true
			} catch (error) {
				console.error('Failed to initialize session:', error)
				globalAuthState.loading = false
				globalAuthState.initialized = true
			} finally {
				globalAuthState.initPromise = null
			}
		})()
		
		return globalAuthState.initPromise
	}
	
	// Refresh session data
	const refresh = async () => {
		globalAuthState.loading = true
		try {
			const result = await client.useSession(useFetch)
			globalAuthState.session = result.data.value
		} catch (error) {
			console.error('Failed to refresh session:', error)
			globalAuthState.session = null
		} finally {
			globalAuthState.loading = false
		}
	}
	
	const signOut = async () => {
		try {
			await client.signOut()
			globalAuthState.session = null
		} catch (error) {
			console.error('Sign out failed:', error)
			globalAuthState.session = null
		} finally {
			globalAuthState.loading = false
		}
	}
	
	// Initialize on first use (client-side only) - but only once
	if (process.client && !globalAuthState.initialized && !globalAuthState.initPromise) {
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
		refresh,
		initSession
	}
}

export const useAuthUser = async () => {
	const client = useAuthClient()

	return {
		user: (await client.useSession(useFetch)).data.value?.user,
	}
}