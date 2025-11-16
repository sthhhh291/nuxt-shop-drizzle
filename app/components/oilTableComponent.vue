<script setup lang="ts">
import type { Oil } from "~~/db/schema";

const router = useRouter();
const toast = useToast();

const props = defineProps<{
  oils: Oil[];
}>();

const emit = defineEmits<{
  emit: [];
}>();

const oilsRef = ref<Oil[]>(props.oils);

const deleteOil = async (id: number) => {
  try {
    await useFetch(`/api/oil/${id}`, {
      method: "DELETE",
    });
    oilsRef.value = oilsRef.value.filter((oil) => oil.id !== id);
    emit("emit");
    toast.add({
      title: "Success",
      description: "Oil entry deleted successfully",
      color: "success",
    });
  } catch (error) {
    console.error("Error deleting oil:", error);
    toast.add({
      title: "Error",
      description: "Failed to delete oil entry",
      color: "error",
    });
  }
};

const columns = [
  {
    key: "type",
    label: "Type",
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
    key: "price_per_unit",
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
  oilsRef.value.map((oil) => ({
    ...oil,
    formattedCost: formatCurrency(oil.cost),
    formattedPricePerUnit: formatCurrency(oil.price_per_unit),
    formattedExtendedPrice: formatCurrency(oil.quantity * oil.price_per_unit),
  }))
);
</script>

<template>
  <div class="space-y-4">
    <UTable :rows="items" :columns="columns" class="w-full">
      <template #type-data="{ row }">
        <div class="flex items-center space-x-3">
          <div class="shrink-0">
            <div
              class="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
              <UIcon
                name="i-heroicons-beaker"
                class="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <div>
            <div class="font-medium text-gray-900 dark:text-white">
              {{ row.type }}
            </div>
          </div>
        </div>
      </template>

      <template #quantity-data="{ row }">
        <div class="flex items-center space-x-2">
          <UIcon name="i-heroicons-scale" class="w-4 h-4 text-gray-400" />
          <span class="font-medium">{{ row.quantity }}</span>
          <span class="text-xs text-gray-500">qt</span>
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

      <template #price_per_unit-data="{ row }">
        <div class="flex items-center space-x-2">
          <UIcon
            name="i-heroicons-currency-dollar"
            class="w-4 h-4 text-orange-500" />
          <span class="font-medium text-orange-600 dark:text-orange-400">
            {{ row.formattedPricePerUnit }}
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
            @click="router.push(`/oil/${row.id}/edit`)">
            Edit
          </UButton>
          <UButton
            size="xs"
            color="error"
            variant="soft"
            icon="i-heroicons-trash"
            @click="deleteOil(row.id)">
            Delete
          </UButton>
        </div>
      </template>
    </UTable>

    <div v-if="!oilsRef.length" class="text-center py-12">
      <div
        class="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
        <UIcon name="i-heroicons-beaker" class="w-8 h-8 text-gray-400" />
      </div>
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2"
        >No Oil Entries</h3
      >
      <p class="text-gray-500 dark:text-gray-400 mb-4"
        >No oil entries have been added yet.</p
      >
    </div>
  </div>
</template>
