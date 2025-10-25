<script setup lang="ts">
import { z } from "zod";
import { ref } from "vue";
import { useRouter } from "vue-router";
import type { customerWithRelations } from "~~/db/schema";

const props = defineProps<{ customer: customerWithRelations }>();

const first_name = ref(props.customer.first_name);
const last_name = ref(props.customer.last_name);
const notes = ref(props.customer.notes ?? "");
const emit = defineEmits(["customerUpdated"]);
const router = useRouter();
const customerSchema = z.object({
  first_name: z.string().min(2).max(100),
  last_name: z.string().min(2).max(100),
  notes: z.string().max(500).optional(),
});
const updatedCustomer = customerSchema.parse({
  first_name: first_name.value,
  last_name: last_name.value,
  notes: notes.value,
});
const updateCustomer = async () => {
  try {
    await $fetch(`/api/customers/${props.customer.id}`, {
      method: "PUT",
      body: updatedCustomer,
    });
    emit("customerUpdated");
    //navigate to customer page
    await router.push(`/customers/${props.customer.id}`);
  } catch (error) {
    console.error("Error adding customer:", error);
  }
};
</script>
<template>
  <div>
    <h2>Edit Customer</h2>
    <form @submit.prevent="updateCustomer">
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
      <button type="submit">Update Customer</button>
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
