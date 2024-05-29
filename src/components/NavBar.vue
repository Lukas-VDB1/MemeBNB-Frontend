<template>
  <nav class="bg-white shadow-md py-2">
    <div class="container mx-auto flex items-center justify-between px-2">
      <div class="flex items-center">
        <a href="./home">
          <img src="@/assets/MemeBNB.png" alt="MemeBNB" class="h-12 ml-2">
        </a>
      </div>
      <div class="flex items-center space-x-4 mr-2">
        <a href="../my-bookings" class="nav-link">My Bookings</a>
        <a href="../my-reviews" class="nav-link">My Reviews</a>
        <a href="../my-campingspots" class="nav-link">My Campingspots</a>
        <div class="relative" @click="toggleDropdown">
          <button class="nav-link px-3 focus:outline-none">
            Profile
          </button>
          <div v-if="dropdownOpen" class="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">
            <a href="./my-profile" class="dropdown-link">My Profile</a>
            <a href="#" @click.prevent="logout" class="dropdown-link">Logout</a>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import axios from 'axios';
const API_URL = "http://localhost:5253";

export default {
  name: 'NavBar',
  data() {
    return {
      dropdownOpen: false,
    };
  },
  methods: {
    toggleDropdown() {
      this.dropdownOpen = !this.dropdownOpen;
    },
    handleOutsideClick(event) {
      if (!this.$el.contains(event.target)) {
        this.closeDropdown();
      }
    },
    closeDropdown() {
      this.dropdownOpen = false;
    },
    async logout() {
      try {
        const response = await axios.post(API_URL + '/auth/logout');

        if (response.status === 200) {
          this.$router.push('/');     
          $cookies.remove("jwt");  
        } else {
          console.error('Failed to logout', response);
        }
      } catch (error) {
        console.error('Failed to logout', error);
      }
    }
  },
  mounted() {
    document.addEventListener('click', this.handleOutsideClick);
  },
  beforeDestroy() {
    document.removeEventListener('click', this.handleOutsideClick);
  },
};
</script>

<style scoped>
/* Import Google Font */
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

nav {
  font-family: 'Roboto', sans-serif;
}

.nav-link {
  font-size: 1.25rem; 
  color: #4a5568; 
  text-decoration: none;
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: #1a202c; 
  text-decoration: underline;
}

.dropdown-link {
  display: block;
  padding: 0.5rem 1rem;
  color: #4a5568; 
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.dropdown-link:hover {
  background-color: #f7fafc;
  text-decoration: underline;
}
</style>
