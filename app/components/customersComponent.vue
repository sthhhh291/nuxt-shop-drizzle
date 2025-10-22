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
        v-for="customer in customers"
        :key="customer.id"
        class="border-b pb-2"
      >
        <nuxt-link :to="`/customers/${customer.id}`">
          {{ customer.first_name }} {{ customer.last_name }}
        </nuxt-link>
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
a {
  text-decoration: none;
  color: #3490dc;
}
a:hover {
  text-decoration: underline;
}
</style>
