<script setup lang="ts">
import { couldStartTrivia } from "typescript";
import { z } from "zod";
import { labor, type Estimate } from "~~/db/schema";

const { id } = useRoute().params;
const router = useRouter();
const toast = useToast();

//estimateate form schema
const estimateSchema = z.object({
  car_id: z.number().min(1, "Car ID is required"),
  date: z.string().min(10, "Date is required").max(10),
  hours_taken: z.number().min(0, "Hours must be 0 or greater"),
  miles: z.number().min(0, "Miles must be 0 or greater"),
  estimate_type: z.string().min(1, "Estimate type is required").max(255),
  private_notes: z.string().optional(),
  public_notes: z.string().optional(),
});

//labor form schema
const laborSchema = z.object({  
  estimate_id: z.number().min(1, "Estimate ID is required"),
  description: z.string().min(1, "Description is required").max(500),
  hours: z.number().min(0.1, "Hours must be at least 0.1"),
  rate: z.number().min(0, "Rate must be 0 or greater"),
});

//parts form schema
const partsSchema = z.object({  
  estimate_id: z.number().min(1, "Estimate ID is required"),
  description: z.string().min(1, "Part name is required").max(255),
  mfr_no: z.string().max(100).optional(),
  part_no: z.string().max(100).optional(),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  cost: z.number().min(0, "Cost must be 0 or greater"),
  list_price: z.number().min(0, "List price must be 0 or greater"),
  unit_price: z.number().min(0, "Unit price must be 0 or greater"),
});

//oil/fluids form schema
const oilFluidsSchema = z.object({  
  estimate_id: z.number().min(1, "Estimate ID is required"),
  description: z.string().min(1, "Oil/Fluid name is required").max(255),
  quantity: z.number().min(0.1, "Quantity must be at least 0.1"),
  cost: z.number().min(0, "Cost must be 0 or greater"),
  unit_price: z.number().min(0, "Unit price must be 0 or greater"),
});

const formState = reactive({
  date: new Date().toISOString().split("T")[0],
  hours_taken: 0,
  miles: 0,
  estimate_type: "",
  private_notes: "",
  public_notes: "",
  labor_items: [] as Array<z.infer<typeof laborSchema>>,
  parts_items: [] as Array<z.infer<typeof partsSchema>>,
  oil_fluids_items: [] as Array<z.infer<typeof oilFluidsSchema>>,
});

const isSubmitting = ref(false);

const estimateTypeOptions = [
  { label: "Initial", value: "initial" },
  { label: "Estimate", value: "estimate" },
  { label: "Repair Order", value: "repair_order" },
];

// Fetch car details for context
const { data: carData, error: carError } = await useFetch(`/api/cars/${id}`);

// Handle case where car data has error property
const isCarDataValid = computed(() => {
  return carData.value && !("error" in carData.value);
});

const carInfo = computed(() => {
  if (!isCarDataValid.value) return null;
  return carData.value as any;
});

const addEstimate = async (event: any) => {
  try {
    isSubmitting.value = true;

    const validatedData = estimateSchema.parse({
      car_id: Number(id),
      date: formState.date,
      hours_taken: Number(formState.hours_taken),
      miles: Number(formState.miles),
      estimate_type: formState.estimate_type,
      private_notes: formState.private_notes || "",
      public_notes: formState.public_notes || "",
    });

    console.log("Adding estimate:", validatedData);

    const response = await $fetch(`/api/estimates`, {
      method: "POST",
      body: validatedData,
    });

    console.log("Estimate added:", response);

    toast.add({
      title: "Success!",
      description: "Estimate created successfully",
      color: "success",
    });

    // Navigate to the new estimate
    if (response && typeof response === "object" && "id" in response) {
      const estimateId =
        Array.isArray(response) ? response[0]?.id : response.id;
      router.push(`/estimates/${estimateId}`);
    } else {
      console.error("Invalid response format:", response);
      throw new Error("Invalid response from server");
    }
  } catch (error) {
    console.error("Error adding estimate:", error);
    toast.add({
      title: "Error",
      description:
        error instanceof Error ? error.message : "Failed to create estimate",
      color: "error",
    });
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <UContainer class="py-8">
    <div class="max-w-3xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center gap-4 mb-4">
          <UButton
            variant="ghost"
            icon="i-heroicons-arrow-left"
            @click="router.back()">
            Back
          </UButton>
        </div>

        <div class="text-center">
          <div
            class="w-16 h-16 mx-auto mb-4 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
            <UIcon
              name="i-heroicons-document-text"
              class="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </div>

          <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Create New Estimate
          </h1>
          <p class="text-gray-600 dark:text-gray-400">
            <span v-if="isCarDataValid">
              For {{ carInfo.year }} {{ carInfo.make }} {{ carInfo.model }}
            </span>
            <span v-else> For vehicle ID: {{ id }} </span>
          </p>
        </div>
      </div>

      <!-- Vehicle Info Card -->
      <UCard v-if="isCarDataValid" class="mb-8">
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon
              name="i-heroicons-truck"
              class="w-5 h-5 text-primary-600 dark:text-primary-400" />
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              Vehicle Information
            </h2>
          </div>
        </template>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span class="text-gray-600 dark:text-gray-400">Make:</span>
            <div class="font-medium">{{ carInfo.make }}</div>
          </div>
          <div>
            <span class="text-gray-600 dark:text-gray-400">Model:</span>
            <div class="font-medium">{{ carInfo.model }}</div>
          </div>
          <div>
            <span class="text-gray-600 dark:text-gray-400">Year:</span>
            <div class="font-medium">{{ carInfo.year }}</div>
          </div>
          <div v-if="carInfo.vin">
            <span class="text-gray-600 dark:text-gray-400">VIN:</span>
            <div class="font-medium text-xs">{{ carInfo.vin }}</div>
          </div>
        </div>
      </UCard>

      <!-- Error Card for Car Data -->
      <UCard
        v-else-if="carError || (carData && 'error' in carData)"
        class="mb-8">
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon
              name="i-heroicons-exclamation-triangle"
              class="w-5 h-5 text-error-600 dark:text-error-400" />
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              Vehicle Not Found
            </h2>
          </div>
        </template>

        <div class="text-center py-4">
          <p class="text-gray-600 dark:text-gray-400">
            Unable to load vehicle information for ID: {{ id }}
          </p>
          <p class="text-sm text-error-600 dark:text-error-400 mt-2">
            {{
              carError ||
              (carData && "error" in carData ? carData.error : "Unknown error")
            }}
          </p>
        </div>
      </UCard>

      <!-- Estimate Form -->
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon
              name="i-heroicons-clipboard-document-list"
              class="w-5 h-5 text-primary-600 dark:text-primary-400" />
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              Estimate Details
            </h2>
          </div>
        </template>

        <UForm
          :schema="estimateSchema"
          :state="formState"
          @submit="addEstimate"
          class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <UFormGroup label="Service Date" name="date" required>
              <UInput
                v-model="formState.date"
                type="date"
                :disabled="isSubmitting" />
            </UFormGroup>

            <UFormGroup label="Estimated Hours" name="hours_taken" required>
              <UInput
                v-model.number="formState.hours_taken"
                type="number"
                step="0.5"
                min="0"
                placeholder="0.0"
                :disabled="isSubmitting" />
            </UFormGroup>

            <UFormGroup label="Vehicle Mileage" name="miles" required>
              <UInput
                v-model.number="formState.miles"
                type="number"
                min="0"
                placeholder="0"
                :disabled="isSubmitting" />
            </UFormGroup>
          </div>

          <UFormGroup label="Service Type" name="estimate_type" required>
            <USelect
              v-model="formState.estimate_type"
              :items="estimateTypeOptions"
              placeholder="Select service type"
              :disabled="isSubmitting" />
          </UFormGroup>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UFormGroup label="Private Notes" name="private_notes">
              <UTextarea
                v-model="formState.private_notes"
                placeholder="Internal notes (not visible to customer)"
                :rows="4"
                :disabled="isSubmitting" />
              <template #help>
                <span class="text-sm text-gray-500">
                  These notes are for internal use and won't be shown to the
                  customer
                </span>
              </template>
            </UFormGroup>

            <UFormGroup label="Public Notes" name="public_notes">
              <UTextarea
                v-model="formState.public_notes"
                placeholder="Customer-visible notes and comments"
                :rows="4"
                :disabled="isSubmitting" />
              <template #help>
                <span class="text-sm text-gray-500">
                  These notes will be visible to the customer on their estimate
                </span>
              </template>
            </UFormGroup>
          </div>

          <!-- Summary Card -->
          <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Estimate Summary
            </h3>
            <div class="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span class="text-gray-600 dark:text-gray-400"
                  >Service Date:</span
                >
                <div class="font-medium">{{ formState.date || "Not set" }}</div>
              </div>
              <div>
                <span class="text-gray-600 dark:text-gray-400"
                  >Estimated Hours:</span
                >
                <div class="font-medium">{{ formState.hours_taken || 0 }}</div>
              </div>
              <div>
                <span class="text-gray-600 dark:text-gray-400"
                  >Service Type:</span
                >
                <div class="font-medium">{{
                  formState.estimate_type || "Not selected"
                }}</div>
              </div>
            </div>
          </div>

          <div class="flex gap-3 pt-6">
            <UButton
              color="neutral"
              variant="outline"
              block
              @click="router.back()"
              :disabled="isSubmitting">
              Cancel
            </UButton>
            <UButton
              type="submit"
              @click="addEstimate"
              color="primary"
              block
              :loading="isSubmitting"
              :disabled="isSubmitting">
              Create Estimate
            </UButton>
          </div>
        </UForm>
      </UCard>

      <!-- Next Steps Info -->
      <div class="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <div class="flex items-start gap-3">
          <UIcon
            name="i-heroicons-information-circle"
            class="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div class="text-sm">
            <h4 class="font-medium text-blue-900 dark:text-blue-100 mb-1"
              >Next Steps</h4
            >
            <p class="text-blue-700 dark:text-blue-200">
              After creating the estimate, you'll be able to add labor charges,
              parts, and oil/fluids to complete the estimate.
            </p>
          </div>
        </div>
      </div>

      <!-- Debug Test - This should render at the bottom -->
      <div
        class="mt-8 p-4 bg-green-100 dark:bg-green-900/20 rounded-lg border-2 border-green-500">
        <p class="text-green-800 dark:text-green-200 font-bold text-center">
          🎯 DEBUG: If you can see this, the entire page is loading correctly!
        </p>
        <p class="text-center text-sm mt-2">Car ID: {{ id }}</p>
        <p class="text-center text-sm">Car Data Valid: {{ isCarDataValid }}</p>
      </div>
    </div>
  </UContainer>
</template>
