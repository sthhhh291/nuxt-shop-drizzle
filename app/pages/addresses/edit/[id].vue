<script setup lang="ts">
import type { Address } from "~~/db/schema";
import { z } from "zod";
const { id } = useRoute().params;
const router = useRouter();
const { data: address } = await useFetch(`/api/addresses/${id}`, {
  method: "GET",
});
// const addressData = computed(() => {
//   return address.value && "address" in address.value ?
//       (address.value.address as Address)
//     : null;
// });
console.log("data value:", address.value);
// console.log("Fetched address:", addressData.value);
const updateAddress = async () => {
  if (!address.value) return;
  try {
    await $fetch(`/api/addresses/${id}`, {
      method: "PUT",
      body: address.value,
    });
    router.push(`/customers/${address.value.customer_id}`);
  } catch (error) {
    console.error("Failed to update address:", error);
  }
};
</script>

<template>
  <div v-if="address" class="address-edit">
    <h1>Edit Address: {{ address.street }}, {{ address.city }}</h1>
    <form @submit.prevent="updateAddress">
      <div>
        <label for="street">Street:</label>
        <input id="street" v-model="address.street" type="text" required />
      </div>
      <div>
        <label for="city">City:</label>
        <input id="city" v-model="address.city" type="text" required />
      </div>
      <div>
        <label for="state">State:</label>
        <input id="state" v-model="address.state" type="text" required />
      </div>
      <div>
        <label for="zip">ZIP Code:</label>
        <input id="zip" v-model="address.zip_code" type="text" required />
      </div>
      <button type="submit">Save Changes</button>
      <button type="button" @click="router.back()">Cancel</button>
    </form>
  </div>
  <div v-else>
    <p>Loading address data...</p>
  </div>
</template>

<style scoped>
.address-edit {
  max-width: 600px;
  margin: 0 auto;
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.address-edit h1 {
  margin-bottom: 1rem;
}

.address-edit form div {
  margin-bottom: 0.75rem;
}

.address-edit label {
  display: block;
  margin-bottom: 0.25rem;
  font-weight: bold;
}

.address-edit input {
  width: 100%;
  padding: 0.5rem;
  box-sizing: border-box;
}

.address-edit button {
  margin-right: 0.5rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
}
</style>
