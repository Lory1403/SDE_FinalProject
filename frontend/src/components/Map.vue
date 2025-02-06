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
  mounted() {
    this.initMap();
  },
  watch: {
    trail: {
      handler(newTrail) {
        this.updateMap(newTrail);
      },
      immediate: true,
    },
  },
  methods: {
    initMap() {
      this.map = L.map('map').setView([45.4125, 10.8530], 15);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(this.map);

      if (this.trail && this.trail.coordinates) {
        this.updateMap(this.trail);
      } else {
        console.warn("Nessun tracciato selezionato.");
      }
    },
    updateMap(trail) {
      if (this.routeLayer) {
        this.map.removeLayer(this.routeLayer);
      }

      if (trail && trail.coordinates) {
        const routeCoordinates = trail.coordinates.map(coord => ({
          lat: coord[1],
          lng: coord[0],
        }));

        this.routeLayer = L.polyline(routeCoordinates, {
          color: 'blue',
          weight: 4,
        }).addTo(this.map);

        const bounds = this.routeLayer.getBounds();
        this.map.fitBounds(bounds, { padding: [7, 7] });
      } else {
        console.warn("Nessun tracciato selezionato.");
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