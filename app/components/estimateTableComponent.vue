<script setup lang="ts">
import type { estimateWithRelations } from "~~/db/schema";
defineProps<{
  estimate: estimateWithRelations;
}>();
</script>
<template>
  <table class="table">
    <thead>
      <tr>
        <th>ID</th>
        <th>Date</th>
        <th>Hours</th>
        <th>Estimate Type</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>{{ estimate.id }}</td>
        <td>{{ estimate.date }}</td>
        <td>{{ estimate.hours_taken }}</td>
        <td>{{ estimate.estimate_type }}</td>
      </tr>
    </tbody>
  </table>
</template>
