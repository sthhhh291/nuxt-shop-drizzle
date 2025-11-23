<script setup lang="ts">
import type { Estimate } from '~~/db/schema';

const props = defineProps<{
  estimates: Estimate[];
}>();
</script>

<template>
  <div v-if="props.estimates.length > 0">
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <UCard
        v-for="estimate in props.estimates"
        :key="estimate.id"
        class="hover:shadow-lg transition-shadow cursor-pointer"
        @click="$router.push(`/estimates/${estimate.id}`)">
        <div class="flex items-center gap-4">
          <UAvatar
            :alt="`Estimate #${estimate.id}`"
            size="lg"
            class="bg-green-500 dark:bg-green-400">
            {{ estimate.id?.toString().slice(0, 2).toUpperCase() }}
          </UAvatar>

          <div class="flex-1 min-w-0">
            <h3 class="font-semibold text-gray-900 dark:text-white truncate">
              Estimate #{{ estimate.id }}
            </h3>
            <p
              v-if="estimate.date"
              class="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
              {{ estimate.date }}
            </p>
          </div>

          <UIcon
            name="i-heroicons-chevron-right"
            class="text-gray-400 shrink-0" />
        </div>
      </UCard>
    </div>
  </div>
</template>