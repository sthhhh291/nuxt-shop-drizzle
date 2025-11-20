<script setup lang="ts">
import type { Phone } from "~~/db/schema";
import { z } from "zod";

const { id } = useRoute().params;
const router = useRouter();
const toast = useToast();

const phone = await useFetch(`/api/phones/${id}`, {
  method: "GET",
});

const phoneData = computed(() => {
  return phone.data.value && "phone" in phone.data.value ?
      (phone.data.value.phone as Phone)
    : null;
});

const isSubmitting = ref(false);

const phoneSchema = z.object({
  phone_number: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be less than 15 digits"),
  phone_type: z.enum(["Cell", "Home", "Work"], {
    required_error: "Please select a phone type",
  }),
});

const formState = reactive({
  phone_number: phoneData.value?.phone_number || "",
  phone_type:
    (phoneData.value?.phone_type as "Cell" | "Home" | "Work") || "Cell",
});

// Update form state when phoneData changes
watch(
  phoneData,
  (newPhoneData) => {
    if (newPhoneData) {
      formState.phone_number = newPhoneData.phone_number;
      formState.phone_type = newPhoneData.phone_type as
        | "Cell"
        | "Home"
        | "Work";
    }
  },
  { immediate: true }
);

const phoneTypeOptions = ["Cell", "Home", "Work"];

const updatePhone = async () => {
  if (!phoneData.value) return;

  try {
    isSubmitting.value = true;

    const validatedData = phoneSchema.parse({
      phone_number: formState.phone_number,
      phone_type: formState.phone_type,
    });

    await $fetch(`/api/phones/${id}`, {
      method: "PUT",
      body: {
        ...phoneData.value,
        ...validatedData,
      },
    });

    toast.add({
      title: "Success!",
      description: "Phone number updated successfully",
      color: "success",
    });

    router.push(`/customers/${phoneData.value.customer_id}`);
  } catch (error) {
    console.error("Failed to update phone:", error);
    toast.add({
      title: "Error",
      description:
        error instanceof Error ?
          error.message
        : "Failed to update phone number",
      color: "error",
    });
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <UContainer class="py-8">
    <div class="max-w-md mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center gap-4 mb-4">
          <UButton
            variant="ghost"
            icon="i-heroicons-arrow-left"
            @click="router.push(`/customers/${phoneData?.customer_id}`)">
            Back to Customer
          </UButton>
        </div>

        <div class="text-center">
          <div
            class="w-16 h-16 mx-auto mb-4 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
            <UIcon
              name="i-heroicons-phone"
              class="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </div>

          <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Edit Phone Number
          </h1>
          <p class="text-gray-600 dark:text-gray-400">
            Update phone number: {{ phoneData?.phone_number }}
          </p>
        </div>
      </div>

      <!-- Form -->
      <UCard v-if="phoneData">
        <UForm
          :schema="phoneSchema"
          :state="formState"
          @submit="updatePhone"
          class="space-y-6">
          <UFormGroup label="Phone Number" name="phone_number" required>
            <UInput
              v-model="formState.phone_number"
              placeholder="Enter phone number"
              icon="i-heroicons-phone"
              size="lg"
              :disabled="isSubmitting" />
          </UFormGroup>

          <UFormGroup label="Phone Type" name="phone_type" required>
            <USelect
              v-model="formState.phone_type"
              :items="phoneTypeOptions"
              placeholder="Select phone type"
              size="lg"
              :disabled="isSubmitting" />
          </UFormGroup>

          <div class="flex gap-3 pt-4">
            <UButton
              color="neutral"
              variant="outline"
              block
              @click="router.push(`/customers/${phoneData.customer_id}`)"
              :disabled="isSubmitting">
              Cancel
            </UButton>
            <UButton
              type="submit"
              @click="updatePhone"
              color="primary"
              block
              :loading="isSubmitting"
              :disabled="isSubmitting">
              Update Phone Number
            </UButton>
          </div>
        </UForm>
      </UCard>

      <!-- Loading State -->
      <UCard v-else>
        <div class="text-center py-8">
          <UIcon
            name="i-heroicons-arrow-path"
            class="animate-spin text-3xl text-primary-600 dark:text-primary-400 mb-4" />
          <h3 class="text-lg font-semibold mb-2">Loading Phone Data</h3>
          <p class="text-gray-500 dark:text-gray-400">
            Please wait while we fetch the phone information...
          </p>
        </div>
      </UCard>
    </div>
  </UContainer>
</template>
