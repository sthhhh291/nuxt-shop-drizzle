<script setup lang="ts">
import type { customerWithRelations } from "~~/db/schema";
const customer = defineProps<{ customer: customerWithRelations }>();
const emit = defineEmits(["customerUpdated"]);

const fetchCustomer = () => {
  // Re-emit the event so a parent or layout can handle refetching the customer data.
  emit("customerUpdated");
};
</script>

<template>
  <EditCustomerComponent
    :customer="customer.customer"
    @customer-updated="fetchCustomer"
  />
</template>
