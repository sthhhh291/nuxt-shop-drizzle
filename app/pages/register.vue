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

<script>
export default {
  data() {
    return {
      username: "",
      email: "",
      password: "",
      // errorMessage: ''
    };
  },
  methods: {
    register() {
      // Registration logic goes here
      // Example: console.log(this.username, this.email, this.password);
    },
  },
};
</script>
