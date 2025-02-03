<template>
  <div>
    <h1>Create a New Trail</h1>
    <MapTrailCreator @elevation-data="updateElevationData" @clear-map="clearMapData" @summary-data="updateSummaryData" @difficultyData="updateDifficultyData"/>
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
      elevationData: [],
      summaryData: null, // Dati per il riepilogo del percorso
      difficultyData: null, // Dati di difficoltà
      chartData: {
        labels: [],
        datasets: [{
          label: "Elevation Profile",
          data: [],
          borderColor: "blue",
          fill: false
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Elevation Profile'
          },
          tooltip: {
            mode: 'index',
            intersect: false
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Position'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Elevation (m)'
            }
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
  justify-content: center; /* Centra orizzontalmente */
  align-items: center;     /* Centra verticalmente */
  height: 400px;           /* Altezza fissa o dinamica per centrare verticalmente */
  width: 100%;             /* Assicurati che occupi tutta la larghezza disponibile */
  margin: 0 auto;          /* Centro orizzontale aggiuntivo */
}
</style>
