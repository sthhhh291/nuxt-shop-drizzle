<script setup lang="ts">
import type { Part } from "~~/db/schema";
defineProps<{
  parts: Part[];
}>();
const emit = defineEmits(["emit"]);
const deletePart = async (id: number) => {
  try {
    if (confirm("Are you sure you want to delete this part entry?")) {
      await useFetch(`/api/parts/${id}`, {
        method: "DELETE",
      });
      // Optionally, emit an event to notify parent component to refresh data
      emit("emit");
    }
  } catch (error) {
    console.error("Error deleting part:", error);
  }
};
</script>

<template>
  <table class="table">
    <thead>
      <tr>
        <th>Description</th>
        <th>Quantity</th>
        <th>Cost</th>
        <th>Unit Price</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="part in parts" :key="part.id">
        <td>{{ part.description }}</td>
        <td>{{ part.quantity }}</td>
        <td>{{ part.cost }}</td>
        <td>{{ part.unit_price }}</td>
        <td>
          <!-- Actions such as Edit/Delete can be added here -->
          <button class="btn btn-sm btn-primary">Edit</button>
          <button class="btn btn-sm btn-danger" @click="deletePart(part.id)"
            >Delete</button
          >
        </td></tr
      >
    </tbody>
  </table>
</template>
