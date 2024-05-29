<template>
    <div class="edit-review-popup" v-if="show">
      <div class="popup-content">
        <h2>Edit Review</h2>
        <div class="form-group">
          <label>New Score:</label>
          <div class="score-input">
            <button @click="decrementScore" :disabled="editedReview.score === 1">-</button>
            <span>{{ editedReview.score }}</span>
            <button @click="incrementScore" :disabled="editedReview.score === 5">+</button>
          </div>
        </div>
        <div class="form-group">
          <label for="comment">New Comment:</label>
          <textarea id="comment" v-model="editedReview.comment"></textarea>
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
    props: ['show', 'review', 'campingspot'],
    data() {
      return {
        editedReview: { ...this.review }
      };
    },
    watch: {
      review(newReview) {
        this.editedReview = { ...newReview };
      }
    },
    methods: {
      cancel() {
        this.$emit('close');
      },
      async save() {
        
        try {
          const response = await axios.put(API_URL + '/Review/Edit/' + this.review.id, {
          id: this.review.id,
          fK_Reviewer: this.review.fK_Reviewer,
          fK_CampingSpot: this.review.fK_CampingSpot,
          score: this.editedReview.score,
          comment: this.editedReview.comment
        });
        
          this.$emit('close', this.newReview);
        } catch (error) {
          console.error('Error saving review:', error);
        }
      },


      incrementScore() {
        if (this.editedReview.score < 5) {
          this.editedReview.score++;
        }
      },
      decrementScore() {
        if (this.editedReview.score > 1) {
          this.editedReview.score--;
        }
      }
    }
  };
</script>
  
  
<style scoped>
  .edit-review-popup {
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
  