<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <input
    :value="modelValue"
    :type="type"
    :placeholder="placeholder"
    @input="onInput"
  />
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string;
  type?: string;
  placeholder?: string;
}>();

const emit = defineEmits<(e: "update:modelValue", value: string) => void>();

function onInput(e: Event) {
  const target = e.target as HTMLInputElement | null;
  const value = target?.value ?? "";
  emit("update:modelValue", value);
}
</script>

<style scoped>
input {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
}
</style>
