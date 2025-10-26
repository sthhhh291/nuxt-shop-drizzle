<script setup lang="ts">
import type { customerWithRelations } from "~~/db/schema";

const { id } = useRoute().params;
const router = useRouter();
const customer = await useFetch(`/api/customers/${id}`, {
  method: "GET",
});
const customerData = computed(() => {
  return customer.data.value && "customer" in customer.data.value ?
      (customer.data.value.customer as customerWithRelations)
    : null;
});
console.log("Fetched customer:", customerData.value);

const updateCustomer = async () => {
  if (!customerData.value) return;
  try {
    await $fetch(`/api/customers/${id}`, {
      method: "PUT",
      body: customerData.value,
    });
    router.push(`/customers/${id}`);
  } catch (error) {
    console.error("Failed to update customer:", error);
  }
};
</script>

<template>
  <div v-if="customerData" class="center">
    <form @submit.prevent="updateCustomer">
      <h1>
        Edit Customer: {{ customerData.first_name }}
        {{ customerData.last_name }}
      </h1>
      <div>
        <label for="first_name">First Name:</label>
        <Input
          id="first_name"
          v-model="customerData.first_name"
          type="text"
          required />
      </div>
      <div>
        <label for="last_name">Last Name:</label>
        <Input
          id="last_name"
          v-model="customerData.last_name"
          type="text"
          required />
      </div>
      <div>
        <label for="notes">Notes:</label>
        <textarea
          id="notes"
          v-model="customerData.notes"
          rows="8"
          cols="35"></textarea>
      </div>
      <!-- Additional fields for addresses, phones, emails can be added here -->
      <Button type="submit">Save Changes</Button>
      <Button
        type="Button"
        @click="router.push(`/customers/${customerData.id}`)"
        >Cancel</Button
      >
    </form>
  </div>
  <div v-else>
    <p>Loading customer data...</p>
  </div>
</template>

<style scoped>
/* form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
label {
  font-weight: bold;
}
Input,
textarea {
  padding: 0.5rem;
  font-size: 1rem;
} */
</style>
