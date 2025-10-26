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
  return data.value && "customer" in data.value
    ? (data.value.customer as customerWithRelations)
    : null;
});
</script>
<template>
  <div>
    <customerCardComponent v-if="customer" :customer="customer" />
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
      <carCardComponent
        v-if="customer && customer.cars"
        v-for="car in customer.cars"
        :key="car.id"
        :car="{ ...car, customer: customer }"
      />
    </div>
    <NuxtPage />
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
