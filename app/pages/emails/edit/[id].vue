<script setup lang="ts">
import type { Email } from "~~/db/schema";
import { z } from "zod";

const { id } = useRoute().params;
const router = useRouter();
const toast = useToast();

const { data: email } = await useFetch<Email>(`/api/emails/${id}`, {
  method: "GET",
});

const emailSchema = z.object({
  email_address: z.string().email("Please enter a valid email address"),
  email_type: z.enum(["personal", "work"], {
    required_error: "Please select an email type",
  }),
});

const isSubmitting = ref(false);
const isLoading = computed(() => !email.value);

const emailTypeOptions = [
  { label: "Personal", value: "personal" },
  { label: "Work", value: "work" },
];

const updateEmail = async (event: any) => {
  if (!email.value) return;

  try {
    isSubmitting.value = true;

    const validatedData = emailSchema.parse({
      email_address: email.value.email_address,
      email_type: email.value.email_type,
    });

    await $fetch(`/api/emails/${id}`, {
      method: "PUT",
      body: { ...email.value, ...validatedData },
    });

    toast.add({
      title: "Success!",
      description: "Email updated successfully",
      color: "success",
    });

    router.push(`/customers/${email.value.customer_id}`);
  } catch (error) {
    console.error("Failed to update email:", error);
    toast.add({
      title: "Error",
      description:
        error instanceof Error ? error.message : "Failed to update email",
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
        <p class="text-gray-600 dark:text-gray-400">Loading email data...</p>
      </div>

      <!-- Email Edit Form -->
      <div v-else-if="email">
        <!-- Header -->
        <div class="mb-8">
          <div class="flex items-center gap-4 mb-4">
            <UButton
              variant="ghost"
              icon="i-heroicons-arrow-left"
              @click="router.push(`/customers/${email.customer_id}`)">
              Back to Customer
            </UButton>
          </div>

          <div class="text-center">
            <div
              class="w-16 h-16 mx-auto mb-4 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
              <UIcon
                name="i-heroicons-at-symbol"
                class="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>

            <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Edit Email
            </h1>
            <p class="text-gray-600 dark:text-gray-400">
              Update email information
            </p>
          </div>
        </div>

        <!-- Form -->
        <UCard>
          <UForm
            :schema="emailSchema"
            :state="email"
            @submit="updateEmail"
            class="space-y-6">
            <UFormGroup label="Email Address" name="email_address" required>
              <UInput
                v-model="email.email_address"
                type="email"
                placeholder="Enter email address"
                icon="i-heroicons-at-symbol"
                size="lg"
                :disabled="isSubmitting" />
            </UFormGroup>

            <UFormGroup label="Email Type" name="email_type" required>
              <USelect
                v-model="email.email_type"
                :items="emailTypeOptions"
                placeholder="Select email type"
                size="lg"
                :disabled="isSubmitting">
                <template #leading>
                  <UIcon
                    :name="
                      email.email_type === 'work' ?
                        'i-heroicons-building-office'
                      : 'i-heroicons-home'
                    "
                    class="w-4 h-4" />
                </template>
              </USelect>
            </UFormGroup>

            <!-- Current Email Preview -->
            <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border">
              <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2"
                >Preview</h4
              >
              <div class="flex items-center gap-3">
                <div class="p-2 bg-white dark:bg-gray-700 rounded-lg border">
                  <UIcon
                    :name="
                      email.email_type === 'work' ?
                        'i-heroicons-building-office'
                      : 'i-heroicons-home'
                    "
                    class="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">{{
                    email.email_address
                  }}</p>
                  <p class="text-sm text-gray-600 dark:text-gray-400 capitalize"
                    >{{ email.email_type }} Email</p
                  >
                </div>
              </div>
            </div>

            <div
              class="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
              <UButton
                color="neutral"
                variant="outline"
                block
                size="lg"
                @click="router.push(`/customers/${email.customer_id}`)"
                :disabled="isSubmitting">
                <UIcon name="i-heroicons-x-mark" class="w-4 h-4 mr-2" />
                Cancel
              </UButton>
              <UButton
                type="submit"
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
          >Email Not Found</h3
        >
        <p class="text-gray-600 dark:text-gray-400 mb-6"
          >The email you're looking for doesn't exist or has been deleted.</p
        >
        <UButton @click="router.push('/customers')" variant="outline"
          >Back to Customers</UButton
        >
      </div>
    </div>
  </UContainer>
</template>
