<script setup lang="ts">
import type { estimateWithRelations } from "~~/db/schema";

const { id } = useRoute().params;
const router = useRouter();

const { data, refresh } = await useFetch(`/api/estimates/${id}`, {
  method: "GET",
});

console.log("Estimate data:", data.value);

const estimate = computed(
  () => (data.value as any)?.estimate as unknown as estimateWithRelations
);

const totals = computed(() => (data.value as any)?.totals);

const updateEstimate = async () => {
  await refresh();
};

// Helper functions
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount || 0);
};

const getEstimateTypeColor = (type: string) => {
  switch (type?.toLowerCase()) {
    case 'repair':
      return 'error';
    case 'maintenance':
      return 'warning';
    case 'inspection':
      return 'info';
    default:
      return 'primary';
  }
};

const printEstimate = () => {
  window.print();
};

// Dropdown menu items
const dropdownItems = [
  [{
    label: 'Edit Estimate',
    icon: 'i-heroicons-pencil',
    click: () => console.log('Edit estimate')
  }],
  [{
    label: 'Duplicate Estimate',
    icon: 'i-heroicons-document-duplicate',
    click: () => console.log('Duplicate estimate')
  }],
  [{
    label: 'Export PDF',
    icon: 'i-heroicons-document-arrow-down',
    click: () => console.log('Export PDF')
  }],
  [{
    label: 'Delete Estimate',
    icon: 'i-heroicons-trash',
    click: () => console.log('Delete estimate')
  }]
];
</script>

<template>
  <UContainer class="py-8">
    <!-- Header Section -->
    <div class="flex items-center gap-4 mb-8">
      <UButton 
        variant="ghost" 
        icon="i-heroicons-arrow-left"
        @click="router.push('/estimates')"
      >
        Back to Estimates
      </UButton>
      
      <div class="flex-1">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          Estimate #{{ id }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">
          {{ estimate ? `${estimate.car.year} ${estimate.car.make} ${estimate.car.model}` : 'Loading...' }}
        </p>
      </div>

      <!-- Action Buttons -->
      <div v-if="estimate" class="flex gap-2">
        <UButton 
          color="primary"
          icon="i-heroicons-printer"
          @click="printEstimate"
        >
          Print
        </UButton>
        
        <UDropdown :items="dropdownItems">
          <UButton 
            variant="outline" 
            trailing-icon="i-heroicons-chevron-down"
          >
            More Actions
          </UButton>
        </UDropdown>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="!estimate" class="flex items-center justify-center py-12">
      <div class="text-center">
        <UIcon name="i-heroicons-arrow-path" class="animate-spin text-3xl text-primary-500 mb-4" />
        <p class="text-gray-600 dark:text-gray-400">Loading estimate details...</p>
      </div>
    </div>

    <!-- Estimate Details -->
    <div v-else class="space-y-8">
      <!-- Summary Cards Row -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <UCard>
          <div class="text-center">
            <div class="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {{ formatCurrency(totals?.total || 0) }}
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Total Amount</p>
          </div>
        </UCard>

        <UCard>
          <div class="text-center">
            <div class="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {{ estimate.hours_taken }}h
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Labor Hours</p>
          </div>
        </UCard>

        <UCard>
          <div class="text-center">
            <div class="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {{ estimate.miles.toLocaleString() }}
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Miles</p>
          </div>
        </UCard>

        <UCard>
          <div class="text-center">
            <UBadge 
              :color="getEstimateTypeColor(estimate.estimate_type)" 
              variant="subtle"
              class="text-lg px-3 py-1"
            >
              {{ estimate.estimate_type }}
            </UBadge>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">Service Type</p>
          </div>
        </UCard>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column - Details -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Customer & Vehicle Info -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UCard>
              <template #header>
                <div class="flex items-center gap-3">
                  <UIcon name="i-heroicons-user" class="text-xl text-primary-600 dark:text-primary-400" />
                  <h3 class="text-lg font-semibold">Customer</h3>
                </div>
              </template>
              <customer-table-component :customer="estimate.car.customer as any" />
            </UCard>

            <UCard>
              <template #header>
                <div class="flex items-center gap-3">
                  <UIcon name="i-heroicons-truck" class="text-xl text-blue-600 dark:text-blue-400" />
                  <h3 class="text-lg font-semibold">Vehicle</h3>
                </div>
              </template>
              <car-table-component :car="estimate.car as any" />
            </UCard>
          </div>

          <!-- Estimate Details -->
          <UCard>
            <template #header>
              <div class="flex items-center gap-3">
                <UIcon name="i-heroicons-document-text" class="text-xl text-green-600 dark:text-green-400" />
                <h3 class="text-lg font-semibold">Estimate Details</h3>
              </div>
            </template>
            <estimate-table-component :estimate="estimate" />
          </UCard>

          <!-- Labor Section -->
          <UCard>
            <template #header>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <UIcon name="i-heroicons-wrench-screwdriver" class="text-xl text-orange-600 dark:text-orange-400" />
                  <h3 class="text-lg font-semibold">Labor</h3>
                </div>
                <UButton 
                  size="sm"
                  icon="i-heroicons-plus"
                  @click="router.push(`/estimates/${id}/addLabor`)"
                >
                  Add Labor
                </UButton>
              </div>
            </template>
            
            <div v-if="estimate.labor && estimate.labor.length > 0">
              <labor-table-component :labor="estimate.labor" @emit="updateEstimate" />
            </div>
            <div v-else class="text-center py-8">
              <UIcon name="i-heroicons-wrench-screwdriver" class="text-3xl text-gray-400 mx-auto mb-3" />
              <p class="text-gray-500 dark:text-gray-400 mb-4">No labor items added</p>
              <UButton 
                icon="i-heroicons-plus"
                @click="router.push(`/estimates/${id}/addLabor`)"
              >
                Add First Labor Item
              </UButton>
            </div>
          </UCard>

          <!-- Parts Section -->
          <UCard>
            <template #header>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <UIcon name="i-heroicons-cog-6-tooth" class="text-xl text-purple-600 dark:text-purple-400" />
                  <h3 class="text-lg font-semibold">Parts</h3>
                </div>
                <UButton 
                  size="sm"
                  icon="i-heroicons-plus"
                  @click="router.push(`/estimates/${id}/addParts`)"
                >
                  Add Parts
                </UButton>
              </div>
            </template>
            
            <div v-if="estimate.parts && estimate.parts.length > 0">
              <part-table-component :parts="estimate.parts" @emit="updateEstimate" />
            </div>
            <div v-else class="text-center py-8">
              <UIcon name="i-heroicons-cog-6-tooth" class="text-3xl text-gray-400 mx-auto mb-3" />
              <p class="text-gray-500 dark:text-gray-400 mb-4">No parts added</p>
              <UButton 
                icon="i-heroicons-plus"
                @click="router.push(`/estimates/${id}/addParts`)"
              >
                Add First Part
              </UButton>
            </div>
          </UCard>

          <!-- Oil Section -->
          <UCard>
            <template #header>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <UIcon name="i-heroicons-beaker" class="text-xl text-yellow-600 dark:text-yellow-400" />
                  <h3 class="text-lg font-semibold">Oil & Fluids</h3>
                </div>
                <UButton 
                  size="sm"
                  icon="i-heroicons-plus"
                  @click="router.push(`/estimates/${id}/addOil`)"
                >
                  Add Oil
                </UButton>
              </div>
            </template>
            
            <div v-if="estimate.oil && estimate.oil.length > 0">
              <oil-table-component :oils="estimate.oil" @emit="updateEstimate" />
            </div>
            <div v-else class="text-center py-8">
              <UIcon name="i-heroicons-beaker" class="text-3xl text-gray-400 mx-auto mb-3" />
              <p class="text-gray-500 dark:text-gray-400 mb-4">No oil/fluids added</p>
              <UButton 
                icon="i-heroicons-plus"
                @click="router.push(`/estimates/${id}/addOil`)"
              >
                Add First Oil Item
              </UButton>
            </div>
          </UCard>
        </div>

        <!-- Right Column - Sidebar -->
        <div class="space-y-6">
          <!-- Cost Breakdown -->
          <UCard>
            <template #header>
              <div class="flex items-center gap-3">
                <UIcon name="i-heroicons-currency-dollar" class="text-xl text-green-600 dark:text-green-400" />
                <h3 class="text-lg font-semibold">Cost Breakdown</h3>
              </div>
            </template>
            
            <div v-if="totals">
              <totals-table-component :totals="totals" />
              
              <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div class="flex justify-between items-center">
                  <span class="text-xl font-bold text-gray-900 dark:text-white">Grand Total:</span>
                  <span class="text-2xl font-bold text-primary-600 dark:text-primary-400">
                    {{ formatCurrency(totals.total) }}
                  </span>
                </div>
              </div>
            </div>
          </UCard>

          <!-- Quick Actions -->
          <UCard>
            <template #header>
              <h3 class="text-lg font-semibold">Quick Actions</h3>
            </template>

            <div class="space-y-3">
              <UButton 
                block 
                variant="outline" 
                icon="i-heroicons-wrench-screwdriver"
                @click="router.push(`/estimates/${id}/addLabor`)"
              >
                Add Labor
              </UButton>
              
              <UButton 
                block 
                variant="outline" 
                icon="i-heroicons-cog-6-tooth"
                @click="router.push(`/estimates/${id}/addParts`)"
              >
                Add Parts
              </UButton>
              
              <UButton 
                block 
                variant="outline" 
                icon="i-heroicons-beaker"
                @click="router.push(`/estimates/${id}/addOil`)"
              >
                Add Oil
              </UButton>
              
              <div class="border-t border-gray-200 dark:border-gray-700 pt-3">
                <UButton 
                  block 
                  variant="outline" 
                  icon="i-heroicons-printer"
                  @click="printEstimate"
                >
                  Print Estimate
                </UButton>
                
                <UButton 
                  block 
                  variant="outline" 
                  icon="i-heroicons-document-duplicate"
                  class="mt-2"
                  disabled
                >
                  Duplicate
                </UButton>
                
                <UButton 
                  block 
                  variant="outline" 
                  color="error"
                  icon="i-heroicons-trash"
                  class="mt-2"
                  disabled
                >
                  Delete
                </UButton>
              </div>
            </div>
          </UCard>

          <!-- Estimate Info -->
          <UCard>
            <template #header>
              <h3 class="text-lg font-semibold">Estimate Information</h3>
            </template>

            <div class="space-y-4">
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-500 dark:text-gray-400">Date Created</span>
                <span class="font-medium text-gray-900 dark:text-white">
                  {{ new Date(estimate.date).toLocaleDateString() }}
                </span>
              </div>
              
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-500 dark:text-gray-400">Estimate Type</span>
                <UBadge :color="getEstimateTypeColor(estimate.estimate_type)" variant="subtle">
                  {{ estimate.estimate_type }}
                </UBadge>
              </div>
              
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-500 dark:text-gray-400">Labor Hours</span>
                <span class="font-medium text-gray-900 dark:text-white">
                  {{ estimate.hours_taken }}h
                </span>
              </div>
              
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-500 dark:text-gray-400">Vehicle Miles</span>
                <span class="font-medium text-gray-900 dark:text-white">
                  {{ estimate.miles.toLocaleString() }}
                </span>
              </div>
            </div>
          </UCard>
        </div>
      </div>
    </div>
  </UContainer>
</template>
