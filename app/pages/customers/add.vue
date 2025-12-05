<script setup lang="ts">
import type { customers, phones as phonesSchema, emails as emailsSchema, addresses as addressesSchema, cars as carsSchema } from "~~/db/schema";

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
    <div class="customer-add-page">
        <h1>Add New Customer</h1>
        <!-- Customer addition form goes here -->
         <UForm @submit="addCustomer">
            <UInput v-model="customer.first_name" label="First Name" required />
            <UInput v-model="customer.last_name" label="Last Name" required />
            <UTextarea v-model="customer.notes" label="Notes" />
            <!-- Form fields for customer, phones, emails, addresses, and cars -->
             <div>
                <ULabel class="font-bold mb-2">Phone Number</ULabel>
                <UInput v-model="phone.phone_number" label="Phone Number" />
                <UInput v-model="phone.phone_type" label="Phone Type" />
                <UButton @click="phones.push({...phone}); phone = {}">Add Phone</UButton>
            </div>
            <div>
                <UInput v-model="email.email_address" label="Email Address" />
                <UInput v-model="email.email_type" label="Email Type" />
                <UButton @click="emails.push({...email}); email = {}">Add Email</UButton>
            </div>
            <div>
                <UInput v-model="address.street" label="Street" />
                <UInput v-model="address.city" label="City" />
                <UInput v-model="address.state" label="State" />
                <UInput v-model="address.zip_code" label="Zip Code" />
                <UButton @click="addresses.push({...address}); address = {}">Add Address</UButton>
            </div>
            <div>
                <UInput v-model="car.make" label="Car Make" />
                <UInput v-model="car.model" label="Car Model" />
                <UInput v-model="car.year" label="Car Year" />
                <UInput v-model="car.vin" label="VIN" />
                <UButton @click="cars.push({...car}); car = {}">Add Car</UButton>
            </div>
            <UButton type="submit" color="primary">Add Customer</UButton>
        </UForm>
        <!-- phones, etc detail -->
         <ul>
            <li v-for="phone in phones">
                {{ phone.phone_type }}: {{ phone.phone_number }}
            </li>
         </ul>
    </div>
</template>