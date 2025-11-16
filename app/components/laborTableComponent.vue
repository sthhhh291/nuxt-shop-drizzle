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

const laborRef = ref<Labor[]>(props.labor);

const deleteLabor = async (id: number) => {
  try {
    await useFetch(`/api/labor/${id}`, {
      method: "DELETE",
    });
    laborRef.value = laborRef.value.filter((lab) => lab.id !== id);
    emit("emit");
    toast.add({
      title: "Success",
      description: "Labor entry deleted successfully",
      color: "success",
    });
  } catch (error) {
    console.error("Error deleting labor:", error);
    toast.add({
      title: "Error",
      description: "Failed to delete labor entry",
      color: "error",
    });
  }
};

const columns = [
  {
    key: "description",
    label: "Description",
    sortable: true,
  },
  {
    key: "hours",
    label: "Hours",
    sortable: true,
  },
  {
    key: "price",
    label: "Price",
    sortable: true,
  },
  {
    key: "actions",
    label: "Actions",
  },
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount || 0);
};

const items = computed(() =>
  laborRef.value.map((lab) => ({
    ...lab,
    formattedPrice: formatCurrency(lab.price),
  }))
);

const actions = [
  [
    {
      key: "edit",
      label: "Edit",
      icon: "i-heroicons-pencil-square",
      click: (row: any) => router.push(`/labor/${row.id}/edit`),
    },
  ],
  [
    {
      key: "delete",
      label: "Delete",
      icon: "i-heroicons-trash",
      color: "red" as const,
      click: (row: any) => deleteLabor(row.id),
    },
  ],
];
</script>

<template>
  <div class="space-y-4">
    <UTable :rows="items" :columns="columns" class="w-full">
      <template #description-data="{ row }">
        <div class="flex items-center space-x-3">
          <div class="shrink-0">
            <div
              class="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <UIcon
                name="i-heroicons-wrench-screwdriver"
                class="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div>
            <div class="font-medium text-gray-900 dark:text-white">
              {{ row.description }}
            </div>
          </div>
        </div>
      </template>

      <template #hours-data="{ row }">
        <div class="flex items-center space-x-2">
          <UIcon name="i-heroicons-clock" class="w-4 h-4 text-gray-400" />
          <span class="font-medium">{{ row.hours }}</span>
          <span class="text-xs text-gray-500">hrs</span>
        </div>
      </template>

      <template #price-data="{ row }">
        <div class="flex items-center space-x-2">
          <UIcon
            name="i-heroicons-currency-dollar"
            class="w-4 h-4 text-green-500" />
          <span class="font-semibold text-green-600 dark:text-green-400">
            {{ row.formattedPrice }}
          </span>
        </div>
      </template>

      <template #actions-data="{ row }">
        <div class="flex items-center space-x-2">
          <UButton
            size="xs"
            color="primary"
            variant="soft"
            icon="i-heroicons-pencil-square"
            @click="router.push(`/labor/${row.id}/edit`)">
            Edit
          </UButton>
          <UButton
            size="xs"
            color="error"
            variant="soft"
            icon="i-heroicons-trash"
            @click="deleteLabor(row.id)">
            Delete
          </UButton>
        </div>
      </template>
    </UTable>

    <div v-if="!laborRef.length" class="text-center py-12">
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
