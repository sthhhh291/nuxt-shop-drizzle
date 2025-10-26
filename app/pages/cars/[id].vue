<script setup lang="ts">
import type { carWithRelations } from "~~/db/schema";
const { id } = useRoute().params;
const { data, refresh } = await useFetch(`/api/cars/${id}`, {
  method: "GET",
});
const car = data.value as carWithRelations;
</script>

<template>
  <div class="container mx-auto p-4">
    <div class="space-y-4">
      <h1>Car Details</h1>
      <div v-if="car">
        <CustomerCardComponent :customer="car.customer" />
        <CarCardComponent :car="car" />
      </div>
      <div v-else>
        <p>Loading car details...</p>
      </div>
    </div>
  </div>
</template>
