<template>
  <div class="camping-spots-container">
    <div v-if="error" class="error-message">{{ error }}</div>
    <div v-if="loading" class="loading-message">Loading...</div>
    <div v-else>
      <div v-for="spot in campingSpots" :key="spot.id" class="camping-spot">
        <h2 class="spot-name">{{ spot.name }}</h2>
        <p>{{ spot.streetName }} {{ spot.streetNumber }}, {{ spot.city }}</p>
        <p>Price per Night: ${{ spot.pricePerNight }}</p>
        <p>Meme Reference: {{ spot.memeReference }}</p>
        <a :href="spot.memeVideoLink" target="_blank" class="meme-link">Watch Meme Video</a>
        <div class="buttons">
          <button @click="showReviews(spot.id)">Check Reviews</button>
          <button @click="showBookings(spot.id)">Check Bookings</button>
        </div>
      </div>
    </div>
    <review-popup
      :show="showReviewPopup"
      :campingSpotId="selectedCampingSpotId"
      @close="closeReviewPopup"
    />
    <booking-popup
      :show="showBookingPopup"
      :campingSpotId="selectedCampingSpotId"
      @close="closeBookingPopup"
    />
  </div>
</template>

<script>
import axios from 'axios';
import VueCookies from 'vue-cookies';
import ReviewPopup from '../../components/ReviewPopup.vue';
import BookingPopup from '../../components/BookingPopup.vue';
const API_URL = "http://localhost:5253";



export default {
  name: 'MyCampingSpots',
  components: {
    ReviewPopup,
    BookingPopup,
  },
  data() {
    return {
      campingSpots: [],
      loading: true,
      error: null,
      user: {
        id: '',
      },
      showReviewPopup: false,
      selectedCampingSpotId: null,
    };
  },
  created() {
    this.initialize();
  },


  methods: {
    async initialize() {
      try {
        await this.fetchUserData();
        await this.fetchCampingSpots();
      } catch (error) {
        this.error = error.message || 'An error occurred';
        this.loading = false;
      }
    },

    async fetchUserData() {
      try {
        const jwt_value = VueCookies.get("jwt");
        const response = await axios.get(`${API_URL}/auth/user?jwt_value=${jwt_value}`);
        this.user = response.data;
      } catch (error) {
        console.error('There was an error fetching the user data:', error);
        throw new Error('Failed to fetch user data');
      }
    },

    async fetchCampingSpots() {
      try {
        const response = await axios.get(`${API_URL}/CampingSpot/CampingSpots/${this.user.id}`);
        this.campingSpots = response.data;
      } catch (error) {
        console.error('Failed to load camping spots:', error);
        this.error = 'Failed to load camping spots';
      } finally {
        this.loading = false;
      }
    },
    
    showReviews(campingSpotId) {
      this.selectedCampingSpotId = campingSpotId;
      this.showReviewPopup = true;
    },

    closeReviewPopup() {
      this.showReviewPopup = false;
      this.selectedCampingSpotId = null;
    },

    showBookings(campingSpotId) {
      this.selectedCampingSpotId = campingSpotId;
      this.showBookingPopup = true;
    },
    closeBookingPopup() {
      this.showBookingPopup = false;
      this.selectedCampingSpotId = null;
    },
  },
};
</script>

<style scoped>
.camping-spots-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  width: 80%; 
  margin: 0 auto;
}

.camping-spot {
  border: 2px solid black; 
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  width: 100%; 
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.spot-name {
  font-weight: bold;
  font-size: 1.5em; 
}

.meme-link {
  color: blue;
  text-decoration: underline;
}

.buttons {
  display: flex;
  justify-content: center;
  gap: 20px; 
  margin-top: 10px;
}

.buttons button {
  padding: 10px 20px;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 5px;
  cursor: pointer;
}

.buttons button:hover {
  background-color: #0056b3;
}

.error-message {
  color: red;
}

.loading-message {
  font-size: 20px;
}
</style>
