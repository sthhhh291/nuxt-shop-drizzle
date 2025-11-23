<script setup lang="ts">
const { signOut } = useBetterAuth();

const handleSignOut = async () => {
  try {
    await signOut();

    // Force a page reload to ensure clean state
    if (process.client) {
      window.location.href = "/auth/login";
    } else {
      await navigateTo("/auth/login");
    }
  } catch (error) {
    console.error("Sign out failed:", error);

    // Even if sign out fails, redirect to login for security
    if (process.client) {
      window.location.href = "/auth/login";
    } else {
      await navigateTo("/auth/login");
    }
  }
};
</script>

<template>
  <UButton
    variant="outline"
    color="error"
    icon="i-heroicons-arrow-right-on-rectangle"
    @click="handleSignOut">
    Sign Out
  </UButton>
</template>
