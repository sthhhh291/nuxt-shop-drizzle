<script setup lang="ts">
const { signOut } = useBetterAuth();

const handleSignOut = async () => {
  try {
    await signOut();
    // Navigate to login page after successful sign out
    await navigateTo("/auth/login");
  } catch (error) {
    console.error("Sign out failed:", error);
    // You might want to show a toast or error message here
  }
};
</script>

<template>
  <UButton 
    variant="outline" 
    color="error"
    icon="i-heroicons-arrow-right-on-rectangle"
    @click="handleSignOut"
  >
    Sign Out
  </UButton>
</template>
