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
  <Button @click="handleSignOut">Sign Out</Button>
</template>
