import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Authenticate/Login';
import Registration from '../views/Authenticate/Registration';
import Home from '../views/Home';
import CampingSpot from '../views/CampingSpot';
import MyBookings from '../views/NavBarPages/MyBookings';
import MyReviews from '../views/NavBarPages/MyReviews';
import MyCampingSpots from '../views/NavBarPages/MyCampingSpots';
import MyProfile from '../views/NavBarPages/MyProfile';

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login, 
  },
  {
    path: '/register',
    name: 'Register',
    component: Registration, 
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
  },
  {
    path: '/camping-spot',
    name: 'CampingSpot',
    component: CampingSpot,
  },
  {
    path: '/my-bookings',
    name: 'MyBookings',
    component: MyBookings,
  },
  {
    path: '/my-reviews',
    name: 'MyReviews',
    component: MyReviews,
  },
  {
    path: '/my-campingspots',
    name: 'MyCampingSpots',
    component: MyCampingSpots,
  },
  {
    path: '/my-profile',
    name: 'MyProfile',
    component: MyProfile,
  },

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
