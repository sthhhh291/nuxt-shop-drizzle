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
      <div v-for="car in cars" :key="car.id" class="">
        <NuxtLink :to="`/cars/${car.id}`">
          <carCardComponent W :car="car" />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
