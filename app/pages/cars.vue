<script setup lang="ts">
import type { carWithRelations } from "~~/db/schema";

const { data: cars } = await useFetch<carWithRelations[]>("/api/cars", {
  method: "GET",
});
</script>

<template>
  <div>
    <div class="">
      <h2>All Cars</h2>
      <carCardComponent
        v-if="cars"
        v-for="car in cars"
        :key="car.id"
        :car="car" />
    </div>
  </div>
</template>
