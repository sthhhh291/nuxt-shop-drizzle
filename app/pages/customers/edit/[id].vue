<script setup lang="ts">
import { z } from "zod";
import type { customerWithRelations } from "~~/db/schema";

const { id } = useRoute().params;
const router = useRouter();
const toast = useToast();

const customerSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  notes: z.string().optional(),
});

const { data: customer, pending } = await useFetch(`/api/customers/${id}`, {
  method: "GET",
});

const customerData = computed(() => {
  return customer.value && "customer" in customer.value ?
      (customer.value.customer as customerWithRelations)
    : null;
});

const formState = reactive({
  first_name: "",
  last_name: "",
  notes: "",
});

const isSubmitting = ref(false);

// Initialize form state when customer data is loaded
watch(
  customerData,
  (newCustomerData) => {
    if (newCustomerData) {
      formState.first_name = newCustomerData.first_name || "";
      formState.last_name = newCustomerData.last_name || "";
      formState.notes = newCustomerData.notes || "";
    }
  },
  { immediate: true }
);

const updateCustomer = async (event: any) => {
  try {
    isSubmitting.value = true;

    const validatedData = customerSchema.parse({
      first_name: formState.first_name,
      last_name: formState.last_name,
      notes: formState.notes,
    });

    await $fetch(`/api/customers/${id}`, {
      method: "PUT",
      body: validatedData,
    });

    toast.add({
      title: "Success!",
      description: "Customer updated successfully",
      color: "green",
    });

    router.push(`/customers/${id}`);
  } catch (error) {
    console.error("Failed to update customer:", error);
    toast.add({
      title: "Error",
      description:
        error instanceof Error ? error.message : "Failed to update customer",
      color: "red",
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
      <div v-if="pending" class="text-center py-12">
        <div
          class="w-16 h-16 mx-auto mb-4 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
          <UIcon
            name="i-heroicons-arrow-path"
            class="w-8 h-8 text-primary-600 dark:text-primary-400 animate-spin" />
        </div>
        <p class="text-gray-600 dark:text-gray-400">Loading customer data...</p>
      </div>

      <!-- Main Content -->
      <div v-else-if="customerData">
        <!-- Header -->
        <div class="mb-8">
          <div class="flex items-center gap-4 mb-4">
            <UButton
              variant="ghost"
              icon="i-heroicons-arrow-left"
              @click="router.push(`/customers/${customerData.id}`)">
              Back to Customer
            </UButton>
          </div>

          <div class="flex items-center gap-4">
            <UAvatar
              :alt="`${customerData.first_name} ${customerData.last_name}`"
              size="xl"
              :ui="{ background: 'bg-primary-500 dark:bg-primary-400' }">
              <template #fallback>
                <span class="text-white font-medium text-xl">
                  {{ customerData.first_name?.charAt(0)
                  }}{{ customerData.last_name?.charAt(0) }}
                </span>
              </template>
            </UAvatar>

            <div>
              <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Edit Customer
              </h1>
              <p class="text-gray-600 dark:text-gray-400">
                Update information for {{ customerData.first_name }}
                {{ customerData.last_name }}
              </p>
            </div>
          </div>
        </div>

        <!-- Form -->
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon
                name="i-heroicons-user"
                class="w-5 h-5 text-primary-600 dark:text-primary-400" />
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                Customer Information
              </h2>
            </div>
          </template>

          <UForm
            :schema="customerSchema"
            :state="formState"
            @submit="updateCustomer"
            class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <UFormGroup label="First Name" name="first_name" required>
                <UInput
                  v-model="formState.first_name"
                  placeholder="Enter first name"
                  icon="i-heroicons-user"
                  size="lg"
                  :disabled="isSubmitting" />
              </UFormGroup>

              <UFormGroup label="Last Name" name="last_name" required>
                <UInput
                  v-model="formState.last_name"
                  placeholder="Enter last name"
                  icon="i-heroicons-user"
                  size="lg"
                  :disabled="isSubmitting" />
              </UFormGroup>
            </div>

            <UFormGroup label="Notes" name="notes">
              <UTextarea
                v-model="formState.notes"
                placeholder="Add any additional notes about this customer"
                :rows="6"
                :disabled="isSubmitting" />
              <template #help>
                <span class="text-sm text-gray-500">
                  Optional notes for internal reference
                </span>
              </template>
            </UFormGroup>

            <div class="flex gap-3 pt-6">
              <UButton
                color="neutral"
                variant="outline"
                block
                @click="router.push(`/customers/${customerData.id}`)"
                :disabled="isSubmitting">
                Cancel
              </UButton>
              <UButton
                type="submit"
                @click="updateCustomer"
                color="primary"
                block
                :loading="isSubmitting"
                :disabled="isSubmitting">
                Save Changes
              </UButton>
            </div>
          </UForm>
        </UCard>

        <!-- Quick Actions -->
        <div class="mt-8">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4"
            >Quick Actions</h3
          >
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <UButton
              variant="outline"
              block
              icon="i-heroicons-phone"
              @click="router.push(`/customers/addPhone/${customerData.id}`)">
              Add Phone
            </UButton>
            <UButton
              variant="outline"
              block
              icon="i-heroicons-envelope"
              @click="router.push(`/customers/addEmail/${customerData.id}`)">
              Add Email
            </UButton>
            <UButton
              variant="outline"
              block
              icon="i-heroicons-home"
              @click="router.push(`/customers/addAddress/${customerData.id}`)">
              Add Address
            </UButton>
            <UButton
              variant="outline"
              block
              icon="i-heroicons-truck"
              @click="router.push(`/customers/addCar/${customerData.id}`)">
              Add Vehicle
            </UButton>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else class="text-center py-12">
        <div
          class="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
          <UIcon
            name="i-heroicons-exclamation-triangle"
            class="w-8 h-8 text-red-600 dark:text-red-400" />
        </div>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2"
          >Customer Not Found</h2
        >
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          The customer you're looking for doesn't exist or has been deleted.
        </p>
        <UButton @click="router.push('/customers')">
          Back to Customers
        </UButton>
      </div>
    </div>
  </UContainer>
</template>
