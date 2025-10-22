<script setup lang="ts">
// import customerCardComponent from "~~/components/customerCardComponent.vue";
import type { customerWithRelations } from "~~/db/schema";
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
    <div class="">
      <h2>Cars</h2>
      <carCardComponent v-for="car in customer.cars" :key="car.id" :car="car" />
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
</style>
