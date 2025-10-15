<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
      </div>
      <UForm
        :state="registerForm"
        @submit="handleRegister"
        class="mt-8 space-y-6">
        <div class="space-y-4">
          <UFormGroup label="Name" name="name">
            <UInput
              v-model="registerForm.name"
              type="text"
              placeholder="Enter your full name"
              required />
          </UFormGroup>

          <UFormGroup label="Email" name="email">
            <UInput
              v-model="registerForm.email"
              type="email"
              placeholder="Enter your email"
              required />
          </UFormGroup>

          <UFormGroup label="Password" name="password">
            <UInput
              v-model="registerForm.password"
              type="password"
              placeholder="Enter your password (min 6 characters)"
              required />
          </UFormGroup>

          <UFormGroup label="Confirm Password" name="confirmPassword">
            <UInput
              v-model="registerForm.confirmPassword"
              type="password"
              placeholder="Confirm your password"
              required />
          </UFormGroup>
        </div>

        <div>
          <UButton type="submit" :loading="isLoading" class="w-full" size="lg">
            Sign up
          </UButton>
        </div>

        <div class="text-center">
          <p class="text-sm text-gray-600">
            Already have an account?
            <NuxtLink
              to="/login"
              class="font-medium text-primary-600 hover:text-primary-500">
              Sign in
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

      <UAlert
        v-if="success"
        color="green"
        variant="solid"
        title="Account created successfully! Please sign in."
        class="mt-4" />
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  auth: false,
});

const registerForm = reactive({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const isLoading = ref(false);
const error = ref("");
const success = ref(false);

const handleRegister = async () => {
  isLoading.value = true;
  error.value = "";
  success.value = false;

  // Validate passwords match
  if (registerForm.password !== registerForm.confirmPassword) {
    error.value = "Passwords do not match";
    isLoading.value = false;
    return;
  }

  // Validate password length
  if (registerForm.password.length < 6) {
    error.value = "Password must be at least 6 characters long";
    isLoading.value = false;
    return;
  }

  try {
    const { data } = await $fetch("/api/auth/register", {
      method: "POST",
      body: {
        name: registerForm.name,
        email: registerForm.email,
        password: registerForm.password,
      },
    });

    success.value = true;

    // Reset form
    registerForm.name = "";
    registerForm.email = "";
    registerForm.password = "";
    registerForm.confirmPassword = "";

    // Redirect to login after a short delay
    setTimeout(() => {
      navigateTo("/login");
    }, 2000);
  } catch (err) {
    error.value =
      err.data?.statusMessage || "An error occurred during registration";
    console.error("Registration error:", err);
  } finally {
    isLoading.value = false;
  }
};
</script>
