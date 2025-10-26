<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <button><slot /></button>
</template>
<script setup lang="ts">
defineProps<{
  description?: string;
  // Define any props if needed
}>();
// This is a placeholder component for buttons
</script>
<style scoped>
button {
  padding: 5px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 0.5 rem;
}
button:hover {
  background-color: #369870;
}
</style>
