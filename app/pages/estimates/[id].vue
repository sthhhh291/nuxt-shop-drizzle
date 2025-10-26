<script setup lang="ts">
import type { estimateWithRelations } from "~~/db/schema";
const { id } = useRoute().params;
const { data, refresh } = await useFetch(`/api/estimates/${id}`, {
  method: "GET",
});
console.log("Estimate data:", data.value);
const estimate = data.value.estimate as unknown as estimateWithRelations;
const totals = data.value.totals;
console.log("Estimate data after casting:", estimate);
console.log("Estimate totals:", totals);
</script>

<template>
  <div class="container mx-auto p-4">
    <div class="space-y-4">
      <h1>Estimate Details</h1>
      <div v-if="estimate">
        <CustomerCardComponent :customer="estimate.car.customer" />
        <CarCardComponent :car="estimate.car" />
        <EstimateCardComponent :estimate="estimate" />
        <EstimateTotalsCardComponent :totals="totals" />
      </div>
      <div v-else>
        <p>Loading estimate details...</p>
      </div>
    </div>
  </div>
</template>
