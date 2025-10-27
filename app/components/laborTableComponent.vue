<script setup lang="ts">
import type { Labor } from "~~/db/schema";
defineProps<{
  labor: Labor[];
}>();
</script>

<template>
  <table class="table">
    <thead>
      <tr>
        <th>Description</th>
        <th>Hours</th>
        <th>Price</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="lab in labor" :key="lab.id">
        <td>{{ lab.description }}</td>
        <td>{{ lab.hours }}</td>
        <td>{{ lab.price }}</td>
      </tr>
    </tbody>
  </table>
</template>
