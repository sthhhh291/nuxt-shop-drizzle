<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <button 
    :class="buttonClasses"
    :disabled="disabled || loading"
    :type="type"
    @click="handleClick"
  >
    <!-- Simple icon rendering without UIcon to avoid import issues -->
    <span v-if="icon" :class="iconClasses">{{ icon }}</span>
    <span v-if="loading" class="animate-spin">⏳</span>
    <slot />
    <span v-if="trailingIcon" :class="iconClasses">{{ trailingIcon }}</span>
  </button>
</template>

<script setup lang="ts">
// Simplified interface to avoid complex dependencies
interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  disabled?: boolean
  loading?: boolean
  icon?: string
  trailingIcon?: string
  type?: 'button' | 'submit' | 'reset'
  description?: string // Legacy prop for backward compatibility
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  type: 'button'
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

// Compute button classes using Tailwind
const getButtonClasses = () => {
  const baseClasses = 'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  // Size classes
  const sizeClasses = {
    xs: 'px-2 py-1 text-xs rounded',
    sm: 'px-3 py-1.5 text-sm rounded',
    md: 'px-4 py-2 text-sm rounded-md',
    lg: 'px-5 py-2.5 text-base rounded-md',
    xl: 'px-6 py-3 text-base rounded-lg'
  }
  
  // Variant classes
  const variantClasses = {
    primary: 'bg-emerald-600 text-white border-transparent hover:bg-emerald-700 focus:ring-emerald-500 active:bg-emerald-800',
    secondary: 'bg-gray-100 text-gray-900 border-transparent hover:bg-gray-200 focus:ring-gray-500 active:bg-gray-300',
    outline: 'bg-transparent text-emerald-600 border border-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 focus:ring-emerald-500 active:bg-emerald-100',
    ghost: 'bg-transparent text-gray-600 border-transparent hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-500 active:bg-gray-200',
    danger: 'bg-red-600 text-white border-transparent hover:bg-red-700 focus:ring-red-500 active:bg-red-800'
  }
  
  return `${baseClasses} ${sizeClasses[props.size]} ${variantClasses[props.variant]}`
}

const getIconClasses = () => {
  const sizeMap = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4', 
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-5 h-5'
  }
  return sizeMap[props.size]
}

const buttonClasses = getButtonClasses()
const iconClasses = getIconClasses()

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<style scoped>
/* Any additional custom styles if needed */
</style>
