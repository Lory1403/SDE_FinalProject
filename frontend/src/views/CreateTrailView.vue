<template>
  <div>
    <h1>Create a New Trail</h1>
    <MapTrailCreator ref="MapTrailCreator" @elevation-data="updateElevationData" @clear-map="clearMapData" @summary-data="updateSummaryData"
      @difficultyData="updateDifficultyData" />
    <TrailSummary v-if="summaryData && difficultyData" :summary="summaryData" :difficultyData="difficultyData" />
    <ElevationChart :chartData="chartData" :options="options" :chartReady="chartReady" />
  </div>
</template>

<script>
import MapTrailCreator from '../components/MapTrailCreator.vue';
import ElevationChart from "../components/ElevationChart.vue";
import TrailSummary from '../components/TrailSummary.vue';

export default {
  name: 'CreateTrailView',
  components: {
    MapTrailCreator,
    ElevationChart,
    TrailSummary // Aggiungi TrailSummary ai componenti
  },
  data() {
    return {
      trailName: '',
      elevationData: [],
      summaryData: null, // Dati per il riepilogo del percorso
      difficultyData: null, // Dati di difficoltà
      posEleLatLon: new Map(),        // Map for position, elevation and lat/lon
      circleMarker: null,       // Marker to place on the map
      chartData: {
        labels: [],
        datasets: [{
          label: "Elevation Profile",
          data: [],
          backgroundColor: '#ffffff',
          borderColor: 'rgb(75, 192, 192)',
          pointRadius: 0
        }]
      },
      options: {
        scales: {
          x: {
            display: false,
          }
        },
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          axis: 'xy',
          mode: 'nearest',
        },
        plugins: {
          tooltip: {
            enabled: true,
            external: function (context) {                  // Handle chart interactions
              const tooltipModel = context.tooltip;

              if (!tooltipModel || tooltipModel.dataPoints.length === 0) return;

              const dataPoint = tooltipModel.dataPoints[0]; // Closest data point

              // Get coordinates for the marker position
              var lat = this.posEleLatLon.get(dataPoint.dataIndex).lat;
              var lon = this.posEleLatLon.get(dataPoint.dataIndex).lon;

              if (lat != null && lon != null) {
                // If the marker already exists, update its position
                if (this.circleMarker != null) {
                  this.circleMarker.remove();
                  this.circleMarker = L.circleMarker([lat, lon], {
                    radius: 6,
                    color: '#FFA500',
                    fillColor: '#FFA500',
                    fillOpacity: 1
                  }).addTo(this.$refs.MapTrailCreator.map).bringToFront();
                } else {
                  // Add a marker to the map
                  this.circleMarker = L.circleMarker([lat, lon], {
                    radius: 6,
                    color: '#FFA500',
                    fillColor: '#FFA500',
                    fillOpacity: 1
                  }).addTo(this.$refs.MapTrailCreator.map).bringToFront();
                }
              }
            }.bind(this) // Assicurati di legare `this` al contesto
          }
        }
      },
      chartReady: false,
      selectedPoints: [],
      trackCoordinates: [],
    };
  },
  methods: {
    updateElevationData(data) {
      // Impostiamo i dati del grafico di elevazione
      this.chartData.labels = data.map((_, index) => index); // Posizione sui punti
      this.chartData.datasets[0].data = data.map(point => point.ele); // Elevazione
      this.chartReady = true;

      // Create map for later use to draw points on the map
      this.posEleLatLon.clear();

      // Update the chart data
      for (let i = 0; i < data.length; i++) {
        this.posEleLatLon.set(i, { ele: data[i].ele, lat: data[i].lat, lon: data[i].lon });    // Map used to draw points on the map
      }
    },

    // Metodo per aggiornare i dati del riepilogo
    updateSummaryData(data) {
      // Impostiamo i dati del riepilogo ricevuti dal componente MapTrailCreator
      this.summaryData = {
        distance: data.distance,   // Distanza percorsa
        duration: data.duration,   // Durata del percorso
        heightDiff: data.heightDiff, // Differenza di altitudine
        up: data.up,               // Dislivello positivo
        down: data.down            // Dislivello negativo
      };
    },

    // Nuovo metodo per aggiornare i dati di difficoltà
    updateDifficultyData(data) {
      this.difficultyData = {
        cmpIdx: data.cmpIdx, // Indice CMP
        CAI: data.CAI // Codice CAI
      };
    },

    // Nuovo metodo per resettare il grafico e il riepilogo
    clearMapData() {
      this.summaryData = null; // Reset dei dati del riepilogo
      this.difficultyData = null; // Resetta anche i dati di difficoltà
      this.chartData.datasets[0].data = []; // Reset dei dati del grafico
      this.chartData.labels = []; // Reset delle etichette del grafico
      this.chartReady = false; // Reset della visualizzazione del grafico
    }
  }
};
</script>

<style scoped>
h1 {
  text-align: center;
  margin-bottom: 20px;
}

.chart-container {
  display: flex;
  justify-content: center;
  /* Centra orizzontalmente */
  align-items: center;
  /* Centra verticalmente */
  height: 400px;
  /* Altezza fissa o dinamica per centrare verticalmente */
  width: 100%;
  /* Assicurati che occupi tutta la larghezza disponibile */
  margin: 0 auto;
  /* Centro orizzontale aggiuntivo */
}
</style>
