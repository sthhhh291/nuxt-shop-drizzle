<script setup lang="ts">
import { z } from "zod";
import type { Car } from "~~/db/schema";

const { id } = useRoute().params;
const router = useRouter();
const toast = useToast();

const carSchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z
    .number()
    .min(1886, "Year must be valid")
    .max(new Date().getFullYear(), "Year cannot be in the future"),
  engine: z.string().optional(),
  vin: z.string().min(1, "VIN is required"),
  license: z.string().min(1, "License is required"),
  fleet_no: z.string().min(1, "Fleet number is required"),
  notes: z.string().optional(),
  customer_id: z.number().min(1, "Customer ID is required"),
});

const currentYear = new Date().getFullYear();
const formState = reactive({
  make: "",
  model: "",
  year: currentYear - 6,
  vin: "",
  engine: "",
  license: "",
  fleet_no: "",
  notes: "",
});

const isSubmitting = ref(false);

// Generate year options for the select dropdown
const yearOptions = Array.from({ length: currentYear - 1885 }, (_, i) => {
  const year = currentYear - i;
  return { label: year.toString(), value: year };
});

const addCar = async (event: any) => {
  try {
    isSubmitting.value = true;

    const validatedData = carSchema.parse({
      make: formState.make,
      model: formState.model,
      year: Number(formState.year),
      engine: formState.engine,
      license: formState.license,
      fleet_no: formState.fleet_no,
      vin: formState.vin,
      notes: formState.notes,
      customer_id: Number(id),
    });

    console.log("Validated Data:", validatedData);

    const response = await $fetch(`/api/cars`, {
      method: "POST",
      body: validatedData,
    });

    const newCar: Car = response as Car;
    console.log("Car added:", newCar);

    toast.add({
      title: "Success!",
      description: "Car added successfully",
      color: "success",
    });

    router.push(`/cars/${newCar.id}`);
  } catch (error) {
    console.error("Error adding car:", error);
    toast.add({
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to add car",
      color: "error",
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
            @click="router.push(`/customers/${id}`)">
            Back to Customer
          </UButton>
        </div>

        <div class="text-center">
          <div
            class="w-16 h-16 mx-auto mb-4 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
            <UIcon
              name="i-heroicons-truck"
              class="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </div>

          <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Add Vehicle
          </h1>
          <p class="text-gray-600 dark:text-gray-400">
            Add a new vehicle for customer ID: {{ id }}
          </p>
        </div>
      </div>

      <!-- Form -->
      <UCard>
        <UForm
          :schema="carSchema"
          :state="formState"
          @submit="addCar"
          class="space-y-6">
          <div class="grid grid-cols-2 gap-4">
            <UFormGroup label="Make" name="make" required>
              <UInput
                v-model="formState.make"
                placeholder="Enter vehicle make"
                icon="i-heroicons-building-storefront"
                size="lg"
                :disabled="isSubmitting" />
            </UFormGroup>

            <UFormGroup label="Model" name="model" required>
              <UInput
                v-model="formState.model"
                placeholder="Enter vehicle model"
                icon="i-heroicons-truck"
                size="lg"
                :disabled="isSubmitting" />
            </UFormGroup>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <UFormGroup label="Year" name="year" required>
              <UInput
                v-model="formState.year"
                icon="i-heroicons-calendar"
                placeholder="Select year"
                type="number"
                size="lg"
                :disabled="isSubmitting" />
            </UFormGroup>

            <UFormGroup label="VIN" name="vin" required>
              <UInput
                v-model="formState.vin"
                placeholder="Enter VIN number"
                icon="i-heroicons-identification"
                size="lg"
                :disabled="isSubmitting" />
            </UFormGroup>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <UFormGroup label="License" name="license" required>
              <UInput
                v-model="formState.license"
                icon="i-heroicons-clipboard-document"
                placeholder="Enter license"
                type="text"
                size="lg"
                :disabled="isSubmitting" />
            </UFormGroup>

            <UFormGroup label="Fleet No" name="fleet_no" required>
              <UInput
                v-model="formState.fleet_no"
                placeholder="Enter fleet number"
                icon="i-heroicons-identification"
                size="lg"
                :disabled="isSubmitting" />
            </UFormGroup>
          </div>
          <UFormGroup label="Engine" name="engine">
            <UInput
              v-model="formState.engine"
              icon="i-heroicons-cog"
              placeholder="Enter engine details (optional)"
              type="text"
              size="lg"
              :disabled="isSubmitting" />
          </UFormGroup>

          <UFormGroup label="Notes" name="notes">
            <UTextarea
              v-model="formState.notes"
              placeholder="Enter any additional notes (optional)"
              :rows="3"
              :disabled="isSubmitting" />
          </UFormGroup>

          <div class="flex gap-3 pt-4">
            <UButton
              color="neutral"
              variant="outline"
              block
              @click="router.push(`/customers/${id}`)"
              :disabled="isSubmitting">
              Cancel
            </UButton>
            <UButton
              type="submit"
              color="primary"
              @click="addCar"
              block
              :loading="isSubmitting"
              :disabled="isSubmitting">
              Add Vehicle
            </UButton>
          </div>
        </UForm>
      </UCard>
    </div>
  </UContainer>
</template>
