<template>
  <div class="new-review-popup">
    <div class="popup-content">
      <h2 class="popup-title">New Review</h2>
      <div class="form-group">
        <label>New Score:</label>
        <div class="score-input">
          <button @click="decrementScore" :disabled="newReview.score === 1">-</button>
          <span>{{ newReview.score }}</span>
          <button @click="incrementScore" :disabled="newReview.score === 5">+</button>
        </div>
      </div>
      <div class="form-group">
        <label for="comment">New Comment:</label>
        <textarea id="comment" v-model="newReview.comment"></textarea>
      </div>
      <div class="button-container">
        <button class="cancel-button" @click="cancel">Cancel</button>
        <button class="save-button" @click="save">Save</button>
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
      user: {
        id: '',
      },
      newReview: {
        score: 1,
        comment: ''
      }
    };
  },
  methods: {
    cancel() {
      this.$emit('close');
    },
    async save() {
      try {
        const CampingSpotID = localStorage.getItem('local_CampingSpotID');
        const jwt_value = $cookies.get("jwt");
        const response_get = await axios.get(API_URL + '/auth/user?jwt_value=' + jwt_value);
        this.userId = response_get.data.id;

        const response = await axios.post(API_URL + '/Review?reviewerId=' + this.userId + '&campingSpotId=' + CampingSpotID, {
          fK_Reviewer: this.userId,
          fK_CampingSpot: CampingSpotID,
          score: this.newReview.score,
          comment: this.newReview.comment
        });
        
        this.$emit('close', this.newReview);
      } catch (error) {
        alert('Please log in or try again later');
        console.error('Error saving review:', error);
      }
    },
    incrementScore() {
      if (this.newReview.score < 5) {
        this.newReview.score++;
      }
    },
    decrementScore() {
      if (this.newReview.score > 1) {
        this.newReview.score--;
      }
    }
  }
};
</script>


<style scoped>
.new-review-popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; 
}

.popup-content {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  z-index: 1001; 
}

.form-group {
  margin-bottom: 15px;
}

label {
  font-weight: bold;
}

.score-input {
  display: flex;
  align-items: center;
}

button {
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  background-color: #e0e0e0;
  cursor: pointer;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

button + span {
  margin: 0 10px;
}

textarea {
  width: 100%;
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.button-container {
  text-align: center;
}

.cancel-button,
.save-button {
  padding: 8px 16px;
  margin: 0 5px;
  border-radius: 5px;
  cursor: pointer;
}

.cancel-button {
  background-color: #ffcccc;
}

.save-button {
  background-color: #66cc99;
}
</style>
