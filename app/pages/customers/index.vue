<script setup lang="ts">
const route = useRoute();
const router = useRouter();

// Reactive search query
const searchQuery = ref((route.query.search as string) || "");
const currentPage = computed(() => Number(route.query.page) || 1);

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
        page: "1", // Reset to first page on new
      },
    });
    // search logic
  }, 300);
};

// Update search function
const updateSearch = () => {
  debouncedSearch();
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

// Update customers function for add customer component
const updateCustomers = () => {
  refresh();
};
</script>

<template>
  <div class="container">
    <div class="search-section">
      <input
        v-model="searchQuery"
        placeholder="Search customers..."
        @input="updateSearch"
        @keyup.enter="updateSearch" />
      <div v-if="pending" class="loading">Searching...</div>
    </div>

    <CustomersComponent
      :customers="customersData.customers"
      class="customer-list">
      <template #no-results>
        <div class="no-results"> No customers found. </div>
      </template>
    </CustomersComponent>
    <PaginationComponent
      :current-page="customersData.pagination.currentPage"
      :total-pages="customersData.pagination.totalPages"
      :has-next-page="customersData.pagination.hasNextPage"
      :has-previous-page="customersData.pagination.hasPreviousPage"
      @page-changed="
        (newPage) => {
          router.push({
            query: {
              ...route.query,
              page: newPage,
            },
          });
        }
      "
      class="pagination" />

    <AddCustomerComponent @customerAdded="updateCustomers" />
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}

.search-section {
  grid-column: 1 / -1;
  margin-bottom: 1rem;
}

.search-section input {
  width: 100%;
  max-width: 400px;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
}

.loading {
  color: #6b7280;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

.customer-list {
  min-height: 200px;
}

.no-results {
  color: #6b7280;
  text-align: center;
  padding: 2rem;
  font-style: italic;
}

.space-y-8 > * + * {
  margin-top: 2rem;
}

.border-b {
  border-bottom: 1px solid #e5e7eb;
}

.pb-2 {
  padding-bottom: 0.5rem;
}

h1 {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #1f2937;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
  padding: 1rem;
}

.pagination button {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background: white;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination button:hover:not(:disabled) {
  background: #f3f4f6;
  border-color: #9ca3af;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination span {
  color: #6b7280;
  font-weight: 500;
}
</style>
