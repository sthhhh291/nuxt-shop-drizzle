<script setup lang="ts">
import type { customerWithRelations } from "~~/db/schema";
defineProps<{
  customer: customerWithRelations;
}>();
</script>

<template>
  <table class="table">
    <thead>
      <tr>
        <th>First Name</th>
        <th>Last Name</th>
        <th v-for="phone in customer.phones" :key="phone.id">
          {{ phone.phone_type }} Phone
        </th>
      </tr>
    </thead>
    <tbody>
      <tr :key="customer.id">
        <td>{{ customer.first_name }}</td>
        <td>{{ customer.last_name }}</td>
        <td v-for="phone in customer.phones" :key="phone.id">
          {{ phone.phone_number }}
        </td>
      </tr>
    </tbody>
  </table>
</template>
