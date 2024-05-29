<template>
  <div class="home-container">
    <div class="filter-container">
      <label for="budget-slider"><strong>Select your MAX budget:</strong> €{{ budget }} &nbsp; </label>
      <input type="range" id="budget-slider" v-model="budget" :min="0" :max="maxBudget" step="10" @input="filterCampingSpots" />
    </div>
    <div class="map-wrapper" ref="mapContainer"></div>
    <button class="create-button" @click="openNewCampingSpotPopup">Create New Campingspot</button>
    <NewCampingSpot v-if="isPopupOpen" @close="closeNewCampingSpotPopup" />
  </div>
</template>

<script>
import axios from "axios"; 
import { ref, onMounted } from 'vue';
import L from 'leaflet';
import "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/leaflet.css";
import { useRouter } from 'vue-router';
import NewCampingSpot from '../components/New/NewCampingSpot.vue'; 
const API_URL = "http://localhost:5253";

export default {
  name: 'Home',

  components: {
    NewCampingSpot
  },

  setup() {
    const router = useRouter();
    const mapContainer = ref(null);
    const map = ref(null);
    const markers = ref([]);
    var budget = ref(100); 
    const maxBudget = ref(500); 
    const CampingSpotList = ref([]); 
    const isPopupOpen = ref(false); 

    // Create the map
    const createMap = () => {
      map.value = L.map(mapContainer.value, {
        zoomControl: true,
        zoom: 1,
        zoomAnimation: false,
        fadeAnimation: true,
        markerZoomAnimation: true
      }).setView([51.275, 4.91], 7);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map.value);
    };

    // Add markers to the map
    const addMarkers = (spots) => {
      markers.value.forEach(marker => map.value.removeLayer(marker)); 
      markers.value = []; 

      spots.forEach((spot, index) => {
        const marker = L.marker([spot.coordinatesLatitude, spot.coordinatesLongitude]).addTo(map.value);
        const popupContent = `
          <div>
            <b>${spot.name}</b><br>
            ${spot.streetName} ${spot.streetNumber}, ${spot.city}, ${spot.country}<br>
            Price per night: €${spot.pricePerNight}<br>
            Meme reference: ${spot.memeReference}<br>
            <a href="${spot.memeVideoLink}" target="_blank">Watch Video</a><br>
            <button class="book-now" onclick="bookNow(${index})">Book Now!</button> 
          </div>`;
        marker.bindPopup(popupContent);
        markers.value.push(marker); 
      });
    };

    // Book now button handler
    window.bookNow = (index) => {
      index = index + 1;
      localStorage.setItem('local_CampingSpotID', index);
      router.push({ name: 'CampingSpot' });
    };

    // Fetch camping spots from the API
    const fetchCampingSpots = async () => {
      try {
        const response = await axios.get(API_URL + "/CampingSpot");
        if (Array.isArray(response.data)) {
          CampingSpotList.value = response.data; 
          maxBudget.value = Math.max(...response.data.map(spot => spot.pricePerNight)) + 10; // Update max budget for slider (+10 omdat de intervals +10 zijn)
          return response.data;
        } else {
          console.error('Expected response data to be an array, but got:', response.data);
        }
      } catch (error) {
        console.error('Failed to fetch camping spots:', error);
      }
      return [];
    };

    // Filter camping spots based on the budget
    const filterCampingSpots = () => {
      const filteredSpots = CampingSpotList.value.filter(spot => spot.pricePerNight <= budget.value);
      addMarkers(filteredSpots);
    };

    const openNewCampingSpotPopup = () => {
      console.log("Opening NewCampingSpotPopup");
      isPopupOpen.value = true; 
    };

    const closeNewCampingSpotPopup = () => {
      console.log("Closing NewCampingSpotPopup");
      isPopupOpen.value = false; 
    };

    // Initialize map and fetch camping spots on mount
    onMounted(async () => {
      createMap();
      const spots = await fetchCampingSpots();
      addMarkers(spots);
    });

    return {
      mapContainer,
      budget,
      maxBudget,
      filterCampingSpots,
      openNewCampingSpotPopup,
      closeNewCampingSpotPopup,
      isPopupOpen 
    };
  }
};
</script>

<style>
.home-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 70vh;
  margin-right: 10vh;
  margin-left: 10vh;
  margin-top: 10vh;
}

.filter-container {
  margin-bottom: 20px;
}

.map-wrapper {
  width: 400px;
  height: 600px;
  position: relative;
  border: 5px solid #ccc;
  z-index: 999;
}

.leaflet-container {
  width: 100%;
  height: 100%;
}

.book-now {
  background-color: #4CAF50;
  border: none;
  color: white;
  padding: 10px 24px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
}

.create-button {
  background-color: #2980b9; 
  border-radius: 30px; 
  margin-top: 20px; 
  padding: 15px 30px; 
  font-size: 18px; 
}
</style>
