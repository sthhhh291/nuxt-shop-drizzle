<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')
const password = ref('')
const errorMessage = ref('')

const { signIn } = useAuthClient()
const { refresh } = useBetterAuth()

const handleLogin = async () => {
    try {
        await signIn.email({ email: email.value, password: password.value })
        // Refresh the auth state to update the layout
        await refresh()
        // Navigate to home page after successful login
        await navigateTo('/')
    } catch (error) {
        errorMessage.value = 'Login failed. Please try again.'
    }
}
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
    <div v-if="errorMessage" style="color: red;">{{ errorMessage }}</div>
    <Button type="submit">Login</Button>
  </form>
  <NuxtLink to="/auth/signup">Go to Signup</NuxtLink>
</template>