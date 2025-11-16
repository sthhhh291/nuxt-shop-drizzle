<script setup lang="ts">
import type { Customer } from "~~/db/schema";

defineProps<{
  customers: Customer[];
}>();
</script>

<template>
  <div v-if="customers.length > 0">
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <UCard
        v-for="customer in customers"
        :key="customer.id"
        class="hover:shadow-lg transition-shadow cursor-pointer"
        @click="$router.push(`/customers/${customer.id}`)"
      >
        <div class="flex items-center gap-4">
          <UAvatar
            :alt="`${customer.first_name} ${customer.last_name}`"
            size="lg"
            class="bg-primary-500 dark:bg-primary-400"
          >
            {{ customer.first_name?.[0] }}{{ customer.last_name?.[0] }}
          </UAvatar>
          
          <div class="flex-1 min-w-0">
            <h3 class="font-semibold text-gray-900 dark:text-white truncate">
              {{ customer.first_name }} {{ customer.last_name }}
            </h3>
            <p v-if="customer.notes" class="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
              {{ customer.notes }}
            </p>
          </div>
          
          <UIcon 
            name="i-heroicons-chevron-right" 
            class="text-gray-400 flex-shrink-0"
          />
        </div>
      </UCard>
    </div>
  </div>
  
  <div v-else class="text-center py-12">
    <slot name="no-results">
      <UIcon name="i-heroicons-users" class="text-4xl text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
        No customers found
      </h3>
      <p class="text-gray-500 dark:text-gray-400">
        Try adjusting your search criteria or add a new customer.
      </p>
    </slot>
  </div>
</template>


