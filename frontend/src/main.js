import { createApp } from 'vue';
//import './style.css'
import 'leaflet/dist/leaflet.css';
import App from './App.vue';
import router from './router'; // Importa il router

// Crea l'app Vue e usa il router
const app = createApp(App);

app.use(router); // Collega il router all'app
app.mount('#app'); // Monta l'app sull'elemento con id 'app'
