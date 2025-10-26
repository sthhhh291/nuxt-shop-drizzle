<script setup lang="ts">
import type { estimateWithRelations } from "~~/db/schema";
const props = defineProps<{
  estimate: estimateWithRelations;
}>();
</script>

<template>
  <div class="estimate-card">
    <div class="">
      <h3>Estimate</h3>
      <p>
        {{ estimate.date }} - {{ estimate.hours_taken }} -
        {{ estimate.estimate_type }}
      </p>
      <div v-for="lab in estimate.labor" :key="lab.id">
        <p>Labor: {{ lab.description }} - ${{ lab.price }} </p>
      </div>
      <div v-for="part in estimate.parts" :key="part.id">
        <p>Part: {{ part.description }} - ${{ part.unit_price }} </p>
      </div>
      <div v-for="oi in estimate.oil" :key="oi.id">
        <p>Oil: {{ oi.price_per_unit }} </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.estimate-card {
  border: 1px solid #ccc;
  padding: 1em;
  margin-bottom: 1em;
  border-radius: 5px;
}
</style>
