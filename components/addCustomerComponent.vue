<script setup lang="ts">
import { z } from "zod";

const first_name = ref("");
const last_name = ref("");
const notes = ref("");

const customerSchema = z.object({
  first_name: z.string().min(2).max(100),
  last_name: z.string().min(2).max(100),
  notes: z.string().max(500).optional(),
});

const emit = defineEmits(["customerAdded"]);
const refreshCustomers = inject("refreshCustomers");

const addCustomer = async () => {
  try {
    const newCustomer = customerSchema.parse({
      first_name: first_name.value,
      last_name: last_name.value,
      notes: notes.value,
    });

    const response = await $fetch("/api/customers", {
      method: "POST",
      body: newCustomer,
    });

    emit("customerAdded");

    // Optionally, reset the form fields
    first_name.value = "";
    last_name.value = "";
    notes.value = "";
  } catch (error) {
    console.error("Error adding customer:", error);
  }
};
</script>

<template>
  <div>
    <h2>Add Customer</h2>
    <form @submit.prevent="addCustomer">
      <div>
        <label for="first_name">First Name:</label>
        <input id="first_name" v-model="first_name" required />
      </div>
      <div>
        <label for="last_name">Last Name:</label>
        <input id="last_name" v-model="last_name" required />
      </div>
      <div>
        <label for="notes">Notes:</label>
        <textarea id="notes" v-model="notes" />
      </div>
      <button type="submit">Add Customer</button>
    </form>
  </div>
</template>

<style scoped>
form {
  border: 1px solid #ccc;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
label {
  font-weight: bold;
}
input,
textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
button {
  width: 150px;
  padding: 0.5rem;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
