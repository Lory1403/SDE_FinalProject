<template>
    <div id="map" style="height: 500px; width: 100%;"></div>
  </template>
  
  <script>
  import L from "leaflet";
  
  export default {
    name: "Map",
    props: {
      // Accetta un percorso in formato GeoJSON come proprietà
      routeData: {
        type: Object,
        required: true,
      },
    },
    mounted() {
      // Inizializza la mappa solo se i dati sono validi
      if (this.isValidRouteData()) {
        this.initMap();
      } else {
        console.error("I dati del percorso non sono validi.");
      }
    },
    methods: {
      // Verifica che i dati siano validi
      isValidRouteData() {
        return this.routeData && this.routeData.coordinates && Array.isArray(this.routeData.coordinates) && this.routeData.coordinates.length > 0;
      },
  
      initMap() {
        // Crea la mappa centrata su un punto predefinito
        const map = L.map('map').setView([45.4125, 10.8530], 15); // Coordinate medie del percorso
  
        // Aggiungi il layer delle mappe (utilizziamo OpenStreetMap)
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);
  
        // Crea un array di lat/lng dal percorso JSON
        const routeCoordinates = this.routeData.coordinates.map(coord => ({
          lat: coord[1], // Latitudine
          lng: coord[0], // Longitudine
        }));
  
        // Aggiungi il percorso alla mappa
        const route = L.polyline(routeCoordinates, {
          color: 'blue',
          weight: 4,
        }).addTo(map);
  
        // Adatta la mappa per includere il percorso
        map.fitBounds(route.getBounds(), { padding: [10, 10] });
      },
    },
  };
  </script>
  
  <style>
  #map {
    height: 500px; /* Altezza fissa per la mappa */
    width: 100%;   /* Mappa responsive */
  }
  </style>
  