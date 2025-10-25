<script setup lang="ts">
// import { form } from "#build/ui";
import type { customerWithRelations } from "~~/db/schema";
const showForm = ref(false);
const route = useRoute();
const { data } = await useFetch(`/api/customers/${route.params.id}`, {
  method: "GET",
});
const customer = computed(() => {
  return data.value && "customer" in data.value
    ? (data.value.customer as customerWithRelations)
    : null;
});
</script>
<template>
  <div>
    <customerCardComponent v-if="customer" :customer="customer" />
    <div v-if="!showForm" id="buttons">
      <!-- placeholder for action buttons -->
      <button>Edit Customer</button><button>Delete Customer</button>
      <button>Add Phone Number</button>
      <button>Add Email</button>
      <button>Add Address</button>
      <button>Add Car</button>
    </div>
    <div class="">
      <h2>Cars</h2>
      <carCardComponent
        v-if="customer && customer.cars"
        v-for="car in customer.cars"
        :key="car.id"
        :car="{ ...car, customer: customer }"
      />
    </div>
  </div>
</template>
<style scoped>
.customer-details {
  border: 1px solid #ccc;
  padding: 1em;
  border-radius: 5px;
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
button {
  margin-right: 1rem;
  padding: 4px;
  background-color: rgb(118, 150, 117);
  color: white;
  border-radius: 2%;
}
button:hover {
  background-color: rgb(127, 127, 199);
}
</style>
