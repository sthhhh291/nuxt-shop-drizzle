<script setup lang="ts">
import type { Customer, customerWithRelations } from "~~/db/schema";

const router = useRouter();
const route = useRoute();
const props = defineProps<{
  customer: customerWithRelations;
}>();
const customer = ref<customerWithRelations>(props.customer);

// Fetch customer data based on route param
watchEffect(async () => {
  const customerId = route.params.id;
  if (customerId) {
    const { data } = await useFetch(`/api/customers/${customerId}`);
    if (data.value && !("error" in data.value)) {
      customer.value = data.value.customer;
    }
  }
});
</script>

<template>
  <div class="space-y-6">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold">Customer Vehicles</h3>
          <UButton
            size="sm"
            icon="i-heroicons-plus"
            @click="router.push(`/customers/addCar/${customer.id}`)">
            Add Car
          </UButton>
        </div>
      </template>

      <div v-if="customer.cars && customer.cars.length > 0" class="space-y-4">
        <div
          v-for="car in customer.cars"
          :key="car.id"
          class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          @click="router.push(`/cars/${car.id}`)">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <UAvatar class="bg-blue-500 dark:bg-blue-400">
                <UIcon name="i-heroicons-truck" />
              </UAvatar>

              <div>
                <h4 class="font-medium text-gray-900 dark:text-white">
                  {{ car.year }} {{ car.make }} {{ car.model }}
                </h4>
                <div
                  class="flex gap-4 text-sm text-gray-500 dark:text-gray-400 mt-1">
                  <span v-if="car.engine">{{ car.engine }}</span>
                  <span v-if="car.license">License: {{ car.license }}</span>
                </div>
              </div>
            </div>

            <UIcon name="i-heroicons-chevron-right" class="text-gray-400" />
          </div>

          <div
            v-if="car.notes"
            class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <p class="text-sm text-gray-600 dark:text-gray-300">
              {{ car.notes }}
            </p>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-8">
        <UIcon
          name="i-heroicons-truck"
          class="text-3xl text-gray-400 mx-auto mb-3" />
        <p class="text-gray-500 dark:text-gray-400 mb-4">
          No vehicles registered for this customer
        </p>
        <UButton
          icon="i-heroicons-plus"
          @click="router.push(`/customers/addCar/${customer.id}`)">
          Add First Car
        </UButton>
      </div>
    </UCard>

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
</template>
