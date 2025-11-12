<script setup lang="ts">
// import { form } from "#build/ui";
import type { customerWithRelations } from "~~/db/schema";
const showForm = ref(false);
const route = useRoute();
const router = useRouter();
const { data } = await useFetch(`/api/customers/${route.params.id}`, {
  method: "GET",
});
const customer = computed(() => {
  return data.value && "customer" in data.value ?
      (data.value.customer as customerWithRelations)
    : null;
});
</script>
<template>
  <div>
    <div class="grid-2">
      <customerCardComponent v-if="customer" :customer="customer" />
      <div class="cars card">
        <NuxtLink
          v-if="customer && customer.cars"
          v-for="car in customer.cars"
          :to="`/cars/${car.id}`">
          {{ car.year }} {{ car.make }} {{ car.model }}
        </NuxtLink>
      </div>
    </div>
    <div v-if="!showForm" id="Buttons">
      <!-- placeholder for action Buttons -->
      <Button @click="router.push(`/customers/addPhone/${customer!.id}`)">
        Add Phone Number
      </Button>
      <Button @click="router.push(`/customers/addEmail/${customer!.id}`)">
        Add Email
      </Button>
      <Button @click="router.push(`/customers/addAddress/${customer!.id}`)">
        Add Address
      </Button>
      <Button @click="router.push(`/customers/addCar/${customer!.id}`)">
        Add Car
      </Button>
    </div>
    <div class="">
      <h2>Cars</h2>
    </div>
  </div>
</template>
<style scoped>
.grid-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1em;
}
.customer-details {
  border: 1px solid #ccc;
  padding: 1em;
  border-radius: 5px;
}
.cars {
  border: 1px solid #ccc;
  padding: 1em;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}
h1 {
  font-size: 2em;
  margin-bottom: 0.5em;
}
p {
  font-size: 1.2em;
  margin: 0.3em 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  margin-bottom: 0.5em;
}
</style>
