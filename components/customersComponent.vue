<script setup lang="ts">
const { data } = await useFetch("/api/customers", {
  method: "GET",
});

const customers = computed(() => {
  // Check if 'customers' exists in the response
  return data.value && "customers" in data.value ? data.value.customers : [];
});
</script>

<template>
  <div>
    <h1>Customers</h1>
    <ul>
      <li v-for="customer in customers" :key="customer.id">
        {{ customer.first_name }} {{ customer.last_name }} -
        {{ customer.notes }}
      </li>
    </ul>
  </div>
</template>
