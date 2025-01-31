<template>
  <div class="container">
    <div id="map" ref="map"></div>
    <div class="control-container">
      <button :disabled="!selectedPoints || selectedPoints.length !== 2" @click="calculateTrail">Calculate Trail</button>
      <button :disabled="selectedPoints.length == 0" @click="clearMap">Clear Map</button>
      <button :disabled="!trackCoordinates" @click="saveTrack">Save Trail</button>
    </div>
  </div>
</template>

<script>
import L from 'leaflet';
import axios from 'axios';

export default {
  data() {
    return {
      map: null,
      marker1: null,
      marker2: null,
      selectedPoints: [],
      trackLayer: null,
      trackCoordinates: null
    };
  },
  mounted() {
    this.initMap();
  },
  methods: {
    initMap() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;
          this.map = L.map(this.$refs.map).setView([latitude, longitude], 13);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }).addTo(this.map);

          this.map.on('click', (e) => {
            if (!this.selectedPoints.length) {
              this.marker1 = L.marker(e.latlng).addTo(this.map);
              this.selectedPoints.push(e.latlng);
            } else if (this.selectedPoints.length === 1) {
              this.marker2 = L.marker(e.latlng).addTo(this.map);
              this.selectedPoints.push(e.latlng);
            }
          });
        }, () => {
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
    calculateTrail() {
      if (this.selectedPoints.length < 2) {
        console.error('Not enough points selected to calculate trail');
        return;
      }

      const [lat1, lng1] = [this.selectedPoints[0].lat, this.selectedPoints[0].lng];
      const [lat2, lng2] = [this.selectedPoints[1].lat, this.selectedPoints[1].lng];

      const start = `${lat1},${lng1}`;
      const end = `${lat2},${lng2}`;
      const url = `http://localhost:8080/api/track?start=${start}&end=${end}`;

      console.log(url);

      fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        this.trackCoordinates = data.geometry.coordinates;
        this.drawTrack();
      })
      .catch(error => {
        console.error('Error calculating trail:', error);
      });
  },
  drawTrack() {
    if (this.trackCoordinates && this.trackCoordinates.length > 0) {
      const latlngs = this.trackCoordinates.map(coord => [coord[1], coord[0]]); // Inverti latitudine e longitudine

      if (this.trackLayer) {
        this.map.removeLayer(this.trackLayer);
      }

      this.trackLayer = L.polyline(latlngs, { color: 'blue' }).addTo(this.map);
      this.map.fitBounds(this.trackLayer.getBounds());
    }
  },
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
    },
    saveTrack() {
      axios.post('/api/tracks/save', { coordinates: this.trackCoordinates })
        .then(response => {
          alert('Percorso salvato con successo!');
        });
    }
  }
};
</script>

<style>
#map {
    margin: 0 auto;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    height: 500px;
    width: 1000px;

    /* Positioning parameters */
    position: relative;
    left: 0%;
    top: -0px;
}
.control-container {
  margin-top: 20px;
}
</style>