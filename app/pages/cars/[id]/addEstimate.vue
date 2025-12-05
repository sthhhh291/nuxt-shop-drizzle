<script setup lang="ts">
import { couldStartTrivia, getModeForResolutionAtIndex } from "typescript";
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
  mfr_number: z.string().max(100).optional(),
  part_number: z.string().max(100).optional(),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  cost: z.number().min(0, "Cost must be 0 or greater"),
  list: z.number().min(0, "List price must be 0 or greater"),
  unit_price: z.number().min(0, "Unit price must be 0 or greater"),
});

//oil/fluids form schema
const oilFluidsSchema = z.object({
  estimate_id: z.number().min(1, "Estimate ID is required"),
  type: z.string().min(1, "Oil/Fluid type is required").max(255),
  mfr_number: z.string().max(100).optional(),
  part_number: z.string().max(100).optional(),
  quantity: z.number().min(0.1, "Quantity must be at least 0.1"),
  cost: z.number().min(0, "Cost must be 0 or greater"),
  list: z.number().min(0, "List price must be 0 or greater"),
  price_per_unit: z.number().min(0, "Price per unit must be 0 or greater"),
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

const laborFormState = reactive({
  description: "",
  hours: 0,
  rate: 0,
});

const partsFormState = reactive({
  description: "",
  mfr_number: "",
  part_number: "",
  quantity: 1,
  cost: 0,
  list: 0,
  unit_price: 0,
});

const oilFluidsFormState = reactive({
  type: "",
  mfr_number: "",
  part_number: "",
  quantity: 0,
  cost: 0,
  list: 0,
  price_per_unit: 0,
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

    // Validate form data
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

    //submit estimate data
    const response = await $fetch(`/api/estimates`, {
      method: "POST",
      body: validatedData,
    });

    console.log("Estimate added:", response);

    const estimate_id =
      response && typeof response === "object" && "id" in response ?
        response.id
      : null;
    //submit labor, parts, and oil/fluids items if estimate_id is valid
    formState.labor_items.forEach(async (laborItem) => {
      const laborData = laborSchema.parse({
        estimate_id: estimate_id,
        description: laborItem.description,
        hours: laborItem.hours,
        rate: laborItem.rate,
      });

      await $fetch(`/api/labor`, {
        method: "POST",
        body: laborData,
      });
    });

    formState.parts_items.forEach(async (partItem) => {
      const partsData = partsSchema.parse({
        estimate_id: estimate_id,
        description: partItem.description,
        mfr_number: partItem.mfr_number,
        part_number: partItem.part_number,
        quantity: partItem.quantity,
        cost: partItem.cost,
        list: partItem.list,
        unit_price: partItem.unit_price,
      });

      await $fetch(`/api/parts`, {
        method: "POST",
        body: partsData,
      });
    });

    formState.oil_fluids_items.forEach(async (oilFluidItem) => {
      const oilFluidsData = oilFluidsSchema.parse({
        estimate_id: estimate_id,
        type: oilFluidItem.type,
        mfr_number: oilFluidItem.mfr_number || "",
        part_number: oilFluidItem.part_number || "",
        quantity: oilFluidItem.quantity,
        cost: oilFluidItem.cost,
        list: oilFluidItem.list,
        price_per_unit: oilFluidItem.unit_price,
      });

      await $fetch(`/api/oil`, {
        method: "POST",
        body: oilFluidsData,
      });
    });

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

      <!-- Labor Items Section -->
      <UCard class="mt-8">
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon
              name="i-heroicons-wrench-screwdriver"
              class="w-5 h-5 text-primary-600 dark:text-primary-400" />
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              Labor Items
            </h2>
          </div>
        </template>

        <div class="space-y-6">
          <!-- Add Labor Form -->
          <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-4">
              Add Labor Item
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div class="md:col-span-2">
                <UInput
                  type="text"
                  placeholder="Labor description"
                  v-model="laborFormState.description" />
              </div>
              <div>
                <UInput
                  type="number"
                  placeholder="Hours"
                  step="0.1"
                  v-model.number="laborFormState.hours" />
              </div>
              <div>
                <UInput
                  type="number"
                  placeholder="Rate ($)"
                  step="0.01"
                  v-model.number="laborFormState.rate" />
              </div>
            </div>
            <div class="mt-4">
              <UButton
                @click="
                  formState.labor_items.push({ ...laborFormState });
                  laborFormState.description = '';
                  laborFormState.hours = 0;
                  laborFormState.rate = 0;
                "
                :disabled="
                  !laborFormState.description ||
                  !laborFormState.hours ||
                  !laborFormState.rate
                "
                size="sm">
                <UIcon name="i-heroicons-plus" class="w-4 h-4 mr-2" />
                Add Labor Item
              </UButton>
            </div>
          </div>

          <!-- Labor Items List -->
          <div v-if="formState.labor_items.length > 0">
            <div class="space-y-2">
              <div
                v-for="(item, index) in formState.labor_items"
                :key="'labor-' + index"
                class="flex items-center justify-between p-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div class="flex-1">
                  <div class="font-medium text-gray-900 dark:text-white">
                    {{ item.description }}
                  </div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">
                    {{ item.hours }} hours @ ${{ item.rate }}/hr = ${{
                      (item.hours * item.rate).toFixed(2)
                    }}
                  </div>
                </div>
                <UButton
                  @click="formState.labor_items.splice(index, 1)"
                  color="red"
                  variant="ghost"
                  size="sm"
                  icon="i-heroicons-trash" />
              </div>
            </div>
          </div>
          <div v-else class="text-center py-8 text-gray-500 dark:text-gray-400">
            <UIcon
              name="i-heroicons-wrench-screwdriver"
              class="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No labor items added yet</p>
          </div>
        </div>
      </UCard>

      <!-- Parts Items Section -->
      <UCard class="mt-8">
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon
              name="i-heroicons-cog-6-tooth"
              class="w-5 h-5 text-primary-600 dark:text-primary-400" />
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              Parts Items
            </h2>
          </div>
        </template>

        <div class="space-y-6">
          <!-- Add Parts Form -->
          <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-4">
              Add Parts Item
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <UInput
                type="text"
                placeholder="Part description"
                v-model="partsFormState.description" />
              <UInput
                type="text"
                placeholder="Manufacturer number"
                v-model="partsFormState.mfr_number" />
              <UInput
                type="text"
                placeholder="Part number"
                v-model="partsFormState.part_number" />
              <UInput
                type="number"
                placeholder="Quantity"
                min="1"
                v-model.number="partsFormState.quantity" />
              <UInput
                type="number"
                placeholder="Cost ($)"
                step="0.01"
                v-model.number="partsFormState.cost" />
              <UInput
                type="number"
                placeholder="List price ($)"
                step="0.01"
                v-model.number="partsFormState.list" />
              <UInput
                type="number"
                placeholder="Unit price ($)"
                step="0.01"
                v-model.number="partsFormState.unit_price" />
            </div>
            <div class="mt-4">
              <UButton
                @click="
                  formState.parts_items.push({ ...partsFormState });
                  partsFormState.description = '';
                  partsFormState.mfr_number = '';
                  partsFormState.part_number = '';
                  partsFormState.quantity = 1;
                  partsFormState.cost = 0;
                  partsFormState.list = 0;
                  partsFormState.unit_price = 0;
                "
                :disabled="
                  !partsFormState.description || !partsFormState.quantity
                "
                size="sm">
                <UIcon name="i-heroicons-plus" class="w-4 h-4 mr-2" />
                Add Parts Item
              </UButton>
            </div>
          </div>

          <!-- Parts Items List -->
          <div v-if="formState.parts_items.length > 0">
            <div class="space-y-2">
              <div
                v-for="(item, index) in formState.parts_items"
                :key="'parts-' + index"
                class="flex items-center justify-between p-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div class="flex-1">
                  <div class="font-medium text-gray-900 dark:text-white">
                    {{ item.description }}
                  </div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">
                    Qty: {{ item.quantity }} @ ${{ item.unit_price }} = ${{
                      (item.quantity * item.unit_price).toFixed(2)
                    }}
                  </div>
                  <div
                    v-if="item.mfr_number || item.part_number"
                    class="text-xs text-gray-500 dark:text-gray-500">
                    <span v-if="item.mfr_number"
                      >MFR: {{ item.mfr_number }}</span
                    >
                    <span v-if="item.mfr_number && item.part_number"> | </span>
                    <span v-if="item.part_number"
                      >Part #: {{ item.part_number }}</span
                    >
                  </div>
                </div>
                <UButton
                  @click="formState.parts_items.splice(index, 1)"
                  color="red"
                  variant="ghost"
                  size="sm"
                  icon="i-heroicons-trash" />
              </div>
            </div>
          </div>
          <div v-else class="text-center py-8 text-gray-500 dark:text-gray-400">
            <UIcon
              name="i-heroicons-cog-6-tooth"
              class="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No parts items added yet</p>
          </div>
        </div>
      </UCard>

      <!-- Oil/Fluids Items Section -->
      <UCard class="mt-8">
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon
              name="i-heroicons-beaker"
              class="w-5 h-5 text-primary-600 dark:text-primary-400" />
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              Oil/Fluids Items
            </h2>
          </div>
        </template>

        <div class="space-y-6">
          <!-- Add Oil/Fluids Form -->
          <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-4">
              Add Oil/Fluid Item
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <UInput
                type="text"
                placeholder="Oil/Fluid type"
                v-model="oilFluidsFormState.type" />
              <UInput
                type="number"
                placeholder="Quantity"
                step="0.1"
                v-model.number="oilFluidsFormState.quantity" />
              <UInput
                type="number"
                placeholder="List price ($)"
                step="0.01"
                v-model.number="oilFluidsFormState.list" />
              <UInput
                type="number"
                placeholder="Unit price ($)"
                step="0.01"
                v-model.number="oilFluidsFormState.unit_price" />
            </div>
            <div class="mt-4">
              <UButton
                @click="
                  formState.oil_fluids_items.push({ ...oilFluidsFormState });
                  oilFluidsFormState.type = '';
                  oilFluidsFormState.quantity = 0;
                  oilFluidsFormState.list = 0;
                  oilFluidsFormState.unit_price = 0;
                "
                :disabled="
                  !oilFluidsFormState.type || !oilFluidsFormState.quantity
                "
                size="sm">
                <UIcon name="i-heroicons-plus" class="w-4 h-4 mr-2" />
                Add Oil/Fluid Item
              </UButton>
            </div>
          </div>

          <!-- Oil/Fluids Items List -->
          <div v-if="formState.oil_fluids_items.length > 0">
            <div class="space-y-2">
              <div
                v-for="(item, index) in formState.oil_fluids_items"
                :key="'oilfluids-' + index"
                class="flex items-center justify-between p-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div class="flex-1">
                  <div class="font-medium text-gray-900 dark:text-white">
                    {{ item.type }}
                  </div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">
                    Qty: {{ item.quantity }} @ ${{ item.unit_price }} = ${{
                      (item.quantity * item.unit_price).toFixed(2)
                    }}
                  </div>
                </div>
                <UButton
                  @click="formState.oil_fluids_items.splice(index, 1)"
                  color="red"
                  variant="ghost"
                  size="sm"
                  icon="i-heroicons-trash" />
              </div>
            </div>
          </div>
          <div v-else class="text-center py-8 text-gray-500 dark:text-gray-400">
            <UIcon
              name="i-heroicons-beaker"
              class="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No oil/fluid items added yet</p>
          </div>
        </div>
      </UCard>

      <!-- Final Actions Card -->
      <UCard class="mt-8">
        <div class="flex gap-3">
          <UButton
            color="neutral"
            variant="outline"
            block
            @click="router.back()"
            :disabled="isSubmitting">
            Cancel
          </UButton>
          <UButton
            @click="addEstimate"
            color="primary"
            block
            :loading="isSubmitting"
            :disabled="isSubmitting">
            Create Complete Estimate
          </UButton>
        </div>
      </UCard>
    </div>
  </UContainer>
</template>
