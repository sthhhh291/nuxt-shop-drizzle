<script setup lang="ts">
// import { form } from "#build/ui";
import type { customerWithRelations } from "~~/db/schema";
const showForm = ref(false);
const route = useRoute();
const router = useRouter();
const { data } = await useFetch(`/api/customers/${route.params.id}`, {
  method: "GET",
});
const customer = computed(() => {
  return data.value && "customer" in data.value ?
      (data.value.customer as customerWithRelations)
    : null;
});
</script>
<template>
  <UContainer class="py-8">
    <!-- Header with Back Button -->
    <div class="flex items-center gap-4 mb-8">
      <UButton
        variant="ghost"
        icon="i-heroicons-arrow-left"
        @click="router.push('/customers')">
        Back to Customers
      </UButton>

      <div class="flex-1">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          {{
            customer ?
              `${customer.first_name} ${customer.last_name}`
            : "Customer Details"
          }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">
          Customer information and vehicles
        </p>
      </div>
    </div>

    <div v-if="customer" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Customer Information -->
      <div class="space-y-6">
        <customerCardComponent :customer="customer" />

        <!-- Quick Actions -->
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold">Quick Actions</h3>
          </template>

          <div class="space-y-3">
            <UButton
              block
              variant="outline"
              icon="i-heroicons-phone"
              @click="router.push(`/customers/addPhone/${customer.id}`)">
              Add Phone Number
            </UButton>

            <UButton
              block
              variant="outline"
              icon="i-heroicons-envelope"
              @click="router.push(`/customers/addEmail/${customer.id}`)">
              Add Email
            </UButton>

            <UButton
              block
              variant="outline"
              icon="i-heroicons-map-pin"
              @click="router.push(`/customers/addAddress/${customer.id}`)">
              Add Address
            </UButton>

            <UButton
              block
              variant="outline"
              icon="i-heroicons-truck"
              @click="router.push(`/customers/addCar/${customer.id}`)">
              Add Car
            </UButton>
          </div>
        </UCard>
      </div>

      <!-- Customer Cars -->
      <customerCarsComponent :customer="customer" />
      <!-- Recent Estimates -->
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">Recent Estimates</h3>
        </template>

        <div class="text-center py-8">
          <UIcon
            name="i-heroicons-document-text"
            class="text-3xl text-gray-400 mx-auto mb-3" />
          <p class="text-gray-500 dark:text-gray-400">
            No estimates found for this customer
          </p>
        </div>
      </UCard>
    </div>

    <!-- Loading State -->
    <div v-else class="flex items-center justify-center py-12">
      <UIcon
        name="i-heroicons-arrow-path"
        class="animate-spin text-2xl text-primary-500" />
      <span class="ml-2 text-gray-600 dark:text-gray-400"
        >Loading customer details...</span
      >
    </div>
  </UContainer>
</template>
