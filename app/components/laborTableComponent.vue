<script setup lang="ts">
import type { Labor } from "~~/db/schema";
const router = useRouter();
const props = defineProps<{
  labor: Labor[];
}>();

const laborRef = ref<Labor[]>(props.labor);
console.log("Labor data in component:", laborRef.value);
// const refreshNuxtData = useNuxtApp().$refreshNuxtData;

const deleteLabor = async (id: number) => {
  try {
    if (confirm("Are you sure you want to delete this labor entry?")) {
      await useFetch(`/api/labor/${id}`, {
        method: "DELETE",
      });
      laborRef.value = laborRef.value.filter((lab) => lab.id !== id);
      // laborRef.value = { ...laborRef.value };
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
      <tr v-for="lab in laborRef" :key="lab.id">
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
