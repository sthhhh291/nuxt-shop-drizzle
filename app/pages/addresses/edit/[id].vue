<script setup lang="ts">
import type { Address } from "~~/db/schema";
import { z } from "zod";

const { id } = useRoute().params;
const router = useRouter();
const toast = useToast();

const { data: address } = await useFetch(`/api/addresses/${id}`, {
  method: "GET",
});

const addressSchema = z.object({
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip_code: z.string().min(1, "Zip Code is required"),
  address_type: z.enum(["home", "work", "billing", "shipping"]),
});

const isSubmitting = ref(false);
const isLoading = computed(() => !address.value);

const addressTypeOptions = [
  { label: "Home", value: "home" },
  { label: "Work", value: "work" },
  { label: "Billing", value: "billing" },
  { label: "Shipping", value: "shipping" },
];

const updateAddress = async (event: any) => {
  if (!address.value) return;

  try {
    isSubmitting.value = true;

    const validatedData = addressSchema.parse({
      street: address.value.street,
      city: address.value.city,
      state: address.value.state,
      zip_code: address.value.zip_code,
      address_type: address.value.address_type,
    });

    await $fetch(`/api/addresses/${id}`, {
      method: "PUT",
      body: { ...address.value, ...validatedData },
    });

    toast.add({
      title: "Success!",
      description: "Address updated successfully",
      color: "success",
    });

    router.push(`/customers/${address.value.customer_id}`);
  } catch (error) {
    console.error("Failed to update address:", error);
    toast.add({
      title: "Error",
      description:
        error instanceof Error ? error.message : "Failed to update address",
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
        <p class="text-gray-600 dark:text-gray-400">Loading address data...</p>
      </div>

      <!-- Address Edit Form -->
      <div v-else-if="address">
        <!-- Header -->
        <div class="mb-8">
          <div class="flex items-center gap-4 mb-4">
            <UButton
              variant="ghost"
              icon="i-heroicons-arrow-left"
              @click="router.push(`/customers/${address.customer_id}`)">
              Back to Customer
            </UButton>
          </div>

          <div class="text-center">
            <div
              class="w-16 h-16 mx-auto mb-4 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
              <UIcon
                name="i-heroicons-pencil"
                class="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>

            <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Edit Address
            </h1>
            <p class="text-gray-600 dark:text-gray-400">
              Update address information
            </p>
          </div>
        </div>

        <!-- Form -->
        <UCard>
          <UForm
            :schema="addressSchema"
            :state="address"
            @submit="updateAddress"
            class="space-y-6">
            <UFormGroup label="Street Address" name="street" required>
              <UInput
                v-model="address.street"
                placeholder="Enter street address"
                icon="i-heroicons-home"
                size="lg"
                :disabled="isSubmitting" />
            </UFormGroup>

            <div class="grid grid-cols-2 gap-4">
              <UFormGroup label="City" name="city" required>
                <UInput
                  v-model="address.city"
                  placeholder="Enter city"
                  icon="i-heroicons-building-office"
                  size="lg"
                  :disabled="isSubmitting" />
              </UFormGroup>

              <UFormGroup label="State" name="state" required>
                <UInput
                  v-model="address.state"
                  placeholder="Enter state"
                  icon="i-heroicons-flag"
                  size="lg"
                  :disabled="isSubmitting" />
              </UFormGroup>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <UFormGroup label="Zip Code" name="zip_code" required>
                <UInput
                  v-model="address.zip_code"
                  placeholder="Enter zip code"
                  icon="i-heroicons-hashtag"
                  size="lg"
                  :disabled="isSubmitting" />
              </UFormGroup>

              <UFormGroup label="Address Type" name="address_type" required>
                <USelect
                  v-model="address.address_type"
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
                @click="router.push(`/customers/${address.customer_id}`)"
                :disabled="isSubmitting">
                Cancel
              </UButton>
              <UButton
                type="submit"
                color="primary"
                block
                :loading="isSubmitting"
                :disabled="isSubmitting">
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
          >Address Not Found</h3
        >
        <p class="text-gray-600 dark:text-gray-400 mb-6"
          >The address you're looking for doesn't exist or has been deleted.</p
        >
        <UButton @click="router.push('/customers')" variant="outline"
          >Back to Customers</UButton
        >
      </div>
    </div>
  </UContainer>
</template>
