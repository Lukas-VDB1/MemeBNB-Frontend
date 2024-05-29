
<template>
  <div id="app">
    <NavBar v-if="!['Login'].includes($route.name)"  />
    <router-view/>
  </div>
</template>


<script>
import NavBar from './components/NavBar.vue'; //Import navbar
// import axios from "axios"; //import axios for api requests
// const API_URL = "http://localhost:5253";


export default {
  name: 'App',
  components: {
    NavBar
    //Map
  },
}
</script>



<style>
@import './assets/tailwind.css';
</style>