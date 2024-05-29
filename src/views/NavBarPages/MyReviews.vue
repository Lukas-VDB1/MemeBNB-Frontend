<template>
  <div class="reviews-container" v-if="!loading">
    <div v-if="reviews.length > 0">
      <div v-for="(review, index) in reviews" :key="review.id" class="review-container" :style="{ marginTop: index !== 0 ? '30px' : '0' }">
        <h2 class="review-title">Campingspot: {{ getCampingSpotName(review.fK_CampingSpot) }}</h2>
        <div class="stars">
          <span v-for="star in review.score" :key="star" class="star">&#9733;</span>
        </div>
        <p class="comment"> "{{ review.comment }}"</p>
        <p class="details">Date Posted: {{ formatDate(review.datePosted) }}</p>
        <div class="button-container">
          <button class="edit-button" @click="openEditPopup(review)">Edit</button>
          <button class="delete-button" @click="openDeletePopup(review)">Delete</button>
        </div>
      </div>
    </div>
    <div v-else class="no-reviews-message">No reviews yet...</div>

    <!-- Edit Review Popup -->
    <edit-review-popup :show="editPopupVisible" :review="selectedReview" @close="editPopupVisible = false" />

    <!-- Delete Review Popup -->
    <delete-review-popup :show="deletePopupVisible" :review="selectedReview" @close="deletePopupVisible = false" />
  </div>
</template>

<script>
import axios from 'axios';
import EditReviewPopup from '../../components/Edit/EditReviewPopup.vue';
import DeleteReviewPopup from '../../components/Delete/DeleteReviewPopup.vue';
import moment from 'moment'; 

const API_URL = "http://localhost:5253";

export default {
  components: {
    EditReviewPopup,
    DeleteReviewPopup
  },
  props: ['show', 'campingSpotId'],
  data() {
    return {
      reviews: [],
      campingSpots: [],
      loading: true,
      user: {
        id: '',
      },
      hoveredReviewId: null,
      editPopupVisible: false,
      deletePopupVisible: false,
      selectedReview: null
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
        await this.fetchReviews();
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

    async fetchReviews() {
      try {
        const response = await axios.get(API_URL + `/Review/Reviews/User/${this.user.id}`);
        this.reviews = response.data;
      } catch (error) {
        console.error('Error fetching reviews:', error);
        throw error; 
      } finally {
        this.loading = false;
      }
    },

    getCampingSpotName(campingSpotId) {
      const spot = this.campingSpots.find(spot => spot.id === campingSpotId);
      return spot ? spot.name : 'Unknown';
    },

    openEditPopup(review) {
      this.selectedReview = review;
      this.editPopupVisible = true;
    },

    openDeletePopup(review) {
      this.selectedReview = review;
      this.deletePopupVisible = true;
    },

    toggleHover(isHovered, reviewId) {
      this.hoveredReviewId = isHovered ? reviewId : null;
    },

    formatDate(dateString) {
      return moment(dateString).format('DD-MM-YYYY');
    }
  },
};
</script>

<style scoped>
.reviews-container {
  padding: 20px;
}

.review-container {
  border: 2px solid #555; 
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
}

.button-container {
  text-align: center;
  margin-top: 15px; 
}

.edit-button,
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

.edit-button:hover {
  background-color: #cceeff; 
}

.delete-button:hover {
  background-color: #ffcccc; 
}
</style>
