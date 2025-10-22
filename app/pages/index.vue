<script setup lang="ts">
const { data, refresh } = await useFetch("/api/customers", {
  method: "GET",
});
const customers = computed(() => {
  return data.value && "customers" in data.value ? data.value.customers : [];
});

provide("refreshCustomers", refresh);
</script>

<template>
  <div class="grid place-items-center container mx-auto p-4">
    <div class="space-y-8">
      <h1>Home Page</h1>
      <customersComponent :customers="customers" />
      <addCustomerComponent @customerAdded="refresh" />
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 800px;
  display: grid;
  place-items: center;
}
.space-y-8 > * + * {
  margin-top: 2rem;
}
.space-y-4 > * + * {
  margin-top: 1rem;
}
.border-b {
  border-bottom: 1px solid #e5e7eb;
}
.pb-2 {
  padding-bottom: 0.5rem;
}
h1 {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
}
</style>
