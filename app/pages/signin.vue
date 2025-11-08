<script setup lang="ts">
import { authClient } from '~~/app/lib/auth-client'; // path to your auth file
const { signIn } = authClient;
const email = ref('');
const password = ref('');
const errorMessage = ref('');

const handleSubmit = async () => {
  errorMessage.value = '';
  try {
    await signIn.email({ 
      email: email.value, 
      password: password.value,
      callbackURL: "/"
    });
    
    // Handle successful sign-in (e.g., redirect or show a success message)
    navigateTo('/');
  } catch (error) {
    errorMessage.value = 'Failed to sign in. Please check your credentials.';
  }
};
</script>