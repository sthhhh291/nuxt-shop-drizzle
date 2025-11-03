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
      <p>
        {{ car.year }} {{ car.make }} {{ car.model }} {{ car.vin }}
        {{ car.license }} {{ car.fleet }}</p
      >
      <div v-for="estimate in car.estimates" :key="estimate.id">
        <NuxtLink :to="`/estimates/${estimate.id}`">
          <EstimateCardComponent :key="estimate.id" :estimate="estimate" />
        </NuxtLink>
      </div>
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
