<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <UIcon name="i-heroicons-wrench-screwdriver" class="text-4xl text-primary-600 dark:text-primary-400 mx-auto mb-4" />
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Sign Up
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Create your Shop Manager account
        </p>
      </div>

      <UCard>
        <UForm 
          :state="formData" 
          @submit="register"
          class="space-y-6"
        >
          <UFormGroup label="Username" name="username" required>
            <UInput
              v-model="formData.username"
              type="text"
              placeholder="Enter your username"
              icon="i-heroicons-user"
              size="lg"
              required
            />
          </UFormGroup>

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
              placeholder="Create a password"
              icon="i-heroicons-lock-closed"
              size="lg"
              required
            />
          </UFormGroup>

          <div class="space-y-4">
            <UAlert
              v-if="errorMessage"
              color="error"
              :title="errorMessage"
              :close-button="{ }"
              @close="errorMessage = ''"
            />

            <UButton 
              type="submit" 
              block 
              size="lg"
              icon="i-heroicons-user-plus"
              :loading="isSubmitting"
            >
              Create Account
            </UButton>
            
            <div class="text-center">
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Already have an account?
                <NuxtLink to="/login" class="text-primary-600 dark:text-primary-400 hover:underline font-medium">
                  Sign in
                </NuxtLink>
              </p>
            </div>
          </div>
        </UForm>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
const { signUp } = useAuthClient();
const { refresh } = useBetterAuth();

const formData = reactive({
  username: "",
  email: "",
  password: "",
});

const errorMessage = ref("");
const isSubmitting = ref(false);

const register = async () => {
  isSubmitting.value = true;
  errorMessage.value = "";

  try {
    await signUp.email({
      name: formData.username,
      email: formData.email,
      password: formData.password,
    });
    console.log("Registration successful");
    // Refresh auth state to update layout
    await refresh();
    // Redirect to home after successful registration
    await navigateTo('/');
  } catch (error) {
    console.error("Registration failed:", error);
    errorMessage.value = "Registration failed. Please try again.";
  } finally {
    isSubmitting.value = false;
  }
};
</script>
