<script setup lang="ts">
import type { Oil } from "~~/db/schema";
defineProps<{
  oils: Oil[];
}>();
</script>

<template>
  <table class="table">
    <thead>
      <tr>
        <th>Description</th>
        <th>Quantity</th>
        <th>Cost</th>
        <th>Unit Price</th>
      </tr>
    </thead>
    <tbody>
      ``
      <tr v-for="oil in oils" :key="oil.id">
        <td>No description currently</td>
        <td>{{ oil.quantity }}</td>
        <td>{{ oil.cost }}</td>
        <td>{{ oil.price_per_unit }}</td>
      </tr>
    </tbody>
  </table>
</template>
