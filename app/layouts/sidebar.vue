<script setup lang="ts">
const showSidebar = ref(false);
</script>

<template>
  <div class="layout-container">
    <header>
      <button @click="showSidebar = !showSidebar">Toggle Sidebar</button>
      <h1>Nuxt Shop Drizzle</h1>
    </header>
    <aside v-if="showSidebar" class="sidebar">
      <nav>
        <ul>
          <li><NuxtLink to="/">Home</NuxtLink></li>
          <li><NuxtLink to="/estimates">Estimates</NuxtLink></li>
          <li><NuxtLink to="/customers">Customers</NuxtLink></li>
          <li><NuxtLink to="/cars">Cars</NuxtLink></li>
        </ul>
      </nav>
    </aside>
    <main :class="{ 'with-sidebar': showSidebar }">
      <NuxtPage />
    </main>
  </div>
</template>
