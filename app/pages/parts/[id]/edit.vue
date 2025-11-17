<script setup lang="ts">
import { z } from "zod";

const { id } = useRoute().params;
const router = useRouter();
const toast = useToast();

const { data, pending, error } = await useFetch(`/api/parts/${id}`, {
  method: "GET",
});

if (error.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Part not found'
  });
}

const part = ref({
  description: data.value?.description || "",
  quantity: data.value?.quantity || 1,
  mfr_number: data.value?.mfr_number || "",
  part_number: data.value?.part_number || "",
  cost: data.value?.cost || 0,
  list: data.value?.list || 0,
  unit_price: data.value?.unit_price || 0,
  estimate_id: data.value?.estimate_id || 0,
});

const partSchema = z.object({
  description: z.string().min(1).max(255),
  mfr_number: z.string().optional(),
  part_number: z.string().optional(),
  quantity: z.number().min(1),
  cost: z.number().min(0),
  list: z.number().min(0),
  unit_price: z.number().min(0),
  estimate_id: z.number().min(1),
});

const isSubmitting = ref(false);

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount || 0);
};

const calcPrice = () => {
  if (part.value.cost > 0) {
    const calculated = part.value.cost * 1.86;
    part.value.unit_price = calculated > part.value.list && part.value.list > 0
      ? part.value.list
      : Number(calculated.toFixed(2));
  }
};

const submitPart = async () => {
  if (isSubmitting.value) return;
  
  try {
    isSubmitting.value = true;
    const npart = partSchema.parse({
      description: part.value.description,
      quantity: Number(part.value.quantity),
      mfr_number: part.value.mfr_number,
      part_number: part.value.part_number,
      cost: Number(part.value.cost),
      list: Number(part.value.list),
      unit_price: Number(part.value.unit_price),
      estimate_id: Number(part.value.estimate_id),
    });
    
    await useFetch(`/api/parts/${id}`, {
      method: "PUT",
      body: npart,
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    toast.add({
      title: 'Success',
      description: 'Part updated successfully',
      color: 'green'
    });
    
    router.push(`/estimates/${data.value?.estimate_id}`);
  } catch (error) {
    console.error("Error updating part:", error);
    toast.add({
      title: 'Error',
      description: 'Failed to update part',
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
            Edit Part
          </h1>
          <p class="text-gray-500 dark:text-gray-400 mt-1">
            {{ part.description }}
          </p>
        </div>
        <div class="flex items-center gap-2">
          <UIcon name="i-heroicons-cog-6-tooth" class="w-6 h-6 text-purple-500" />
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="flex justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-purple-500" />
    </div>

    <!-- Form Card -->
    <UCard v-else class="mb-6">
      <template #header>
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
            <UIcon name="i-heroicons-pencil-square" class="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Part Details</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">Update part information and pricing</p>
          </div>
        </div>
      </template>

      <form @submit.prevent="submitPart" class="space-y-6">
        <!-- Description -->
        <UFormGroup label="Description" required>
          <UInput
            v-model="part.description"
            placeholder="Enter part description"
            icon="i-heroicons-document-text"
            size="lg"
            required
          />
        </UFormGroup>

        <!-- Part Numbers Row -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <UFormGroup label="Quantity" required>
            <UInput
              v-model.number="part.quantity"
              type="number"
              min="1"
              placeholder="1"
              icon="i-heroicons-squares-2x2"
              size="lg"
              required
            />
          </UFormGroup>

          <UFormGroup label="Manufacturer Number">
            <UInput
              v-model="part.mfr_number"
              placeholder="MFR #"
              icon="i-heroicons-identification"
              size="lg"
            />
          </UFormGroup>

          <UFormGroup label="Part Number">
            <UInput
              v-model="part.part_number"
              placeholder="Part #"
              icon="i-heroicons-hashtag"
              size="lg"
            />
          </UFormGroup>
        </div>

        <!-- Pricing Section -->
        <div class="space-y-4">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
            <UIcon name="i-heroicons-currency-dollar" class="w-5 h-5 text-green-500" />
            Pricing Information
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <UFormGroup label="Cost" required>
              <UInput
                v-model.number="part.cost"
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

            <UFormGroup label="List Price" required>
              <UInput
                v-model.number="part.list"
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
                  <UBadge color="orange" variant="soft" size="xs">List</UBadge>
                </template>
              </UInput>
            </UFormGroup>

            <UFormGroup label="Unit Price">
              <UInput
                v-model.number="part.unit_price"
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
                {{ part.quantity }} × {{ formatCurrency(part.unit_price) }}
              </p>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-green-600 dark:text-green-400">
                {{ formatCurrency(part.quantity * part.unit_price) }}
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
          color="purple"
          icon="i-heroicons-check"
          :loading="isSubmitting"
          @click="submitPart"
        >
          {{ isSubmitting ? 'Updating...' : 'Update Part' }}
        </UButton>
      </div>
    </div>
  </div>
</template>
