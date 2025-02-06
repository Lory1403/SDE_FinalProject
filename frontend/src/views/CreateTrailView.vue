<template>
  <h1>Create a New Trail</h1>
  <div class="global-container" :class="{ 'chart-ready': chartReady }">

    <div class="map-container">
      <MapTrailCreator ref="MapTrailCreator" @elevation-data="updateElevationData" @clear-map="clearMapData"
        @summary-data="updateSummaryData" @difficultyData="updateDifficultyData" />
    </div>

    <div class="chart_summary-container">
      <ElevationChart :chartData="chartData" :options="options" :chartReady="chartReady" />
      <TrailSummary v-if="summaryData && difficultyData" :summary="summaryData" :difficultyData="difficultyData" />
    </div>

    <!--
    <div class="trailSummary-container">
      <TrailSummary v-if="summaryData && difficultyData" :summary="summaryData" :difficultyData="difficultyData" />
    </div>
    -->
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

      // Use $nextTick to ensure the map has updated with any new layers before fitting bounds.
      this.$nextTick(() => {
        // Check if both map and trackLayer exist to avoid errors
        if (this.$refs.MapTrailCreator && this.$refs.MapTrailCreator.map && this.$refs.MapTrailCreator.trackLayer) {
          // Invalidate the map size so that Leaflet is aware of the container's new dimensions
          this.$refs.MapTrailCreator.map.invalidateSize();

          // Refit the map boundaries to the trackLayer
          const bounds = this.$refs.MapTrailCreator.trackLayer.getBounds();
          this.$refs.MapTrailCreator.map.fitBounds(bounds);
        }
      });
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

      if (this.circleMarker != null)
        this.circleMarker.remove();   //Remove the marker from the map
    }
  }
};
</script>

<style scoped>
h1 {
  text-align: center;
  margin-bottom: 20px;
}

.global-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  margin: 10px;
}

.map-container {
  width: 100%;
  min-height: 500px;
  /* Ensure map has minimum height */
}

/* .chart-container {
  display: none;
} */

/* .trailSummary-container {
  width: 100%;
} */

@media (min-width: 1200px) {
  .global-container {
    grid-template-columns: 1fr;
  }

  .global-container.chart-ready {
    grid-template-columns: 1fr 1fr;
  }

  .global-container.chart-ready .map-container,
  .global-container.chart-ready .chart_summary-container {
    width: 100%;
    min-width: auto;
    /* Remove fixed min-width */
  }

  .chart_summary-container {
    display: block;
  }
}
</style>