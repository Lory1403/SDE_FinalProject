<template>
  <div class="container">
    <!-- List of saved trails -->
    <div class="trails-list">
      <SavedTrailsList @select-trail="selectTrail" />
      <div class="back-button-container">
        <BackButton />
      </div>
    </div>

    <!-- Trail details with map and elevation graph -->
    <div class="trail-details">
      <MapComponent ref="MapComponent" :trail="selectedTrail" />
      <div v-if="selectedTrail" class="trail-info scrollable">
        <TrailSummary :summary="summary" :difficultyData="difficultyData" />
        <ElevationChart :chartData="chartData" :options="chartOptions" :chartReady="chartReady" />
      </div>
    </div>
  </div>
</template>

<script>
import SavedTrailsList from '../components/SavedTrailsList.vue';
import MapComponent from '../components/Map.vue';
import TrailSummary from '../components/TrailSummary.vue';
import ElevationChart from '../components/ElevationChart.vue';
import BackButton from '../components/BackButton.vue';

export default {
  name: 'PersonalTrailsView',
  components: {
    SavedTrailsList,
    MapComponent,
    TrailSummary,
    ElevationChart,
    BackButton
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
      posEleLatLon: new Map(),        // Map for position, elevation and lat/lon
      circleMarker: null,             // Marker to place on the map
      chartOptions: {
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
                  }).addTo(this.$refs.MapComponent.map).bringToFront();
                } else {
                  // Add a marker to the map
                  this.circleMarker = L.circleMarker([lat, lon], {
                    radius: 6,
                    color: '#FFA500',
                    fillColor: '#FFA500',
                    fillOpacity: 1
                  }).addTo(this.$refs.MapComponent.map).bringToFront();
                }
              }
            }.bind(this) // Assicurati di legare `this` al contesto
          }
        }
      },
      chartReady: false,    // Flag to to make the graph visible only when the data is loaded
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
    // Method called once a trail is selected
    selectTrail(trail) {
      this.selectedTrail = trail;

      // Remove eventual marker from the map
      if (this.circleMarker != null)
        this.circleMarker.remove();

      // Load information for the selected trail
      this.updateChartData(trail);
      this.updateSummaryData(trail);
      this.chartReady = true;
    },

    // Method to update the chart data
    updateChartData(trail) {
      // Get the elevation data from the trail
      this.chartData.labels = trail.coordinates.map((_, index) => index);
      this.chartData.datasets[0].data = trail.coordinates.map(coord => coord[2]);

      // Create map for later use to draw points on the map
      this.posEleLatLon.clear();

      // Update the chart data
      for (let i = 0; i < trail.coordinates.length; i++) {
        this.posEleLatLon.set(i, { ele: trail.coordinates[i][2], lat: trail.coordinates[i][1], lon: trail.coordinates[i][0] });    // Map used to draw points on the map
      }

      // Use $nextTick to ensure the map has updated with any new layers before fitting bounds.
      this.$nextTick(() => {
        // Check if both map and routeLayer exist to avoid errors
        if (this.$refs.MapComponent && this.$refs.MapComponent.map && this.$refs.MapComponent.routeLayer) {
          // Invalidate the map size so that Leaflet is aware of the container's new dimensions
          this.$refs.MapComponent.map.invalidateSize();

          // Refit the map boundaries to the trackLayer
          const bounds = this.$refs.MapComponent.routeLayer.getBounds();
          this.$refs.MapComponent.map.fitBounds(bounds);
        }
      });
    },

    // Method to update the summary data of the trail
    updateSummaryData(trail) {
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
  overflow-y: auto;
  /* Rende il div scrollabile verticalmente */
  max-height: 100vh;
  /* Imposta l'altezza massima del div */
}

.chart-container {
  flex: 1;
  overflow-y: auto;
  /* Rende il contenitore scrollabile */
}

.scrollable {
  overflow-y: auto;
}
</style>
