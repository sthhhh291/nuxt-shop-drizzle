<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <UButton
    :variant="uiVariant"
    :size="size"
    :disabled="disabled || loading"
    :loading="loading"
    :icon="icon"
    :trailing-icon="trailingIcon"
    :type="type"
    :color="color"
    :block="block"
    :square="square"
    :padded="padded"
    @click="handleClick"
    v-bind="$attrs">
    <template v-if="$slots.icon" #icon>
      <slot name="icon" />
    </template>
    <template v-if="$slots.trailing" #trailing>
      <slot name="trailing" />
    </template>
    <slot />
  </UButton>
</template>

<script setup lang="ts">
interface Props {
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "danger"
    | "solid"
    | "soft"
    | "subtle"
    | "link";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  trailingIcon?: string;
  type?: "button" | "submit" | "reset";
  color?:
    | "primary"
    | "secondary"
    | "success"
    | "info"
    | "warning"
    | "error"
    | "neutral";
  block?: boolean;
  square?: boolean;
  padded?: boolean;
  // Legacy props for backward compatibility
  description?: string;
}

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<Props>(), {
  variant: "primary",
  size: "md",
  disabled: false,
  loading: false,
  type: "button",
  color: "primary",
  block: false,
  square: false,
  padded: true,
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

// Map custom variants to NuxtUI variants
const uiVariant = computed(
  (): "outline" | "ghost" | "solid" | "soft" | "subtle" | "link" => {
    const variantMap: Record<
      string,
      "outline" | "ghost" | "solid" | "soft" | "subtle" | "link"
    > = {
      primary: "solid",
      secondary: "soft",
      outline: "outline",
      ghost: "ghost",
      danger: "solid",
      solid: "solid",
      soft: "soft",
      subtle: "subtle",
      link: "link",
    };
    return variantMap[props.variant] || "solid";
  }
);

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit("click", event);
  }
};
</script>
