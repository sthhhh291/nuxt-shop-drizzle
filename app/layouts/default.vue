<template>
  <ul>
    <NuxtLink to="/">Home</NuxtLink>
    <NuxtLink to="/estimates">Estimates</NuxtLink>
    <NuxtLink to="/customers">Customers</NuxtLink>
    <NuxtLink to="/cars">Cars</NuxtLink>
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
