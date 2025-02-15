<template>
  <div class="container">
    <label class="waiting-label" v-if="map == null">Loading map...</label>
    <div id="map" ref="map"></div>

    <!-- Control container for buttons -->
    <div class="control-container">
      <button class="button-type" :disabled="!selectedPoints || selectedPoints.length !== 2"
        v-if="selectedPoints && selectedPoints.length == 2" @click="calculateTrail">
        Calculate Trail
      </button>
      <button class="button-type" :disabled="selectedPoints.length == 0" v-if="selectedPoints.length != 0"
        @click="clearMap">
        Clear Map
      </button>
      <button class="button-type" :disabled="!trackCoordinates" v-if="trackCoordinates" @click="saveTrack">
        Save Trail
      </button>
      <BackButton />
    </div>
  </div>
</template>

<script>
import L from 'leaflet';
import axios from 'axios';
import BackButton from './BackButton.vue';

export default {
  components: {
    BackButton
  },
  data() {
    return {
      map: null,
      marker1: null,                  // Marker for the first selected point
      marker2: null,                  // Marker for the second selected point
      selectedPoints: [],             // Array to store the selected point coordinates
      trackLayer: null,               // Layer to store the track polyline
      trackCoordinates: null,         // Array to store the track coordinates
      trackData: {
        name: "",
        summary: {
          distance: 0,
          duration: 0,
          heightDiff: 0,
          up: 0,
          down: 0
        },
        difficulty: {
          cmpIdx: 0,
          CAI: 0
        },
        geometry: {
          coordinates: []
        }
      },
      markerIconUrl: '/marker-icon.png' // Use an absolute path to the icon
    };
  },
  mounted() {
    this.initMap();
  },
  methods: {
    initMap() {
      // Check if geolocation is supported by the browser
      if (navigator.geolocation) {
        // Get the current position of the user
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;

          // Set the map view to the user's current position
          this.map = L.map(this.$refs.map).setView([latitude, longitude], 13);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }).addTo(this.map);

          // Import marker icon to use
          const Icon = L.icon({
            iconUrl: this.markerIconUrl,
            iconSize: [25, 41],
            iconAnchor: [12, 41]
          });

          // Add a click event listener to the map
          this.map.on('click', (e) => {
            // If no points are selected, add the first marker
            if (!this.selectedPoints.length) {
              this.marker1 = L.marker(e.latlng, { icon: Icon }).addTo(this.map);
              this.selectedPoints.push(e.latlng);
            } else if (this.selectedPoints.length === 1) {        // If one point is already selected, add the second marker
              this.marker2 = L.marker(e.latlng, { icon: Icon }).addTo(this.map);
              this.selectedPoints.push(e.latlng);
            }
          });
        },
          () => {
            // Fallback in case of error or if the user denies geolocation
            this.map = L.map(this.$refs.map).setView([45.5236, -122.6750], 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(this.map);
          });
      } else {
        // Fallback if geolocation is not supported
        this.map = L.map(this.$refs.map).setView([45.5236, -122.6750], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);
      }
    },

    // Function to clear the selected points and markers
    selectPoints() {
      this.selectedPoints = [];
      if (this.marker1) {
        this.map.removeLayer(this.marker1);
        this.marker1 = null;
      }
      if (this.marker2) {
        this.map.removeLayer(this.marker2);
        this.marker2 = null;
      }
    },

    // Function to calculate the track between the selected points
    calculateTrail() {
      if (this.selectedPoints.length < 2) {
        console.error('Not enough points selected to calculate trail');
        return;
      }

      const [lat1, lng1] = [this.selectedPoints[0].lat, this.selectedPoints[0].lng];
      const [lat2, lng2] = [this.selectedPoints[1].lat, this.selectedPoints[1].lng];

      const start = `${lat1},${lng1}`;
      const end = `${lat2},${lng2}`;
      const url = `${import.meta.env.VITE_APP_BACKEND_URL}/api/track?start=${start}&end=${end}`;

      // Prima richiesta: calcola il percorso
      fetch(url, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
        }
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          this.trackData.geometry.coordinates = data.geometry.coordinates;           // Store the track geometry
          this.trackCoordinates = data.geometry.coordinates;  // Store the track coordinates
          this.drawTrack();                                   // Draw the track on the map

          // Estrai i dati di elevazione
          const elevationData = data.geometry.coordinates.map(coord => ({
            lon: coord[0],
            lat: coord[1],
            pos: coord[2] || 0, // Se disponibile, usa la quota (ele)
            ele: coord[2] || 0, // Elevazione
          }));

          // Emit the elevation data to parent
          this.$emit("elevation-data", elevationData);

          // Emit the summary data to parent as well
          const summary = {
            distance: data.summary.distance,
            duration: data.summary.duration,
            heightDiff: data.summary.heightDiff,
            up: data.summary.up,
            down: data.summary.down
          };
          this.trackData.summary = summary;
          this.$emit("summary-data", summary);  // Emit summary data

          // Seconda richiesta: calcola la difficoltà
          const difficultyUrl = `${import.meta.env.VITE_APP_BACKEND_URL}/api/difficulty?start=${start}&end=${end}`;
          fetch(difficultyUrl, {
            headers: {
              "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
            }
          })
            .then(response => {
              if (!response.ok) {
                throw new Error('Network response for difficulty was not ok');
              }
              return response.json();
            })
            .then(difficultyData => {
              const difficulty = {
                cmpIdx: difficultyData.cmpIdx,
                CAI: difficultyData.CAI
              };
              this.trackData.difficulty = difficulty;
              this.$emit("difficultyData", difficultyData);
            })
            .catch(error => {
              console.error('Error fetching difficulty:', error);
            });

        })
        .catch(error => {
          console.error('Error calculating trail:', error);
        });
    },
    // Function to draw the track on the map
    drawTrack() {
      if (this.trackCoordinates && this.trackCoordinates.length > 0) {
        const latlngs = this.trackCoordinates.map(coord => [coord[1], coord[0]]); // Inverti latitudine e longitudine

        if (this.trackLayer) {
          this.map.removeLayer(this.trackLayer);
        }

        this.trackLayer = L.polyline(latlngs, { color: 'blue' }).addTo(this.map);
        this.map.fitBounds(this.trackLayer.getBounds());
        setTimeout(() => {
          this.map.fitBounds(this.trackLayer.getBounds());
        }, 100);
      }
    },

    // Function to clear all added map elements
    clearMap() {
      this.selectedPoints = [];
      if (this.marker1) {
        this.map.removeLayer(this.marker1);
        this.marker1 = null;
      }
      if (this.marker2) {
        this.map.removeLayer(this.marker2);
        this.marker2 = null;
      }
      if (this.trackLayer) {
        this.map.removeLayer(this.trackLayer);
        this.trackLayer = null;
      }

      this.trackCoordinates = null;

      setTimeout(() => {
        this.map.invalidateSize();
      }, 100);

      this.$emit('clear-map');
    },

    // Function to store the track on the database
    saveTrack() {
      const trailName = prompt('Enter the name of the trail:');
      if (trailName) {
        this.trackData.name = trailName;
        const token = localStorage.getItem('authToken');
        axios.post(`${import.meta.env.VITE_APP_BACKEND_URL}/api/track/save`, { track: this.trackData }, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
          }
        })
          .then(response => {
            alert('Percorso salvato con successo!');
          })
          .catch(error => {
            console.error('Errore durante il salvataggio del percorso:', error);
            alert('Errore durante il salvataggio del percorso.');
          });
      } else {
        alert('Il nome del tracciato è obbligatorio.');
      }
    }
  }
};
</script>

<style>
/* Keyframes for animating the waiting label */
@keyframes fadeInOut {

  0%,
  100% {
    opacity: 0;
  }

  50% {
    opacity: 1;
  }
}

/* Styling for the waiting label */
.waiting-label {
  display: block;
  text-align: center;
  margin-top: 10px;
  font-size: 24px;
  animation: fadeInOut 4s infinite;
}

/* Styling for the map container */
#map {
  margin: 0 auto;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  height: 600px;
  /* width: 1000px; */

  /* Positioning parameters */
  position: relative;
  left: 0%;
  top: -0px;
}

/* Styling for the control container (buttons) */
.control-container {
  margin-top: 20px;
  width: 100%;
  display: flex;
  justify-content: center;
}

.button-type {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #4285f4;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin: 0 5px;
  transition: background-color 0.3s ease;
}
</style>
