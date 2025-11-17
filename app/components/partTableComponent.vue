<script setup lang="ts">
import type { Part } from "~~/db/schema";

const router = useRouter();
const toast = useToast();

const props = defineProps<{
  parts: Part[];
}>();

const emit = defineEmits<{
  emit: [];
}>();

const deletePart = async (id: number) => {
  try {
    await useFetch(`/api/parts/${id}`, {
      method: "DELETE",
    });
    emit("emit");
    toast.add({
      title: "Success",
      description: "Part deleted successfully",
      color: "green",
    });
  } catch (error) {
    console.error("Error deleting part:", error);
    toast.add({
      title: "Error",
      description: "Failed to delete part",
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
    <div v-if="props.parts && props.parts.length" class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Description
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Quantity
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Cost
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Unit Price
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Extended Price
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="part in props.parts" :key="part.id" class="hover:bg-gray-50 dark:hover:bg-gray-800">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
              {{ part.description }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
              {{ part.quantity }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 dark:text-blue-400">
              {{ formatCurrency(part.cost) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-orange-600 dark:text-orange-400">
              {{ formatCurrency(part.unit_price) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600 dark:text-green-400">
              {{ formatCurrency(part.quantity * part.unit_price) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm space-x-2">
              <UButton
                size="xs"
                color="blue"
                variant="soft"
                icon="i-heroicons-pencil-square"
                @click="router.push(`/parts/${part.id}/edit`)">
                Edit
              </UButton>
              <UButton
                size="xs"
                color="red"
                variant="soft"
                icon="i-heroicons-trash"
                @click="deletePart(part.id)">
                Delete
              </UButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="!props.parts || !props.parts.length" class="text-center py-12">
      <div
        class="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
        <UIcon name="i-heroicons-cog-6-tooth" class="w-8 h-8 text-gray-400" />
      </div>
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2"
        >No Parts</h3
      >
      <p class="text-gray-500 dark:text-gray-400 mb-4"
        >No parts have been added yet.</p
      >
    </div>
  </div>
</template>
