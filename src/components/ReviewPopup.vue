<template>
    <div class="modal" v-if="show">
      <div class="modal-content">
        <span class="close" @click="close">&times;</span>
        <div v-if="loading" class="loading-message">Loading reviews...</div>
        <div v-else>
          <div v-if="reviews.length > 0">
            <div v-for="review in reviews" :key="review.id" class="review">
              <div class="stars">
                <span v-for="star in review.score" :key="star" class="star">&#9733;</span>
              </div>
              <p class="comment"> "{{ review.comment }}"</p>
              <p class="details">Date Posted: {{ review.datePosted }}</p>
              <p class="details">Reviewer: {{ review.fK_Reviewer }}</p>
            </div>
          </div>
          <div v-else class="no-reviews-message">No reviews yet...</div>
        </div>
      </div>
    </div>
</template>
  
<script>
  import axios from 'axios';
  const API_URL = "http://localhost:5253";
  
  export default {
    props: ['show', 'campingSpotId'],
    data() {
      return {
        reviews: [],
        loading: true,
      };
    },
    mounted() {
      if (this.show) {
        this.fetchReviews();
      }
    },
    watch: {
      show(newVal) {
        if (newVal) {
          this.fetchReviews();
        }
      },
    },
    methods: {
      async fetchReviews() {
        this.loading = true;
        try {
          const response = await axios.get(API_URL + `/Review/Reviews/CampingSpot/${this.campingSpotId}?camping_spot_id=${this.campingSpotId}`);
          this.reviews = response.data;
        } catch (error) {
          console.error('Error fetching reviews:', error);
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
    width: 60%; 
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
  
  .review {
    border-bottom: 1px solid #ddd;
    padding: 10px 0;
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
    text-align: center;
    font-style: italic;
    color: #555;
  }
</style>
  