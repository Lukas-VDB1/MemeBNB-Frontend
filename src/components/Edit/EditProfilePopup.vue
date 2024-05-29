<template>
    <div v-if="visible" class="modal-overlay" @click.self="hide">
      <div class="modal-container">
        <div class="modal-header">
          <h3 class="title">Edit Profile</h3>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="firstName">First Name</label>
            <input type="text" class="form-control" v-model="user.firstName" placeholder="First Name" />
          </div>
          <div class="form-group">
            <label for="lastName">Last Name</label>
            <input type="text" class="form-control" v-model="user.lastName" placeholder="Last Name" />
          </div>
          <!-- <div class="form-group">
            <label>Email</label>
            <input type="text" class="form-control" :value="user.email" disabled />
          </div> -->
          <div class="form-group">
            <label for="newPassword">New Password</label>
            <input type="password" class="form-control" v-model="user.newPassword" />
          </div>
          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input type="password" class="form-control" v-model="user.confirmPassword" />
          </div>
          <div v-if="passwordsMatchError" class="text-danger">{{ passwordsMatchError }}</div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary close-button" @click="hide">Close</button>
          <button class="btn btn-primary save-button" @click="saveChanges">Save</button>
        </div>
      </div>
    </div>
  </template>
  
<script>
import axios from 'axios';
const API_URL = 'http://localhost:5253';


  export default {
    props: {
      visible: {
        type: Boolean,
        required: true
      },
      user: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        user: {
            id: '',
        },
        newPassword: '',
        confirmPassword: '',
        passwordsMatchError: ''
      };
    },
    methods: {
      hide() {
        this.$emit('update:visible', false);
      },
      async saveChanges() {
        if (this.user.newPassword === this.user.confirmPassword) {

            if (this.user.newPassword === ""){
                this.passwordsMatchError = 'Please enter your current (or new) password to confirm';
            }
            else{
                const jwt_value = $cookies.get("jwt");
                const response_get = await axios.get(API_URL + '/auth/user?jwt_value=' + jwt_value);
                this.userData = response_get.data;

                const response = await axios.put(API_URL + '/User/Edit/' + this.userData.id, {
                    id: this.userData.id,
                    firstName: this.user.firstName,
                    lastName: this.user.lastName,
                    birthDate: this.userData.birthDate,
                    password: this.user.confirmPassword,
                    email: this.userData.email
            })
        
            console.log('API call to save data');
            this.hide(); 
            }
        } else {
          this.passwordsMatchError = 'Passwords don\'t match';
        }
      }
    }
  };
</script>

<style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .modal-container {
    background: white;
    padding: 20px;
    border-radius: 8px;
    width: 90%;
    max-width: 500px;
    display: flex;
    flex-direction: column;
  }
  .modal-header {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .title {
    font-weight: bold;
  }
  .modal-body {
    margin-top: 10px;
    margin-bottom: 20px;
  }
  .modal-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .close-button {
    background-color: red;
    border: none;
    border-radius: 20px;
    color: white;
    padding: 10px 20px;
    cursor: pointer;
  }
  .save-button {
    background-color: blue;
    border: none;
    border-radius: 20px;
    color: white;
    padding: 10px 20px;
    cursor: pointer;
  }
  .close-button:hover {
    background-color: darkred;
  }
  .save-button:hover {
    background-color: darkblue;
  }
  .form-group {
    margin-bottom: 15px;
  }
  .form-control {
    border: 1px solid black;
    border-radius: 4px;
    padding: 8px 12px;
    width: 100%;
  }
</style>
  