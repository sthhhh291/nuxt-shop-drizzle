<script setup lang="ts">
import type { estimateWithRelations } from "~~/db/schema";

const props = defineProps<{
  estimate: estimateWithRelations;
}>();

const columns = [
  { key: "id", label: "ID" },
  { key: "date", label: "Date" },
  { key: "hours_taken", label: "Hours" },
  { key: "estimate_type", label: "Type" },
  { key: "total_cost", label: "Total Cost" },
];

const rows = computed(() => [props.estimate]);

const formatCurrency = (amount: number | null) => {
  if (!amount) return "$0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

const formatDate = (date: string | null) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString();
};
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <UIcon name="i-heroicons-document-text" class="text-primary-500" />
          <div>
            <h3 class="font-semibold">Estimate Details</h3>
            <p class="text-sm text-gray-500">ID: {{ estimate.id }}</p>
          </div>
        </div>
        <UBadge
          :color="estimate.estimate_type === 'repair' ? 'warning' : 'info'"
          variant="soft">
          {{ estimate.estimate_type }}
        </UBadge>
      </div>
    </template>

    <UTable
      :columns="columns"
      :rows="rows"
      :empty-state="{
        icon: 'i-heroicons-document-text-20-solid',
        label: 'No estimate data available.',
      }">
      <template #id-data="{ row }">
        <UBadge color="primary" variant="outline">{{ row.id }}</UBadge>
      </template>

      <template #date-data="{ row }">
        <span class="text-sm">{{ formatDate(row.date) }}</span>
      </template>

      <template #hours_taken-data="{ row }">
        <div class="flex items-center gap-1">
          <UIcon name="i-heroicons-clock" class="text-gray-400" />
          <span>{{ row.hours_taken || 0 }} hrs</span>
        </div>
      </template>

      <template #estimate_type-data="{ row }">
        <UBadge
          :color="
            row.estimate_type === 'repair' ? 'warning'
            : row.estimate_type === 'maintenance' ? 'success'
            : 'info'
          "
          variant="soft">
          {{ row.estimate_type }}
        </UBadge>
      </template>

      <template #total_cost-data="{ row }">
        <span class="font-semibold text-green-600">
          {{ formatCurrency(row.total_cost) }}
        </span>
      </template>
    </UTable>
  </UCard>
</template>
