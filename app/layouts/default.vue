<script setup lang="ts">
const { session, loading, user, isAuthenticated } = useBetterAuth();

// Mobile menu state
const isMobileMenuOpen = ref(false);

// Create a reactive key that changes when auth state changes
const authKey = computed(
  () => `${isAuthenticated.value}-${user.value?.id || "none"}`
);

// Minimal logging only for authentication changes (not on every render)
watch(isAuthenticated, (newAuth, oldAuth) => {
  if (oldAuth !== undefined && oldAuth !== newAuth) {
    console.log("Auth status changed:", newAuth);
  }
});

// Close mobile menu on route change
const route = useRoute();
watch(() => route.path, () => {
  isMobileMenuOpen.value = false;
});
</script>

<template>
  <div :key="authKey" class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <UIcon name="i-heroicons-arrow-path" class="animate-spin text-3xl text-primary-500 mb-4" />
        <p class="text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    </div>

    <!-- Unauthenticated State -->
    <div v-else-if="!isAuthenticated" class="min-h-screen flex items-center justify-center">
      <UCard class="w-full max-w-md">
        <div class="text-center space-y-6">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Shop Management
            </h1>
            <p class="text-gray-600 dark:text-gray-400">
              Please sign in to continue
            </p>
          </div>
          
          <div class="space-y-3">
            <UButton 
              block 
              to="/auth/login"
              icon="i-heroicons-arrow-right-on-rectangle"
            >
              Sign In
            </UButton>
            
            <UButton 
              block 
              variant="outline"
              to="/auth/signup"
              icon="i-heroicons-user-plus"
            >
              Sign Up
            </UButton>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Authenticated Layout -->
    <div v-else>
      <!-- Navigation Header -->
      <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <UContainer>
          <nav class="flex items-center justify-between h-16">
            <!-- Logo/Brand -->
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-wrench-screwdriver" class="text-2xl text-primary-600 dark:text-primary-400" />
              <h1 class="text-xl font-bold text-gray-900 dark:text-white">
                Shop Manager
              </h1>
            </div>

            <!-- Navigation Links -->
            <div class="hidden md:flex items-center gap-1">
              <UButton 
                variant="ghost" 
                to="/"
                :class="{ 'bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400': $route.path === '/' }"
              >
                <UIcon name="i-heroicons-home" class="mr-2" />
                Dashboard
              </UButton>
              
              <UButton 
                variant="ghost" 
                to="/customers"
                :class="{ 'bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400': $route.path.startsWith('/customers') }"
              >
                <UIcon name="i-heroicons-users" class="mr-2" />
                Customers
              </UButton>
              
              <UButton 
                variant="ghost" 
                to="/cars"
                :class="{ 'bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400': $route.path.startsWith('/cars') }"
              >
                <UIcon name="i-heroicons-truck" class="mr-2" />
                Cars
              </UButton>
              
              <UButton 
                variant="ghost" 
                to="/estimates"
                :class="{ 'bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400': $route.path.startsWith('/estimates') }"
              >
                <UIcon name="i-heroicons-document-text" class="mr-2" />
                Estimates
              </UButton>
              <UButton variant="ghost" to="/reports"
                :class="{ 'bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400': $route.path.startsWith('/reports') }"
              >
                <UIcon name="i-heroicons-chart-bar" class="mr-2" />
                Reports
              </UButton>
            </div>

            <!-- User Menu -->
            <div class="flex items-center gap-4">
              <!-- User Info -->
              <div class="hidden sm:flex items-center gap-3">
                <UAvatar
                  :alt="user?.name || user?.email || 'User'"
                  size="sm"
                  class="bg-primary-500 dark:bg-primary-400"
                >
                  {{ (user?.name || user?.email || 'U')?.[0]?.toUpperCase() }}
                </UAvatar>
                
                <div class="text-sm">
                  <p class="font-medium text-gray-900 dark:text-white">
                    {{ user?.name || 'User' }}
                  </p>
                  <p class="text-gray-500 dark:text-gray-400">
                    {{ user?.email }}
                  </p>
                </div>
              </div>

              <!-- Sign Out -->
              <Signout />

              <!-- Mobile menu button (placeholder) -->
              <UButton 
                variant="ghost" 
                icon="i-heroicons-bars-3"
                class="md:hidden"
                @click="isMobileMenuOpen = !isMobileMenuOpen"
              />
            </div>
          </nav>

          <!-- Mobile Navigation -->
          <div v-if="isMobileMenuOpen" class="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <div class="space-y-2">
              <UButton 
                block 
                variant="ghost" 
                to="/"
                @click="isMobileMenuOpen = false"
              >
                <UIcon name="i-heroicons-home" class="mr-2" />
                Dashboard
              </UButton>
              
              <UButton 
                block 
                variant="ghost" 
                to="/customers"
                @click="isMobileMenuOpen = false"
              >
                <UIcon name="i-heroicons-users" class="mr-2" />
                Customers
              </UButton>
              
              <UButton 
                block 
                variant="ghost" 
                to="/cars"
                @click="isMobileMenuOpen = false"
              >
                <UIcon name="i-heroicons-truck" class="mr-2" />
                Cars
              </UButton>
              
              <UButton 
                block 
                variant="ghost" 
                to="/estimates"
                @click="isMobileMenuOpen = false"
              >
                <UIcon name="i-heroicons-document-text" class="mr-2" />
                Estimates
              </UButton>
            </div>
          </div>
        </UContainer>
      </header>

      <!-- Main Content -->
      <main class="flex-1">
        <NuxtPage />
      </main>
    </div>
  </div>
</template>


