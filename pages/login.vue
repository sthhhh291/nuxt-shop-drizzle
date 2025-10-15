<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
      </div>
      <UForm :state="loginForm" @submit="handleLogin" class="mt-8 space-y-6">
        <div class="space-y-4">
          <UFormGroup label="Email" name="email">
            <UInput
              v-model="loginForm.email"
              type="email"
              placeholder="Enter your email"
              required />
          </UFormGroup>

          <UFormGroup label="Password" name="password">
            <UInput
              v-model="loginForm.password"
              type="password"
              placeholder="Enter your password"
              required />
          </UFormGroup>
        </div>

        <div>
          <UButton type="submit" :loading="isLoading" class="w-full" size="lg">
            Sign in
          </UButton>
        </div>

        <div class="text-center">
          <p class="text-sm text-gray-600">
            Don't have an account?
            <NuxtLink
              to="/register"
              class="font-medium text-primary-600 hover:text-primary-500">
              Sign up
            </NuxtLink>
          </p>
        </div>
      </UForm>

      <UAlert
        v-if="error"
        color="red"
        variant="solid"
        :title="error"
        class="mt-4" />
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  auth: false,
});

const { signIn } = useAuth();

const loginForm = reactive({
  email: "",
  password: "",
});

const isLoading = ref(false);
const error = ref("");

const handleLogin = async () => {
  isLoading.value = true;
  error.value = "";

  try {
    const result = await signIn("credentials", {
      email: loginForm.email,
      password: loginForm.password,
      redirect: false,
    });

    if (result?.error) {
      error.value = "Invalid email or password";
    } else {
      await navigateTo("/");
    }
  } catch (err) {
    error.value = "An error occurred during login";
    console.error("Login error:", err);
  } finally {
    isLoading.value = false;
  }
};
</script>
