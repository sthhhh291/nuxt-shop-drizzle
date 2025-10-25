<script setup lang="ts">
import type { Email } from "~~/db/schema";
const router = useRouter();
// const route = useRoute();
const { id } = useRoute().params;
const { data: email } = await useFetch<Email>(`/api/emails/${id}`, {
  method: "GET",
});
console.log("Fetched email:", email.value);

const updateEmail = async () => {
  if (!email.value) return;
  try {
    await useFetch(`/api/emails/${id}`, {
      method: "PUT",
      body: email.value,
    });
    router.push(`/customers/${email.value.customer_id}`);
  } catch (error) {
    console.error("Failed to update email:", error);
  }
};
</script>
<template>
  <div class="p-4">
    <h1 class="text-2xl mb-4">Edit Email</h1>
    <form @submit.prevent="updateEmail">
      <div>
        <label class="block mb-1">Email Address</label>
        <input v-model="email!.email_address" type="email" required />
      </div>
      <div>
        <label class="block mb-1">Type</label>
        <select v-model="email!.email_type" required>
          <option value="personal">Personal</option>
          <option value="work">Work</option>
        </select>
      </div>
      <button
        type="submit"
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Save Changes
      </button>
      <button
        type="button"
        class="ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        @click="router.back()">
        Cancel
      </button>
    </form>
  </div>
</template>

<style scoped>
form {
  max-width: 600px;
}
input,
select {
  font-size: 1rem;
}
button {
  font-size: 1rem;
}
</style>
