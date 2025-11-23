import { createAuthClient } from "better-auth/vue";

export const authClient = createAuthClient({
  /** The base URL of the server - use runtime config for proper production URLs */
  baseURL: process.client ? window.location.origin : undefined,
});
