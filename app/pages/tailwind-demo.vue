<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-7xl mx-auto">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Card Components Demo</h1>
        <p class="text-gray-600">Demonstrating both custom CSS and Tailwind-based card components</p>
      </div>

      <!-- Tailwind Card Examples -->
      <section class="mb-12">
        <h2 class="text-2xl font-semibold text-gray-800 mb-6">Tailwind-Based Cards</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Basic Card -->
          <TailwindCard title="Basic Card" variant="default">
            <p class="text-gray-600">This is a basic card using Tailwind CSS classes for styling.</p>
            <div class="mt-4 flex gap-2">
              <UBadge color="primary" variant="soft">New</UBadge>
              <UBadge color="success" variant="soft">Featured</UBadge>
            </div>
          </TailwindCard>

          <!-- Outlined Card -->
          <TailwindCard title="Outlined Card" variant="outlined" size="lg">
            <template #actions>
              <UButton size="xs" color="neutral" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
            </template>
            <p class="text-gray-600">This card uses the outlined variant with a larger size.</p>
            <template #footer>
              <span class="text-sm text-gray-500">Last updated today</span>
              <UButton size="sm" color="primary">View Details</UButton>
            </template>
          </TailwindCard>

          <!-- Elevated Card -->
          <TailwindCard title="Elevated Card" variant="elevated" :clickable="true" @click="showAlert('Elevated card clicked!')">
            <div class="space-y-3">
              <p class="text-gray-600">This elevated card is clickable and shows a shadow effect.</p>
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-cursor-arrow-rays-20-solid" class="text-blue-500" />
                <span class="text-sm text-blue-600">Click me!</span>
              </div>
            </div>
          </TailwindCard>

          <!-- Flat Card -->
          <TailwindCard variant="flat" size="sm">
            <div class="text-center">
              <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <UIcon name="i-heroicons-chart-bar-20-solid" class="text-white text-xl" />
              </div>
              <h3 class="font-semibold text-gray-900">Analytics</h3>
              <p class="text-2xl font-bold text-purple-600 mt-1">12,345</p>
            </div>
          </TailwindCard>

          <!-- Custom Styled Card -->
          <TailwindCard 
            title="Custom Background" 
            variant="elevated" 
            class="bg-gradient-to-br from-blue-600 to-purple-600 text-white border-0"
            headerClass="border-white/20 text-white"
            footerClass="border-white/20"
          >
            <p class="text-blue-100">This card demonstrates custom styling with gradients and white text.</p>
            <template #footer>
              <UBadge color="neutral" variant="solid">Premium</UBadge>
              <UButton color="neutral" variant="outline" size="sm">Learn More</UButton>
            </template>
          </TailwindCard>

          <!-- Product Card Example -->
          <TailwindCard variant="default" :clickable="true" @click="showAlert('Product card clicked!')">
            <template #header>
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <UIcon name="i-heroicons-shopping-bag-20-solid" class="text-green-600" />
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900">Product Name</h3>
                  <p class="text-sm text-gray-500">Category</p>
                </div>
              </div>
            </template>
            
            <div class="space-y-3">
              <p class="text-gray-600">A comprehensive product description that explains the key features and benefits.</p>
              <div class="flex items-center justify-between">
                <span class="text-2xl font-bold text-green-600">$99.99</span>
                <div class="flex items-center gap-1">
                  <UIcon name="i-heroicons-star-20-solid" class="text-yellow-400" />
                  <span class="text-sm text-gray-600">4.8 (125)</span>
                </div>
              </div>
            </div>

            <template #footer>
              <UButton color="neutral" variant="outline" size="sm">Add to Wishlist</UButton>
              <UButton color="primary" size="sm">Add to Cart</UButton>
            </template>
          </TailwindCard>
        </div>
      </section>

      <!-- Nuxt UI Components Showcase -->
      <section class="mb-12">
        <h2 class="text-2xl font-semibold text-gray-800 mb-6">Nuxt UI Components Integration</h2>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Form Card -->
          <TailwindCard title="Contact Form" variant="default" size="lg">
            <template #actions>
              <UBadge color="info" variant="soft">Required</UBadge>
            </template>
            
            <UForm class="space-y-4">
              <UFormGroup label="Name" required>
                <UInput placeholder="Enter your name" />
              </UFormGroup>
              
              <UFormGroup label="Email" required>
                <UInput type="email" placeholder="Enter your email" />
              </UFormGroup>
              
              <UFormGroup label="Message">
                <UTextarea placeholder="Enter your message" :rows="3" />
              </UFormGroup>
            </UForm>

            <template #footer>
              <UButton color="neutral" variant="outline">Cancel</UButton>
              <UButton color="primary">Send Message</UButton>
            </template>
          </TailwindCard>

          <!-- Stats Card -->
          <TailwindCard title="Dashboard Stats" variant="elevated">
            <div class="grid grid-cols-2 gap-4">
              <div class="text-center p-4 bg-blue-50 rounded-lg">
                <UIcon name="i-heroicons-users-20-solid" class="text-blue-600 text-2xl mb-2 mx-auto" />
                <div class="text-2xl font-bold text-blue-600">1,234</div>
                <div class="text-sm text-gray-600">Total Users</div>
              </div>
              
              <div class="text-center p-4 bg-green-50 rounded-lg">
                <UIcon name="i-heroicons-currency-dollar-20-solid" class="text-green-600 text-2xl mb-2 mx-auto" />
                <div class="text-2xl font-bold text-green-600">$56,789</div>
                <div class="text-sm text-gray-600">Revenue</div>
              </div>
              
              <div class="text-center p-4 bg-purple-50 rounded-lg">
                <UIcon name="i-heroicons-shopping-cart-20-solid" class="text-purple-600 text-2xl mb-2 mx-auto" />
                <div class="text-2xl font-bold text-purple-600">892</div>
                <div class="text-sm text-gray-600">Orders</div>
              </div>
              
              <div class="text-center p-4 bg-orange-50 rounded-lg">
                <UIcon name="i-heroicons-chart-bar-20-solid" class="text-orange-600 text-2xl mb-2 mx-auto" />
                <div class="text-2xl font-bold text-orange-600">98.5%</div>
                <div class="text-sm text-gray-600">Satisfaction</div>
              </div>
            </div>
          </TailwindCard>
        </div>
      </section>

      <!-- Code Examples -->
      <section>
        <h2 class="text-2xl font-semibold text-gray-800 mb-6">Usage Examples</h2>
        
        <TailwindCard title="Code Examples" variant="outlined" size="lg">
          <div class="space-y-6">
            <div>
              <h4 class="font-semibold text-gray-900 mb-2">Basic Usage:</h4>
              <pre class="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto"><code>&lt;TailwindCard title="My Card" variant="default"&gt;
  &lt;p&gt;Card content goes here&lt;/p&gt;
&lt;/TailwindCard&gt;</code></pre>
            </div>
            
            <div>
              <h4 class="font-semibold text-gray-900 mb-2">With Header Actions:</h4>
              <pre class="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto"><code>&lt;TailwindCard title="My Card"&gt;
  &lt;template #actions&gt;
    &lt;UButton size="xs"&gt;Edit&lt;/UButton&gt;
  &lt;/template&gt;
  &lt;p&gt;Content&lt;/p&gt;
&lt;/TailwindCard&gt;</code></pre>
            </div>
            
            <div>
              <h4 class="font-semibold text-gray-900 mb-2">Clickable Card:</h4>
              <pre class="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto"><code>&lt;TailwindCard 
  title="Clickable" 
  :clickable="true"
  @click="handleClick"
  variant="elevated"
&gt;
  &lt;p&gt;Click me!&lt;/p&gt;
&lt;/TailwindCard&gt;</code></pre>
            </div>
          </div>
        </TailwindCard>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
// This page demonstrates both Card components with Tailwind and Nuxt UI
useHead({
  title: 'Tailwind Card Demo',
  meta: [
    { name: 'description', content: 'Demonstration of Tailwind-based card components with Nuxt UI integration' }
  ]
})

const showAlert = (message: string) => {
  alert(message)
}
</script>

<style scoped>
/* Additional custom styles if needed */
</style>