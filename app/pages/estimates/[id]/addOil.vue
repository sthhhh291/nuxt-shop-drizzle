<script setup lang="ts">
import { form } from "#build/ui";
import { z } from "zod";

const { id } = useRoute().params;
const router = useRouter();
const toast = useToast();

const oilSchema = z.object({
  type: z.string().min(1, "Oil type is required").max(255),
  mfr_number: z.string().optional(),
  part_number: z.string().optional(),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  cost: z.number().min(0, "Cost must be valid"),
  list: z.number().min(0, "List price must be valid"),
  price_per_unit: z.number().min(0, "Price per unit must be valid"),
  estimate_id: z.number().min(1),
});

const formState = reactive({
  type: "",
  quantity: 1,
  mfr_number: "",
  part_number: "",
  cost: 0,
  list: 0,
  price_per_unit: 0,
});

const isSubmitting = ref(false);

const oilTypeOptions = [
  { label: "5W-30 Conventional", value: "5W-30 Conventional" },
  { label: "5W-30 Synthetic", value: "5W-30 Synthetic" },
  { label: "5W-20 Conventional", value: "5W-20 Conventional" },
  { label: "5W-20 Synthetic", value: "5W-20 Synthetic" },
  { label: "0W-20 Synthetic", value: "0W-20 Synthetic" },
  { label: "10W-30 Conventional", value: "10W-30 Conventional" },
  { label: "10W-40 Conventional", value: "10W-40 Conventional" },
  { label: "15W-40 Diesel", value: "15W-40 Diesel" },
  { label: "Mercon V ATF", value: "Mercon V ATF" },
  { label: "Dexron VI ATF", value: "Dexron VI ATF" },
  { label: "DOT 3 Brake Fluid", value: "DOT 3 Brake Fluid" },
  { label: "DOT 4 Brake Fluid", value: "DOT 4 Brake Fluid" },
  { label: "Power Steering Fluid", value: "Power Steering Fluid" },
  { label: "Coolant/Antifreeze", value: "Coolant/Antifreeze" },
  { label: "Gear Oil", value: "Gear Oil" },
  { label: "Hydraulic Fluid", value: "Hydraulic Fluid" },
  { label: "Transmission Fluid", value: "Transmission Fluid" },
  { label: "Other", value: "Other" },
];

const calcPrice = () => {
  const markup = formState.cost * 1.86;
  formState.price_per_unit =
    markup > formState.list && formState.list > 0 ?
      formState.list
    : parseFloat(markup.toFixed(2));
};

// Watch for changes in cost, list, or quantity to automatically calculate price
watch(
  [() => formState.cost, () => formState.list, () => formState.quantity],
  () => {
    calcPrice();
  }
);

const submitOil = async (event: any) => {
  try {
    isSubmitting.value = true;

    const validatedData = oilSchema.parse({
      type: formState.type,
      quantity: Number(formState.quantity),
      mfr_number: formState.mfr_number || "",
      part_number: formState.part_number || "",
      cost: Number(formState.cost),
      list: Number(formState.list),
      price_per_unit: Number(formState.price_per_unit),
      estimate_id: Number(id),
    });

    await $fetch(`/api/oil`, {
      method: "POST",
      body: validatedData,
    });

    toast.add({
      title: "Success!",
      description: "Oil/fluid added to estimate",
      color: "success",
    });

    router.push(`/estimates/${id}`);
  } catch (error) {
    console.error("Error adding oil:", error);
    toast.add({
      title: "Error",
      description:
        error instanceof Error ? error.message : "Failed to add oil/fluid",
      color: "warning",
    });
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <UContainer class="py-8">
    <div class="max-w-4xl mx-auto">
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
              name="i-heroicons-beaker"
              class="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </div>

          <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Add Oil & Fluids
          </h1>
          <p class="text-gray-600 dark:text-gray-400">
            Add oil or fluids to estimate #{{ id }}
          </p>
        </div>
      </div>

      <!-- Form -->
      <UCard>
        <UForm
          :schema="oilSchema"
          :state="formState"
          @submit="submitOil"
          class="space-y-6">
          <UFormGroup label="Oil/Fluid Type" name="type" required>
            <USelect
              v-model="formState.type"
              :items="oilTypeOptions"
              placeholder="Select oil/fluid type"
              searchable
              size="lg"
              :disabled="isSubmitting" />
          </UFormGroup>

          <div class="grid grid-cols-2 gap-4">
            <UFormGroup label="Manufacturer Number" name="mfr_number">
              <UInput
                v-model="formState.mfr_number"
                placeholder="MFR part number"
                icon="i-heroicons-hashtag"
                size="lg"
                :disabled="isSubmitting" />
            </UFormGroup>

            <UFormGroup label="Part Number" name="part_number">
              <UInput
                v-model="formState.part_number"
                placeholder="Internal part number"
                icon="i-heroicons-qr-code"
                size="lg"
                :disabled="isSubmitting" />
            </UFormGroup>
          </div>

          <div class="grid grid-cols-3 gap-4">
            <UFormGroup label="Quantity (Quarts)" name="quantity" required>
              <UInput
                v-model.number="formState.quantity"
                type="number"
                min="1"
                placeholder="1"
                icon="i-heroicons-beaker"
                size="lg"
                :disabled="isSubmitting" />
            </UFormGroup>

            <UFormGroup label="Cost per Unit ($)" name="cost" required>
              <UInput
                v-model.number="formState.cost"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                icon="i-heroicons-currency-dollar"
                size="lg"
                :disabled="isSubmitting" />
            </UFormGroup>

            <UFormGroup label="List Price ($)" name="list">
              <UInput
                v-model.number="formState.list"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                icon="i-heroicons-tag"
                size="lg"
                :disabled="isSubmitting" />
            </UFormGroup>
          </div>

          <UFormGroup label="Price per Unit ($)" name="price_per_unit" required>
            <UInput
              v-model.number="formState.price_per_unit"
              type="number"
              step="0.01"
              min="0"
              icon="i-heroicons-calculator"
              size="lg"
              class="bg-gray-50 dark:bg-gray-800"
              :disabled="isSubmitting" />
            <template #help>
              <span class="text-sm text-gray-500">
                Automatically calculated with 86% markup (cost × 1.86 or list
                price, whichever is lower)
              </span>
            </template>
          </UFormGroup>

          <!-- Pricing Summary -->
          <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Pricing Summary
            </h3>
            <div class="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span class="text-gray-600 dark:text-gray-400"
                  >Total Cost:</span
                >
                <div class="font-medium"
                  >${{ (formState.cost * formState.quantity).toFixed(2) }}</div
                >
              </div>
              <div>
                <span class="text-gray-600 dark:text-gray-400"
                  >Unit Markup:</span
                >
                <div class="font-medium"
                  >{{
                    formState.cost > 0 ?
                      Math.round(
                        ((formState.price_per_unit - formState.cost) /
                          formState.cost) *
                          100
                      )
                    : 0
                  }}%</div
                >
              </div>
              <div>
                <span class="text-gray-600 dark:text-gray-400"
                  >Total Price:</span
                >
                <div class="font-medium text-lg text-primary-600"
                  >${{
                    (formState.price_per_unit * formState.quantity).toFixed(2)
                  }}</div
                >
              </div>
            </div>
          </div>

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
              @click="submitOil"
              color="primary"
              block
              :loading="isSubmitting"
              :disabled="isSubmitting">
              Add Oil/Fluid
            </UButton>
          </div>
        </UForm>
      </UCard>
    </div>
  </UContainer>
</template>
