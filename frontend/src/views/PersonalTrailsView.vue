<template>
  <div class="container">
    <div class="trails-list">
      <SavedTrailsList @select-trail="selectTrail" />
    </div>
    <div class="trail-details">
      <Map :trail="selectedTrail" />
      <div v-if="selectedTrail" class="trail-info scrollable">
        <TrailSummary :summary="summary" :difficultyData="difficultyData" />
        <ElevationChart :chartData="chartData" :options="chartOptions" :chartReady="chartReady" />
      </div>
    </div>
  </div>
</template>

<script>
import SavedTrailsList from '../components/SavedTrailsList.vue';
import Map from '../components/Map.vue';
import TrailSummary from '../components/TrailSummary.vue';
import ElevationChart from '../components/ElevationChart.vue';

export default {
  name: 'PersonalTrailsView',
  components: {
    SavedTrailsList,
    Map,
    TrailSummary,
    ElevationChart
  },
  data() {
    return {
      selectedTrail: null,
      chartData: {
        labels: [],
        datasets: [
          {
            label: 'Elevation',
            backgroundColor: '#ffffff',
            borderColor: 'rgb(75, 192, 192)',
            pointRadius: 0,
            data: []
          }
        ]
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false
      },
      chartReady: false,
      summary: {
        distance: 0,
        duration: 0,
        heightDiff: 0,
        up: 0,
        down: 0
      },
      difficultyData: {
        cmpIdx: 0,
        CAI: ''
      }
    };
  },
  methods: {
    selectTrail(trail) {
      console.log('selectTrail method called');
      this.selectedTrail = trail;
      console.log('Selected trail:', trail);
      this.updateChartData(trail);
      this.updateSummaryData(trail);
      this.chartReady = true;
    },
    updateChartData(trail) {
      console.log('updateChartData method called');
      this.chartData.labels = trail.coordinates.map((_, index) => index);
      this.chartData.datasets[0].data = trail.coordinates.map(coord => coord[2]);
    },
    updateSummaryData(trail) {
      console.log(trail);
      this.summary = {
        distance: trail.distance,
        duration: trail.duration,
        heightDiff: trail.heightDiff,
        up: trail.up,
        down: trail.down
      };
      this.difficultyData = {
        cmpIdx: trail.cmpIdx,
        CAI: trail.CAI
      };
    }
  }
};
</script>

<style scoped>
.container {
  display: flex;
  height: 100vh;
}

.trails-list {
  width: 30%;
  overflow-y: auto;
  border-right: 1px solid #ccc;
}

.trail-details {
  width: 70%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  overflow-y: auto; /* Rende il div scrollabile verticalmente */
  max-height: 100vh; /* Imposta l'altezza massima del div */
}

.chart-container {
  flex: 1;
  overflow-y: auto; /* Rende il contenitore scrollabile */
}

.scrollable {
  overflow-y: auto;
}
</style>