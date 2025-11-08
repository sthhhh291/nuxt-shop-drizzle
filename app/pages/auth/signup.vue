<script setup lang="ts">
import { ref } from 'vue'

const { signUp } = useAuthClient()
const { refresh } = useBetterAuth()

const email = ref('')
const name = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')

const signup = async () => {
    if (password.value !== confirmPassword.value) {
        errorMessage.value = 'Passwords do not match.'
        return
    }

    try {
        // Call your signup API here
        await signUp.email({
            email: email.value, 
            password: password.value,
            name: name.value
        })
        // Refresh the auth state to update the layout
        await refresh()
        // Navigate to home page after successful signup
        await navigateTo('/')
    } catch (error) {
        errorMessage.value = 'Signup failed. Please try again.'
    }
}
</script>

<template>
    <form @submit.prevent="signup">
        <div>
            <label for="name">Name:</label>
            <Input id="name" v-model="name" required />
        </div>
        <div>
            <label for="email">Email:</label>
            <Input id="email" type="email" v-model="email" required />
        </div>
        <div>
            <label for="password">Password:</label>
            <Input   id="password" type="password" v-model="password" required />
        </div>
        <div>
            <label for="confirmPassword">Confirm Password:</label>
            <Input id="confirmPassword" type="password" v-model="confirmPassword" required />
        </div>
        <div v-if="errorMessage" style="color: red;">{{ errorMessage }}</div>
    <Button type="submit">Sign Up</Button>
    </form>
</template>