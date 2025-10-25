<script setup lang="ts">
import type { Phone } from "~~/db/schema";
import { z } from "zod";
const { id } = useRoute().params;
const router = useRouter();
const phone = await useFetch(`/api/phones/${id}`, {
  method: "GET",
});
const phoneData = computed(() => {
  return phone.data.value && "phone" in phone.data.value ?
      (phone.data.value.phone as Phone)
    : null;
});
console.log("Fetched phone:", phoneData.value);

const updatePhone = async () => {
  if (!phoneData.value) return;
  try {
    await $fetch(`/api/phones/${id}`, {
      method: "PUT",
      body: phoneData.value,
    });
    router.push(`/customers/${phoneData.value.customer_id}`);
  } catch (error) {
    console.error("Failed to update phone:", error);
  }
};
const phoneSchema = z.object({
  phone_number: z.string().min(7).max(15),
  phone_type: z.enum(["mobile", "home", "work"]),
});
</script>

<template>
  <div v-if="phoneData" class="phone-edit">
    <h1>Edit Phone: {{ phoneData.phone_number }}</h1>
    <form @submit.prevent="updatePhone">
      <div>
        <label for="number">Number:</label>
        <input
          id="number"
          v-model="phoneData.phone_number"
          type="text"
          required />
      </div>
      <div>
        <label for="type">Type:</label>
        <select id="type" v-model="phoneData.phone_type" required>
          <option value="mobile">Mobile</option>
          <option value="home">Home</option>
          <option value="work">Work</option>
        </select>
      </div>
      <button type="submit">Save Changes</button>
      <button type="button" @click="router.push('/phones')">Cancel</button>
    </form>
  </div>
  <div v-else>
    <p>Loading phone data...</p>
  </div>
</template>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
label {
  font-weight: bold;
}
input {
  padding: 0.5rem;
  font-size: 1rem;
}
button {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  margin-right: 1rem;
}
.phone-edit {
  max-width: 600px;
  margin: auto;
}
.phone-edit h1 {
  text-align: center;
  margin-bottom: 2rem;
}
select {
  padding: 0.5rem;
  font-size: 1rem;
}
option {
  font-size: 1rem;
}
</style>
