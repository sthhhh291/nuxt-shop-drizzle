<script setup lang="ts">
// import type { Car } from "~~/db/schema";
import { z } from "zod";
import type { Car } from "~~/db/schema";
const { id } = useRoute().params;
const carSchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z
    .number()
    .min(1886, "Year must be valid")
    .max(new Date().getFullYear(), "Year cannot be in the future"),
  vin: z.string().min(1, "VIN is required"),
  customer_id: z.number().min(1, "Customer ID is required"),
});
const car = {
  make: "",
  model: "",
  year: new Date().getFullYear() - 6,
  vin: "",
};
const router = useRouter();
const addCar = async () => {
  try {
    const newCar = carSchema.parse({
      make: car.make,
      model: car.model,
      year: car.year,
      vin: car.vin,
      customer_id: Number(id),
    });

    const response = await useFetch(`/api/cars`, {
      method: "POST",
      body: newCar,
    });
    const ncar: Car = response.data.value as Car;
    console.log("Car added:", ncar);
    router.push(`/cars/${ncar.id}`);
  } catch (error) {
    console.error("Error adding car:", error);
  }
};
</script>
<template>
  <div class="center">
    <form @submit.prevent="addCar">
      <h2>Add Car for Customer ID: {{ id }}</h2>
      <div>
        <label for="make">Make:</label>
        <Input id="make" v-model="car.make" />
      </div>
      <div>
        <label for="model">Model:</label>
        <Input id="model" v-model="car.model" />
      </div>
      <div>
        <label for="year">Year:</label>
        <Input id="year" v-model.number="car.year" type="number" />
      </div>
      <div>
        <label for="vin">VIN:</label>
        <Input id="vin" v-model="car.vin" />
        <Input v-model="id" type="hidden" />
      </div>
      <Button type="submit">Add Car</Button>
      <Button @click.prevent="router.push(`/customers/${id}`)">Cancel</Button>
    </form>
  </div>
</template>
<style scoped>
/* form {
  display: flex;
  flex-direction: column;
  max-width: 400px;
}
label {
  font-weight: bold;
  margin-top: 1em;
}
Input {
  width: 100%;
  padding: 0.5em;
  margin-top: 0.5em;
  box-sizing: border-box;
}
Button {
  margin-top: 1.5em;
  padding: 0.75em;
  background-color: #4caf50;
  color: white;
  border: none;
  cursor: pointer;
}
Button:hover {
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
} */
</style>
