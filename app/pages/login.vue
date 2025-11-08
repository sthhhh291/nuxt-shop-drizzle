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
  <div>
    <div class="custom-bg mb-14 p-14 text-center text-white">
      <h1>Sigin</h1>
    </div>
    <form
      class="card custom-card mx-auto w-11/12 max-w-md bg-white p-6 shadow-lg"
      @submit.prevent="login"
    >
      <input
        v-model="formData.email"
        type="email"
        name="email"
        placeholder="email here.."
      />
      <input v-model="formData.password" type="password" name="password" />
      <button type="submit">Sign In</button>
    </form>
  </div>
</template>
