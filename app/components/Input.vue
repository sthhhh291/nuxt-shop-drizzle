<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <UInput
    :model-value="modelValue"
    :type="type"
    :placeholder="placeholder"
    :size="size"
    :icon="icon"
    :disabled="disabled"
    :loading="loading"
    :label="label"
    :error="error"
    :color="color"
    :variant="variant"
    @update:model-value="onInput"
    v-bind="$attrs">
    <template v-if="$slots.icon" #icon>
      <slot name="icon" />
    </template>
    <template v-if="$slots.trailing" #trailing>
      <slot name="trailing" />
    </template>
  </UInput>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string | number | null | undefined;
  type?: string;
  placeholder?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  icon?: string;
  disabled?: boolean;
  loading?: boolean;
  label?: string;
  error?: string | boolean;
  color?:
    | "white"
    | "gray"
    | "red"
    | "orange"
    | "amber"
    | "yellow"
    | "lime"
    | "green"
    | "emerald"
    | "teal"
    | "cyan"
    | "sky"
    | "blue"
    | "indigo"
    | "violet"
    | "purple"
    | "fuchsia"
    | "pink"
    | "rose"
    | "primary";
  variant?: "outline" | "none";
}

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<Props>(), {
  type: "text",
  size: "md",
  disabled: false,
  loading: false,
  color: "white",
  variant: "outline",
});

const emit = defineEmits<{
  "update:modelValue": [value: string | number | null | undefined];
}>();

function onInput(value: string | number | null | undefined) {
  emit("update:modelValue", value);
}
</script>
