<script setup lang="ts">
import { ref } from "vue";

const email = ref("");
const password = ref("");
const errorMessage = ref("");

const { signIn } = useAuthClient();
const { refresh } = useBetterAuth();

const router = useRouter();

const handleLogin = async () => {
  try {
    errorMessage.value = ""; // Clear any previous errors
    console.log("Starting login process...");

    // Sign in with better-auth
    const result = await signIn.email({
      email: email.value,
      password: password.value,
    });

    console.log("Sign in result:", result);

    if (result.error) {
      errorMessage.value =
        result.error.message || "Login failed. Please try again.";
      return;
    }

    console.log("Login successful - doing full page reload for reliability...");

    // For better-auth, a full page reload is often the most reliable way
    // to ensure the session is properly established across all components
    if (process.client) {
      window.location.href = "/";
    }
  } catch (error: any) {
    console.error("Login error:", error);
    errorMessage.value = error?.message || "Login failed. Please try again.";
  }
};
</script>

<template>
  <form @submit.prevent="handleLogin">
    <div>
      <label for="email">Email:</label>
      <Input id="email" type="email" v-model="email" required />
    </div>
    <div>
      <label for="password">Password:</label>
      <Input id="password" type="password" v-model="password" required />
    </div>
    <div v-if="errorMessage" style="color: red">{{ errorMessage }}</div>
    <Button type="submit">Login</Button>
  </form>
  <NuxtLink to="/auth/signup">Go to Signup</NuxtLink>
</template>
