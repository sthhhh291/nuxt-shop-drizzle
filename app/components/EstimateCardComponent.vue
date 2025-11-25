<script setup lang="ts">
import type { estimateWithRelations } from "~~/db/schema";

const props = defineProps<{
  estimate: estimateWithRelations;
}>();

// Calculate totals
const laborTotal = computed(() => 
  props.estimate.labor.reduce((sum, item) => sum + item.price, 0)
);

const partsTotal = computed(() => 
  props.estimate.parts.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0)
);

const oilTotal = computed(() => 
  props.estimate.oil.reduce((sum, item) => sum + (item.price_per_unit * item.quantity), 0)
);

const subtotal = computed(() => laborTotal.value + partsTotal.value + oilTotal.value);

// Format currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
};

// Format date
const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};
</script>

<template>
  <UCard class="hover:shadow-lg transition-shadow">
    <!-- Header -->
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
            <UIcon name="i-heroicons-document-text" class="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ formatDate(estimate.date) }}
            </h3>
            <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <UIcon name="i-heroicons-clock" class="w-4 h-4" />
              <span>{{ estimate.hours_taken }} hours</span>
              <span class="text-gray-300 dark:text-gray-600">•</span>
              <UBadge :color="estimate.estimate_type === 'Warranty' ? 'blue' : 'green'" variant="soft">
                {{ estimate.estimate_type }}
              </UBadge>
            </div>
          </div>
        </div>
        
        <div class="text-right">
          <p class="text-sm text-gray-500 dark:text-gray-400">Total</p>
          <p class="text-xl font-bold text-primary-600 dark:text-primary-400">
            {{ formatCurrency(subtotal) }}
          </p>
        </div>
      </div>
    </template>

    <!-- Content -->
    <div class="space-y-4">
      <!-- Labor Items -->
      <div v-if="estimate.labor.length > 0">
        <div class="flex items-center gap-2 mb-2">
          <UIcon name="i-heroicons-wrench-screwdriver" class="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300">Labor</h4>
        </div>
        <div class="space-y-2 pl-6">
          <div 
            v-for="lab in estimate.labor" 
            :key="lab.id"
            class="flex items-start justify-between text-sm"
          >
            <span class="text-gray-600 dark:text-gray-400 flex-1">{{ lab.description }}</span>
            <span class="font-medium text-gray-900 dark:text-white ml-2">
              {{ formatCurrency(lab.price) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Parts Items -->
      <div v-if="estimate.parts.length > 0">
        <div class="flex items-center gap-2 mb-2">
          <UIcon name="i-heroicons-cog-6-tooth" class="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300">Parts</h4>
        </div>
        <div class="space-y-2 pl-6">
          <div 
            v-for="part in estimate.parts" 
            :key="part.id"
            class="flex items-start justify-between text-sm"
          >
            <div class="flex-1">
              <span class="text-gray-600 dark:text-gray-400">{{ part.description }}</span>
              <span class="text-gray-400 dark:text-gray-500 text-xs ml-2">×{{ part.quantity }}</span>
            </div>
            <span class="font-medium text-gray-900 dark:text-white ml-2">
              {{ formatCurrency(part.unit_price * part.quantity) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Oil Items -->
      <div v-if="estimate.oil.length > 0">
        <div class="flex items-center gap-2 mb-2">
          <UIcon name="i-heroicons-beaker" class="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300">Oil & Fluids</h4>
        </div>
        <div class="space-y-2 pl-6">
          <div 
            v-for="oi in estimate.oil" 
            :key="oi.id"
            class="flex items-start justify-between text-sm"
          >
            <div class="flex-1">
              <span class="text-gray-600 dark:text-gray-400">{{ oi.type }}</span>
              <span class="text-gray-400 dark:text-gray-500 text-xs ml-2">×{{ oi.quantity }}</span>
            </div>
            <span class="font-medium text-gray-900 dark:text-white ml-2">
              {{ formatCurrency(oi.price_per_unit * oi.quantity) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer with breakdown -->
    <template #footer>
      <div class="space-y-2 border-t border-gray-200 dark:border-gray-700 pt-3">
        <div class="flex justify-between text-sm">
          <span class="text-gray-600 dark:text-gray-400">Labor</span>
          <span class="font-medium text-gray-900 dark:text-white">{{ formatCurrency(laborTotal) }}</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-gray-600 dark:text-gray-400">Parts</span>
          <span class="font-medium text-gray-900 dark:text-white">{{ formatCurrency(partsTotal) }}</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-gray-600 dark:text-gray-400">Oil & Fluids</span>
          <span class="font-medium text-gray-900 dark:text-white">{{ formatCurrency(oilTotal) }}</span>
        </div>
        <div class="flex justify-between text-base font-semibold pt-2 border-t border-gray-200 dark:border-gray-700">
          <span class="text-gray-900 dark:text-white">Subtotal</span>
          <span class="text-primary-600 dark:text-primary-400">{{ formatCurrency(subtotal) }}</span>
        </div>
      </div>
    </template>
  </UCard>
</template>
