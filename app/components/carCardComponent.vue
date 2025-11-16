<script setup lang="ts">
import type { carWithRelations } from "~~/db/schema";

const props = defineProps<{
  car: carWithRelations;
}>();

const hasEstimates = computed(
  () => props.car.estimates && props.car.estimates.length > 0
);
</script>

<template>
  <UCard class="hover:shadow-lg transition-shadow duration-200">
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div
            class="w-12 h-12 bg-linear-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <UIcon name="i-heroicons-truck" class="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 class="font-semibold text-lg text-gray-900 dark:text-white">
              {{ car.year }} {{ car.make }} {{ car.model }}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              VIN: {{ car.vin }}
            </p>
          </div>
        </div>
        <UBadge v-if="car.fleet" color="primary" variant="soft"> Fleet </UBadge>
      </div>
    </template>

    <!-- Car Details -->
    <div class="space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="flex items-center gap-2">
          <UIcon name="i-heroicons-calendar" class="w-4 h-4 text-gray-400" />
          <span class="text-sm">
            <span class="font-medium">Year:</span> {{ car.year }}
          </span>
        </div>
        <div class="flex items-center gap-2">
          <UIcon
            name="i-heroicons-identification"
            class="w-4 h-4 text-gray-400" />
          <span class="text-sm">
            <span class="font-medium">License:</span> {{ car.license || "N/A" }}
          </span>
        </div>
      </div>

      <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
        <div class="flex items-center justify-between mb-3">
          <h4
            class="font-medium text-gray-900 dark:text-white flex items-center gap-2">
            <UIcon name="i-heroicons-document-text" class="w-4 h-4" />
            Estimates
          </h4>
          <UBadge
            :color="hasEstimates ? 'success' : 'neutral'"
            variant="soft"
            size="xs">
            {{ car.estimates?.length || 0 }}
          </UBadge>
        </div>

        <div v-if="hasEstimates" class="space-y-3">
          <NuxtLink
            v-for="estimate in car.estimates"
            :key="estimate.id"
            :to="`/estimates/${estimate.id}`"
            class="block hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg p-3 transition-colors duration-150">
            <EstimateCardComponent :estimate="estimate" />
          </NuxtLink>
        </div>

        <div v-else class="text-center py-6">
          <div
            class="w-12 h-12 mx-auto mb-3 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
            <UIcon
              name="i-heroicons-document-plus"
              class="w-6 h-6 text-gray-400" />
          </div>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">
            No estimates yet
          </p>
          <UButton
            :to="`/cars/${car.id}/addEstimate`"
            color="primary"
            variant="soft"
            size="sm"
            icon="i-heroicons-plus">
            Add Estimate
          </UButton>
        </div>
      </div>
    </div>
  </UCard>
</template>
