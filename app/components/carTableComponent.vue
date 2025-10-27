<script setup lang="ts">
import type { carWithRelations } from "~~/db/schema";
defineProps<{
  car: carWithRelations;
}>();
</script>

<template>
  <table class="table">
    <thead>
      <tr>
        <th>Make</th>
        <th>Model</th>
        <th>Year</th>
        <th>VIN</th>
      </tr>
    </thead>
    <tbody>
      <tr :key="car.id">
        <td>{{ car.make }}</td>
        <td>{{ car.model }}</td>
        <td>{{ car.year }}</td>
        <td>{{ car.vin }}</td>
      </tr>
    </tbody>
  </table>
</template>
