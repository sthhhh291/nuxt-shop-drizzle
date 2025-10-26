<script setup lang="ts">
import { z } from "zod";
const { id } = useRoute().params;
const router = useRouter();
const addressSchema = z.object({
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip_code: z.string().min(1, "Zip Code is required"),
  address_type: z.string().min(1, "Address Type is required"),
  customer_id: z.number().int(),
});
const address = {
  street: "",
  city: "",
  state: "",
  zip_code: "",
  address_type: "",
  customer_id: Number(id),
};
const addAddress = async () => {
  try {
    const newAddress = addressSchema.parse({
      street: address.street,
      city: address.city,
      state: address.state,
      zip_code: address.zip_code,
      address_type: address.address_type,
      customer_id: Number(id),
    });
    const response = await useFetch(`/api/addresses`, {
      method: "POST",
      body: newAddress,
    });
    console.log("Address added:", response.data.value);
    router.push(`/customers/${id}`);
  } catch (error) {
    console.error("Error adding address:", error);
  }
};
</script>

<template>
  <div>
    <div class="center">
      <form @submit.prevent="addAddress">
        <h2>Add Address for Customer ID: {{ id }}</h2>
        <div>
          <label for="street">Street:</label>
          <Input id="street" v-model="address.street" required />
        </div>
        <div>
          <label for="city">City:</label>
          <Input id="city" v-model="address.city" required />
        </div>
        <div>
          <label for="state">State:</label>
          <Input id="state" v-model="address.state" required />
        </div>
        <div>
          <label for="zip_code">Zip Code:</label>
          <Input id="zip_code" v-model="address.zip_code" required />
        </div>
        <div>
          <label for="address_type">Address Type:</label>
          <Input id="address_type" v-model="address.address_type" required />
        </div>
        <div>
          <Input v-model="id" type="hidden" />
        </div>
        <Button type="submit">Add Address</Button>
        <Button @click.prevent="router.push(`/customers/${id}`)">Cancel</Button>
      </form>
    </div>
  </div>
</template>
