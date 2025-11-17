<script setup lang="ts">
import type { Labor } from "~~/db/schema";

const router = useRouter();
const toast = useToast();

const props = defineProps<{
  labor: Labor[];
}>();

const emit = defineEmits<{
  emit: [];
}>();

const deleteLabor = async (id: number) => {
  try {
    await useFetch(`/api/labor/${id}`, {
      method: "DELETE",
    });
    emit("emit");
    toast.add({
      title: 'Success',
      description: 'Labor entry deleted successfully',
      color: 'green'
    });
  } catch (error) {
    console.error("Error deleting labor:", error);
    toast.add({
      title: 'Error',
      description: 'Failed to delete labor entry',
      color: 'red'
    });
  }
};

const getTotalHours = computed(() => {
  return props.labor.reduce((total, lab) => total + lab.hours, 0);
});

const getTotalCost = computed(() => {
  return props.labor.reduce((total, lab) => total + lab.price, 0);
});
</script>

<template>
  <div class="space-y-4">
    <!-- Summary Card -->
    <UCard v-if="props.labor.length > 0" class="bg-linear-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <UIcon name="i-heroicons-wrench-screwdriver" class="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Labor Summary</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ props.labor.length }} labor entries</p>
            </div>
          </div>
          <UBadge color="blue" variant="soft" size="lg">
            {{ formatCurrency(getTotalCost) }}
          </UBadge>
        </div>
      </template>

      <div class="grid grid-cols-2 gap-4">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
            <UIcon name="i-heroicons-clock" class="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Total Hours</p>
            <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ getTotalHours }}</p>
          </div>
        </div>
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
            <UIcon name="i-heroicons-currency-dollar" class="w-4 h-4 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Total Cost</p>
            <p class="text-lg font-semibold text-green-600 dark:text-green-400">{{ formatCurrency(getTotalCost) }}</p>
          </div>
        </div>
      </div>
    </UCard>

    <!-- Individual Labor Cards -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <UCard 
        v-for="lab in props.labor" 
        :key="lab.id"
        class="hover:shadow-lg transition-shadow duration-200"
        :ui="{
          body: { padding: 'p-4 sm:p-6' }
        }"
      >
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <UIcon name="i-heroicons-wrench-screwdriver" class="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 class="text-lg font-semibold text-gray-900 dark:text-white truncate">
                  {{ lab.description }}
                </h4>
              </div>
            </div>
            <UDropdown :items="[
              [{
                key: 'edit',
                label: 'Edit',
                icon: 'i-heroicons-pencil-square',
                click: () => router.push(`/labor/${lab.id}/edit`)
              }],
              [{
                key: 'delete',
                label: 'Delete',
                icon: 'i-heroicons-trash',
                click: () => deleteLabor(lab.id)
              }]
            ]">
              <UButton
                color="gray"
                variant="ghost"
                icon="i-heroicons-ellipsis-vertical"
                size="sm"
              />
            </UDropdown>
          </div>
        </template>

        <div class="space-y-4">
          <!-- Hours -->
          <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <div class="flex items-center space-x-2">
              <UIcon name="i-heroicons-clock" class="w-4 h-4 text-gray-500" />
              <span class="text-sm font-medium text-gray-600 dark:text-gray-300">Hours</span>
            </div>
            <div class="flex items-center space-x-1">
              <span class="text-lg font-bold text-gray-900 dark:text-white">{{ lab.hours }}</span>
              <span class="text-xs text-gray-500">hrs</span>
            </div>
          </div>

          <!-- Price -->
          <div class="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div class="flex items-center space-x-2">
              <UIcon name="i-heroicons-currency-dollar" class="w-4 h-4 text-green-600 dark:text-green-400" />
              <span class="text-sm font-medium text-green-700 dark:text-green-300">Price</span>
            </div>
            <span class="text-lg font-bold text-green-600 dark:text-green-400">
              {{ formatCurrency(lab.price) }}
            </span>
          </div>

          <!-- Rate per hour -->
          <div class="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div class="flex items-center space-x-2">
              <UIcon name="i-heroicons-calculator" class="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span class="text-sm font-medium text-blue-700 dark:text-blue-300">Rate/Hour</span>
            </div>
            <span class="text-lg font-bold text-blue-600 dark:text-blue-400">
              {{ formatCurrency(lab.price / lab.hours) }}
            </span>
          </div>
        </div>

        <template #footer>
          <div class="flex justify-between items-center">
            <UButton
              color="blue"
              variant="soft"
              size="sm"
              icon="i-heroicons-pencil-square"
              @click="router.push(`/labor/${lab.id}/edit`)"
            >
              Edit
            </UButton>
            <UButton
              color="red"
              variant="soft"
              size="sm"
              icon="i-heroicons-trash"
              @click="deleteLabor(lab.id)"
            >
              Delete
            </UButton>
          </div>
        </template>
      </UCard>
    </div>

    <!-- Empty State -->
    <UCard v-if="!props.labor.length" class="text-center py-12">
      <div class="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
        <UIcon name="i-heroicons-wrench-screwdriver" class="w-8 h-8 text-gray-400" />
      </div>
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No Labor Entries</h3>
      <p class="text-gray-500 dark:text-gray-400 mb-6">No labor entries have been added yet.</p>
      <UButton
        color="blue"
        icon="i-heroicons-plus"
        @click="router.push('/labor/create')"
      >
        Add Labor Entry
      </UButton>
    </UCard>
  </div>
</template>
