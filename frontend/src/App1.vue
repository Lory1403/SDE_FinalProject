<template>
  <div id="app">
    <h1>Mappa del Percorso</h1>
    
    <!-- Mostra il messaggio di caricamento -->
    <div v-if="loading">Caricamento mappa...</div>
    
    <!-- Mostra la mappa solo quando i dati sono caricati -->
    <Map v-if="routeData && !loading" :routeData="routeData" />
    
    <!-- Mostra un errore se c'è un problema nel recupero dei dati -->
    <div v-else-if="error" class="error">
      Errore durante il caricamento dei dati. Per favore, riprova più tardi.
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Map from './components/Map.vue';

export default {
  name: 'App',
  components: {
    Map,
  },
  data() {
    return {
      routeData: null, // Dati del percorso
      loading: true,    // Stato di caricamento
      error: false,     // Stato di errore
    };
  },
  mounted() {
    // Avvia il recupero dei dati una volta che il componente è montato
    this.fetchRouteData();
  },
  methods: {
    fetchRouteData() {
      // Fai una richiesta GET all'API REST per ottenere i dati del percorso
      axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}/api/track?start=45.410838,10.852047&end=45.414908,10.858090`)
        .then(response => {
          this.routeData = response.data; // Imposta i dati del percorso
          this.loading = false;            // Imposta lo stato di caricamento a false
        })
        .catch(error => {
          console.error('Errore durante il recupero dei dati:', error);
          this.error = true;  // Imposta lo stato di errore a true
          this.loading = false; // Imposta lo stato di caricamento a false
        });
    },
  },
};
</script>

<style>
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
}

/* Stile per il messaggio di errore */
.error {
  color: red;
  font-weight: bold;
  margin-top: 20px;
}

/* Caricamento mappa */
div {
  font-size: 16px;
  color: #555;
}
</style>
