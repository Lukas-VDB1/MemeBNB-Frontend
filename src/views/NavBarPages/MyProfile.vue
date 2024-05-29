<template>
  <div class="outer-container">
    <div class="container text-center">
      <h1 class="title mt-5">My Profile</h1>
      <div class="card mt-4 mx-auto">
        <div class="card-body">
          <div class="mb-3">
            <label class="form-label subtitle">First Name</label>
            <div>{{ user.firstName }}</div>
          </div>
          <div class="mb-3">
            <label class="form-label subtitle">Last Name</label>
            <div>{{ user.lastName }}</div>
          </div>
          <div class="mb-3">
            <label class="form-label subtitle">Email</label>
            <div>{{ user.email }}</div>
          </div>
          <button class="btn btn-primary edit-button" @click="showEditPopup">Edit Info</button>
        </div>
      </div>
      <EditProfilePopup :visible="isEditPopupVisible" :user="user" @update:visible="isEditPopupVisible = $event" />
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import EditProfilePopup from '../../components/Edit/EditProfilePopup.vue';
const API_URL = "http://localhost:5253";


export default {
  components: {
    EditProfilePopup,
  },
  data() {
    return {
      user: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
      },
      isEditPopupVisible: false,
    };
  },
  methods: {
    fetchUserData() {
      let jwt_value = $cookies.get("jwt");
      axios.get(`${API_URL}/auth/user?jwt_value=${jwt_value}`)
        .then(response => {
          this.user = response.data;
        })
        .catch(error => {
          console.error('There was an error fetching the user data:', error);
        });
    },
    showEditPopup() {
      this.isEditPopupVisible = true;
    },
  },
  mounted() {
    this.fetchUserData();
  },
};
</script>

<style scoped>
.outer-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
}
.container {
  max-width: 600px;
  height: auto; 
}
.title {
  font-size: 2em;
  font-weight: bold;
  margin-top: 20px;
}
.card {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  height: auto; 
  border: 2px solid #000; 
  padding: 20px;
}
.subtitle {
  font-weight: bold;
}
.edit-button {
  background-color: blue;
  border: none;
  border-radius: 20px;
  color: white;
  padding: 10px 20px;
  cursor: pointer;
}
.edit-button:hover {
  background-color: darkblue;
}
</style>
