<script setup lang="ts">
import type { Address } from "~~/db/schema";

const router = useRouter();
const toast = useToast();

// Fetch addresses
const { data: addresses, refresh } = await useFetch("/api/addresses", {
  method: "GET",
});

const isLoading = computed(() => !addresses.value);
const addressList = computed(() => addresses.value || []);

// Search and filter
const searchQuery = ref("");
const selectedType = ref("");
const sortBy = ref("street");
const sortOrder = ref("asc");

const addressTypeOptions = [
  { label: "All Types", value: "" },
  { label: "Home", value: "home" },
  { label: "Work", value: "work" },
  { label: "Billing", value: "billing" },
  { label: "Shipping", value: "shipping" },
];

const sortOptions = [
  { label: "Street (A-Z)", value: "street-asc" },
  { label: "Street (Z-A)", value: "street-desc" },
  { label: "City (A-Z)", value: "city-asc" },
  { label: "City (Z-A)", value: "city-desc" },
  { label: "State (A-Z)", value: "state-asc" },
  { label: "State (Z-A)", value: "state-desc" },
];

// Filtered and sorted addresses
const filteredAddresses = computed(() => {
  let filtered = addressList.value;

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (address) =>
        address.street?.toLowerCase().includes(query) ||
        address.city?.toLowerCase().includes(query) ||
        address.state?.toLowerCase().includes(query) ||
        address.zip_code?.toLowerCase().includes(query)
    );
  }

  // Filter by type
  if (selectedType.value) {
    filtered = filtered.filter(
      (address) => address.address_type === selectedType.value
    );
  }

  // Sort addresses
  const [field, order] = sortBy.value.split("-");
  filtered = [...filtered].sort((a, b) => {
    const aValue = (a as any)[field]?.toLowerCase() || "";
    const bValue = (b as any)[field]?.toLowerCase() || "";
    const comparison = aValue.localeCompare(bValue);
    return order === "asc" ? comparison : -comparison;
  });

  return filtered;
});

// Handle sort change
const handleSortChange = (value: string) => {
  const [field, order] = value.split("-");
  sortBy.value = field;
  sortOrder.value = order;
};

// Delete address
const deleteAddress = async (address: Address) => {
  try {
    await $fetch(`/api/addresses/${address.id}`, {
      method: "DELETE",
    });

    toast.add({
      title: "Success!",
      description: "Address deleted successfully",
      color: "success",
    });

    refresh();
  } catch (error) {
    console.error("Failed to delete address:", error);
    toast.add({
      title: "Error",
      description: "Failed to delete address",
      color: "error",
    });
  }
};

// Table columns
const columns = [
  {
    key: "street",
    label: "Street Address",
  },
  {
    key: "city",
    label: "City",
  },
  {
    key: "state",
    label: "State",
  },
  {
    key: "zip_code",
    label: "Zip Code",
  },
  {
    key: "address_type",
    label: "Type",
  },
  {
    key: "actions",
    label: "Actions",
  },
];

// Row actions
const rowActions = (address: Address) => [
  [
    {
      label: "Edit",
      icon: "i-heroicons-pencil-square",
      click: () => router.push(`/addresses/edit/${address.id}`),
    },
  ],
  [
    {
      label: "View Customer",
      icon: "i-heroicons-user",
      click: () => router.push(`/customers/${address.customer_id}`),
    },
  ],
  [
    {
      label: "Delete",
      icon: "i-heroicons-trash",
      color: "red",
      click: () => deleteAddress(address),
    },
  ],
];
</script>

<template>
  <UContainer class="py-8">
    <!-- Header -->
    <div class="mb-8">
      <div
        class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
            Addresses
          </h1>
          <p class="text-gray-600 dark:text-gray-400 mt-1">
            Manage all customer addresses
          </p>
        </div>
      </div>

      <!-- Search and Filters -->
      <div class="flex flex-col sm:flex-row gap-4 mb-6">
        <div class="flex-1">
          <UInput
            v-model="searchQuery"
            placeholder="Search addresses..."
            icon="i-heroicons-magnifying-glass"
            size="lg" />
        </div>

        <div class="flex gap-3">
          <USelect
            v-model="selectedType"
            :items="addressTypeOptions"
            placeholder="Filter by type"
            class="w-40" />

          <USelect
            :model-value="`${sortBy}-${sortOrder}`"
            @update:model-value="handleSortChange"
            :items="sortOptions"
            placeholder="Sort by"
            class="w-40" />
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <UCard>
          <div class="flex items-center gap-3">
            <div class="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
              <UIcon
                name="i-heroicons-home"
                class="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400"
                >Total Addresses</p
              >
              <p class="text-xl font-semibold text-gray-900 dark:text-white">{{
                addressList.length
              }}</p>
            </div>
          </div>
        </UCard>

        <UCard>
          <div class="flex items-center gap-3">
            <div class="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <UIcon
                name="i-heroicons-home-modern"
                class="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400"
                >Home Addresses</p
              >
              <p class="text-xl font-semibold text-gray-900 dark:text-white">
                {{
                  addressList.filter((a) => a.address_type === "home").length
                }}
              </p>
            </div>
          </div>
        </UCard>

        <UCard>
          <div class="flex items-center gap-3">
            <div class="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <UIcon
                name="i-heroicons-building-office"
                class="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400"
                >Work Addresses</p
              >
              <p class="text-xl font-semibold text-gray-900 dark:text-white">
                {{
                  addressList.filter((a) => a.address_type === "work").length
                }}
              </p>
            </div>
          </div>
        </UCard>

        <UCard>
          <div class="flex items-center gap-3">
            <div class="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <UIcon
                name="i-heroicons-truck"
                class="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">Shipping</p>
              <p class="text-xl font-semibold text-gray-900 dark:text-white">
                {{
                  addressList.filter((a) => a.address_type === "shipping")
                    .length
                }}
              </p>
            </div>
          </div>
        </UCard>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-12">
      <UIcon
        name="i-heroicons-arrow-path"
        class="w-8 h-8 animate-spin text-primary-500 mx-auto mb-4" />
      <p class="text-gray-600 dark:text-gray-400">Loading addresses...</p>
    </div>

    <!-- No Addresses State -->
    <div v-else-if="addressList.length === 0" class="text-center py-12">
      <div
        class="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
        <UIcon name="i-heroicons-home" class="w-8 h-8 text-gray-400" />
      </div>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2"
        >No Addresses Found</h3
      >
      <p class="text-gray-600 dark:text-gray-400 mb-6"
        >Get started by adding addresses for your customers.</p
      >
      <UButton @click="router.push('/customers')" icon="i-heroicons-plus">
        Go to Customers
      </UButton>
    </div>

    <!-- No Results State -->
    <div v-else-if="filteredAddresses.length === 0" class="text-center py-12">
      <div
        class="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
        <UIcon
          name="i-heroicons-magnifying-glass"
          class="w-8 h-8 text-gray-400" />
      </div>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2"
        >No Matches Found</h3
      >
      <p class="text-gray-600 dark:text-gray-400 mb-6"
        >Try adjusting your search or filter criteria.</p
      >
      <UButton
        @click="
          searchQuery = '';
          selectedType = '';
        "
        variant="outline">
        Clear Filters
      </UButton>
    </div>

    <!-- Addresses Table -->
    <UCard v-else>
      <div class="overflow-x-auto">
        <UTable :columns="columns" :rows="filteredAddresses" class="w-full">
          <template #street-data="{ row }">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
                <UIcon
                  name="i-heroicons-home"
                  class="w-4 h-4 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <p class="font-medium text-gray-900 dark:text-white">{{
                  row.street
                }}</p>
              </div>
            </div>
          </template>

          <template #city-data="{ row }">
            <span class="text-gray-900 dark:text-white">{{ row.city }}</span>
          </template>

          <template #state-data="{ row }">
            <span class="text-gray-900 dark:text-white">{{ row.state }}</span>
          </template>

          <template #zip_code-data="{ row }">
            <span class="text-gray-700 dark:text-gray-300">{{
              row.zip_code
            }}</span>
          </template>

          <template #address_type-data="{ row }">
            <UBadge
              :color="
                row.address_type === 'home' ? 'green'
                : row.address_type === 'work' ? 'blue'
                : row.address_type === 'billing' ? 'orange'
                : 'purple'
              "
              variant="soft">
              {{ row.address_type }}
            </UBadge>
          </template>

          <template #actions-data="{ row }">
            <div class="flex items-center gap-2">
              <UButton
                size="xs"
                variant="ghost"
                icon="i-heroicons-pencil-square"
                @click="router.push(`/addresses/edit/${row.id}`)" />

              <UButton
                size="xs"
                variant="ghost"
                icon="i-heroicons-user"
                @click="router.push(`/customers/${row.customer_id}`)" />

              <UDropdown :items="rowActions(row)">
                <UButton
                  size="xs"
                  variant="ghost"
                  icon="i-heroicons-ellipsis-horizontal" />
              </UDropdown>
            </div>
          </template>
        </UTable>
      </div>

      <!-- Results Summary -->
      <div
        v-if="filteredAddresses.length > 0"
        class="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
        Showing {{ filteredAddresses.length }} of
        {{ addressList.length }} addresses
      </div>
    </UCard>
  </UContainer>
</template>
