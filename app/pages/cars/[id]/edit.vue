<script setup lang="ts">
const { id } = useRoute().params;
const router = useRouter();
const toast = useToast();
import type { Car } from "~~/db/schema";
import { z } from "zod";

const { data: car } = await useFetch<Car>(`/api/cars/${id}`, {
  method: "GET",
});

const carSchema = z.object({
  make: z.string().min(1, "Make is required"),
    model: z.string().min(1, "Model is required"),
    year: z
      .number()
      .int()
      .min(1886, "Year must be valid")
      .max(new Date().getFullYear(), "Year cannot be in the future"),
    engine: z.string().optional(),
    vin: z.string().optional(),
    license: z.string().optional(),
    fleet_no: z.string().optional(),
    notes: z.string().optional(),
    customer_id: z.number().int().min(1, "Customer ID is required"), 
});

const formData = ref({
  make: car.value?.make || "",
  model: car.value?.model || "",
  year: car.value?.year || new Date().getFullYear(),
  engine: car.value?.engine || "",
  vin: car.value?.vin || "",
  license: car.value?.license || "",
  fleet: car.value?.fleet || "",
  notes: car.value?.notes || "",
  customer_id: car.value?.customer_id || null,
});

// Popular car makes for better UX
const carMakes = [
  "Toyota",
  "Honda",
  "Ford",
  "Chevrolet",
  "Nissan",
  "BMW",
  "Mercedes-Benz",
  "Audi",
  "Volkswagen",
  "Hyundai",
  "Kia",
  "Mazda",
  "Subaru",
  "Lexus",
  "Infiniti",
  "Acura",
  "Cadillac",
  "Lincoln",
  "Buick",
  "GMC",
  "Ram",
  "Jeep",
  "Chrysler",
  "Dodge",
  "Mitsubishi",
  "Volvo",
  "Jaguar",
  "Land Rover",
  "Porsche",
  "Tesla",
  "Other",
];

// Car colors for selection
const carColors = [
  { label: "White", value: "white" },
  { label: "Black", value: "black" },
  { label: "Silver", value: "silver" },
  { label: "Gray", value: "gray" },
  { label: "Red", value: "red" },
  { label: "Blue", value: "blue" },
  { label: "Green", value: "green" },
  { label: "Brown", value: "brown" },
  { label: "Gold", value: "gold" },
  { label: "Orange", value: "orange" },
  { label: "Yellow", value: "yellow" },
  { label: "Purple", value: "purple" },
  { label: "Other", value: "other" },
];

// Generate year options
const currentYear = new Date().getFullYear();
const yearOptions = Array.from(
  { length: currentYear - 1885 },
  (_, i) => currentYear - i
);

const isSubmitting = ref(false);
const isLoading = computed(() => !car.value);

const updateCar = async (event: any) => {
  if (!car.value) return;
  console.log("Form submitted with data:", car.value);

  try {
    isSubmitting.value = true;

    const validatedData = carSchema.parse({
      make: formData.value.make,
      model: formData.value.model,
      year: formData.value.year,
      engine: formData.value.engine,
      vin: formData.value.vin,
      license: formData.value.license,
      fleet_no: formData.value.fleet,
      notes: formData.value.notes,
      customer_id: formData.value.customer_id,
    });

    console.log("Updating car with data:", validatedData);

    await $fetch(`/api/cars/${id}`, {
      method: "PUT",
      body: { ...car.value, ...validatedData },
    });

    toast.add({
      title: "Success!",
      description: "Car updated successfully",
      color: "success",
    });

    router.push(`/cars/${id}`);
  } catch (error) {
    console.error("Failed to update car:", error);
    toast.add({
      title: "Error",
      description:
        error instanceof Error ? error.message : "Failed to update car",
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
      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-12">
        <UIcon
          name="i-heroicons-arrow-path"
          class="w-8 h-8 animate-spin text-primary-500 mx-auto mb-4" />
        <p class="text-gray-600 dark:text-gray-400">Loading car data...</p>
      </div>

      <!-- Car Edit Form -->
      <div v-else-if="car">
        <!-- Header -->
        <div class="mb-8">
          <div class="flex items-center gap-4 mb-4">
            <UButton
              variant="ghost"
              icon="i-heroicons-arrow-left"
              @click="router.push(`/cars/${id}`)">
              Back to Car Details
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
              Edit Vehicle
            </h1>
            <p class="text-gray-600 dark:text-gray-400">
              Update vehicle information
            </p>
          </div>
        </div>

        <!-- Form -->
        <UCard>
          <UForm
            :schema="carSchema"
            :state="car"
            @submit="updateCar"
            class="space-y-6">
            <!-- Basic Vehicle Information -->
            <div class="space-y-6">
              <h3
                class="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                Vehicle Details
              </h3>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <UFormGroup label="Make" name="make" required>
                  <USelectMenu
                    v-model="car.make"
                    :items="carMakes"
                    placeholder="Select or type make"
                    searchable
                    creatable
                    size="lg"
                    :disabled="isSubmitting">
                    <template #leading>
                      <UIcon name="i-heroicons-tag" class="w-4 h-4" />
                    </template>
                  </USelectMenu>
                </UFormGroup>

                <UFormGroup label="Model" name="model" required>
                  <UInput
                    v-model="car.model"
                    placeholder="Enter vehicle model"
                    icon="i-heroicons-identification"
                    size="lg"
                    :disabled="isSubmitting" />
                </UFormGroup>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <UFormGroup label="Year" name="year" required>
                  <USelectMenu
                    v-model="car.year"
                    :items="yearOptions"
                    placeholder="Select year"
                    searchable
                    size="lg"
                    :disabled="isSubmitting">
                    <template #leading>
                      <UIcon name="i-heroicons-calendar" class="w-4 h-4" />
                    </template>
                  </USelectMenu>
                </UFormGroup>

                <UFormGroup label="Engine" name="engine">
                  <UInput
                    v-model="car.engine"
                    placeholder="Enter engine details (optional)"
                    size="lg"
                    :disabled="isSubmitting">
                    <template #leading>
                      <UIcon name="i-heroicons-swatch" class="w-4 h-4" />
                    </template>
                  </UInput>
                </UFormGroup>
              </div>
            </div>

            <!-- Additional Information -->
            <div class="space-y-6">
              <h3
                class="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                Additional Information
              </h3>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <UFormGroup
                  label="Vin"
                  name="vin"
                  help="Current odometer reading">
                  <UInput
                    v-model.number="car.vin"
                    type="text"
                    placeholder="Vin"
                    icon="i-heroicons-chart-bar"
                    size="lg"
                    :disabled="isSubmitting" />
                </UFormGroup>

                <UFormGroup
                  label="License Plate"
                  name="license"
                  help="License plate number">
                  <UInput
                    v-model="car.license"
                    placeholder="Enter license plate (optional)"
                    icon="i-heroicons-hashtag"
                    size="lg"
                    maxlength="17"
                    :disabled="isSubmitting" />
                </UFormGroup>
                <UFormGroup
                  label="Fleet Number"
                  name="fleet_no"
                  help="Fleet identification number">
                  <UInput
                    v-model="car.fleet"
                    placeholder="Enter fleet number (optional)"
                    icon="i-heroicons-briefcase"
                    size="lg"
                    :disabled="isSubmitting" />
                    <UInput v-model="car.customer_id" type="hidden" />
                </UFormGroup>
              </div>
            </div>

            <!-- Vehicle Preview -->
            <!-- <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border">
              <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-4"
                >Vehicle Preview</h4
              >
              <div class="flex items-center gap-4">
                <div class="p-3 bg-white dark:bg-gray-700 rounded-lg border">
                  <UIcon
                    name="i-heroicons-truck"
                    class="w-6 h-6 text-gray-600 dark:text-gray-400" />
                </div>
                <div class="flex-1">
                  <p class="font-medium text-gray-900 dark:text-white text-lg">
                    {{ car.year }} {{ car.make }} {{ car.model }}
                  </p>
                  <div
                    class="flex flex-wrap gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                    <span v-if="car.color" class="flex items-center gap-1">
                      <UIcon name="i-heroicons-swatch" class="w-3 h-3" />
                      {{ car.color }}
                    </span>
                    <span v-if="car.mileage" class="flex items-center gap-1">
                      <UIcon name="i-heroicons-chart-bar" class="w-3 h-3" />
                      {{ car.mileage?.toLocaleString() }} miles
                    </span>
                    <span v-if="car.vin" class="flex items-center gap-1">
                      <UIcon name="i-heroicons-hashtag" class="w-3 h-3" />
                      VIN: {{ car.vin }}
                    </span>
                  </div>
                </div>
              </div>
            </div> -->

            <div
              class="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
              <UButton
                color="neutral"
                variant="outline"
                block
                size="lg"
                @click="router.push(`/cars/${id}`)"
                :disabled="isSubmitting">
                <UIcon name="i-heroicons-x-mark" class="w-4 h-4 mr-2" />
                Cancel
              </UButton>
              <UButton
                type="submit"
                @click="updateCar"
                color="primary"
                block
                size="lg"
                :loading="isSubmitting"
                :disabled="isSubmitting">
                <UIcon name="i-heroicons-check" class="w-4 h-4 mr-2" />
                Save Changes
              </UButton>
            </div>
          </UForm>
        </UCard>
      </div>

      <!-- Error State -->
      <div v-else class="text-center py-12">
        <UIcon
          name="i-heroicons-exclamation-triangle"
          class="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2"
          >Vehicle Not Found</h3
        >
        <p class="text-gray-600 dark:text-gray-400 mb-6"
          >The vehicle you're looking for doesn't exist or has been deleted.</p
        >
        <UButton @click="router.push('/cars')" variant="outline"
          >Back to Cars</UButton
        >
      </div>
    </div>
  </UContainer>
</template>
