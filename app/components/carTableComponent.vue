<script setup lang="ts">
import type { carWithRelations } from "~~/db/schema";

const props = defineProps<{
  car: carWithRelations;
}>();

const columns = [
  { key: "make", label: "Make" },
  { key: "model", label: "Model" },
  { key: "year", label: "Year" },
  { key: "vin", label: "VIN" },
];

const rows = computed(() => [props.car]);
</script>

<template>
  <UCard>
    <UTable
      :columns="columns"
      :rows="rows"
      :empty-state="{
        icon: 'i-heroicons-circle-stack-20-solid',
        label: 'No car data available.',
      }">
      <template #vin-data="{ row }">
        <span class="font-mono text-sm">{{ row.vin }}</span>
      </template>
      <template #year-data="{ row }">
        <UBadge color="primary" variant="soft">{{ row.year }}</UBadge>
      </template>
    </UTable>
  </UCard>
</template>
