<script setup lang="ts">
// Enhanced car type to include customer info from the API
interface CarWithCustomer {
  id: number;
  make: string;
  model: string;
  year: number;
  engine?: string;
  vin?: string;
  license?: string;
  fleet?: string;
  notes?: string;
  customer_id: number;
  customer_first_name?: string;
  customer_last_name?: string;
}

interface CarsResponse {
  cars: CarWithCustomer[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// Reactive search and pagination
const searchQuery = ref("");
const currentPage = ref(1);
const isLoading = ref(false);

// Fetch cars with search and pagination
const { data: carsData, refresh: refreshCars } = await useFetch<CarsResponse>("/api/cars", {
  method: "GET",
  query: computed(() => ({
    search: searchQuery.value,
    page: currentPage.value,
    limit: 20
  })),
  server: false,
});

const cars = computed(() => carsData.value?.cars || []);
const pagination = computed(() => carsData.value?.pagination);

// Search functionality
const debouncedSearch = useDebounceFn(() => {
  currentPage.value = 1; // Reset to first page on new search
  refreshCars();
}, 300);

watch(searchQuery, () => {
  debouncedSearch();
});

// Pagination handlers
const goToPage = (page: number) => {
  currentPage.value = page;
  refreshCars();
};

// Modal state
const isAddCarOpen = ref(false);
</script>

<template>
  <UContainer class="py-8">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          Cars
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">
          Manage your customer vehicles
          <span v-if="pagination" class="text-sm">
            ({{ pagination.totalCount }} total)
          </span>
        </p>
      </div>
      
      <!-- Add Car Button -->
      <UButton 
        color="primary" 
        size="lg"
        icon="i-heroicons-plus"
        @click="isAddCarOpen = true"
      >
        Add Car
      </UButton>
    </div>

    <!-- Search Section -->
    <div class="mb-6">
      <UFormGroup label="Search Cars" description="Search by customer name, year, make, model, VIN, license plate, or fleet">
        <UInput
          v-model="searchQuery"
          icon="i-heroicons-magnifying-glass"
          placeholder="Search by customer name, car details, VIN, license..."
          size="lg"
          :loading="isLoading"
        />
      </UFormGroup>
    </div>

    <!-- Cars Grid -->
    <div v-if="cars && cars.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <UCard 
        v-for="car in cars" 
        :key="car.id"
        class="hover:shadow-lg transition-shadow cursor-pointer"
        @click="$router.push(`/cars/${car.id}`)"
      >
        <div class="space-y-4">
          <!-- Car Header -->
          <div class="flex items-center gap-4">
            <UAvatar
              size="lg"
              class="bg-blue-500 dark:bg-blue-400"
            >
              <UIcon name="i-heroicons-truck" class="text-xl" />
            </UAvatar>
            
            <div class="flex-1 min-w-0">
              <h3 class="font-semibold text-gray-900 dark:text-white truncate">
                {{ car.year }} {{ car.make }} {{ car.model }}
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Owner: {{ car.customer_first_name }} {{ car.customer_last_name }}
              </p>
            </div>
            
            <UIcon 
              name="i-heroicons-chevron-right" 
              class="text-gray-400 shrink-0"
            />
          </div>

          <!-- Car Details -->
          <div class="space-y-2">
            <div v-if="car.engine" class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <UIcon name="i-heroicons-cog-6-tooth" class="text-xs" />
              <span>{{ car.engine }}</span>
            </div>
            
            <div v-if="car.vin" class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <UIcon name="i-heroicons-identification" class="text-xs" />
              <span>VIN: {{ car.vin }}</span>
            </div>
            
            <div v-if="car.license" class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <UIcon name="i-heroicons-document-text" class="text-xs" />
              <span>License: {{ car.license }}</span>
            </div>
          </div>

          <!-- Car Notes -->
          <div v-if="car.notes" class="pt-2 border-t border-gray-200 dark:border-gray-700">
            <p class="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
              {{ car.notes }}
            </p>
          </div>

        </div>
      </UCard>
    </div>

    <!-- Pagination -->
    <div v-if="pagination && pagination.totalPages > 1" class="mt-8 flex justify-center">
      <UPagination
        v-model="currentPage"
        :page-count="pagination.limit"
        :total="pagination.totalCount"
        :max="7"
        @update:model-value="goToPage"
      />
    </div>

    <!-- Empty State -->
    <UCard v-else-if="!isLoading">
      <div class="text-center py-12">
        <UIcon name="i-heroicons-truck" class="text-4xl text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
          {{ searchQuery ? 'No cars found' : 'No cars yet' }}
        </h3>
        <p class="text-gray-500 dark:text-gray-400 mb-6">
          {{ searchQuery 
            ? 'Try adjusting your search terms or clear the search to see all cars.' 
            : 'Get started by adding your first vehicle.' 
          }}
        </p>
        <div class="flex gap-3 justify-center">
          <UButton
            v-if="searchQuery"
            variant="outline"
            icon="i-heroicons-x-mark"
            @click="searchQuery = ''"
          >
            Clear Search
          </UButton>
          <UButton
            color="primary"
            icon="i-heroicons-plus"
            @click="isAddCarOpen = true"
          >
            {{ searchQuery ? 'Add Car' : 'Add Your First Car' }}
          </UButton>
        </div>
      </div>
    </UCard>

    <!-- Loading State -->
    <div v-else-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <USkeleton v-for="i in 6" :key="i" class="h-48" />
    </div>

    <!-- Add Car Modal -->
    <UModal v-model="isAddCarOpen">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">Add New Car</h3>
            <UButton
              color="neutral"
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              @click="isAddCarOpen = false"
            />
          </div>
        </template>

        <div class="space-y-4">
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Car management functionality coming soon.
          </p>
          <UButton 
            block 
            variant="outline" 
            @click="isAddCarOpen = false"
          >
            Close
          </UButton>
        </div>
      </UCard>
    </UModal>
  </UContainer>
</template>
