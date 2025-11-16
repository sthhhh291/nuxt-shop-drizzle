<script setup lang="ts">
const { signUp } = useAuthClient();
const { refresh } = useBetterAuth();

const formData = reactive({
  email: "",
  name: "",
  password: "",
  confirmPassword: "",
});

const isLoading = ref(false);
const errorMessage = ref("");

const signup = async () => {
  if (formData.password !== formData.confirmPassword) {
    errorMessage.value = "Passwords do not match.";
    return;
  }

  if (formData.password.length < 6) {
    errorMessage.value = "Password must be at least 6 characters long.";
    return;
  }

  try {
    isLoading.value = true;
    errorMessage.value = "";

    // Call your signup API here
    await signUp.email({
      email: formData.email,
      password: formData.password,
      name: formData.name,
    });
    // Refresh the auth state to update the layout
    await refresh();
    // Navigate to home page after successful signup
    await navigateTo("/");
  } catch (error: any) {
    console.error("Signup error:", error);
    errorMessage.value = error?.message || "Signup failed. Please try again.";
  } finally {
    isLoading.value = false;
  }
};

definePageMeta({
  layout: false,
});
</script>

<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <UIcon
          name="i-heroicons-wrench-screwdriver"
          class="text-4xl text-primary-600 dark:text-primary-400 mx-auto mb-4" />
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Create Account
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Join Shop Manager and start organizing your business
        </p>
      </div>

      <UCard>
        <UForm :state="formData" @submit="signup" class="space-y-6">
          <UFormGroup label="Full Name" name="name" required>
            <UInput
              v-model="formData.name"
              type="text"
              placeholder="Enter your full name"
              icon="i-heroicons-user"
              size="lg"
              required
              :disabled="isLoading" />
          </UFormGroup>

          <UFormGroup label="Email" name="email" required>
            <UInput
              v-model="formData.email"
              type="email"
              placeholder="Enter your email"
              icon="i-heroicons-envelope"
              size="lg"
              required
              :disabled="isLoading" />
          </UFormGroup>

          <UFormGroup label="Password" name="password" required>
            <UInput
              v-model="formData.password"
              type="password"
              placeholder="Create a password (min 6 characters)"
              icon="i-heroicons-lock-closed"
              size="lg"
              required
              :disabled="isLoading" />
          </UFormGroup>

          <UFormGroup label="Confirm Password" name="confirmPassword" required>
            <UInput
              v-model="formData.confirmPassword"
              type="password"
              placeholder="Confirm your password"
              icon="i-heroicons-check-circle"
              size="lg"
              required
              :disabled="isLoading" />
          </UFormGroup>

          <UAlert
            v-if="errorMessage"
            icon="i-heroicons-exclamation-triangle"
            color="error"
            variant="soft"
            :title="errorMessage" />

          <div class="space-y-4">
            <UButton
              type="submit"
              block
              size="lg"
              icon="i-heroicons-user-plus"
              :loading="isLoading"
              :disabled="isLoading">
              {{ isLoading ? "Creating Account..." : "Create Account" }}
            </UButton>

            <div class="text-center">
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Already have an account?
                <NuxtLink
                  to="/auth/login"
                  class="text-primary-600 dark:text-primary-400 hover:underline font-medium">
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
