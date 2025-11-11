<script setup lang="ts">
const route = useRoute();
const router = useRouter();

// Reactive search query
const searchQuery = ref((route.query.search as string) || "");
const currentPage = computed(() => Number(route.query.page) || 1);

// Debounced search function
const debouncedSearch = useDebounceFn(() => {
  router.push({
    query: {
      ...route.query,
      search: searchQuery.value || undefined,
      page: "1", // Reset to first page on new search
    },
  });
}, 300);

// Update search function
const updateSearch = () => {
  debouncedSearch();
};

// Use the optimized API endpoint
const {
  data: customersData,
  pending,
  refresh,
} = useFetch("/api/customers-lite", {
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
  // Add caching for better performance
  key: computed(
    () => `customers-${currentPage.value}-${route.query.search || ""}`
  ),
  server: false, // Client-side only to avoid hydration issues
});

// Update customers function for add customer component
const updateCustomers = () => {
  refresh();
};

// Add loading state management
const isSearching = ref(false);
watch(searchQuery, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    isSearching.value = true;
  }
});

watch(pending, (newValue) => {
  if (!newValue) {
    isSearching.value = false;
  }
});
</script>

<template>
  <div class="container">
    <div class="search-section">
      <input
        v-model="searchQuery"
        placeholder="Search customers..."
        @input="updateSearch"
        @keyup.enter="updateSearch"
        :disabled="pending"
        class="search-input" />
      <div v-if="pending || isSearching" class="loading">
        <span class="spinner"></span>
        Searching...
      </div>
    </div>

    <div class="customer-list">
      <h1>Customers ({{ customersData?.pagination?.totalCount || 0 }})</h1>

      <div
        v-if="customersData?.customers?.length === 0 && !pending"
        class="no-results">
        No customers found
      </div>

      <!-- Optimized customer list with better styling -->
      <div v-else class="customers-grid">
        <div
          v-for="customer in customersData?.customers || []"
          :key="customer.id"
          class="customer-card">
          <div class="customer-info">
            <h2 class="customer-name">
              {{ customer.first_name }} {{ customer.last_name }}
            </h2>
            <p v-if="customer.notes" class="customer-notes">
              {{ customer.notes }}
            </p>
          </div>
        </div>
      </div>

      <!-- Enhanced Pagination -->
      <div
        v-if="
          customersData?.pagination?.totalPages &&
          customersData.pagination.totalPages > 1
        "
        class="pagination">
        <button
          :disabled="!customersData?.pagination?.hasPreviousPage || pending"
          @click="
            router.push({
              query: { ...route.query, page: String(currentPage - 1) },
            })
          "
          class="pagination-btn">
          ← Previous
        </button>

        <div class="pagination-info">
          <span
            >Page {{ customersData?.pagination?.currentPage }} of
            {{ customersData?.pagination?.totalPages }}</span
          >
          <span class="pagination-summary">
            ({{ customersData?.pagination?.offset + 1 }}-{{
              Math.min(
                (customersData?.pagination?.offset || 0) +
                  (customersData?.pagination?.limit || 20),
                customersData?.pagination?.totalCount || 0
              )
            }}
            of {{ customersData?.pagination?.totalCount }})
          </span>
        </div>

        <button
          :disabled="!customersData?.pagination?.hasNextPage || pending"
          @click="
            router.push({
              query: { ...route.query, page: String(currentPage + 1) },
            })
          "
          class="pagination-btn">
          Next →
        </button>
      </div>
    </div>

    <addCustomerComponent @customerAdded="updateCustomers" />
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

.search-input {
  width: 100%;
  max-width: 400px;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-input:disabled {
  background-color: #f9fafb;
  cursor: not-allowed;
}

.loading {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #e5e7eb;
  border-top: 2px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.customer-list {
  min-height: 200px;
}

.no-results {
  color: #6b7280;
  text-align: center;
  padding: 3rem;
  font-style: italic;
  background: #f9fafb;
  border-radius: 0.5rem;
  border: 2px dashed #e5e7eb;
}

.customers-grid {
  display: grid;
  gap: 1rem;
  margin-bottom: 2rem;
}

.customer-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
  transition: all 0.2s;
  cursor: pointer;
}

.customer-card:hover {
  border-color: #d1d5db;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.customer-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.customer-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.customer-notes {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.4;
}

h1 {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: #1f2937;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 2rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
}

.pagination-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background: white;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
  min-width: 100px;
}

.pagination-btn:hover:not(:disabled) {
  background: #f3f4f6;
  border-color: #9ca3af;
  transform: translateY(-1px);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.pagination-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.pagination-info > span:first-child {
  color: #1f2937;
  font-weight: 600;
}

.pagination-summary {
  color: #6b7280;
  font-size: 0.875rem;
}

/* Responsive design */
@media (max-width: 768px) {
  .container {
    grid-template-columns: 1fr;
    padding: 0.5rem;
  }

  .pagination {
    flex-direction: column;
    gap: 0.5rem;
  }

  .pagination-btn {
    width: 100%;
  }
}
</style>
