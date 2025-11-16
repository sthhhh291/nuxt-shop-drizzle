<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-4xl font-bold text-gray-900 mb-8 text-center">
        🎉 Tailwind CSS is Working!
      </h1>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <!-- Card with Tailwind classes -->
        <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
          <h3 class="text-xl font-semibold text-gray-800 mb-3">Pure Tailwind Card</h3>
          <p class="text-gray-600 mb-4">This card is built entirely with Tailwind CSS utility classes.</p>
          <div class="flex items-center justify-between">
            <span class="text-sm text-blue-600 font-medium">Tailwind CSS</span>
            <div class="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
        </div>

        <!-- Card with gradient -->
        <div class="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-md p-6 text-white">
          <h3 class="text-xl font-semibold mb-3">Gradient Card</h3>
          <p class="text-purple-100 mb-4">Showcasing Tailwind's gradient utilities.</p>
          <button class="bg-white text-purple-600 px-4 py-2 rounded-md font-medium hover:bg-purple-50 transition-colors">
            Click Me
          </button>
        </div>

        <!-- Nuxt UI Component Card -->
        <UCard class="hover:shadow-lg transition-shadow duration-200">
          <template #header>
            <h3 class="text-xl font-semibold text-gray-800">Nuxt UI Card</h3>
          </template>
          
          <p class="text-gray-600 mb-4">This uses the Nuxt UI Card component with Tailwind classes.</p>
          
          <div class="flex gap-2">
            <UBadge color="primary" variant="soft">Nuxt UI</UBadge>
            <UBadge color="success" variant="soft">Tailwind</UBadge>
          </div>
        </UCard>
      </div>

      <!-- Button Examples -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Button Examples</h2>
        
        <div class="flex flex-wrap gap-4 mb-4">
          <button class="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors">
            Pure Tailwind
          </button>
          <UButton color="primary">Nuxt UI Button</UButton>
          <UButton color="secondary" variant="outline">Outlined</UButton>
          <UButton color="success" size="sm">Small Success</UButton>
        </div>
      </div>

      <!-- Form Example -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Form Example</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Pure Tailwind Form -->
          <div>
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Pure Tailwind Form</h3>
            <form class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input 
                  type="text" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  type="email" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>
              <button 
                type="submit"
                class="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                Submit
              </button>
            </form>
          </div>

          <!-- Nuxt UI Form -->
          <div>
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Nuxt UI Form</h3>
            <UForm class="space-y-4">
              <UFormGroup label="Name">
                <UInput placeholder="Enter your name" />
              </UFormGroup>
              <UFormGroup label="Email">
                <UInput type="email" placeholder="Enter your email" />
              </UFormGroup>
              <UButton type="submit" block>Submit</UButton>
            </UForm>
          </div>
        </div>
      </div>

      <!-- Responsive Grid -->
      <div class="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Responsive Grid</h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div v-for="i in 12" :key="i" class="bg-gradient-to-br from-indigo-400 to-purple-500 rounded-lg p-4 text-white text-center font-semibold">
            {{ i }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Tailwind CSS Test - Working!',
  meta: [
    { name: 'description', content: 'Testing Tailwind CSS integration with Nuxt UI' }
  ]
})
</script>

<style scoped>
/* Custom styles if needed - Tailwind handles most styling */
</style>