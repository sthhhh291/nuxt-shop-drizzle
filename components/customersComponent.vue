<script setup lang="ts">
import type { Customer } from "~~/db/schema";

defineProps<{
  customers: Customer[];
}>();
</script>

<template>
  <div>
    <h1>Customers</h1>
    <ul class="space-y-4">
      <li
        class="border-b pb-2"
        v-for="customer in customers"
        :key="customer.id">
        {{ customer.first_name }} {{ customer.last_name }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
ul {
  list-style-type: none;
  padding: 0;
}
li {
  margin-bottom: 10px;
}
</style>
