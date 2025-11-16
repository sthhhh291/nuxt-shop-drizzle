<script lang="ts" setup>
const { signIn } = useAuthClient();
const { refresh } = useBetterAuth();

const formData = reactive({
  email: "",
  password: "",
});

const login = async (e: Event) => {
  try {
    e.preventDefault();
    await signIn.email({
      email: formData.email,
      password: formData.password,
    });
    // Refresh auth state to update layout
    await refresh();
    // Redirect to home after successful login
    await navigateTo('/');
  } catch (error) {
    console.error("Login failed:", error);
  }
};

definePageMeta({
  title: "Signin",
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <UIcon name="i-heroicons-wrench-screwdriver" class="text-4xl text-primary-600 dark:text-primary-400 mx-auto mb-4" />
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Sign In
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Welcome back to Shop Manager
        </p>
      </div>

      <UCard>
        <UForm 
          :state="formData" 
          @submit="login"
          class="space-y-6"
        >
          <UFormGroup label="Email" name="email" required>
            <UInput
              v-model="formData.email"
              type="email"
              placeholder="Enter your email"
              icon="i-heroicons-envelope"
              size="lg"
              required
            />
          </UFormGroup>

          <UFormGroup label="Password" name="password" required>
            <UInput
              v-model="formData.password"
              type="password"
              placeholder="Enter your password"
              icon="i-heroicons-lock-closed"
              size="lg"
              required
            />
          </UFormGroup>

          <div class="space-y-4">
            <UButton 
              type="submit" 
              block 
              size="lg"
              icon="i-heroicons-arrow-right-on-rectangle"
            >
              Sign In
            </UButton>
            
            <div class="text-center">
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?
                <NuxtLink to="/register" class="text-primary-600 dark:text-primary-400 hover:underline font-medium">
                  Sign up
                </NuxtLink>
              </p>
            </div>
          </div>
        </UForm>
      </UCard>
    </div>
  </div>
</template>
