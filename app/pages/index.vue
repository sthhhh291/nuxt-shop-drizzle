<script setup lang="ts">
const { data, refresh } = await useFetch("/api/customers", {
  method: "GET",
});
const customers = computed(() => {
  return data.value && "customers" in data.value ? data.value.customers : [];
});

// Modal state
const isAddCustomerOpen = ref(false);

// Handle customer added
const handleCustomerAdded = () => {
  refresh();
  isAddCustomerOpen.value = false;
};

provide("refreshCustomers", refresh);
</script>

<template>
  <UContainer class="py-8">
    <!-- Header Section -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Dashboard
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        Welcome to your shop management system
      </p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <UCard>
        <div class="flex items-center gap-4">
          <div class="p-3 bg-primary-100 dark:bg-primary-900 rounded-lg">
            <UIcon name="i-heroicons-users" class="text-2xl text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Total Customers</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ customers?.length || 0 }}
            </p>
          </div>
        </div>
      </UCard>

      <UCard>
        <div class="flex items-center gap-4">
          <div class="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
            <UIcon name="i-heroicons-truck" class="text-2xl text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Active Cars</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">--</p>
          </div>
        </div>
      </UCard>

      <UCard>
        <div class="flex items-center gap-4">
          <div class="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <UIcon name="i-heroicons-document-text" class="text-2xl text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Estimates</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">--</p>
          </div>
        </div>
      </UCard>

      <UCard>
        <div class="flex items-center gap-4">
          <div class="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
            <UIcon name="i-heroicons-currency-dollar" class="text-2xl text-yellow-600 dark:text-yellow-400" />
          </div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Revenue</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">--</p>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Recent Customers Section -->
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
            Recent Customers
          </h2>
          <UButton 
            variant="outline" 
            size="sm"
            to="/customers"
            icon="i-heroicons-arrow-right"
            trailing
          >
            View All
          </UButton>
        </div>
      </template>
      
      <customersComponent :customers="customers" />
    </UCard>

    <!-- Quick Actions -->
    <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">Quick Actions</h3>
        </template>
        
        <div class="space-y-4">
          <UButton 
            block 
            variant="outline" 
            icon="i-heroicons-user-plus"
            @click="isAddCustomerOpen = true"
          >
            Add New Customer
          </UButton>
          
          <UButton 
            block 
            variant="outline" 
            icon="i-heroicons-truck"
            to="/cars"
          >
            Manage Cars
          </UButton>
          
          <UButton 
            block 
            variant="outline" 
            icon="i-heroicons-document-plus"
            to="/estimates"
          >
            Create Estimate
          </UButton>
        </div>
      </UCard>

      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">Recent Activity</h3>
        </template>
        
        <div class="space-y-3">
          <div class="text-center py-8 text-gray-500 dark:text-gray-400">
            <UIcon name="i-heroicons-clock" class="text-2xl mb-2" />
            <p>No recent activity</p>
          </div>
        </div>
      </UCard>
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

        <addCustomerComponent @customerAdded="handleCustomerAdded" />
      </UCard>
    </UModal>
  </UContainer>
</template>


