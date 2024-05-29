<template>
    <div class="popup">
      <h2 class="popup-title">Create New Camping Spot</h2>
      <form @submit.prevent="createCampingSpot">
        <div class="input-group">
          <div class="input-row">
            <label for="name">Name:</label>
            <input type="text" id="name" v-model="formData.name" required placeholder="E.g., Beautiful Campsite">
          </div>
          <div class="input-row">
            <label for="streetName">Street Name:</label>
            <input type="text" id="streetName" v-model="formData.streetName" required placeholder="E.g., Street Street">
          </div>
          <div class="input-row">
            <label for="streetNumber">Street Number:</label>
            <input type="number" id="streetNumber" v-model.number="formData.streetNumber" required placeholder="E.g., 123">
          </div>
          <div class="input-row">
            <label for="city">City:</label>
            <input type="text" id="city" v-model="formData.city" required placeholder="E.g., Riverside">
          </div>
          <div class="input-row">
            <label for="country">Country:</label>
            <input type="text" id="country" v-model="formData.country" required placeholder="E.g., USA">
          </div>
          <div class="input-row">
          <label for="coordinatesLatitude">Coordinates Latitude:</label>
          <input type="number" id="coordinatesLatitude" v-model="formData.coordinatesLatitude" required 
                 step="any" pattern="[-]?(?:\d*\.)?\d+" class="input-field" 
                 placeholder="E.g., 40.7128">
        </div>
        <div class="input-row">
          <label for="coordinatesLongitude">Coordinates Longitude:</label>
          <input type="number" id="coordinatesLongitude" v-model="formData.coordinatesLongitude" required 
                 step="any" pattern="[-]?(?:\d*\.)?\d+" class="input-field" 
                 placeholder="E.g., -74.0060">
        </div>
          <div class="input-row">
            <label for="pricePerNight">Price Per Night (€):</label>
            <input type="number" id="pricePerNight" v-model.number="formData.pricePerNight" required placeholder="E.g., 50">
          </div>
          <div class="input-row">
            <label for="memeReference">Meme Reference:</label>
            <input type="text" id="memeReference" v-model="formData.memeReference" required placeholder="E.g., Starry Night Meme">
          </div>
          <div class="input-row">
            <label for="memeVideoLink">Meme Video Link:</label>
            <input type="text" id="memeVideoLink" v-model="formData.memeVideoLink" required placeholder="E.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ">
          </div>
        </div>
        <div class="buttons">
          <button type="button" @click="closePopup" class="cancel-button">Cancel</button>
          <button type="submit" class="create-button">Create</button>
        </div>
      </form>
    </div>
  </template>
  
<script>
  import axios from 'axios';
  const API_URL = "http://localhost:5253";


  export default {
    name: 'NewCampingSpot',
    data() {
      return {
        user: {
            id: '',
        },
        formData: {
          id: 0,
          name: '',
          streetName: '',
          streetNumber: null,
          city: '',
          country: '',
          coordinatesLatitude: '',
          coordinatesLongitude: '',
          pricePerNight: null,
          memeReference: '',
          memeVideoLink: ''
        }
      };
    },

    methods: {
      async createCampingSpot() {
        try {
            const jwt_value = $cookies.get("jwt");


            const response_get = await axios.get(API_URL + '/auth/user?jwt_value=' + jwt_value);
            this.userId = response_get.data.id;
            const response = axios.post(API_URL + `/CampingSpot?ownerId=${this.userId}`, this.formData);
            console.log('Camping spot created:', response.data);

            this.closePopup();
      } catch (error) {
        alert('Please log in or try again later');
        console.error('Error creating camping spot:', error);
      }
      },
      closePopup() {
        this.$emit('close');
      }
    }
  };
</script>
  
<style scoped>
  .popup {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    width: 70%; 
    max-height: 80%; 
    overflow-y: auto; 
    z-index: 1000; /* Ensure the popup is above other elements */
  }
  
  .popup-title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
    text-align: center; 
  }
  
  .input-group {
    margin-bottom: 20px;
  }
  
  .input-row {
    display: flex;
    margin-bottom: 10px;
  }
  
  .input-row label {
    flex: 1;
    margin-right: 10px;
  }
  
  .input-row input {
    flex: 2;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 8px;
    box-sizing: border-box;
  }
  
  .buttons {
  display: flex;
  justify-content: space-between;
  align-items: center; 
}

.buttons button {
  padding: 10px 20px;
  border-radius: 20px;
  cursor: pointer;
  border: none;
  width: 120px; 
  height: 40px; 
}

.cancel-button {
  background-color: #ff6347; 
  color: #fff;
  margin-top: 2px; 
}

.create-button {
  background-color: #4caf50; 
  color: #fff;
}
</style>
  