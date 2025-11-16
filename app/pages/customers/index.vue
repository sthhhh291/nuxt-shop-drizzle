<script setup lang="ts">
const route = useRoute();
const router = useRouter();

// Reactive search query
const searchQuery = ref((route.query.search as string) || "");
const currentPage = computed(() => Number(route.query.page) || 1);

// Modal state
const isAddCustomerOpen = ref(false);

// Pagination handler
const handlePageChange = (page: number) => {
  console.log("Page changed to:", page);
  router.push({
    query: {
      ...route.query,
      page: page.toString(),
    },
  });
};

// Debounced search function
let searchTimeout: NodeJS.Timeout | null = null;
const debouncedSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  searchTimeout = setTimeout(() => {
    router.push({
      query: {
        ...route.query,
        search: searchQuery.value || undefined,
        page: "1", // Reset to first page on new search
      },
    });
  }, 300);
};

// Update search function
const updateSearch = () => {
  debouncedSearch();
};

// Clear search function
const clearSearch = () => {
  searchQuery.value = "";
  router.push({
    query: {
      ...route.query,
      search: undefined,
      page: "1",
    },
  });
};

const {
  data: customersData,
  pending,
  refresh,
} = useFetch("/api/customers", {
  default: () => ({
    customers: [],
    pagination: {
      currentPage: 1,
      totalPages: 0,
      totalCount: 0,
      limit: 20,
      hasNextPage: false,
      hasPreviousPage: false,
      offset: 0,
    },
  }),
  query: {
    page: currentPage,
    search: computed(() => route.query.search),
  },
  watch: [currentPage, () => route.query.search],
});

// Handle customer added
const handleCustomerAdded = () => {
  refresh();
  isAddCustomerOpen.value = false;
};

// Update customers function for add customer component
const updateCustomers = () => {
  refresh();
};

// go to new page when currentPage changes
const changePage = (newPage: number) => {
  return {
    query: {
      ...route.query,
      page: newPage.toString(),
    },
  };
};
</script>

<template>
  <UContainer class="py-8">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          Customers
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">
          Manage your customer database
          <span v-if="(customersData as any)?.pagination?.totalCount" class="text-sm">
            ({{ (customersData as any).pagination.totalCount }} total)
          </span>
        </p>
      </div>
      
      <!-- Add Customer Modal Trigger -->
      <UButton 
        color="primary" 
        size="lg"
        icon="i-heroicons-plus"
        @click="isAddCustomerOpen = true"
      >
        Add Customer
      </UButton>
    </div>

    <!-- Search Section -->
    <UCard class="mb-6">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1">
          <UInput
            v-model="searchQuery"
            placeholder="Search customers by name..."
            icon="i-heroicons-magnifying-glass"
            size="lg"
            @input="updateSearch"
            @keyup.enter="updateSearch"
          />
        </div>
        <UButton
          v-if="searchQuery"
          variant="outline"
          color="neutral"
          icon="i-heroicons-x-mark"
          @click="clearSearch"
        >
          Clear
        </UButton>
      </div>
      
      <!-- Loading State -->
      <div v-if="pending" class="flex items-center gap-2 mt-4 text-primary-500">
        <UIcon name="i-heroicons-arrow-path" class="animate-spin" />
        <span>Searching...</span>
      </div>
    </UCard>

    <!-- Customers List -->
    <UCard v-if="(customersData as any)?.customers?.length > 0">
      <template #header>
        <h2 class="text-xl font-semibold">Customer List</h2>
      </template>
      
      <div class="divide-y divide-gray-200 dark:divide-gray-700">
        <div
          v-for="customer in (customersData as any).customers"
          :key="customer.id"
          class="py-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <NuxtLink
            :to="`/customers/${customer.id}`"
            class="block group"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <UAvatar
                  :alt="`${customer.first_name} ${customer.last_name}`"
                  size="md"
                  class="bg-primary-500 dark:bg-primary-400"
                >
                  {{ customer.first_name?.[0] }}{{ customer.last_name?.[0] }}
                </UAvatar>
                
                <div>
                  <h3 class="font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {{ customer.first_name }} {{ customer.last_name }}
                  </h3>
                  <p v-if="customer.notes" class="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                    {{ customer.notes }}
                  </p>
                </div>
              </div>
              
              <UIcon 
                name="i-heroicons-chevron-right" 
                class="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors"
              />
            </div>
          </NuxtLink>
        </div>
      </div>
    </UCard>

    <!-- Empty State -->
    <UCard v-else-if="!pending">
      <div class="text-center py-12">
        <UIcon name="i-heroicons-users" class="text-4xl text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
          {{ searchQuery ? 'No customers found' : 'No customers yet' }}
        </h3>
        <p class="text-gray-500 dark:text-gray-400 mb-6">
          {{ searchQuery 
            ? `No customers match "${searchQuery}". Try a different search term.`
            : 'Get started by adding your first customer.'
          }}
        </p>
        <UButton
          v-if="!searchQuery"
          color="primary"
          icon="i-heroicons-plus"
          @click="isAddCustomerOpen = true"
        >
          Add Your First Customer
        </UButton>
      </div>
    </UCard>

    <!-- Pagination -->
    <div v-if="(customersData as any)?.pagination?.totalPages > 1" class="mt-6">
      <UPagination
        v-model="currentPage"
        :page-count="(customersData as any).pagination.totalPages"
        :total="(customersData as any).pagination.totalCount"
        :to="changePage"
        show-last
        show-first
        @update:model-value="handlePageChange"
      />
    </div>

    <!-- Add Customer Modal -->
    <UModal v-model="isAddCustomerOpen">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">Add New Customer</h3>
            <UButton
              color="neutral"
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              @click="isAddCustomerOpen = false"
            />
          </div>
        </template>

        <AddCustomerComponent @customerAdded="handleCustomerAdded" />
      </UCard>
    </UModal>
  </UContainer>
</template>

<style scoped>
</style>
