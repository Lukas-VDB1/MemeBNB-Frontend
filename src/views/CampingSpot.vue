<template>
  <div class="camping-container">
    <div class="content">
      <div v-if="isLoading" class="loading">
        Loading...
      </div>

      <div v-else-if="CampingSpot" class="camping-spot">
        <div class="camping-info">
          <h1 class="name">{{ CampingSpot.name }}</h1>
          <br>
          <p class="address">{{ CampingSpot.streetName }} {{ CampingSpot.streetNumber }}, {{ CampingSpot.city }}, {{ CampingSpot.country }}</p>
          <br>
          <p class="price" @click="toggleCurrency">Price per night: {{ displayPrice }} {{ isPriceInEuros ? '€' : '$' }}</p>
          <br>
          <p class="meme-reference">"{{ CampingSpot.memeReference }}"</p>
          <br>
          <a class="video-link" :href="CampingSpot.memeVideoLink" target="_blank">Video Link</a>
          <br>
          <a class="google-maps-link" :href="getGoogleMapsLink(CampingSpot.coordinatesLatitude, CampingSpot.coordinatesLongitude)" target="_blank">Open in Google Maps</a>
          <br>
          <button class="book-button" @click="openBookingPopup">Book Now</button>
        </div>
        <div class="video">
          <div v-if="CampingSpot.memeVideoLink">
            <iframe width="560" height="315" :src="'https://www.youtube.com/embed/' + getVideoId(CampingSpot.memeVideoLink)" frameborder="0" allowfullscreen></iframe>
          </div>
        </div>
      </div>

      <div v-else class="data-not-found">
        Data not found.
      </div>
    </div>
    <BookingPopup v-if="isPopupOpen" :campingSpotId="CampingSpot.id" @close="closeBookingPopup" />
  </div>

  <!-- Reviews Section Outside Container -->
  <div class="reviews-section">
    <h2 class="reviews-title">Reviews</h2>
    <button class="create-review-button" @click="openNewReviewPopup">Create Review</button>
  </div>

  <!-- Reviews Section -->
  <div class="reviews-container" v-if="!loading">
    <div v-if="reviews.length > 0">
      <div v-for="(review, index) in reviews" :key="review.id" class="review-container" :style="{ marginTop: index !== 0 ? '30px' : '0' }">
        <div class="stars">
          <span v-for="star in review.score" :key="star" class="star">&#9733;</span>
        </div>
        <p class="comment"> "{{ review.comment }}"</p>
        <p class="details">Date Posted: {{ review.datePosted }}</p>
        <p class="details">Reviewer: Anonymous</p>
      </div>
    </div>
    <div v-else class="no-reviews-message">No reviews yet...</div>
  </div>
  <NewReviewPopup v-if="isReviewPopupOpen" @close="closeNewReviewPopup" />
</template>

<script>
import axios from "axios";
import { ref, onMounted } from 'vue';
import BookingPopup from '../components/New/NewBookingPopup.vue';
import NewReviewPopup from '../components/New/NewReviewPopup.vue'; 
const API_URL = "http://localhost:5253";


export default {
  name: 'CampingSpot',
  components: { BookingPopup, NewReviewPopup },

  setup() {
    const CampingSpot = ref(null);
    const isLoading = ref(true);
    const displayPrice = ref(null);
    const isPopupOpen = ref(false);
    const isReviewPopupOpen = ref(false);
    const reviews = ref([]);
    let isPriceInEuros = true;

    const fetchReviews = async () => {
      try {
        const CampingSpotID = localStorage.getItem('local_CampingSpotID');
        const response = await axios.get(API_URL + `/Review/Reviews/CampingSpot/${CampingSpotID}?camping_spot_id=${CampingSpotID}`);
        reviews.value = response.data;
      } catch (error) {
        console.error('Error fetching reviews:', error);
        throw error; // Propagate error to caller
      } finally {
        isLoading.value = false;
      }
    };

    const getVideoId = (videoLink) => {
      const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
      const match = videoLink.match(regex);
      return match ? match[1] : null;
    };

    const getGoogleMapsLink = (latitude, longitude) => {
      return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    };

    onMounted(async () => {
      try {
        const CampingSpotID = localStorage.getItem('local_CampingSpotID');
        const response = await axios.get(API_URL + "/CampingSpot/" + CampingSpotID + "?campingSpotID=" + CampingSpotID);
        if (response.data) {
          CampingSpot.value = response.data;
          isLoading.value = false;
          displayPrice.value = response.data.pricePerNight;
          await fetchReviews(); 
        } else {
          console.error('Expected response data to be an object, but got:', response.data);
        }
      } catch (error) {
        console.error('Failed to fetch camping spot:', error);
      }
    });

    const toggleCurrency = () => {
      if (isPriceInEuros) {
        displayPrice.value = (parseFloat(displayPrice.value) * 1.18).toFixed(2); // Convert to dollars
      } else {
        displayPrice.value = (parseFloat(displayPrice.value) / 1.18).toFixed(2); // Convert back to euros
      }
      isPriceInEuros = !isPriceInEuros;
    };

    const openBookingPopup = () => {
      isPopupOpen.value = true;
    };

    const closeBookingPopup = () => {
      isPopupOpen.value = false;
    };

    const openNewReviewPopup = () => {
      isReviewPopupOpen.value = true;
    };

    const closeNewReviewPopup = () => {
      isReviewPopupOpen.value = false;
    };

    return { CampingSpot, isLoading, displayPrice, toggleCurrency, isPriceInEuros, isPopupOpen, openBookingPopup, closeBookingPopup, isReviewPopupOpen, openNewReviewPopup, closeNewReviewPopup, reviews, getVideoId, getGoogleMapsLink };
  }
};
</script>

<style>
.camping-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px; 
}

.content {
  border: 2px solid #ccc;
  padding: 20px;
  border-radius: 10px;
}

.loading {
  font-size: 24px;
}

.camping-spot {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.camping-info {
  flex: 1;
  margin-right: 20px;
  text-align: center; 
}

.video {
  flex: 1;
}

.data-not-found {
  font-size: 24px;
}

.name {
  text-align: center;
  font-size: 28px;
  font-weight: bold;
  color: red;
}

.address,
.price,
.meme-reference {
  font-size: 16px;
  text-align: center;
}

.google-maps-link,
.video-link,
.book-button {
  text-align: center; 
  margin-top: 10px; 
}

.google-maps-link,
.video-link {
  color: blue;
  text-decoration: underline;
}

.book-button {
  padding: 10px 20px;
  background-color: blue;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.reviews-section {
  margin-top: 20px;
  text-align: center;
}

.reviews-title {
  font-size: 24px;
  font-weight: bold;
}

.create-review-button {
  margin-top: 10px;
  padding: 10px 20px;
  background-color: #7fbfff; 
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
}

.reviews-container {
  padding: 20px;
}

.review-container {
  margin-bottom: 30px; 
  text-align: center;
  padding: 10px;
  max-width: 300px;
  margin: 0 auto;
}

.review-title {
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

.no-reviews-message {
  font-style: italic;
  color: #555;
  text-align: center;
}
</style>
