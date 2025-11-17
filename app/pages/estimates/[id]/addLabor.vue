<script setup lang="ts">
import { z } from "zod";

const { id } = useRoute().params;
const router = useRouter();
const toast = useToast();

const laborSchema = z.object({
  description: z.string().min(1, "Description is required"),
  hours: z.number().min(0.1, "Hours must be greater than 0"),
  rate: z.number().min(1, "Rate must be greater than 0"),
  price: z.number().min(0, "Price must be valid"),
  estimate_id: z.number().int(),
});

const formState = reactive({
  description: "",
  hours: 0,
  rate: 125,
  price: 0,
});

const isSubmitting = ref(false);

const calcPrice = () => {
  formState.price = formState.hours * formState.rate;
};

// Watch for changes in hours or rate to automatically calculate price
watch([() => formState.hours, () => formState.rate], () => {
  calcPrice();
});

const submitLabor = async (event: any) => {
  try {
    isSubmitting.value = true;

    const validatedData = laborSchema.parse({
      description: formState.description,
      hours: Number(formState.hours),
      rate: Number(formState.rate),
      price: Number(formState.price),
      estimate_id: Number(id),
    });

    await $fetch("/api/labor", {
      method: "POST",
      body: validatedData,
    });

    toast.add({
      title: "Success!",
      description: "Labor item added to estimate",
      color: "green",
    });

    router.push(`/estimates/${id}`);
  } catch (error) {
    console.error("Error adding labor:", error);
    toast.add({
      title: "Error",
      description:
        error instanceof Error ? error.message : "Failed to add labor item",
      color: "red",
    });
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <UContainer class="py-8">
    <div class="max-w-2xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center gap-4 mb-4">
          <UButton
            variant="ghost"
            icon="i-heroicons-arrow-left"
            @click="router.push(`/estimates/${id}`)">
            Back to Estimate
          </UButton>
        </div>

        <div class="text-center">
          <div
            class="w-16 h-16 mx-auto mb-4 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
            <UIcon
              name="i-heroicons-wrench-screwdriver"
              class="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </div>

          <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Add Labor Item
          </h1>
          <p class="text-gray-600 dark:text-gray-400">
            Add labor charges to estimate #{{ id }}
          </p>
        </div>
      </div>

      <!-- Form -->
      <UCard>
        <UForm
          :schema="laborSchema"
          :state="formState"
          @submit="submitLabor"
          class="space-y-6">
          <UFormGroup label="Labor Description" name="description" required>
            <UTextarea
              v-model="formState.description"
              placeholder="Describe the labor work performed"
              :rows="3"
              :disabled="isSubmitting" />
          </UFormGroup>

          <div class="grid grid-cols-2 gap-4">
            <UFormGroup label="Hours" name="hours" required>
              <UInput
                v-model.number="formState.hours"
                type="number"
                step="0.1"
                min="0.1"
                placeholder="0.0"
                icon="i-heroicons-clock"
                size="lg"
                :disabled="isSubmitting" />
            </UFormGroup>

            <UFormGroup label="Hourly Rate ($)" name="rate" required>
              <UInput
                v-model.number="formState.rate"
                type="number"
                step="0.01"
                min="1"
                placeholder="125.00"
                icon="i-heroicons-currency-dollar"
                size="lg"
                :disabled="isSubmitting" />
            </UFormGroup>
          </div>

          <UFormGroup label="Total Price" name="price" required>
            <UInput
              v-model.number="formState.price"
              type="number"
              step="0.01"
              readonly
              icon="i-heroicons-calculator"
              size="lg"
              class="bg-gray-50 dark:bg-gray-800"
              :disabled="isSubmitting" />
            <template #help>
              <span class="text-sm text-gray-500">
                Automatically calculated: {{ formState.hours }} hours × ${{
                  formState.rate
                }}/hour
              </span>
            </template>
          </UFormGroup>

          <div class="flex gap-3 pt-4">
            <UButton
              color="neutral"
              variant="outline"
              block
              @click="router.push(`/estimates/${id}`)"
              :disabled="isSubmitting">
              Cancel
            </UButton>
            <UButton
              type="submit"
              @click="submitLabor"
              color="primary"
              block
              :loading="isSubmitting"
              :disabled="isSubmitting">
              Add Labor Item
            </UButton>
          </div>
        </UForm>
      </UCard>
    </div>
  </UContainer>
</template>
