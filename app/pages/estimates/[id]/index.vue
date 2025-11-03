<script setup lang="ts">
import type { estimateWithRelations } from "~~/db/schema";
const { id } = useRoute().params;
const { data, refresh } = await useFetch(`/api/estimates/${id}`, {
  method: "GET",
});
const router = useRouter();
console.log("Estimate data:", data.value);
const estimate = computed(
  () => data.value?.estimate as unknown as estimateWithRelations
);
const totals = computed(() => data.value.totals);
const updateEstimate = async () => {
  await refresh();
};
</script>

<template>
  <div class="">
    <customer-table-component class="table" :customer="estimate.car.customer" />
    <car-table-component class="table" :car="estimate.car" />
    <estimate-table-component class="table" :estimate="estimate" />
    <h4>
      Labor
      <Button @click="router.push(`/estimates/${id}/addLabor`)"
        >Add Labor</Button
      >
    </h4>
    <labor-table-component :labor="estimate.labor" @emit="updateEstimate" />
    <h4>
      Parts
      <Button @click="router.push(`/estimates/${id}/addParts`)"
        >Add Parts</Button
      >
    </h4>
    <part-table-component :parts="estimate.parts" @emit="updateEstimate" />
    <h4>
      Oil
      <Button @click="router.push(`/estimates/${id}/addOil`)">Add Oil</Button>
    </h4>
    <oil-table-component :oils="estimate.oil" @emit="updateEstimate" />
    <totals-table-component :totals="totals" />
    <h1>Grand Total: {{ formatCurrency(totals.total) }}</h1>
  </div>
</template>
