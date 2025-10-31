<script setup lang="ts">
import Input from "~/components/Input.vue";
import type { Labor } from "~~/db/schema";
const { id } = useRoute().params;
const router = useRouter();
const { data } = await useFetch(`/api/labor/${id}`, {
  method: "GET",
});
console.log("Labor data:", data.value);
const labor = ref(data.value as Labor);

const calcLaborPrice = () => {
  labor.value.price = labor.value.hours * labor.value.rate;
};

const updateLabor = async () => {
  try {
    await useFetch(`/api/labor/${id}`, {
      method: "PUT",
      body: labor,
    });
    router.back();
  } catch (error) {
    console.error("Error updating labor:", error);
  }
};
</script>

<template>
  <div class="labor-edit">
    <h1>Edit Labor Entry: {{ labor.description }}</h1>
    <form @submit.prevent="updateLabor">
      <div>
        <label for="description">Description:</label>
        <Input
          id="description"
          v-model="labor.description"
          type="text"
          @input="calcLaborPrice"
          required
        />
      </div>
      <div>
        <label for="hours">Hours:</label>
        <Input
          id="hours"
          v-model.number="labor.hours"
          type="number"
          step="0.1"
          @input="calcLaborPrice"
          required
        />
      </div>
      <div>
        <label for="rate">Rate:</label>
        <Input
          id="rate"
          v-model.number="labor.rate"
          type="number"
          step="5"
          required
        />
      </div>
      <div>
        <label for="price">Price</label>
        <Input
          id="price"
          v-model="labor.price"
          type="number"
          step="0.01"
          required
        />
      </div>
      <Button type="submit">Save Changes</Button>
      <Button type="button" @click="router.back()">Cancel</Button>
    </form>
  </div>
</template>
