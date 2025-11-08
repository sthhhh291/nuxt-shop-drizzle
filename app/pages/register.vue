<template>
  <div class="register-container">
    <h1>Register</h1>
    <form @submit.prevent="register">
      <div class="form-group">
        <label for="username">Username:</label>
        <input id="username" v-model="username" required type="text" />
      </div>
      <div class="form-group">
        <label for="email">Email:</label>
        <input id="email" v-model="email" required type="email" />
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input id="password" v-model="password" type="password" required />
      </div>
      <button type="submit">Register</button>
    </form>
    <!-- <p v-if="errorMessage" class="error">{{ errorMessage }}</p> -->
  </div>
</template>

<script setup lang="ts">
const { signUp } = useAuthClient();
const { refresh } = useBetterAuth();

const username = ref("");
const email = ref("");
const password = ref("");
const errorMessage = ref("");

const register = async () => {
  try {
    await signUp.email({
      name: username.value,
      email: email.value,
      password: password.value,
    });
    console.log("Registration successful");
    // Refresh auth state to update layout
    await refresh();
    // Redirect to home after successful registration
    await navigateTo('/');
  } catch (error) {
    console.error("Registration failed:", error);
    errorMessage.value = "Registration failed. Please try again.";
  }
};
</script>
