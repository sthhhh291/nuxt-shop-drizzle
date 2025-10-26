<script setup lang="ts">
import type { customerWithRelations } from "~~/db/schema";
defineProps<{
  customer: customerWithRelations;
}>();
const router = useRouter();
const deletePhone = async (phoneId: number) => {
  if (confirm(`Are you sure you want to delete phone with ID: ${phoneId}?`)) {
    // Call API to delete phone
    await useFetch(`/api/phones/${phoneId}`, {
      method: "DELETE",
    });
    refreshNuxtData();
  }
};
const deleteEmail = async (emailId: number) => {
  if (confirm(`Are you sure you want to delete email with ID: ${emailId}?`)) {
    // Call API to delete email
    await useFetch(`/api/emails/${emailId}`, {
      method: "DELETE",
    });
    refreshNuxtData();
  }
};
const deleteAddress = async (addressId: number) => {
  if (
    confirm(`Are you sure you want to delete address with ID: ${addressId}?`)
  ) {
    // Call API to delete address
    await useFetch(`/api/addresses/${addressId}`, {
      method: "DELETE",
    });
    refreshNuxtData();
  }
};
</script>

<template>
  <div class="customer-card">
    <div class="">
      <h3>Customer</h3>
      <p>
        {{ customer.first_name }} {{ customer.last_name }}
        <Button @click="router.push(`/customers/edit/${customer.id}`)">
          E
        </Button>
      </p>
    </div>
    <div class="">
      <h3>Address</h3>
      <div v-for="add in customer.addresses" :key="add.id">
        <p>
          {{ add.street }}, {{ add.city }}, {{ add.state }} {{ add.zip_code }}
          <Button @click="router.push(`/addresses/edit/${add.id}`)"> E </Button>
          <Button @click="() => deleteAddress(add.id)">D</Button>
        </p>
      </div>
    </div>
    <div class="">
      <h3>Phones</h3>
      <div v-for="phone in customer.phones" :key="phone.id">
        <p>
          {{ phone.phone_number }} ({{ phone.phone_type }})
          <Button @click="router.push(`/phones/edit/${phone.id}`)">E</Button>
          <Button @click="() => deletePhone(phone.id)">D</Button>
        </p>
      </div>
    </div>
    <div class="">
      <h3>Emails</h3>
      <div v-for="email in customer.emails" :key="email.id">
        <p>
          {{ email.email_address }} ({{ email.email_type }})
          <Button @click="router.push(`/emails/edit/${email.id}`)">E</Button>
          <Button @click="() => deleteEmail(email.id)">D</Button>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.customer-card {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 1em;
  border: 1px solid #ccc;
  padding: 1em;
  margin-bottom: 1em;
  border-radius: 5px;
}
</style>
