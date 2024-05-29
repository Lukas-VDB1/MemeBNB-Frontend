<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md p-8 space-y-8 bg-white shadow-lg rounded-xl">
      <div>
        <h2 class="mt-6 text-3xl font-extrabold text-center text-gray-900">
          Create your account
        </h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="register">
        <input type="hidden" name="remember" value="true">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="first-name" class="sr-only">First Name</label>
            <input v-model="firstName" id="first-name" name="first-name" type="text" autocomplete="given-name" required class="relative block w-full px-3 py-2 placeholder-gray-500 border border-gray-300 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="First Name">
          </div>
          <div>
            <label for="last-name" class="sr-only">Last Name</label>
            <input v-model="lastName" id="last-name" name="last-name" type="text" autocomplete="family-name" required class="relative block w-full px-3 py-2 placeholder-gray-500 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Last Name">
          </div>
          <div>
            <label for="birthdate" class="sr-only">Birthdate</label>
            <input v-model="birthDate" id="birthdate" name="birthdate" type="date" required class="relative block w-full px-3 py-2 placeholder-gray-500 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Birthdate">
          </div>
          <div>
            <label for="email" class="sr-only">Email address</label>
            <input v-model="email" id="email" name="email" type="email" autocomplete="email" required class="relative block w-full px-3 py-2 placeholder-gray-500 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Email address">
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input v-model="password" id="password" name="password" type="password" autocomplete="new-password" required class="relative block w-full px-3 py-2 placeholder-gray-500 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Password">
          </div>
          <div>
            <label for="confirm-password" class="sr-only">Confirm Password</label>
            <input v-model="confirmPassword" id="confirm-password" name="confirm-password" type="password" autocomplete="new-password" required class="relative block w-full px-3 py-2 placeholder-gray-500 border border-gray-300 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Confirm Password">
          </div>
        </div>

        <div>
          <button type="submit" class="group relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Register
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
const API_URL = "http://localhost:5253";

export default {
  name: 'Registration',
  setup() {
    const router = useRouter();

    const firstName = ref('');
    const lastName = ref('');
    const birthDate = ref('');
    const email = ref('');
    const password = ref('');
    const confirmPassword = ref('');

    const register = async () => {
      if (password.value !== confirmPassword.value) {
        alert('Passwords do not match');
        return;
      }

      const userData = {
        id: 0,
        firstName: firstName.value,
        lastName: lastName.value,
        birthDate: birthDate.value,
        password: password.value,
        email: email.value
      };

      try {
        const encoded_mail = encodeURIComponent(email.value); // replace @ symbol
        const check_if_user_exists = await axios.get(API_URL + '/User/userExists/' + encoded_mail + '?email=' + encoded_mail)

        if (!check_if_user_exists.data){
          const response = await axios.post(API_URL + '/User', userData);

          if (response.status === 200 || response.status === 201) {
            router.push('/');
            console.log('Registration successful');
          } else {
            console.error('Registration failed', response.data);
          }
        }
        else{
          alert("Email already in use");
        }

        
      } catch (error) {
        console.error('Network error:', error);
      }
    };

    return { firstName, lastName, birthDate, email, password, confirmPassword, register };
  }
}
</script>

<style scoped>
</style>
