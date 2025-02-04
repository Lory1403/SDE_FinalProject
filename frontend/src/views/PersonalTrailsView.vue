<template>
    <div>
      <div class="trails-list">
        <SavedTrailsList @select-trail="selectTrail" />
      </div>
      <div class="trail-details" v-if="selectedTrail">
        <Map :trail="selectedTrail" />
        <TrailSummary :summary="selectedTrail.summary" :difficultyData="selectedTrail.difficultyData" />
        <ElevationChart :chartData="selectedTrail.chartData" :options="chartOptions" :chartReady="chartReady" />
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
        chartOptions: {
          responsive: true,
          maintainAspectRatio: false
        },
        chartReady: false
      };
    },
    methods: {
      selectTrail(trail) {
        this.selectedTrail = trail;
        this.chartReady = true;
      }
    }
  };
  </script>
  
  <style scoped>
  .trails-list {
    float: left;
    width: 30%;
  }
  
  .trail-details {
    float: right;
    width: 70%;
  }
  </style>