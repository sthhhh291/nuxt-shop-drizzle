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

const partsRef = ref<Part[]>(props.parts);

const deletePart = async (id: number) => {
  try {
    await useFetch(`/api/parts/${id}`, {
      method: "DELETE",
    });
    partsRef.value = partsRef.value.filter((part) => part.id !== id);
    emit("emit");
    toast.add({
      title: "Success",
      description: "Part deleted successfully",
      color: "success",
    });
  } catch (error) {
    console.error("Error deleting part:", error);
    toast.add({
      title: "Error",
      description: "Failed to delete part",
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
    key: "quantity",
    label: "Qty",
    sortable: true,
  },
  {
    key: "cost",
    label: "Cost",
    sortable: true,
  },
  {
    key: "unit_price",
    label: "Unit Price",
    sortable: true,
  },
  {
    key: "extended_price",
    label: "Extended Price",
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
  partsRef.value.map((part) => ({
    ...part,
    formattedCost: formatCurrency(part.cost),
    formattedUnitPrice: formatCurrency(part.unit_price),
    formattedExtendedPrice: formatCurrency(part.quantity * part.unit_price),
  }))
);
</script>

<template>
  <div class="space-y-4">
    <UTable :rows="items" :columns="columns" class="w-full">
      <template #description-data="{ row }">
        <div class="flex items-center space-x-3">
          <div class="shrink-0">
            <div
              class="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <UIcon
                name="i-heroicons-cog-6-tooth"
                class="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div>
            <div class="font-medium text-gray-900 dark:text-white">
              {{ row.description }}
            </div>
          </div>
        </div>
      </template>

      <template #quantity-data="{ row }">
        <div class="flex items-center space-x-2">
          <UIcon name="i-heroicons-squares-2x2" class="w-4 h-4 text-gray-400" />
          <span class="font-medium">{{ row.quantity }}</span>
        </div>
      </template>

      <template #cost-data="{ row }">
        <div class="flex items-center space-x-2">
          <UIcon
            name="i-heroicons-currency-dollar"
            class="w-4 h-4 text-blue-500" />
          <span class="font-medium text-blue-600 dark:text-blue-400">
            {{ row.formattedCost }}
          </span>
        </div>
      </template>

      <template #unit_price-data="{ row }">
        <div class="flex items-center space-x-2">
          <UIcon
            name="i-heroicons-currency-dollar"
            class="w-4 h-4 text-orange-500" />
          <span class="font-medium text-orange-600 dark:text-orange-400">
            {{ row.formattedUnitPrice }}
          </span>
        </div>
      </template>

      <template #extended_price-data="{ row }">
        <div class="flex items-center space-x-2">
          <UIcon
            name="i-heroicons-currency-dollar"
            class="w-4 h-4 text-green-500" />
          <span class="font-semibold text-green-600 dark:text-green-400">
            {{ row.formattedExtendedPrice }}
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
            @click="router.push(`/parts/${row.id}/edit`)">
            Edit
          </UButton>
          <UButton
            size="xs"
            color="error"
            variant="soft"
            icon="i-heroicons-trash"
            @click="deletePart(row.id)">
            Delete
          </UButton>
        </div>
      </template>
    </UTable>

    <div v-if="!partsRef.length" class="text-center py-12">
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
