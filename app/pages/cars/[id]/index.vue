<script setup lang="ts">
import type { carWithRelations } from "~~/db/schema";

const router = useRouter();
const { id } = useRoute().params;
const { data, refresh } = await useFetch(`/api/cars/${id}`, {
  method: "GET",
});
const car = data.value as carWithRelations;

// Dropdown menu items
const dropdownItems = [
  [
    {
      label: "Edit Vehicle",
      icon: "i-heroicons-pencil",
      click: () => console.log("Edit vehicle"),
    },
  ],
  [
    {
      label: "Print History",
      icon: "i-heroicons-printer",
      click: () => console.log("Print history"),
    },
  ],
  [
    {
      label: "Delete Vehicle",
      icon: "i-heroicons-trash",
      click: () => console.log("Delete vehicle"),
    },
  ],
];
</script>

<template>
  <UContainer class="py-8">
    <!-- Header with Back Button -->
    <div class="flex items-center gap-4 mb-8">
      <UButton
        variant="ghost"
        icon="i-heroicons-arrow-left"
        @click="router.push('/cars')">
        Back to Cars
      </UButton>

      <div class="flex-1">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          {{ car ? `${car.year} ${car.make} ${car.model}` : "Car Details" }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">
          Vehicle information and service history
        </p>
      </div>

      <!-- Action Buttons -->
      <div v-if="car" class="flex gap-2">
        <UButton
          color="primary"
          icon="i-heroicons-document-plus"
          @click="router.push(`/cars/${id}/addEstimate`)">
          Add Estimate
        </UButton>

        <UDropdown :items="dropdownItems">
          <UButton variant="outline" trailing-icon="i-heroicons-chevron-down">
            More Actions
          </UButton>
        </UDropdown>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="!car" class="flex items-center justify-center py-12">
      <div class="text-center">
        <UIcon
          name="i-heroicons-arrow-path"
          class="animate-spin text-3xl text-primary-500 mb-4" />
        <p class="text-gray-600 dark:text-gray-400">Loading car details...</p>
      </div>
    </div>

    <!-- Car Details -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Main Information -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Vehicle Information Card -->
        <UCard>
          <template #header>
            <div class="flex items-center gap-3">
              <UAvatar class="bg-blue-500 dark:bg-blue-400" size="md">
                <UIcon name="i-heroicons-truck" class="text-xl" />
              </UAvatar>
              <div>
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                  {{ car.year }} {{ car.make }} {{ car.model }}
                </h2>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Vehicle Details
                </p>
              </div>
            </div>
          </template>

          <div class="space-y-4">
            <!-- Vehicle Specs -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-3">
                <div v-if="car.engine" class="flex items-center gap-3">
                  <div class="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <UIcon
                      name="i-heroicons-cog-6-tooth"
                      class="text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <p class="text-sm text-gray-500 dark:text-gray-400"
                      >Engine</p
                    >
                    <p class="font-medium text-gray-900 dark:text-white">{{
                      car.engine
                    }}</p>
                  </div>
                </div>

                <div v-if="car.vin" class="flex items-center gap-3">
                  <div class="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <UIcon
                      name="i-heroicons-identification"
                      class="text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <p class="text-sm text-gray-500 dark:text-gray-400">VIN</p>
                    <p
                      class="font-medium text-gray-900 dark:text-white font-mono text-sm"
                      >{{ car.vin }}</p
                    >
                  </div>
                </div>
              </div>

              <div class="space-y-3">
                <div v-if="car.license" class="flex items-center gap-3">
                  <div class="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <UIcon
                      name="i-heroicons-document-text"
                      class="text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <p class="text-sm text-gray-500 dark:text-gray-400"
                      >License Plate</p
                    >
                    <p class="font-medium text-gray-900 dark:text-white">{{
                      car.license
                    }}</p>
                  </div>
                </div>

                <div v-if="car.fleet" class="flex items-center gap-3">
                  <div class="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <UIcon
                      name="i-heroicons-building-office"
                      class="text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <p class="text-sm text-gray-500 dark:text-gray-400"
                      >Fleet</p
                    >
                    <p class="font-medium text-gray-900 dark:text-white">{{
                      car.fleet
                    }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Notes -->
            <div
              v-if="car.notes"
              class="pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-2"
                >Notes</h3
              >
              <p
                class="text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                {{ car.notes }}
              </p>
            </div>
          </div>
        </UCard>

        <!-- Service History -->
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <UIcon
                  name="i-heroicons-document-text"
                  class="text-xl text-gray-600 dark:text-gray-400" />
                <div>
                  <h2
                    class="text-xl font-semibold text-gray-900 dark:text-white">
                    Service History
                  </h2>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    Estimates and repairs for this vehicle
                  </p>
                </div>
              </div>
              <UButton
                size="sm"
                icon="i-heroicons-plus"
                @click="router.push(`/cars/${id}/addEstimate`)">
                Add Estimate
              </UButton>
            </div>
          </template>

          <div
            v-if="car.estimates && car.estimates.length > 0"
            class="space-y-4">
            <div
              v-for="estimate in car.estimates"
              :key="estimate.id"
              class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <div class="flex items-center justify-between mb-3">
                <div>
                  <h4 class="font-medium text-gray-900 dark:text-white">
                    Estimate #{{ estimate.id }}
                  </h4>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    {{ new Date(estimate.date).toLocaleDateString() }}
                  </p>
                </div>
                <UBadge
                  :color="
                    estimate.estimate_type === 'repair' ? 'error' : 'primary'
                  "
                  variant="subtle">
                  {{ estimate.estimate_type }}
                </UBadge>
              </div>

              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p class="text-gray-500 dark:text-gray-400">Hours</p>
                  <p class="font-medium text-gray-900 dark:text-white">{{
                    estimate.hours_taken
                  }}</p>
                </div>
                <div>
                  <p class="text-gray-500 dark:text-gray-400">Miles</p>
                  <p class="font-medium text-gray-900 dark:text-white">{{
                    estimate.miles.toLocaleString()
                  }}</p>
                </div>
                <div>
                  <p class="text-gray-500 dark:text-gray-400">Type</p>
                  <p
                    class="font-medium text-gray-900 dark:text-white capitalize"
                    >{{ estimate.estimate_type }}</p
                  >
                </div>
                <div class="text-right">
                  <UButton
                    variant="ghost"
                    size="xs"
                    icon="i-heroicons-eye"
                    @click="router.push(`/estimates/${estimate.id}`)">
                    View
                  </UButton>
                </div>
              </div>

              <div
                v-if="estimate.public_notes"
                class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <p class="text-sm text-gray-600 dark:text-gray-300">
                  {{ estimate.public_notes }}
                </p>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-8">
            <UIcon
              name="i-heroicons-document-text"
              class="text-3xl text-gray-400 mx-auto mb-3" />
            <p class="text-gray-500 dark:text-gray-400 mb-4">
              No service history for this vehicle
            </p>
            <UButton
              icon="i-heroicons-plus"
              @click="router.push(`/cars/${id}/addEstimate`)">
              Create First Estimate
            </UButton>
          </div>
        </UCard>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Owner Information -->
        <UCard>
          <template #header>
            <div class="flex items-center gap-3">
              <UIcon
                name="i-heroicons-user"
                class="text-xl text-gray-600 dark:text-gray-400" />
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  Owner
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Customer information
                </p>
              </div>
            </div>
          </template>

          <div class="space-y-4">
            <!-- Customer Info -->
            <div class="flex items-center gap-4">
              <UAvatar
                :alt="`${car.customer.first_name} ${car.customer.last_name}`"
                size="lg"
                class="bg-primary-500 dark:bg-primary-400">
                {{ car.customer.first_name?.[0]
                }}{{ car.customer.last_name?.[0] }}
              </UAvatar>

              <div class="flex-1">
                <h4 class="font-semibold text-gray-900 dark:text-white">
                  {{ car.customer.first_name }} {{ car.customer.last_name }}
                </h4>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Customer ID: #{{ car.customer.id }}
                </p>
              </div>
            </div>

            <!-- Contact Information -->
            <div
              v-if="
                (car.customer as any).phones &&
                (car.customer as any).phones.length > 0
              "
              class="space-y-2">
              <h5 class="text-sm font-medium text-gray-900 dark:text-white"
                >Phone Numbers</h5
              >
              <div
                v-for="phone in (car.customer as any).phones"
                :key="phone.id"
                class="flex items-center gap-2">
                <UIcon name="i-heroicons-phone" class="text-xs text-gray-400" />
                <span class="text-sm text-gray-600 dark:text-gray-300">
                  {{ phone.phone_number }} ({{ phone.phone_type }})
                </span>
              </div>
            </div>

            <div
              v-if="
                (car.customer as any).emails &&
                (car.customer as any).emails.length > 0
              "
              class="space-y-2">
              <h5 class="text-sm font-medium text-gray-900 dark:text-white"
                >Email Addresses</h5
              >
              <div
                v-for="email in (car.customer as any).emails"
                :key="email.id"
                class="flex items-center gap-2">
                <UIcon
                  name="i-heroicons-envelope"
                  class="text-xs text-gray-400" />
                <span class="text-sm text-gray-600 dark:text-gray-300">
                  {{ email.email_address }} ({{ email.email_type }})
                </span>
              </div>
            </div>

            <div
              v-if="
                (car.customer as any).addresses &&
                (car.customer as any).addresses.length > 0
              "
              class="space-y-2">
              <h5 class="text-sm font-medium text-gray-900 dark:text-white"
                >Addresses</h5
              >
              <div
                v-for="address in (car.customer as any).addresses"
                :key="address.id"
                class="flex items-start gap-2">
                <UIcon
                  name="i-heroicons-map-pin"
                  class="text-xs text-gray-400 mt-0.5" />
                <div class="text-sm text-gray-600 dark:text-gray-300">
                  <p>{{ address.street }}</p>
                  <p
                    >{{ address.city }}, {{ address.state }}
                    {{ address.zip_code }}</p
                  >
                  <p class="text-xs text-gray-500"
                    >({{ address.address_type }})</p
                  >
                </div>
              </div>
            </div>
          </div>

          <div class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <UButton
              block
              variant="outline"
              icon="i-heroicons-arrow-top-right-on-square"
              @click="router.push(`/customers/${car?.customer?.id}`)">
              View Customer Profile
            </UButton>
          </div>
        </UCard>

        <!-- Quick Actions -->
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Quick Actions
            </h3>
          </template>

          <div class="space-y-3">
            <UButton
              block
              variant="outline"
              icon="i-heroicons-document-plus"
              @click="router.push(`/cars/${id}/addEstimate`)">
              Create Estimate
            </UButton>

            <UButton
              @click="router.push(`/cars/${id}/edit`)"
              block
              variant="outline"
              icon="i-heroicons-pencil">
              Edit Vehicle
            </UButton>

            <UButton
              block
              variant="outline"
              icon="i-heroicons-printer"
              disabled>
              Print History
            </UButton>

            <UButton
              block
              variant="outline"
              color="error"
              icon="i-heroicons-trash"
              disabled>
              Delete Vehicle
            </UButton>
          </div>
        </UCard>

        <!-- Vehicle Stats -->
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Statistics
            </h3>
          </template>

          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-500 dark:text-gray-400"
                >Total Estimates</span
              >
              <span class="font-semibold text-gray-900 dark:text-white">
                {{ car.estimates?.length || 0 }}
              </span>
            </div>

            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-500 dark:text-gray-400"
                >Last Service</span
              >
              <span class="font-semibold text-gray-900 dark:text-white">
                {{
                  car.estimates && car.estimates.length > 0 ?
                    new Date(
                      car.estimates[car.estimates.length - 1].date
                    ).toLocaleDateString()
                  : "Never"
                }}
              </span>
            </div>

            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-500 dark:text-gray-400"
                >Vehicle Age</span
              >
              <span class="font-semibold text-gray-900 dark:text-white">
                {{ new Date().getFullYear() - car.year }} years
              </span>
            </div>
          </div>
        </UCard>
      </div>
    </div>
  </UContainer>
</template>
