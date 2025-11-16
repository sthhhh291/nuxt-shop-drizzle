<script setup lang="ts">
const { data, refresh } = await useFetch("/api/estimates", {
  method: "GET",
});
const estimates = computed(() => {
  return data.value && "estimates" in data.value ? data.value.estimates : [];
});

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
          <span v-if="estimates" class="text-sm">
            ({{ estimates.length }} total)
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

    <!-- Estimates List -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Estimates Component -->
      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
            Recent Estimates
          </h2>
        </template>
        
        <estimatesComponent :estimates="estimates" />
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

