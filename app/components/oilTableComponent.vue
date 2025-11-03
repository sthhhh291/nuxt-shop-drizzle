<script setup lang="ts">
import type { Oil } from "~~/db/schema";
defineProps<{
  oils: Oil[];
}>();
const router = useRouter();
const emit = defineEmits(["emit"]);
const deleteOil = async (id: number) => {
  try {
    if (confirm("Are you sure you want to delete this oil entry?")) {
      await useFetch(`/api/oil/${id}`, {
        method: "DELETE",
      });
      // Optionally, emit an event to notify parent component to refresh data
      emit("emit");
    }
  } catch (error) {
    console.error("Error deleting oil:", error);
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
        <th>Extended Price</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="oil in oils" :key="oil.id">
        <td>{{ oil.type }}</td>
        <td>{{ oil.quantity }}</td>
        <td>{{ formatCurrency(oil.cost) }}</td>
        <td>{{ formatCurrency(oil.price_per_unit) }}</td>
        <td>{{ formatCurrency(oil.quantity * oil.price_per_unit) }}</td>
        <td>
          <!-- Actions such as Edit/Delete can be added here -->
          <Button
            class="btn btn-sm btn-primary"
            @click="router.push(`/oil/${oil.id}/edit`)"
            >Edit</Button
          >
          <Button class="btn btn-sm btn-danger" @click="deleteOil(oil.id)"
            >Delete</Button
          >
        </td>
      </tr>
    </tbody>
  </table>
</template>
