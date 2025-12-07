<script setup lang="ts">
import type { customers, phones as phonesSchema, emails as emailsSchema, addresses as addressesSchema, cars as carsSchema } from "~~/db/schema";
import { phoneSchema, customerSchema, emailSchema, addressSchema, carSchema } from "~/lib/validations";

const toast = useToast();

const customer: Ref<Partial<typeof customers.$inferSelect>> = ref({});
const phones: Ref<Array<Partial<typeof phonesSchema.$inferSelect>>> = ref([]);
const emails: Ref<Array<Partial<typeof emailsSchema.$inferSelect>>> = ref([]);
const addresses: Ref<Array<Partial<typeof addressesSchema.$inferSelect>>> = ref([]);
const cars: Ref<Array<Partial<typeof carsSchema.$inferSelect>>> = ref([]);

const phone: Ref<Partial<typeof phonesSchema.$inferSelect>> = ref({});
const email: Ref<Partial<typeof emailsSchema.$inferSelect>> = ref({});
const address: Ref<Partial<typeof addressesSchema.$inferSelect>> = ref({});
const car: Ref<Partial<typeof carsSchema.$inferSelect>> = ref({});

const addPhone = async (data: any) => {
    try {
        phones.value.push(data);
        phone.value = {};
        toast.add({ title: 'Phone added', color: 'success' });
    } catch (error) {
        toast.add({ title: 'Failed to add phone', color: 'error' });
    }
};

const addEmail = async (data: any) => {
    try {
        emails.value.push(data);
        email.value = {};
        toast.add({ title: 'Email added', color: 'success' });
    } catch (error) {
        toast.add({ title: 'Failed to add email', color: 'error' });
    }
};

const addAddress = async (data: any) => {
    try {
        addresses.value.push(data);
        address.value = {};
        toast.add({ title: 'Address added', color: 'success' });
    } catch (error) {
        toast.add({ title: 'Failed to add address', color: 'error' });
    }
};

const addCar = async (data: any) => {
    try {
        cars.value.push(data);
        car.value = {};
        toast.add({ title: 'Car added', color: 'success' });
    } catch (error) {
        toast.add({ title: 'Failed to add car', color: 'error' });
    }
};

const removePhone = (index: number) => phones.value.splice(index, 1);
const removeEmail = (index: number) => emails.value.splice(index, 1);
const removeAddress = (index: number) => addresses.value.splice(index, 1);
const removeCar = (index: number) => cars.value.splice(index, 1);

const addCustomer = async () => {
    const response = await $fetch('/api/customers', {
        method: 'POST',
        body: customer.value,
    });

    if (!response || 'error' in response) {
        toast.add({ title: 'Failed to add customer', color: 'warning' });
        return;
    }

    if (!('customer' in response)) {
        toast.add({ title: 'Invalid response from server', color: 'warning' });
        return;
    }

    const customerId = response.customer?.id;
    // Optionally handle phones, emails, addresses, and cars addition here
    phones.value.forEach(async (phone) => {
        await $fetch('/api/phones', {
            method: 'POST',
            body: { ...phone, customer_id: customerId },
        });
    });
    emails.value.forEach(async (email) => {
        await $fetch('/api/emails', {
            method: 'POST',
            body: { ...email, customer_id: customerId },
        });
    });
    addresses.value.forEach(async (address) => {
        await $fetch('/api/addresses', {
            method: 'POST',
            body: { ...address, customer_id: customerId },
        });
    });
    cars.value.forEach(async (car) => {
        await $fetch('/api/cars', { 
            method: 'POST',
            body: { ...car, customer_id: customerId },
        });
    });
    // Redirect or show success message
    toast.add({ title: 'Customer added successfully!', color: 'primary' });
    await navigateTo(`/customers/${customerId}`);
};

</script>

<template>
  <UContainer class="py-8">
    <div class="max-w-5xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center gap-4 mb-4">
          <UButton
            to="/customers"
            icon="i-heroicons-arrow-left"
            variant="ghost"
            size="sm">
            Back to Customers
          </UButton>
        </div>
        <div class="flex items-center gap-4">
          <div class="p-3 bg-primary-100 dark:bg-primary-900 rounded-lg">
            <UIcon
              name="i-heroicons-user-plus"
              class="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
              Add New Customer
            </h1>
            <p class="text-gray-600 dark:text-gray-400 mt-1">
              Create a customer profile with contact information and vehicles
            </p>
          </div>
        </div>
      </div>

      <!-- Main Form -->
      <UForm :schema="customerSchema" :state="customer" @submit="addCustomer" class="space-y-6">
        <!-- Customer Information Card -->
        <UCard>
          <template #header>
            <div class="flex items-center gap-3">
              <div class="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <UIcon
                  name="i-heroicons-identification"
                  class="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  Customer Information
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Basic contact details
                </p>
              </div>
            </div>
          </template>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UFormGroup label="First Name" name="first_name" required>
              <UInput v-model="customer.first_name" placeholder="John" icon="i-heroicons-user" />
            </UFormGroup>
            <UFormGroup label="Last Name" name="last_name" required>
              <UInput v-model="customer.last_name" placeholder="Doe" icon="i-heroicons-user" />
            </UFormGroup>
            <UFormGroup label="Notes" name="notes" class="md:col-span-2">
              <UTextarea v-model="customer.notes" placeholder="Additional notes about this customer..." rows="3" />
            </UFormGroup>
          </div>
        </UCard>

        <!-- Phone Numbers Card -->
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <UIcon
                    name="i-heroicons-phone"
                    class="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                    Phone Numbers
                  </h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    {{ phones.length }} phone{{ phones.length !== 1 ? 's' : '' }} added
                  </p>
                </div>
              </div>
            </div>
          </template>

          <div class="space-y-4">
            <!-- Phone List -->
            <div v-if="phones.length > 0" class="space-y-2">
              <div
                v-for="(p, index) in phones"
                :key="index"
                class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div class="flex items-center gap-3">
                  <UIcon name="i-heroicons-phone" class="text-green-600 dark:text-green-400" />
                  <div>
                    <p class="font-medium text-gray-900 dark:text-white">{{ p.phone_number }}</p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">{{ p.phone_type }}</p>
                  </div>
                </div>
                <UButton
                  @click="removePhone(index)"
                  icon="i-heroicons-trash"
                  color="error"
                  variant="ghost"
                  size="sm" />
              </div>
            </div>

            <!-- Add Phone Form -->
            <UForm :schema="phoneSchema" :state="phone" @submit="addPhone">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <UFormGroup label="Phone Number" name="phone_number" class="md:col-span-2">
                  <UInput
                    v-model="phone.phone_number"
                    placeholder="1234567890"
                    icon="i-heroicons-phone" />
                </UFormGroup>
                <UFormGroup label="Phone Type" name="phone_type">
                  <USelect
                    v-model="phone.phone_type"
                    :items="[
                      { label: 'Mobile', value: 'Mobile' },
                      { label: 'Home', value: 'Home' },
                      { label: 'Work', value: 'Work' },
                    ]" />
                </UFormGroup>
              </div>
              <UButton type="submit" icon="i-heroicons-plus" variant="outline" size="sm" class="mt-3">
                Add Phone
              </UButton>
            </UForm>
          </div>
        </UCard>

        <!-- Email Addresses Card -->
        <UCard>
          <template #header>
            <div class="flex items-center gap-3">
              <div class="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <UIcon
                  name="i-heroicons-envelope"
                  class="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  Email Addresses
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ emails.length }} email{{ emails.length !== 1 ? 's' : '' }} added
                </p>
              </div>
            </div>
          </template>

          <div class="space-y-4">
            <!-- Email List -->
            <div v-if="emails.length > 0" class="space-y-2">
              <div
                v-for="(e, index) in emails"
                :key="index"
                class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div class="flex items-center gap-3">
                  <UIcon name="i-heroicons-envelope" class="text-purple-600 dark:text-purple-400" />
                  <div>
                    <p class="font-medium text-gray-900 dark:text-white">{{ e.email_address }}</p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">{{ e.email_type || 'Primary' }}</p>
                  </div>
                </div>
                <UButton
                  @click="removeEmail(index)"
                  icon="i-heroicons-trash"
                  color="error"
                  variant="ghost"
                  size="sm" />
              </div>
            </div>

            <!-- Add Email Form -->
            <UForm :schema="emailSchema" :state="email" @submit="addEmail">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <UFormGroup label="Email Address" name="email_address" class="md:col-span-2">
                  <UInput
                    v-model="email.email_address"
                    placeholder="john@example.com"
                    type="email"
                    icon="i-heroicons-envelope" />
                </UFormGroup>
                <UFormGroup label="Email Type" name="email_type">
                  <UInput v-model="email.email_type" placeholder="Primary" />
                </UFormGroup>
              </div>
              <UButton type="submit" icon="i-heroicons-plus" variant="outline" size="sm" class="mt-3">
                Add Email
              </UButton>
            </UForm>
          </div>
        </UCard>

        <!-- Addresses Card -->
        <UCard>
          <template #header>
            <div class="flex items-center gap-3">
              <div class="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <UIcon
                  name="i-heroicons-map-pin"
                  class="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  Addresses
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ addresses.length }} address{{ addresses.length !== 1 ? 'es' : '' }} added
                </p>
              </div>
            </div>
          </template>

          <div class="space-y-4">
            <!-- Address List -->
            <div v-if="addresses.length > 0" class="space-y-2">
              <div
                v-for="(a, index) in addresses"
                :key="index"
                class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div class="flex items-center gap-3">
                  <UIcon name="i-heroicons-map-pin" class="text-orange-600 dark:text-orange-400" />
                  <div>
                    <p class="font-medium text-gray-900 dark:text-white">{{ a.street }}</p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      {{ a.city }}, {{ a.state }} {{ a.zip_code }}
                    </p>
                  </div>
                </div>
                <UButton
                  @click="removeAddress(index)"
                  icon="i-heroicons-trash"
                  color="error"
                  variant="ghost"
                  size="sm" />
              </div>
            </div>

            <!-- Add Address Form -->
            <UForm :schema="addressSchema" :state="address" @submit="addAddress">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <UFormGroup label="Street" name="street" class="md:col-span-2">
                  <UInput
                    v-model="address.street"
                    placeholder="123 Main St"
                    icon="i-heroicons-map-pin" />
                </UFormGroup>
                <UFormGroup label="City" name="city">
                  <UInput v-model="address.city" placeholder="Springfield" />
                </UFormGroup>
                <UFormGroup label="State" name="state">
                  <UInput v-model="address.state" placeholder="CA" maxlength="2" />
                </UFormGroup>
                <UFormGroup label="Zip Code" name="zip_code" class="md:col-span-2">
                  <UInput v-model="address.zip_code" placeholder="12345" />
                </UFormGroup>
              </div>
              <UButton type="submit" icon="i-heroicons-plus" variant="outline" size="sm" class="mt-3">
                Add Address
              </UButton>
            </UForm>
          </div>
        </UCard>

        <!-- Cars Card -->
        <UCard>
          <template #header>
            <div class="flex items-center gap-3">
              <div class="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                <UIcon
                  name="i-heroicons-truck"
                  class="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  Vehicles
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ cars.length }} vehicle{{ cars.length !== 1 ? 's' : '' }} added
                </p>
              </div>
            </div>
          </template>

          <div class="space-y-4">
            <!-- Car List -->
            <div v-if="cars.length > 0" class="space-y-2">
              <div
                v-for="(c, index) in cars"
                :key="index"
                class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div class="flex items-center gap-3">
                  <UIcon name="i-heroicons-truck" class="text-red-600 dark:text-red-400" />
                  <div>
                    <p class="font-medium text-gray-900 dark:text-white">
                      {{ c.year }} {{ c.make }} {{ c.model }}
                    </p>
                    <p v-if="c.vin" class="text-sm text-gray-600 dark:text-gray-400">VIN: {{ c.vin }}</p>
                  </div>
                </div>
                <UButton
                  @click="removeCar(index)"
                  icon="i-heroicons-trash"
                  color="error"
                  variant="ghost"
                  size="sm" />
              </div>
            </div>

            <!-- Add Car Form -->
            <UForm :schema="carSchema" :state="car" @submit="addCar">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <UFormGroup label="Make" name="make">
                  <UInput v-model="car.make" placeholder="Toyota" icon="i-heroicons-truck" />
                </UFormGroup>
                <UFormGroup label="Model" name="model">
                  <UInput v-model="car.model" placeholder="Camry" />
                </UFormGroup>
                <UFormGroup label="Year" name="year">
                  <UInput v-model.number="car.year" type="number" placeholder="2024" />
                </UFormGroup>
                <UFormGroup label="VIN" name="vin">
                  <UInput v-model="car.vin" placeholder="1HGBH41JXMN109186" maxlength="17" />
                </UFormGroup>
              </div>
              <UButton type="submit" icon="i-heroicons-plus" variant="outline" size="sm" class="mt-3">
                Add Vehicle
              </UButton>
            </UForm>
          </div>
        </UCard>

        <!-- Submit Button -->
        <div class="flex items-center justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          <UButton to="/customers" variant="ghost" size="lg">
            Cancel
          </UButton>
          <UButton type="submit" color="primary" size="lg" icon="i-heroicons-check">
            Create Customer
          </UButton>
        </div>
      </UForm>
    </div>
  </UContainer>
</template>