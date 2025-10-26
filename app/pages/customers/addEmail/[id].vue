<script setup lang="ts">
import { z } from "zod";
const { id } = useRoute().params;
const router = useRouter();
const emailSchema = z.object({
  email_address: z.string().min(1, "Email is required").email("Invalid email"),
  email_type: z.enum(["personal", "work"]),
  customer_id: z.number().int(),
});
const email = {
  email_address: "",
  email_type: "personal",
  customer_id: Number(id),
};
const addEmail = async () => {
  try {
    const newEmail = emailSchema.parse({
      email_address: email.email_address,
      email_type: email.email_type,
      customer_id: Number(id),
    });
    const response = await useFetch(`/api/emails`, {
      method: "POST",
      body: newEmail,
    });
    console.log("Email added:", response.data.value);
    router.push(`/customers/${id}`);
  } catch (error) {
    console.error("Error adding email:", error);
  }
};
</script>

<template>
  <div class="center">
    <form @submit.prevent="addEmail">
      <h2 class="text-2xl font-bold mb-6">Add Email for Customer {{ id }}</h2>
      <div class="mb-4">
        <label class="block text-gray-700 mb-2" for="email"
          >Email Address</label
        >
        <Input
          v-model="email.email_address"
          type="email"
          id="email"
          class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter email address"
          required />
      </div>
      <div class="mb-6">
        <label class="block text-gray-700 mb-2" for="email_type"
          >Email Type</label
        >
        <select
          id="email_type"
          v-model="email.email_type"
          class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required>
          <option value="" disabled>Select email type</option>
          <option value="personal">Personal</option>
          <option value="work">Work</option>
        </select>
      </div>
      <Button
        type="submit"
        class="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200">
        Add Email
      </Button>
      <Button
        @click.prevent="router.push(`/customers/${id}`)"
        class="w-full mt-4 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-200">
        Cancel
      </Button>
    </form>
  </div>
</template>

<style scoped>
/* Add any additional styles if necessary */
</style>
