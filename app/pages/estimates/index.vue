<script setup lang="ts">
const { data, refresh } = await useFetch("/api/estimates", {
  method: "GET",
});
const estimates = computed(() => {
  return data.value && "estimates" in data.value ? data.value.estimates : [];
});
provide("refreshEstimates", refresh);
</script>
<template>
  <div class="container">
    <estimatesComponent :estimates="estimates" />
    <addEstimateComponent @estimateAdded="refresh" />
  </div>
</template>
<style scoped>
.container {
  max-width: 800px;
  display: grid;
  grid-template-columns: 2fr 1fr;
  place-items: center;
}
.space-y-8 > * + * {
  margin-top: 2rem;
}
.space-y-4 > * + * {
  margin-top: 1rem;
}
.border-b {
  border-bottom: 1px solid #e5e7eb;
}
.pb-2 {
  padding-bottom: 0.5rem;
}
h1 {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
}
</style>
