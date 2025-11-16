<template>
  <div class="card-examples">
    <h1 class="text-3xl font-bold mb-8">Card Component Examples</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Basic Card -->
      <Card title="Basic Card" class="bg-white">
        <p class="text-gray-600">This is a basic card with default styling.</p>
        <template #footer>
          <Button variant="primary" size="sm">Action</Button>
        </template>
      </Card>

      <!-- Outlined Card -->
      <Card title="Outlined Card" variant="outlined" class="bg-white">
        <p class="text-gray-600">This card has an outlined variant style.</p>
        <template #footer>
          <Button variant="secondary" size="sm">Secondary</Button>
        </template>
      </Card>

      <!-- Elevated Card -->
      <Card title="Elevated Card" variant="elevated" class="bg-white">
        <p class="text-gray-600">This card has an elevated shadow effect.</p>
        <template #actions>
          <Button variant="ghost" size="sm">•••</Button>
        </template>
        <template #footer>
          <Button variant="primary" size="sm">Learn More</Button>
        </template>
      </Card>

      <!-- Card with custom background -->
      <Card title="Custom Background" background="#f0f9ff" class="border border-blue-200">
        <p class="text-blue-700">This card has a custom background color.</p>
      </Card>

      <!-- Large Card -->
      <Card title="Large Card" size="lg" class="bg-white md:col-span-2">
        <p class="text-gray-600 mb-4">This is a larger card that spans multiple columns on larger screens.</p>
        <div class="space-y-2">
          <p class="text-sm text-gray-500">• Feature one</p>
          <p class="text-sm text-gray-500">• Feature two</p>
          <p class="text-sm text-gray-500">• Feature three</p>
        </div>
        <template #footer>
          <div class="flex gap-2">
            <Button variant="primary" size="sm">Primary</Button>
            <Button variant="secondary" size="sm">Secondary</Button>
          </div>
        </template>
      </Card>

      <!-- Clickable Card -->
      <Card 
        title="Clickable Card" 
        clickable 
        hover 
        class="bg-white cursor-pointer"
        @click="handleCardClick"
      >
        <p class="text-gray-600">Click me! I'm interactive.</p>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
// Import components
import Card from '../Card.vue'
import Button from '../Button.vue'

const handleCardClick = () => {
  alert('Card clicked!')
}
</script>

<style scoped>
.card-examples {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}
</style>