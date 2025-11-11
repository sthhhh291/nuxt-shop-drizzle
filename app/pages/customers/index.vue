<script setup lang="ts">
const { data: customersData, pending, refresh } = useFetch('/api/customers', {
  default: () => ({ customers: [], pagination: {} }),
  watch: [],
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
      />
      <div v-if="pending" class="loading">Searching...</div>
    </div>

    <div class="customer-list">
      <h1>Customers ({{ customersData.pagination.totalCount || 0 }})</h1>

      <div v-if="customersData.customers.length === 0 && !pending" class="no-results">
        No customers found
      </div>

      <div v-else class="space-y-8">
        <div v-for="customer in customersData.customers" :key="customer.id" class="border-b pb-2">
          <h2 class="text-lg font-semibold">
            {{ customer.first_name }} {{ customer.last_name }}
          </h2>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.totalPages && pagination.totalPages > 1" class="pagination">
        <button
          :disabled="!pagination.hasPreviousPage"
          @click="router.push({ query: { ...route.query, page: String(currentPage - 1) } })"
        >
          Previous
        </button>
        <span>Page {{ pagination.currentPage }} of {{ pagination.totalPages }}</span>
        <button
          :disabled="!pagination.hasNextPage"
          @click="router.push({ query: { ...route.query, page: String(currentPage + 1) } })"
        >
          Next
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
