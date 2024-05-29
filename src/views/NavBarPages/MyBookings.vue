<template>
  <div class="bookings-container" v-if="!loading">
    <div v-if="bookings.length > 0">
      <div v-for="(booking, index) in bookings" :key="booking.id" class="booking-container" :style="{ marginTop: index !== 0 ? '30px' : '0' }">
        <h2 class="booking-title">Campingspot: {{ getCampingSpotName(booking.fK_CampingSpot) }}</h2>
        <div class="stars">
          <span v-for="star in booking.score" :key="star" class="star">&#9733;</span>
        </div>
        <p class="details">Start Date: {{ formatDate(booking.dateStart) }}</p>
        <p class="details">End Date: {{ formatDate(booking.dateEnd) }}</p>
        <div class="button-container">
          <button class="delete-button" @click="openDeletePopup(booking)">Delete</button>
        </div>
      </div>
    </div>
    <div v-else class="no-bookings-message">No bookings yet...</div>

    <!-- Delete Booking Popup -->
    <delete-booking-popup :show="deletePopupVisible" :booking="selectedBooking" @close="deletePopupVisible = false" />
  </div>
</template>

<script>
import axios from 'axios';
import DeleteBookingPopup from '../../components/Delete/DeleteBookingPopup.vue';
import moment from 'moment'; //For Date formatting

const API_URL = "http://localhost:5253";

export default {
  components: {
    DeleteBookingPopup
  },
  props: ['show', 'bookingId'],
  data() {
    return {
      bookings: [],
      campingSpots: [],
      loading: true,
      user: {
        id: '',
      },
      hoveredBookingId: null,
      deletePopupVisible: false,
      selectedBooking: null
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
        await this.fetchBookings();
      } catch (error) {
        console.error('An error occurred during initialization:', error);
        this.loading = false;
      }
    },

    async fetchUserData() {
      try {
        const jwt_value = $cookies.get("jwt");
        const response = await axios.get(API_URL + '/auth/user?jwt_value=' + jwt_value);
        this.user.id = response.data.id;
      } catch (error) {
        console.error('There was an error fetching the user data:', error);
        throw error; 
      }
    },

    async fetchCampingSpots() {
      try {
        const response = await axios.get(API_URL + '/CampingSpot');
        this.campingSpots = response.data;
      } catch (error) {
        console.error('Error fetching camping spots:', error);
        throw error; 
      }
    },

    async fetchBookings() {
      try {
        const response = await axios.get(API_URL + `/Booking/Bookings/User/${this.user.id}`);
        this.bookings = response.data;
      } catch (error) {
        console.error('Error fetching bookings:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    getCampingSpotName(campingSpotId) {
      const spot = this.campingSpots.find(spot => spot.id === campingSpotId);
      return spot ? spot.name : 'Unknown';
    },

    openDeletePopup(booking) {
      this.selectedBooking = booking;
      this.deletePopupVisible = true;
    },

    closeDeletePopup() {
      this.deletePopupVisible = false;
      this.selectedBooking = null;
    },

    toggleHover(isHovered, bookingId) {
      this.hoveredBookingId = isHovered ? bookingId : null;
    },

    formatDate(dateString) {
      return moment(dateString).format('DD-MM-YYYY');
    }
  },
};
</script>

<style scoped>
.bookings-container {
  padding: 20px;
}

.booking-container {
  border: 2px solid #555; 
  margin-bottom: 30px; 
  text-align: center;
  padding: 10px;
  max-width: 300px;
  margin: 0 auto;
}

.booking-title {
  font-size: 20px;
  margin-bottom: 10px;
}

.stars {
  color: gold;
  font-size: 24px;
}

.star {
  margin-right: 5px;
}

.comment {
  margin-top: 5px;
}

.details {
  font-size: 0.9em;
  color: #555;
}

.no-bookings-message {
  font-style: italic;
  color: #555;
  text-align: center;
}

.button-container {
  text-align: center;
  margin-top: 15px; 
}

.delete-button {
  background-color: #e0e0e0; 
  border: none;
  cursor: pointer;
  padding: 8px 16px;
  margin: 0 10px; 
  border-radius: 20px; 
  font-weight: bold;
  color: black; 
}

.delete-button:hover {
  background-color: #ffcccc;
}
</style>
