<template>
    <div class="delete-booking-popup" v-if="show">
      <div class="popup-content">
        <h2>Are you sure you want to delete this Booking?</h2>
        <div class="button-container">
          <button class="cancel-button" @click="cancel">No</button>
          <button class="delete-button" @click="confirm">Yes</button>
        </div>
      </div>
    </div>
</template>
  
<script>
  import axios from 'axios';
  const API_URL = "http://localhost:5253";

  export default {
    props: {
        show: {
        type: Boolean,
        required: true
        },
        booking: {
        type: Object,
        required: true
        }
    },
    methods: {
      cancel() {
        this.$emit('close');
      },


      confirm() {
        try {
            const response = axios.delete(API_URL + `/Booking/Delete/${this.booking.id}`);
            this.$emit('close');
            window.location.reload();
            
        } catch (error) {
            console.error('Error deleting booking:', error);
            this.errorMessage = "Something went wrong deleting the booking...";
        }
      }
    }
  };
</script>
  
<style scoped>
  .delete-booking-popup {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .popup-content {
    background-color: white;
    padding: 20px;
    border-radius: 10px;
  }
  
  .button-container {
    text-align: center;
    margin-top: 15px;
  }
  
  .cancel-button,
  .delete-button {
    padding: 8px 16px;
    margin: 0 5px;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .cancel-button {
    background-color: #ffcccc;
  }
  
  .delete-button {
    background-color: #ff6666;
  }
</style>
  