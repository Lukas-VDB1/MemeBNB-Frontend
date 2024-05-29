<template>
    <div class="modal" v-if="show">
      <div class="modal-content">
        <span class="close" @click="close">&times;</span>
        <div v-if="loading" class="loading-message">Loading bookings...</div>
        <div v-else>
          <div v-if="bookings.length > 0">
            <div v-for="booking in bookings" :key="booking.id" class="booking">
              <p class="dates">Start Date: {{ booking.dateStart }}</p>
              <p class="dates">End Date: {{ booking.dateEnd }}</p>
              <p class="details">Booked By: {{ booking.fK_BookedBy }}</p>
            </div>
          </div>
          <div v-else class="no-bookings-message">No bookings yet...</div>
        </div>
      </div>
    </div>
</template>
  
  <script>
  import axios from 'axios';
  const API_URL = 'http://localhost:5253';
  
  export default {
    props: ['show', 'campingSpotId'],
    data() {
      return {
        bookings: [],
        loading: true,
      };
    },
    mounted() {
      if (this.show) {
        this.fetchBookings();
      }
    },
    watch: {
      show(newVal) {
        if (newVal) {
          this.fetchBookings();
        }
      },
    },
    methods: {
      async fetchBookings() {
        this.loading = true;
        try {
          const response = await axios.get(API_URL + `/Booking/Bookings/CampingSpot/${this.campingSpotId}?camping_spot_id=${this.campingSpotId}`);
          this.bookings = response.data;
        } catch (error) {
          console.error('Error fetching bookings:', error);
        } finally {
          this.loading = false;
        }
      },
      close() {
        this.$emit('close');
      },
    },
  };
</script>
  
<style scoped>
  .modal {
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.4);
  }
  
  .modal-content {
    background-color: white;
    margin: 10% auto;
    padding: 20px;
    border: 1px solid #888;
    width: 60%; /* Adjusted width */
    max-height: 70%;
    overflow-y: auto;
    border-radius: 10px;
  }
  
  .close {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
  }
  
  .close:hover,
  .close:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
  }
  
  .booking {
    border-bottom: 1px solid #ddd;
    padding: 10px 0;
  }
  
  .dates {
    font-weight: bold;
  }
  
  .details {
    font-size: 0.9em;
    color: #555;
  }
  
  .no-bookings-message {
    text-align: center;
    font-style: italic;
    color: #555;
  }
</style>
  