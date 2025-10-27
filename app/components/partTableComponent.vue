<script setup lang="ts">
import type { Part } from "~~/db/schema";
defineProps<{
  parts: Part[];
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
      <tr v-for="part in parts" :key="part.id">
        <td>{{ part.description }}</td>
        <td>{{ part.quantity }}</td>
        <td>{{ part.cost }}</td>
        <td>{{ part.unit_price }}</td>
      </tr>
    </tbody>
  </table>
</template>
