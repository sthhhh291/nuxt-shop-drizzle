<script setup lang="ts">
import type { estimateWithRelations } from "~~/db/schema";
const { id } = useRoute().params;
const { data } = await useFetch(`/api/estimates/${id}`, {
  method: "GET",
});
console.log("Estimate data:", data.value);
const estimate = data.value.estimate as unknown as estimateWithRelations;
const totals = data.value.totals;
</script>

<template>
  <div class="">
    <customer-table-component class="table" :customer="estimate.car.customer" />
    <car-table-component class="table" :car="estimate.car" />
    <estimate-table-component class="table" :estimate="estimate" />
    <labor-table-component :labor="estimate.labor" />
    <part-table-component :parts="estimate.parts" />
    <oil-table-component :oils="estimate.oil" />
    <totals-table-component :totals="estimate.totals" />
  </div>
</template>
