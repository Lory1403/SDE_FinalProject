<template>
    <div class="trail-summary">
      <h2>Trail Summary</h2>
      <ul>
        <li><strong>Distance:</strong> {{ formatDistance(summary.distance) }}</li>
        <li><strong>Duration:</strong> {{ formatDuration(summary.duration) }}</li>
        <li><strong>Elevation Difference:</strong> {{ summary.heightDiff }} meters</li>
      <li><strong>Up:</strong> {{ summary.up }} meters - <strong>Down:</strong> {{ summary.down }} meters</li>
      <li><strong>Difficulty:</strong></li>
      <li><strong>Cmp Index:</strong> {{ difficultyData.cmpIdx }} - <strong>CAI Code:</strong> {{ difficultyData.CAI }}</li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    name: 'TrailSummary',
    props: {
      summary: {
        type: Object,
        required: true,
      },
      difficultyData: {
        type: Object,
        required: true,
      }
    },
    methods: {
      formatDuration(seconds) {
        const hours = Math.floor(seconds / 3600); // Calcola le ore
        const minutes = Math.floor((seconds % 3600) / 60); // Calcola i minuti
        const secs = (seconds % 60).toFixed(0); // Calculate seconds and fix it to 2 decimals
  
        if (hours > 0) {
          return `${hours} h ${minutes} min ${secs} sec`; // Se ci sono ore
        }
        return `${minutes} min ${secs} sec`; // Altrimenti solo minuti e secondi
      },
      formatDistance(meters) {
        if (meters >= 1000) {
          return (meters / 1000).toFixed(2) + ' km'; // Converte in km se supera 1000 metri
        }
        return meters + ' m'; // Altrimenti lascia in metri
      },
    }
  };
  </script>
  
  <style scoped>
  .trail-summary {
    padding: 20px;
    background-color: #424242;
    border-radius: 8px;
    margin-top: 20px;
    text-align: center;
  }
  
  h2 {
    text-align: center;
    margin-bottom: 10px;
  }
  
  ul {
    list-style-type: none;
    padding-left: 0;
  }
  
  li {
    font-size: 16px;
    margin-bottom: 8px;
  }
  
  strong {
    font-weight: bold;
  }
</style>