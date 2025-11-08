<script setup lang="ts">
// Try using the API endpoint directly
const { data: session, pending: loading } = await useFetch(
  "/api/auth/get-session",
  {
    server: false, // Client-side only to avoid SSR issues
    default: () => null,
  }
);

// Watch for session changes
watch(
  session,
  (newSession) => {
    console.log("Session updated:", newSession);
  },
  { immediate: true }
);

const handleSignOut = async () => {
  try {
    await $fetch("/api/auth/signout", {
      method: "POST",
    });
    // Navigate to login page after successful sign out
    // await refresh();
    await navigateTo("/auth/login");
  } catch (error) {
    console.error("Sign out failed:", error);
    // You might want to show a toast or error message here
  }
};
</script>

<template>
  <div v-if="loading">Loading...</div>
  <ul v-else-if="!session?.user && !session?.data">
    <NuxtLink to="/auth/login">Sign In</NuxtLink>
    <NuxtLink to="/auth/signup">Sign Up</NuxtLink>
  </ul>
  <ul v-else>
    <NuxtLink to="/">Home</NuxtLink>
    <NuxtLink to="/estimates">Estimates</NuxtLink>
    <NuxtLink to="/customers">Customers</NuxtLink>
    <NuxtLink to="/cars">Cars</NuxtLink>
    <Signout />
    <!-- <Button @click="handleSignOut">Sign Out</Button> -->
  </ul>
  <main>
    <NuxtPage />
  </main>
</template>

<style scoped>
ul {
  display: flex;
  gap: 1rem;
  padding: 20px 40px;
  background-color: #f8f9fa;
}
ul a {
  text-decoration: none;
  color: #eef4fa;
  background-color: #007bff;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition:
    background-color 0.75s,
    color 0.75s;
}
ul a:hover {
  /* text-decoration: underline; */
  color: #eef4fa;
  background-color: #91c6ff;
}
</style>
