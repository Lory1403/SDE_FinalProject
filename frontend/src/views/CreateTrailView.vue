<template>
  <div>
    <h1>Create a New Trail</h1>
    <MapTrailCreator @elevation-data="updateElevationData" />
    <ElevationChart :chartData="chartData" :options="options" :chartReady="chartReady" />
  </div>
</template>

<script>
import MapTrailCreator from '../components/MapTrailCreator.vue';
import ElevationChart from "../components/ElevationChart.vue";

export default {
  name: 'CreateTrailView',
  components: {
    MapTrailCreator,
    ElevationChart
  },
  data() {
    return {
      elevationData: [],
      chartData: {
        labels: [],
        datasets: [{
          label: "Elevation Profile",
          data: [],
          borderColor: "blue",
          fill: false
        }]
      },
      chartReady: false,
      selectedPoints: [],
      trackCoordinates: [],
    };
  },
  methods: {
    updateElevationData(data) {
      this.elevationData = data;
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
      const url = `${import.meta.env.VITE_APP_BACKEND_URL}/api/track?start=${start}&end=${end}`;
  
      fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          this.trackCoordinates = data.geometry.coordinates;
          this.updateElevationChart(data);
          this.drawTrack();
        })
        .catch(error => {
          console.error('Error calculating trail:', error);
        });
    },
    drawTrack() {
      if (this.trackCoordinates && this.trackCoordinates.length > 0) {
        const latlngs = this.trackCoordinates.map(coord => [coord[1], coord[0]]);
  
        if (this.trackLayer) {
          this.map.removeLayer(this.trackLayer);
        }
  
        this.trackLayer = L.polyline(latlngs, { color: 'blue' }).addTo(this.map);
        this.map.fitBounds(this.trackLayer.getBounds());
      }
    },
    updateElevationChart(response) {
      try {
        this.chartData.labels = [];
        this.chartData.datasets[0].data = [];
  
        const totalDistance = response.summary.distance;
        const coordinates = response.geometry.coordinates;
  
        coordinates.forEach((point, index) => {
          const [lon, lat, ele] = point;
          const pos = (index / coordinates.length) * totalDistance;
  
          this.chartData.labels.push(pos.toFixed(2));
          this.chartData.datasets[0].data.push(ele.toFixed(1));
        });
  
        this.chartReady = true;
      } catch (error) {
        console.error("Error updating chart:", error);
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
  }
};
</script>

<style scoped>
h1 {
  text-align: center;
  margin-bottom: 20px;
}
</style>
