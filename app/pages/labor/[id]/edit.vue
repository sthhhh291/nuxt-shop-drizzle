<script setup lang="ts">
import type { Labor } from "~~/db/schema";

const { id } = useRoute().params;
const router = useRouter();
const toast = useToast();

const { data, pending, error } = await useFetch(`/api/labor/${id}`, {
  method: "GET",
});

if (error.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Labor entry not found'
  });
}

const labor = ref(data.value as Labor);
const isSubmitting = ref(false);

const calcLaborPrice = () => {
  if (labor.value.hours && labor.value.rate) {
    labor.value.price = Number((labor.value.hours * labor.value.rate).toFixed(2));
  }
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount || 0);
};

const updateLabor = async () => {
  if (isSubmitting.value) return;
  
  try {
    isSubmitting.value = true;
    await useFetch(`/api/labor/${id}`, {
      method: "PUT",
      body: labor.value,
    });
    
    toast.add({
      title: 'Success',
      description: 'Labor entry updated successfully',
      color: 'green'
    });
    
    router.back();
  } catch (error) {
    console.error("Error updating labor:", error);
    toast.add({
      title: 'Error',
      description: 'Failed to update labor entry',
      color: 'red'
    });
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="max-w-2xl mx-auto p-6">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center gap-4 mb-4">
        <UButton
          icon="i-heroicons-arrow-left"
          variant="ghost"
          color="gray"
          @click="router.back()"
        />
        <div class="flex-1">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            Edit Labor Entry
          </h1>
          <p class="text-gray-500 dark:text-gray-400 mt-1">
            {{ labor.description }}
          </p>
        </div>
        <div class="flex items-center gap-2">
          <UIcon name="i-heroicons-wrench-screwdriver" class="w-6 h-6 text-blue-500" />
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="flex justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-blue-500" />
    </div>

    <!-- Form Card -->
    <UCard v-else class="mb-6">
      <template #header>
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
            <UIcon name="i-heroicons-pencil-square" class="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Labor Details</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">Update labor entry information</p>
          </div>
        </div>
      </template>

      <form @submit.prevent="updateLabor" class="space-y-6">
        <!-- Description -->
        <UFormGroup label="Description" required>
          <UInput
            v-model="labor.description"
            placeholder="Enter labor description"
            icon="i-heroicons-document-text"
            size="lg"
            required
          />
        </UFormGroup>

        <!-- Hours and Rate Row -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <UFormGroup label="Hours" required>
            <UInput
              v-model.number="labor.hours"
              type="number"
              step="0.1"
              min="0"
              placeholder="0.0"
              icon="i-heroicons-clock"
              size="lg"
              @input="calcLaborPrice"
              required
            >
              <template #trailing>
                <span class="text-xs text-gray-500">hrs</span>
              </template>
            </UInput>
          </UFormGroup>

          <UFormGroup label="Rate per Hour" required>
            <UInput
              v-model.number="labor.rate"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              icon="i-heroicons-currency-dollar"
              size="lg"
              @input="calcLaborPrice"
              required
            >
              <template #trailing>
                <span class="text-xs text-gray-500">/hr</span>
              </template>
            </UInput>
          </UFormGroup>
        </div>

        <!-- Price Display -->
        <UFormGroup label="Total Price">
          <div class="relative">
            <UInput
              v-model.number="labor.price"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              icon="i-heroicons-currency-dollar"
              size="lg"
              readonly
              class="bg-gray-50 dark:bg-gray-800"
            />
            <div class="absolute right-3 top-1/2 transform -translate-y-1/2">
              <UBadge color="green" variant="soft">
                {{ formatCurrency(labor.price) }}
              </UBadge>
            </div>
          </div>
          <template #help>
            <div class="flex items-center gap-2 text-sm text-gray-500">
              <UIcon name="i-heroicons-calculator" class="w-4 h-4" />
              Calculated automatically: {{ labor.hours }} hrs × {{ formatCurrency(labor.rate) }}/hr
            </div>
          </template>
        </UFormGroup>
      </form>
    </UCard>

    <!-- Action Buttons -->
    <div class="flex items-center justify-between">
      <UButton
        variant="ghost"
        color="gray"
        icon="i-heroicons-x-mark"
        @click="router.back()"
      >
        Cancel
      </UButton>

      <div class="flex items-center gap-3">
        <UButton
          color="blue"
          icon="i-heroicons-check"
          :loading="isSubmitting"
          @click="updateLabor"
        >
          {{ isSubmitting ? 'Saving...' : 'Save Changes' }}
        </UButton>
      </div>
    </div>
  </div>
</template>
