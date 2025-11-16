<template>
  <div 
    :class="cardClasses"
    :style="customStyles"
    @click="handleClick"
  >
    <!-- Header slot -->
    <div v-if="$slots.header || title" class="card-header" :class="headerClasses">
      <slot name="header">
        <h3 v-if="title" class="card-title">{{ title }}</h3>
      </slot>
      <div v-if="$slots.actions" class="card-actions">
        <slot name="actions"></slot>
      </div>
    </div>

    <!-- Main content -->
    <div class="card-content" :class="contentClasses">
      <slot></slot>
    </div>

    <!-- Footer slot -->
    <div v-if="$slots.footer" class="card-footer" :class="footerClasses">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  // Content
  title?: string
  
  // Layout
  variant?: 'default' | 'outlined' | 'elevated' | 'flat'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full'
  
  // Styling
  background?: string
  border?: boolean
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  
  // Behavior
  clickable?: boolean
  hover?: boolean
  disabled?: boolean
  
  // Layout
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  
  // Custom classes
  class?: string
  headerClass?: string
  contentClass?: string
  footerClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'md',
  rounded: 'md',
  shadow: 'sm',
  border: true,
  clickable: false,
  hover: true,
  disabled: false,
  padding: 'md',
  gap: 'md'
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

// Computed classes
const cardClasses = computed(() => [
  'card',
  `card--${props.variant}`,
  `card--${props.size}`,
  `card--rounded-${props.rounded}`,
  `card--shadow-${props.shadow}`,
  `card--padding-${props.padding}`,
  `card--gap-${props.gap}`,
  {
    'card--border': props.border,
    'card--clickable': props.clickable,
    'card--hover': props.hover && !props.disabled,
    'card--disabled': props.disabled,
  },
  props.class
])

const headerClasses = computed(() => [
  'card-header--default',
  props.headerClass
])

const contentClasses = computed(() => [
  'card-content--default',
  props.contentClass
])

const footerClasses = computed(() => [
  'card-footer--default',
  props.footerClass
])

const customStyles = computed(() => ({
  backgroundColor: props.background || undefined
}))

// Handle click events
const handleClick = (event: MouseEvent) => {
  if (props.clickable && !props.disabled) {
    emit('click', event)
  }
}
</script>

<style scoped>
/* Base card styles using regular CSS */
.card {
  display: flex;
  flex-direction: column;
  background: white;
  transition: all 0.2s ease-in-out;
  position: relative;
  overflow: hidden;
}

/* Variants */
.card--default {
  background: white;
  border: 1px solid #e5e7eb;
}

.card--outlined {
  background: transparent;
  border: 2px solid #d1d5db;
}

.card--elevated {
  background: white;
  border: none;
}

.card--flat {
  background: #f9fafb;
  border: none;
  box-shadow: none !important;
}

/* Sizes */
.card--sm {
  min-height: 80px;
}

.card--md {
  min-height: 120px;
}

.card--lg {
  min-height: 160px;
}

.card--xl {
  min-height: 200px;
}

/* Rounded corners */
.card--rounded-none {
  border-radius: 0;
}

.card--rounded-sm {
  border-radius: 0.125rem;
}

.card--rounded-md {
  border-radius: 0.375rem;
}

.card--rounded-lg {
  border-radius: 0.5rem;
}

.card--rounded-full {
  border-radius: 9999px;
}

/* Shadows */
.card--shadow-none {
  box-shadow: none;
}

.card--shadow-sm {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.card--shadow-md {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.card--shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.card--shadow-xl {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Padding */
.card--padding-none {
  padding: 0;
}

.card--padding-sm {
  padding: 0.5rem;
}

.card--padding-md {
  padding: 1rem;
}

.card--padding-lg {
  padding: 1.5rem;
}

.card--padding-xl {
  padding: 2rem;
}

/* Gap between sections */
.card--gap-none .card-header,
.card--gap-none .card-content,
.card--gap-none .card-footer {
  margin-bottom: 0;
}

.card--gap-sm .card-header,
.card--gap-sm .card-content {
  margin-bottom: 0.5rem;
}

.card--gap-md .card-header,
.card--gap-md .card-content {
  margin-bottom: 1rem;
}

.card--gap-lg .card-header,
.card--gap-lg .card-content {
  margin-bottom: 1.5rem;
}

.card--gap-xl .card-header,
.card--gap-xl .card-content {
  margin-bottom: 2rem;
}

/* Interactive states */
.card--clickable {
  cursor: pointer;
}

.card--hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.card--disabled {
  opacity: 0.6;
  cursor: not-allowed;
  pointer-events: none;
}

/* Header styles */
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #f3f4f6;
  padding-bottom: 0.75rem;
}

.card-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.card-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Content styles */
.card-content {
  flex: 1;
  color: #374151;
  line-height: 1.6;
}

/* Footer styles */
.card-footer {
  border-top: 1px solid #f3f4f6;
  padding-top: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Remove bottom margin from last content/footer */
.card-content:last-child,
.card-footer:last-child {
  margin-bottom: 0;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .card--padding-md {
    padding: 0.75rem;
  }
  
  .card--padding-lg {
    padding: 1rem;
  }
  
  .card--padding-xl {
    padding: 1.25rem;
  }
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .card-actions {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>