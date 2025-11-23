import { authClient } from "~/lib/auth-client";

export const useAuthClient = () => {
  return authClient;
};

// Global reactive state to ensure all components stay in sync
const globalAuthState = reactive({
  session: null as any,
  loading: true,
  initialized: false,
  initPromise: null as Promise<void> | null,
  hydrated: false,
});

// Check for persisted session on client-side
if (process.client) {
  const persistedSession = localStorage.getItem("auth-session");
  if (persistedSession) {
    try {
      globalAuthState.session = JSON.parse(persistedSession);
      globalAuthState.loading = false;
    } catch (error) {
      console.error("Failed to parse persisted session:", error);
      localStorage.removeItem("auth-session");
    }
  }
}

export const useBetterAuth = () => {
  const client = useAuthClient();

  // Computed values based on global state
  const user = computed(() => globalAuthState.session?.user ?? null);
  const isAuthenticated = computed(() => !!globalAuthState.session?.user);
  const session = computed(() => globalAuthState.session);
  const loading = computed(() => globalAuthState.loading);

  // Initialize session data only once with promise caching
  const initSession = async () => {
    if (globalAuthState.initialized) return;
    if (globalAuthState.initPromise) return globalAuthState.initPromise;

    globalAuthState.loading = true;
    globalAuthState.initPromise = (async () => {
      try {
        const result = await client.useSession(useFetch);
        globalAuthState.session = result.data.value;

        // Persist session to localStorage
        if (process.client && result.data.value) {
          localStorage.setItem(
            "auth-session",
            JSON.stringify(result.data.value)
          );
        }

        globalAuthState.loading = false;
        globalAuthState.initialized = true;
        globalAuthState.hydrated = true;
      } catch (error) {
        console.error("Failed to initialize session:", error);
        globalAuthState.session = null;
        globalAuthState.loading = false;
        globalAuthState.initialized = true;

        // Clear persisted session on error
        if (process.client) {
          localStorage.removeItem("auth-session");
        }
      } finally {
        globalAuthState.initPromise = null;
      }
    })();

    return globalAuthState.initPromise;
  };

  // Refresh session data
  const refresh = async () => {
    globalAuthState.loading = true;
    try {
      // Force re-initialization of session
      globalAuthState.initialized = false;
      globalAuthState.initPromise = null;

      // Re-initialize session
      const result = await client.useSession(useFetch);
      globalAuthState.session = result.data.value;
      globalAuthState.initialized = true;

      // Ensure reactivity triggers
      await nextTick();

      console.log("Refresh completed, session:", globalAuthState.session);
    } catch (error) {
      console.error("Failed to refresh session:", error);
      globalAuthState.session = null;
    } finally {
      globalAuthState.loading = false;
    }
  };

  const signOut = async () => {
    try {
      // Clear local state first
      globalAuthState.session = null;
      globalAuthState.initialized = false;
      globalAuthState.loading = true;

      // Clear persisted session
      if (process.client) {
        localStorage.removeItem("auth-session");
      }

      // Try to sign out from server
      try {
        await client.signOut({
          fetchOptions: {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          },
        });
      } catch (serverError) {
        console.warn(
          "Server sign out failed, but local state cleared:",
          serverError
        );
        // Continue with local cleanup even if server sign out fails
      }

      // Force a small delay to ensure state updates
      await new Promise((resolve) => setTimeout(resolve, 100));
    } catch (error) {
      console.error("Sign out failed:", error);

      // Clear local state even on error
      globalAuthState.session = null;
      globalAuthState.initialized = false;

      // Clear persisted session on error too
      if (process.client) {
        localStorage.removeItem("auth-session");
      }
    } finally {
      globalAuthState.loading = false;
    }
  };

  // Initialize on first use (client-side only) - but only once, with hydration check
  if (
    process.client &&
    !globalAuthState.initialized &&
    !globalAuthState.initPromise
  ) {
    // Wait for hydration to complete before initializing
    onMounted(() => {
      if (!globalAuthState.hydrated && !globalAuthState.session) {
        initSession();
      }
    });
  }

  return {
    session,
    loading,
    user,
    isAuthenticated,
    signOut,
    refresh,
    initSession,
  };
};

export const useAuthUser = async () => {
  const client = useAuthClient();

  return {
    user: (await client.useSession(useFetch)).data.value?.user,
  };
};
