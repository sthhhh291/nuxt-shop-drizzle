<script setup lang="ts">
// Search and pagination state
const searchQuery = ref("");
const currentPage = ref(1);

const { data, refresh } = await useFetch("/api/estimates", {
  method: "GET",
  query: computed(() => ({
    search: searchQuery.value,
    page: currentPage.value,
    limit: 20
  })),
  server: false,
});

const estimates = computed(() => {
  return data.value && "estimates" in data.value ? data.value.estimates : [];
});

const pagination = computed(() => {
  return data.value && "pagination" in data.value ? data.value.pagination : undefined;
});

// Search with simple debounce
let searchTimeout: ReturnType<typeof setTimeout> | null = null;

watch(searchQuery, () => {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    currentPage.value = 1; // Reset to first page on new search
    refresh();
  }, 300);
});

// Pagination handler
const goToPage = (page: number) => {
  currentPage.value = page;
  refresh();
};

// Modal state
const isAddEstimateOpen = ref(false);

// Handle estimate added
const handleEstimateAdded = () => {
  refresh();
  isAddEstimateOpen.value = false;
};

provide("refreshEstimates", refresh);
</script>
<template>
  <UContainer class="py-8">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          Estimates
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">
          Manage repair estimates and quotes
          <span v-if="pagination" class="text-sm">
            ({{ pagination.totalCount }} total)
          </span>
        </p>
      </div>
      
      <!-- Add Estimate Button -->
      <UButton 
        color="primary" 
        size="lg"
        icon="i-heroicons-plus"
        @click="isAddEstimateOpen = true"
      >
        Create Estimate
      </UButton>
    </div>

    <!-- Search Section -->
    <div class="mb-6">
      <UFormGroup 
        label="Search Estimates" 
        description="Search by customer name, car details, labor, parts, oil, or notes"
      >
        <UInput
          v-model="searchQuery"
          icon="i-heroicons-magnifying-glass"
          placeholder="Search by customer, car, labor, parts, oil type, or notes..."
          size="lg"
        />
      </UFormGroup>
    </div>

    <!-- Estimates List -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Estimates Component -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
              {{ searchQuery ? 'Search Results' : 'Recent Estimates' }}
            </h2>
            <UButton
              v-if="searchQuery"
              variant="ghost"
              size="xs"
              icon="i-heroicons-x-mark"
              @click="searchQuery = ''"
            >
              Clear
            </UButton>
          </div>
        </template>
        
        <estimatesComponent :estimates="estimates" />
        
        <!-- Pagination -->
        <template v-if="pagination && pagination.totalPages > 1" #footer>
          <div class="flex justify-center">
            <UPagination
              v-model="currentPage"
              :page-count="pagination.limit"
              :total="pagination.totalCount"
              :max="5"
              @update:model-value="goToPage"
            />
          </div>
        </template>
      </UCard>

      <!-- Add Estimate Form -->
      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
            Quick Actions
          </h2>
        </template>
        
        <div class="space-y-4">
          <UButton 
            block 
            variant="outline" 
            icon="i-heroicons-document-plus"
            @click="isAddEstimateOpen = true"
          >
            Create New Estimate
          </UButton>
          
          <UButton 
            block 
            variant="outline" 
            icon="i-heroicons-calculator"
            disabled
          >
            Estimate Calculator
          </UButton>
          
          <UButton 
            block 
            variant="outline" 
            icon="i-heroicons-document-text"
            disabled
          >
            Templates
          </UButton>
        </div>
      </UCard>
    </div>

    <!-- Add Estimate Modal -->
    <UModal v-model="isAddEstimateOpen">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">Create New Estimate</h3>
            <UButton
              color="neutral"
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              @click="isAddEstimateOpen = false"
            />
          </div>
        </template>

        <addEstimateComponent @estimateAdded="handleEstimateAdded" />
      </UCard>
    </UModal>
  </UContainer>
</template>

