<script setup lang="ts">
import { z } from "zod";

const first_name = ref("");
const last_name = ref("");
const notes = ref("");

const customerSchema = z.object({
  //   id: z.string().uuid(),
  first_name: z.string().min(2).max(100),
  last_name: z.string().min(2).max(100),
  notes: z.string().max(500).optional(),
});

const addCustomer = async () => {
  try {
    const newCustomer = customerSchema.parse({
      //    id: crypto.randomUUID(),
      first_name: first_name.value,
      last_name: last_name.value,
      notes: notes.value,
    });

    const response = await $fetch("/api/customers", {
      method: "POST",
      body: newCustomer,
    });

    console.log("Customer added:", response);
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
