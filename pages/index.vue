<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-semibold">Nuxt Shop</h1>
          </div>

          <div class="flex items-center space-x-4">
            <div
              v-if="status === 'authenticated'"
              class="flex items-center space-x-4">
              <span class="text-gray-700"
                >Welcome, {{ data?.user?.name }}!</span
              >
              <UButton @click="handleSignOut" variant="outline">
                Sign out
              </UButton>
            </div>

            <div
              v-else-if="status === 'unauthenticated'"
              class="flex items-center space-x-4">
              <UButton @click="navigateTo('/login')" variant="outline">
                Sign in
              </UButton>
              <UButton @click="navigateTo('/register')"> Sign up </UButton>
            </div>

            <div v-else class="flex items-center space-x-4">
              <span>Loading...</span>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="text-center">
          <h2 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Welcome to Nuxt Shop
          </h2>
          <p class="mt-4 text-lg text-gray-600">
            A modern e-commerce platform built with Nuxt 3, Drizzle ORM, and
            SQLite.
          </p>
        </div>

        <div v-if="status === 'authenticated'" class="mt-8">
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900">
                Your Profile
              </h3>
              <div class="mt-4 space-y-2">
                <p><strong>Name:</strong> {{ data?.user?.name }}</p>
                <p><strong>Email:</strong> {{ data?.user?.email }}</p>
                <p><strong>User ID:</strong> {{ data?.user?.id }}</p>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="mt-8">
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6 text-center">
              <h3 class="text-lg leading-6 font-medium text-gray-900">
                Get Started
              </h3>
              <p class="mt-2 text-gray-600">
                Sign in or create an account to access your personalized
                shopping experience.
              </p>
              <div class="mt-4 space-x-4">
                <UButton @click="navigateTo('/register')" size="lg">
                  Create Account
                </UButton>
                <UButton
                  @click="navigateTo('/login')"
                  variant="outline"
                  size="lg">
                  Sign In
                </UButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
const { data, status, signOut } = useAuth();

const handleSignOut = async () => {
  await signOut({ callbackUrl: "/" });
};
</script>
