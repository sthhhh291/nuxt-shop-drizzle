<template>
  <div class="card-demo-page">
    <CardExamples />
  </div>
</template>

<script setup lang="ts">
import  CardExamples from '~~/app/components/examples/CardExamples.vue';
// This page demonstrates the Card component usage
useHead({
  title: 'Card Component Demo',
  meta: [
    { name: 'description', content: 'Demonstration of the generic Card component' }
  ]
})
</script>

<style scoped>
.card-demo-page {
  min-height: 100vh;
  background: #f9fafb;
  padding: 1rem;
}
</style>