<script setup lang="ts">
import type { Labor } from "~~/db/schema";
const router = useRouter();
defineProps<{
  labor: Labor[];
}>();

const deleteLabor = async (id: number) => {
  try {
    if (confirm("Are you sure you want to delete this labor entry?")) {
      await useFetch(`/api/labor/${id}`, {
        method: "DELETE",
      });
      refreshNuxtData();
      // router.go(0); // Refresh the page to reflect changes
    }
  } catch (error) {
    console.error("Error deleting labor:", error);
  }
};
</script>

<template>
  <table class="table">
    <thead>
      <tr>
        <th>Description</th>
        <th>Hours</th>
        <th>Price</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="lab in labor" :key="lab.id">
        <td>{{ lab.description }}</td>
        <td>{{ lab.hours }}</td>
        <td>{{ lab.price }}</td>
        <td>
          <Button @click="router.push(`/labor/${lab.id}/edit`)">Edit</Button>
          <Button @click="deleteLabor(lab.id)">Delete</Button>
        </td>
      </tr>
    </tbody>
  </table>
</template>
