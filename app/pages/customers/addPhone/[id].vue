<script setup lang="ts">
import { z } from "zod";

const { id } = useRoute().params;
const router = useRouter();
const toast = useToast();

const phoneSchema = z.object({
  phone_number: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be less than 15 digits"),
  phone_type: z.enum(["Mobile", "Home", "Work"], {
    required_error: "Please select a phone type",
  }),
  customer_id: z.number().int(),
});

const formState = reactive({
  phone_number: "",
  phone_type: "",
});

const isSubmitting = ref(false);

const phoneTypeOptions = ["Mobile", "Home", "Work"];

const addPhone = async (event: any) => {
  try {
    isSubmitting.value = true;

    const validatedData = phoneSchema.parse({
      phone_number: formState.phone_number,
      phone_type: formState.phone_type,
      customer_id: Number(id),
    });

    const response = await $fetch(`/api/phones`, {
      method: "POST",
      body: validatedData,
    });

    console.log("Phone added:", response);

    toast.add({
      title: "Success!",
      description: "Phone number added successfully",
      color: "success",
    });

    router.push(`/customers/${id}`);
  } catch (error) {
    console.error("Error adding phone:", error);
    toast.add({
      title: "Error",
      description:
        error instanceof Error ? error.message : "Failed to add phone number",
      color: "red",
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
            @click="router.push(`/customers/${id}`)">
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
            Add Phone Number
          </h1>
          <p class="text-gray-600 dark:text-gray-400">
            Add a new phone number for customer ID: {{ id }}
          </p>
        </div>
      </div>

      <!-- Form -->
      <UCard>
        <UForm
          :schema="phoneSchema"
          :state="formState"
          @submit="addPhone"
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
              @click="router.push(`/customers/${id}`)"
              :disabled="isSubmitting">
              Cancel
            </UButton>
            <UButton
              type="submit"
              @click="addPhone"
              color="primary"
              block
              :loading="isSubmitting"
              :disabled="isSubmitting">
              Add Phone Number
            </UButton>
          </div>
        </UForm>
      </UCard>
    </div>
  </UContainer>
</template>
