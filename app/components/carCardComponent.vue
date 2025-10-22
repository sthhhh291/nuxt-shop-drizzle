<script setup lang="ts">
import type { carWithRelations } from "~~/db/schema";
defineProps<{
  car: carWithRelations;
}>();
</script>

<template>
  <div class="car-card">
    <div class="">
      <h3>Car</h3>
      <p>{{ car.make }} {{ car.model }} ({{ car.year }})</p>
    </div>
  </div>
</template>

<style scoped>
.car-card {
  border: 1px solid #ccc;
  padding: 1em;
  margin-bottom: 1em;
  border-radius: 5px;
}
</style>
