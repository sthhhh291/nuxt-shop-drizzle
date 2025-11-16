<script setup lang="ts">
import { z } from "zod";

const { id } = useRoute().params;
const router = useRouter();
const toast = useToast();

const addressSchema = z.object({
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip_code: z.string().min(1, "Zip Code is required"),
  address_type: z.enum(["home", "work", "billing", "shipping"]),
  customer_id: z.number().int(),
});

const formState = reactive({
  street: "",
  city: "",
  state: "",
  zip_code: "",
  address_type: "home",
});

const isSubmitting = ref(false);

const addressTypeOptions = [
  { label: "Home", value: "home" },
  { label: "Work", value: "work" },
  { label: "Billing", value: "billing" },
  { label: "Shipping", value: "shipping" },
];

const addAddress = async (event: any) => {
  try {
    isSubmitting.value = true;

    const validatedData = addressSchema.parse({
      street: formState.street,
      city: formState.city,
      state: formState.state,
      zip_code: formState.zip_code,
      address_type: formState.address_type,
      customer_id: Number(id),
    });

    const response = await $fetch(`/api/addresses`, {
      method: "POST",
      body: validatedData,
    });

    console.log("Address added:", response);

    toast.add({
      title: "Success!",
      description: "Address added successfully",
      color: "success",
    });

    router.push(`/customers/${id}`);
  } catch (error) {
    console.error("Error adding address:", error);
    toast.add({
      title: "Error",
      description:
        error instanceof Error ? error.message : "Failed to add address",
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
              name="i-heroicons-home"
              class="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </div>

          <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Add Address
          </h1>
          <p class="text-gray-600 dark:text-gray-400">
            Add a new address for customer ID: {{ id }}
          </p>
        </div>
      </div>

      <!-- Form -->
      <UCard>
        <UForm
          :schema="addressSchema"
          :state="formState"
          @submit="addAddress"
          class="space-y-6">
          <UFormGroup label="Street Address" name="street" required>
            <UInput
              v-model="formState.street"
              placeholder="Enter street address"
              icon="i-heroicons-home"
              size="lg"
              :disabled="isSubmitting" />
          </UFormGroup>

          <div class="grid grid-cols-2 gap-4">
            <UFormGroup label="City" name="city" required>
              <UInput
                v-model="formState.city"
                placeholder="Enter city"
                icon="i-heroicons-building-office"
                size="lg"
                :disabled="isSubmitting" />
            </UFormGroup>

            <UFormGroup label="State" name="state" required>
              <UInput
                v-model="formState.state"
                placeholder="Enter state"
                icon="i-heroicons-flag"
                size="lg"
                :disabled="isSubmitting" />
            </UFormGroup>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <UFormGroup label="Zip Code" name="zip_code" required>
              <UInput
                v-model="formState.zip_code"
                placeholder="Enter zip code"
                icon="i-heroicons-hashtag"
                size="lg"
                :disabled="isSubmitting" />
            </UFormGroup>

            <UFormGroup label="Address Type" name="address_type" required>
              <USelect
                v-model="formState.address_type"
                :items="addressTypeOptions"
                placeholder="Select address type"
                size="lg"
                :disabled="isSubmitting" />
            </UFormGroup>
          </div>

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
              @click="addAddress"
              color="primary"
              block
              :loading="isSubmitting"
              :disabled="isSubmitting">
              Add Address
            </UButton>
          </div>
        </UForm>
      </UCard>
    </div>
  </UContainer>
</template>
