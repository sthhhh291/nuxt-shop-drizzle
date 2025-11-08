<script setup lang="ts">
const { session, loading, user, isAuthenticated } = useBetterAuth()

// Watch for all auth state changes with debugging
watch(
  user,
  (newUser) => {
    console.log("Layout: User updated:", newUser);
  },
  { immediate: true }
);

watch(
  isAuthenticated,
  (newAuth) => {
    console.log("Layout: Authentication status:", newAuth);
  },
  { immediate: true }
);

watch(
  loading,
  (newLoading) => {
    console.log("Layout: Loading status:", newLoading);
  },
  { immediate: true }
);
</script>

<template>
  <div v-if="loading">Loading...</div>
  <ul v-else-if="!isAuthenticated">
    <NuxtLink to="/auth/login">Sign In</NuxtLink>
    <NuxtLink to="/auth/signup">Sign Up</NuxtLink>
  </ul>
  <ul v-else>
    <NuxtLink to="/">Home</NuxtLink>
    <NuxtLink to="/estimates">Estimates</NuxtLink>
    <NuxtLink to="/customers">Customers</NuxtLink>
    <NuxtLink to="/cars">Cars</NuxtLink>
    <Button disabled>Welcome, {{ user.name || user.email }}</Button>
    <Signout />
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
