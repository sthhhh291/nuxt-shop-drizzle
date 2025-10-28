<script setup lang="ts">
import type { Estimate } from "~~/db/schema";
import { z } from "zod";
const { id } = useRoute().params;

const router = useRouter();

const estimateSchema = z.object({
  car_id: z.number().min(1),
  date: z.string().min(10).max(10),
  hours_taken: z.number().min(0),
  miles: z.number().min(0),
  estimate_type: z.string().min(1).max(255),
});
const estimate = {
  car_id: Number(id),
  date: "",
  hours_taken: 0,
  miles: 0,
  estimate_type: "",
};
const addEstimate = async () => {
  try {
    const newEstimate = estimateSchema.parse({
      car_id: Number(id),
      date: estimate.date,
      hours_taken: estimate.hours_taken,
      miles: estimate.miles,
      estimate_type: estimate.estimate_type,
    });
    console.log("Adding estimate:", newEstimate);
    const response = await useFetch(`/api/estimates`, {
      method: "POST",
      body: newEstimate,
    });
    console.log("Estimate added:", response.data.value[0].id);
    router.push(`/estimates/${response.data.value[0].id}`);
  } catch (error) {
    console.error("Error adding estimate:", error);
    return;
  }
};
</script>

<template>
  <div class="container mx-auto p-4">
    <div class="space-y-4">
      <h1>Add Estimate for Car {{ id }}</h1>
      <form @submit.prevent="addEstimate">
        <div>
          <label for="date">Date (YYYY-MM-DD):</label>
          <Input id="date" v-model="estimate.date" required />
        </div>
        <div>
          <label for="hours_taken">Hours Taken:</label>
          <Input
            id="hours_taken"
            v-model.number="estimate.hours_taken"
            type="number"
            required />
        </div>
        <div>
          <label for="miles">Miles:</label>
          <Input
            id="miles"
            v-model.number="estimate.miles"
            type="number"
            required />
        </div>
        <div>
          <label for="estimate_type">Estimate Type:</label>
          <Input id="estimate_type" v-model="estimate.estimate_type" required />
        </div>
        <Button type="submit">Add Estimate</Button>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* Add any component-specific styles here */
</style>
