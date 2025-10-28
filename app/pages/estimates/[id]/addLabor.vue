<script setup lang="ts">
import { ref, computed } from "vue";
const { id } = useRoute().params;
const labor = ref({
  description: "",
  hours: 0,
  price: 0,
  rate: 125,
  estimate_id: Number(id),
});

const hours = computed<string>({
  get: () => String(labor.value.hours),
  set: (val: string) => {
    const n = Number(val);
    labor.value.hours = Number.isNaN(n) ? 0 : n;
  },
});

const price = computed<string>({
  get: () => String(labor.value.price),
  set: (val: string) => {
    const n = Number(val);
    labor.value.price = Number.isNaN(n) ? 0 : n;
  },
});

const submitLabor = async () => {
  try {
    await useFetch("/api/labor", {
      method: "POST",
      body: {
        ...labor.value,
        hours: Number(labor.value.hours),
        price: Number(labor.value.price),
        rate: Number(labor.value.rate),
      },
    });
    useRouter().push(`/estimates/${id}`);
  } catch (error) {
    console.error("Error adding labor:", error);
  }
};
</script>

<template>
  <div>
    <h1>Add Labor to Estimate {{ id }}</h1>
    <form class="center" @submit.prevent="submitLabor">
      <div>
        <label for="description">Description:</label>
        <Input
          id="description"
          v-model="labor.description"
          type="text"
          required
        />
      </div>
      <div>
        <label for="hours">Hours:</label>
        <Input id="hours" v-model="labor.hours" type="number" required />
      </div>
      <div>
        <label for="rate">Labor Rate:</label>
        <Input id="rate" v-model="labor.rate" type="number" required />
      </div>
      <div>
        <label for="price">Price:</label>
        <Input id="price" v-model="labor.price" type="number" required />
      </div>
      <Button type="submit">Add Labor</Button>
      <Button @click="useRouter().push(`/estimates/${id}`)">Cancel</Button>
    </form>
  </div>
</template>
