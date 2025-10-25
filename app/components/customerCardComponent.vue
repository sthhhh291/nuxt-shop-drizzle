<script setup lang="ts">
import type { customerWithRelations } from "~~/db/schema";
defineProps<{
  customer: customerWithRelations;
}>();
const router = useRouter();
</script>

<template>
  <div class="customer-card">
    <div class="">
      <h3>Customer</h3>
      <p>
        {{ customer.first_name }} {{ customer.last_name }}
        <button @click="router.push(`/customers/edit/${customer.id}`)">
          Edit
        </button>
      </p>
    </div>
    <div class="">
      <h3>Address</h3>
      <div v-for="add in customer.addresses" :key="add.id">
        <p>
          {{ add.street }}, {{ add.city }}, {{ add.state }} {{ add.zip_code }}
          <button @click="router.push(`/addresses/edit/${add.id}`)"
            >Edit</button
          >
        </p>
      </div>
    </div>
    <div class="">
      <h3>Phones</h3>
      <div v-for="phone in customer.phones" :key="phone.id">
        <p
          >{{ phone.phone_number }} ({{ phone.phone_type }})
          <button @click="router.push(`/phones/edit/${phone.id}`)"
            >Edit
          </button></p
        >
      </div>
    </div>
    <div class="">
      <h3>Emails</h3>
      <div v-for="email in customer.emails" :key="email.id">
        <p>{{ email.email_address }} ({{ email.email_type }})</p>
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
button {
  margin-left: 1em;
  color: #ffffff;
  background: none;
  border: none;
  cursor: pointer;
  background-color: rgb(119, 180, 117);
  padding: 0.2em 0.5em;
  border-radius: 3px;
}
</style>
