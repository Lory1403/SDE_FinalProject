<template>
  <div id="map" style="height: 500px; width: 100%;"></div>
</template>

<script>
import L from "leaflet";

export default {
  name: "MapComponent",
  props: {
    trail: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      map: null,
      routeLayer: null,
    };
  },

  // Lifecycle hook that is called after the component has been rendered.
  mounted() {
    this.initMap();
  },
  
  /**
   * Watcher for the `trail` property.
   * 
   * This watcher triggers the `updateMap` method whenever the `trail` property changes.
   * 
   * @property {Object} trail - The trail object being watched.
   * @method handler - The method that handles the change in the `trail` property.
   * @param {Object} newTrail - The new value of the `trail` property.
   * @property {boolean} immediate - If true, the handler is called immediately after the watcher is created.
   */
  watch: {
    trail: {
      handler(newTrail) {
        this.updateMap(newTrail);
      },
      immediate: true,
    },
  },

  methods: {

    /**
     * Initializes the map.
     * 
     * This method initializes the map and sets the view to the coordinates of the trail.
     */
    initMap() {
      this.map = L.map('map').setView([45.4125, 10.8530], 15);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(this.map);

      if (this.trail && this.trail.coordinates) {
        this.updateMap(this.trail);
      }
    },

    /**
     * Updates the map with the trail coordinates.
     */
    updateMap(trail) {
      // Remove the previous route layer if it exists
      if (this.routeLayer) {
        this.map.removeLayer(this.routeLayer);
      }

      if (trail && trail.coordinates) {
        // Extract the coordinates from the trail object
        const routeCoordinates = trail.coordinates.map(coord => ({
          lat: coord[1],
          lng: coord[0],
        }));

        // Create a polyline layer with the route coordinates
        this.routeLayer = L.polyline(routeCoordinates, {
          color: 'blue',
          weight: 4,
        }).addTo(this.map);

        // Fit the map to the bounds of the route layer
        const bounds = this.routeLayer.getBounds();
        this.map.fitBounds(bounds, { padding: [7, 7] });
      }
    },
  },
};
</script>

<style>
#map {
  height: 100%;
  width: 100%;
}
</style>