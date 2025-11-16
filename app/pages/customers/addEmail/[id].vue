<script setup lang="ts">
import { z } from "zod";

const { id } = useRoute().params;
const router = useRouter();
const toast = useToast();

const emailSchema = z.object({
  email_address: z.string().min(1, "Email is required").email("Invalid email"),
  email_type: z.enum(["personal", "work"]),
  customer_id: z.number().int(),
});

const formState = reactive({
  email_address: "",
  email_type: "personal",
});

const isSubmitting = ref(false);

const emailTypeOptions = [
  { label: "Personal", value: "personal" },
  { label: "Work", value: "work" },
];

const addEmail = async (event: any) => {
  try {
    isSubmitting.value = true;

    const validatedData = emailSchema.parse({
      email_address: formState.email_address,
      email_type: formState.email_type,
      customer_id: Number(id),
    });

    const response = await $fetch(`/api/emails`, {
      method: "POST",
      body: validatedData,
    });

    console.log("Email added:", response);

    toast.add({
      title: "Success!",
      description: "Email address added successfully",
      color: "green",
    });

    router.push(`/customers/${id}`);
  } catch (error) {
    console.error("Error adding email:", error);
    toast.add({
      title: "Error",
      description:
        error instanceof Error ? error.message : "Failed to add email address",
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
              name="i-heroicons-envelope"
              class="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </div>

          <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Add Email Address
          </h1>
          <p class="text-gray-600 dark:text-gray-400">
            Add a new email address for customer ID: {{ id }}
          </p>
        </div>
      </div>

      <!-- Form -->
      <UCard>
        <UForm
          :schema="emailSchema"
          :state="formState"
          @submit="addEmail"
          class="space-y-6">
          <UFormGroup label="Email Address" name="email_address" required>
            <UInput
              v-model="formState.email_address"
              type="email"
              placeholder="Enter email address"
              icon="i-heroicons-envelope"
              size="lg"
              :disabled="isSubmitting" />
          </UFormGroup>

          <UFormGroup label="Email Type" name="email_type" required>
            <USelect
              v-model="formState.email_type"
              :items="emailTypeOptions"
              placeholder="Select email type"
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
              @click="addEmail"
              color="primary"
              block
              :loading="isSubmitting"
              :disabled="isSubmitting">
              Add Email Address
            </UButton>
          </div>
        </UForm>
      </UCard>
    </div>
  </UContainer>
</template>
