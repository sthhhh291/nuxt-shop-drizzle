<script setup lang="ts">
import type { carWithRelations } from "~~/db/schema";

const { data: cars } = await useFetch<carWithRelations[]>("/api/cars", {
  method: "GET",
});

// Modal state
const isAddCarOpen = ref(false);
</script>

<template>
  <UContainer class="py-8">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          Cars
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">
          Manage your customer vehicles
          <span v-if="cars" class="text-sm">
            ({{ cars.length }} total)
          </span>
        </p>
      </div>
      
      <!-- Add Car Button -->
      <UButton 
        color="primary" 
        size="lg"
        icon="i-heroicons-plus"
        @click="isAddCarOpen = true"
      >
        Add Car
      </UButton>
    </div>

    <!-- Cars Grid -->
    <div v-if="cars && cars.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <UCard 
        v-for="car in cars" 
        :key="car.id"
        class="hover:shadow-lg transition-shadow cursor-pointer"
        @click="$router.push(`/cars/${car.id}`)"
      >
        <div class="space-y-4">
          <!-- Car Header -->
          <div class="flex items-center gap-4">
            <UAvatar
              size="lg"
              class="bg-blue-500 dark:bg-blue-400"
            >
              <UIcon name="i-heroicons-truck" class="text-xl" />
            </UAvatar>
            
            <div class="flex-1 min-w-0">
              <h3 class="font-semibold text-gray-900 dark:text-white truncate">
                {{ car.year }} {{ car.make }} {{ car.model }}
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Owner: {{ car.customer.first_name }} {{ car.customer.last_name }}
              </p>
            </div>
            
            <UIcon 
              name="i-heroicons-chevron-right" 
              class="text-gray-400 shrink-0"
            />
          </div>

          <!-- Car Details -->
          <div class="space-y-2">
            <div v-if="car.engine" class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <UIcon name="i-heroicons-cog-6-tooth" class="text-xs" />
              <span>{{ car.engine }}</span>
            </div>
            
            <div v-if="car.vin" class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <UIcon name="i-heroicons-identification" class="text-xs" />
              <span>VIN: {{ car.vin }}</span>
            </div>
            
            <div v-if="car.license" class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <UIcon name="i-heroicons-document-text" class="text-xs" />
              <span>License: {{ car.license }}</span>
            </div>
          </div>

          <!-- Car Notes -->
          <div v-if="car.notes" class="pt-2 border-t border-gray-200 dark:border-gray-700">
            <p class="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
              {{ car.notes }}
            </p>
          </div>

          <!-- Estimates Count -->
          <div v-if="car.estimates && car.estimates.length > 0" class="pt-2 border-t border-gray-200 dark:border-gray-700">
            <div class="flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400">
              <UIcon name="i-heroicons-document-text" class="text-xs" />
              <span>{{ car.estimates.length }} estimate(s)</span>
            </div>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Empty State -->
    <UCard v-else>
      <div class="text-center py-12">
        <UIcon name="i-heroicons-truck" class="text-4xl text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No cars yet
        </h3>
        <p class="text-gray-500 dark:text-gray-400 mb-6">
          Get started by adding your first vehicle.
        </p>
        <UButton
          color="primary"
          icon="i-heroicons-plus"
          @click="isAddCarOpen = true"
        >
          Add Your First Car
        </UButton>
      </div>
    </UCard>

    <!-- Add Car Modal -->
    <UModal v-model="isAddCarOpen">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">Add New Car</h3>
            <UButton
              color="neutral"
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              @click="isAddCarOpen = false"
            />
          </div>
        </template>

        <div class="space-y-4">
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Car management functionality coming soon.
          </p>
          <UButton 
            block 
            variant="outline" 
            @click="isAddCarOpen = false"
          >
            Close
          </UButton>
        </div>
      </UCard>
    </UModal>
  </UContainer>
</template>
