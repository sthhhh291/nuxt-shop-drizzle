<script setup lang="ts">
import { z } from "zod";

const { id } = useRoute().params;
const router = useRouter();
const toast = useToast();

const { data, pending, error } = await useFetch(`/api/oil/${id}`, {
  method: "GET",
});

if (error.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Oil entry not found'
  });
}

const oil = ref({
  type: data.value?.type || "",
  quantity: data.value?.quantity || 1,
  mfr_number: data.value?.mfr_number || "",
  part_number: data.value?.part_number || "",
  cost: data.value?.cost || 0,
  list: data.value?.list || 0,
  price_per_unit: data.value?.price_per_unit || 0,
  estimate_id: data.value?.estimate_id || 0,
});

const oilSchema = z.object({
  type: z.string().min(1).max(255),
  mfr_number: z.string().optional(),
  part_number: z.string().optional(),
  quantity: z.number().min(1),
  cost: z.number().min(0),
  list: z.number().min(0),
  price_per_unit: z.number().min(0),
  estimate_id: z.number().min(1),
});

const isSubmitting = ref(false);

const oilTypes = [
  "Engine Oil",
  "Transmission Fluid",
  "Brake Fluid",
  "Power Steering Fluid",
  "Coolant",
  "Differential Oil",
  "Hydraulic Fluid",
];

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount || 0);
};

const calcPrice = () => {
  if (oil.value.cost > 0) {
    const calculated = oil.value.cost * 1.86;
    oil.value.price_per_unit = calculated > oil.value.list && oil.value.list > 0
      ? oil.value.list
      : Number(calculated.toFixed(2));
  }
};

const submitOil = async () => {
  if (isSubmitting.value) return;
  
  try {
    isSubmitting.value = true;
    const validatedOil = oilSchema.parse({
      type: oil.value.type,
      quantity: Number(oil.value.quantity),
      mfr_number: oil.value.mfr_number,
      part_number: oil.value.part_number,
      cost: Number(oil.value.cost),
      list: Number(oil.value.list),
      price_per_unit: Number(oil.value.price_per_unit),
      estimate_id: Number(oil.value.estimate_id),
    });
    
    await useFetch(`/api/oil/${id}`, {
      method: "PUT",
      body: validatedOil,
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    toast.add({
      title: 'Success',
      description: 'Oil entry updated successfully',
      color: 'green'
    });
    
    router.push(`/estimates/${data.value?.estimate_id}`);
  } catch (error) {
    console.error("Error updating oil:", error);
    toast.add({
      title: 'Error',
      description: 'Failed to update oil entry',
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
            Edit Oil Entry
          </h1>
          <p class="text-gray-500 dark:text-gray-400 mt-1">
            {{ oil.type }}
          </p>
        </div>
        <div class="flex items-center gap-2">
          <UIcon name="i-heroicons-beaker" class="w-6 h-6 text-amber-500" />
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="flex justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-amber-500" />
    </div>

    <!-- Form Card -->
    <UCard v-else class="mb-6">
      <template #header>
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
            <UIcon name="i-heroicons-pencil-square" class="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Oil Details</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">Update oil/fluid entry information</p>
          </div>
        </div>
      </template>

      <form @submit.prevent="submitOil" class="space-y-6">
        <!-- Oil Type -->
        <UFormGroup label="Oil/Fluid Type" required>
          <USelectMenu
            v-model="oil.type"
            :options="oilTypes"
            placeholder="Select oil type"
            icon="i-heroicons-beaker"
            size="lg"
            searchable
            creatable
            required
          />
        </UFormGroup>

        <!-- Quantity -->
        <UFormGroup label="Quantity" required>
          <UInput
            v-model.number="oil.quantity"
            type="number"
            step="0.1"
            min="0"
            placeholder="0.0"
            icon="i-heroicons-scale"
            size="lg"
            required
          >
            <template #trailing>
              <span class="text-xs text-gray-500">qt</span>
            </template>
          </UInput>
        </UFormGroup>

        <!-- Optional Part Numbers -->
        <UAccordion :items="[{
          key: 'part_numbers',
          label: 'Part Numbers (Optional)',
          icon: 'i-heroicons-hashtag',
          defaultOpen: false
        }]">
          <template #part_numbers>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <UFormGroup label="Manufacturer Number">
                <UInput
                  v-model="oil.mfr_number"
                  placeholder="MFR #"
                  icon="i-heroicons-identification"
                  size="lg"
                />
              </UFormGroup>

              <UFormGroup label="Part Number">
                <UInput
                  v-model="oil.part_number"
                  placeholder="Part #"
                  icon="i-heroicons-hashtag"
                  size="lg"
                />
              </UFormGroup>
            </div>
          </template>
        </UAccordion>

        <!-- Pricing Section -->
        <div class="space-y-4">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
            <UIcon name="i-heroicons-currency-dollar" class="w-5 h-5 text-green-500" />
            Pricing Information
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <UFormGroup label="Cost" required>
              <UInput
                v-model.number="oil.cost"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                icon="i-heroicons-currency-dollar"
                size="lg"
                @input="calcPrice"
                required
              >
                <template #trailing>
                  <UBadge color="blue" variant="soft" size="xs">Cost</UBadge>
                </template>
              </UInput>
            </UFormGroup>

            <UFormGroup label="List Price">
              <UInput
                v-model.number="oil.list"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                icon="i-heroicons-currency-dollar"
                size="lg"
                @input="calcPrice"
              >
                <template #trailing>
                  <UBadge color="orange" variant="soft" size="xs">List</UBadge>
                </template>
              </UInput>
            </UFormGroup>

            <UFormGroup label="Price per Unit">
              <UInput
                v-model.number="oil.price_per_unit"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                icon="i-heroicons-currency-dollar"
                size="lg"
              >
                <template #trailing>
                  <UBadge color="green" variant="soft" size="xs">Sell</UBadge>
                </template>
              </UInput>
              <template #help>
                <div class="flex items-center gap-2 text-sm text-gray-500">
                  <UIcon name="i-heroicons-calculator" class="w-4 h-4" />
                  Auto-calculated: Cost × 1.86 or List Price (whichever is lower)
                </div>
              </template>
            </UFormGroup>
          </div>
        </div>

        <!-- Extended Price Display -->
        <UCard class="bg-gray-50 dark:bg-gray-800/50">
          <div class="flex items-center justify-between">
            <div>
              <h4 class="font-medium text-gray-900 dark:text-white">Extended Price</h4>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ oil.quantity }} qt × {{ formatCurrency(oil.price_per_unit) }}
              </p>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-green-600 dark:text-green-400">
                {{ formatCurrency(oil.quantity * oil.price_per_unit) }}
              </div>
            </div>
          </div>
        </UCard>
      </form>
    </UCard>

    <!-- Action Buttons -->
    <div class="flex items-center justify-between">
      <UButton
        variant="ghost"
        color="gray"
        icon="i-heroicons-x-mark"
        @click="router.push(`/estimates/${data.value?.estimate_id}`)"
      >
        Cancel
      </UButton>

      <div class="flex items-center gap-3">
        <UButton
          color="amber"
          icon="i-heroicons-check"
          :loading="isSubmitting"
          @click="submitOil"
        >
          {{ isSubmitting ? 'Updating...' : 'Update Oil Entry' }}
        </UButton>
      </div>
    </div>
  </div>
</template>
