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

// Debug logging
console.log('Labor data received in table component:', props.labor);

const deleteLabor = async (id: number) => {
  try {
    await useFetch(`/api/labor/${id}`, {
      method: "DELETE",
    });
    emit("emit");
    toast.add({
      title: "Success",
      description: "Labor entry deleted successfully",
      color: "green",
    });
  } catch (error) {
    console.error("Error deleting labor:", error);
    toast.add({
      title: "Error",
      description: "Failed to delete labor entry",
      color: "red",
    });
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount || 0);
};
</script>

<template>
  <div class="space-y-4">
    <!-- Simple working table -->
    <div v-if="props.labor && props.labor.length" class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Description
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Hours
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Price
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="lab in props.labor" :key="lab.id" class="hover:bg-gray-50 dark:hover:bg-gray-800">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
              {{ lab.description }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
              {{ lab.hours }} hrs
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600 dark:text-green-400">
              {{ formatCurrency(lab.price) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm space-x-2">
              <UButton
                size="xs"
                color="blue"
                variant="soft"
                icon="i-heroicons-pencil-square"
                @click="router.push(`/labor/${lab.id}/edit`)">
                Edit
              </UButton>
              <UButton
                size="xs"
                color="red"
                variant="soft"
                icon="i-heroicons-trash"
                @click="deleteLabor(lab.id)">
                Delete
              </UButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="!props.labor || !props.labor.length" class="text-center py-12">
      <div
        class="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
        <UIcon
          name="i-heroicons-wrench-screwdriver"
          class="w-8 h-8 text-gray-400" />
      </div>
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2"
        >No Labor Entries</h3
      >
      <p class="text-gray-500 dark:text-gray-400 mb-4"
        >No labor entries have been added yet.</p
      >
    </div>
  </div>
</template>
