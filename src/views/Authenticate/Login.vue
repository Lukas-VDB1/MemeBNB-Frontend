<template>
  <div class="flex justify-center items-center min-h-screen bg-white-100">
    <!-- MemeBNB image -->
    <img src="@/assets/MemeBNB.png" alt="MemeBNB Logo" class="absolute top-0 w-2/3 md:w-1/3 mx-auto z-10">

    <!-- Left image -->
    <div class="absolute left-0 top-10vh w-1/3 h-4/5 overflow-hidden">
      <img src="@/assets/JoostKlein1.png" alt="Left Image" class="w-full h-full object-cover transform animate-mirror">
    </div>
    <!-- Right image -->
    <div class="absolute right-0 top-10vh w-1/3 h-4/5  overflow-hidden">
      <img src="@/assets/JoostKlein1.png" alt="Right Image" class="w-full h-full object-cover transform animate-mirror scale-x-[-1]">
    </div>

    <!-- Login form container -->
    <div class="relative w-full max-w-md p-8 space-y-8 bg-white shadow-lg rounded-xl z-10">
      <div>
        <h2 class="mt-6 text-3xl font-extrabold text-center text-gray-900">
          Sign in to your account
        </h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="login">
        <input type="hidden" name="remember" value="true">
        <div class="rounded-md shadow-sm">
          <div>
            <label for="email" class="sr-only">Email address</label>
            <input id="email" name="email" v-model="email" type="email" autocomplete="email" required class="relative block w-full px-3 py-2 placeholder-gray-500 border border-gray-300 rounded-none rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Email address">
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input id="password" name="password" v-model="password" type="password" autocomplete="current-password" required class="relative block w-full px-3 py-2 placeholder-gray-500 border border-gray-300 rounded-none rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Password">
          </div>
        </div>
  
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input id="remember_me" name="remember_me" type="checkbox" class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500">
            <label for="remember_me" class="block ml-2 text-sm text-gray-900">
              Remember me
            </label>
          </div>
  
          <div class="text-sm">
            <a href="./register" class="font-medium text-indigo-600 hover:text-indigo-500">
              New? Create Account
            </a>
          </div>
        </div>
  
        <div>
          <button type="submit" class="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md group hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Sign in
          </button>
        </div>

        <div v-if="errorMessage" class="text-red-500 text-center mt-2">
          {{ errorMessage }}
        </div>

        <div>
          <h2 class="mt-6 text-xl font-bold text-center text-gray-900">
            Or
          </h2>
        </div>

        <div class="text-sm">
          <a href="./home" class="font-medium text-indigo-600 hover:text-indigo-500">
            continue as guest
          </a>
        </div>
      </form>

      <div>
        <button @click="loginWithGoogle" class="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md group hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
          Sign in with Google
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
const API_URL = "http://localhost:5253";
    


export default {
  name: 'LoginScreen',
  data() {
    return {
      email: '',
      password: '',
      errorMessage: ''
    };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post(API_URL + '/auth/login', {
          email: this.email,
          password: this.password
          
       
        });

        if (response.status === 200) {
          $cookies.set("jwt", response.data); 

          this.$router.push('/home');
        }
      } catch (error) {
        this.errorMessage = "Invalid Credentials";
      }
    },

    //Login with Google OAuth => Not functional yet
    loginWithGoogle() {
      window.location.href = 'http://localhost:5253/auth/login'; 
    }
  }
}
</script>

<style scoped>
.animate-mirror {
  animation: mirror 0s infinite alternate; /* Mirror animation -> Change value from 0 to 1 to make Joost Dance */
}

@keyframes mirror {
  0% {
    transform: scaleX(1);
  }
  100% {
    transform: scaleX(-1);
  }
}
</style>
