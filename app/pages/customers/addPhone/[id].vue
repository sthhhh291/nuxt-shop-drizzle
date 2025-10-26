<script setup lang="ts">
import { z } from "zod";
const { id } = useRoute().params;
const phoneSchema = z.object({
  phone_number: z.string().min(10).max(15),
  phone_type: z.enum(["Mobile", "Home", "Work"]),
  customer_id: z.number().int(),
});
const phone = {
  phone_number: "",
  phone_type: "",
};
const router = useRouter();
const addPhone = async () => {
  try {
    const newPhone = phoneSchema.parse({
      phone_number: phone.phone_number,
      phone_type: phone.phone_type,
      customer_id: Number(id),
    });
    const response = await useFetch(`/api/phones`, {
      method: "POST",
      body: newPhone,
    });
    console.log("Phone added:", response.data.value);
    router.push(`/customers/${id}`);
  } catch (error) {
    console.error("Error adding phone:", error);
  }
};
</script>
<template>
  <div class="center">
    <form @submit.prevent="addPhone">
      <h2>Add Phone for Customer ID: {{ id }}</h2>
      <div>
        <label for="phone_number">Phone Number:</label>
        <input id="phone_number" v-model="phone.phone_number" required />
      </div>
      <div>
        <label for="phone_type">Phone Type:</label>
        <select
          id="phone_type"
          v-model="phone.phone_type"
          name="phone_type"
          required
        >
          <option value="" disabled>Select type</option>
          <option value="Mobile">Mobile</option>
          <option value="Home">Home</option>
          <option value="Work">Work</option>
        </select>
      </div>
      <div>
        <input v-model="id" type="hidden" />
      </div>
      <button type="submit">Add Phone</button>
      <button @click.prevent="router.push(`/customers/${id}`)">Cancel</button>
    </form>
  </div>
</template>
<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 1em;
  width: 300px;
  padding: 1em;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
}
label {
  margin-bottom: 0.5em;
}
input,
select,
option {
  padding: 0.5em;
  border: 1px solid #ccc;
  border-radius: 3px;
  width: 100%;
}
button {
  padding: 0.5em;
  background-color: rgb(118, 150, 117);
  color: white;
  border: none;
  cursor: pointer;
}
button:hover {
  background-color: #45a049;
}
.center {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
}
h2 {
  text-align: center;
}
</style>
