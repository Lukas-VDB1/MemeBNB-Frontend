import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/tailwind.css';

//fix leaflet map marker icons not showing properly
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
   iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
   iconUrl: require('leaflet/dist/images/marker-icon.png'),
   shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});


createApp(App).use(router).mount('#app')

