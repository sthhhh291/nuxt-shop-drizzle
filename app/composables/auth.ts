import { authClient } from '~/lib/auth-client'

export const useAuthClient = () => {
	return authClient
}

export const useAuthUser = async () => {
	const client = useAuthClient()

	return {
		user: (await client.useSession(useFetch)).data.value?.user,
	}
}