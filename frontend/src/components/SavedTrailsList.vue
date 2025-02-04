<template>
    <div>
      <h2>Saved Trails</h2>
      <ul>
        <li v-for="trail in trails.tracks" :key="trail._id" @click="selectTrail(trail)">
          <h3>{{ trail._id }}</h3>
          <p>Email: {{ trail.email }}</p>
          <p>Distance: {{ trail.distance }} meters</p>
          <p>Duration: {{ trail.duration }} seconds</p>
          <p>Height Difference: {{ trail.heightDiff }} meters</p>
          <p>Difficulty: {{ trail.cmpIdx }}</p>
          <p>CAI: {{ trail.CAI }}</p>
          <p>Timestamp: {{ new Date(trail.timestamp).toLocaleString() }}</p>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'SavedTrailsList',
    data() {
      return {
        trails: { tracks: [] },
      };
    },
    methods: {
      async fetchTrails() {
        try {
          const token = localStorage.getItem('authToken');
          const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}/api/tracks/get`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          this.trails = response.data;
          console.log('Fetched trails:', this.trails);
        } catch (error) {
          console.error('Error fetching trails:', error);
        }
      },
      selectTrail(trail) {
        this.$emit('select-trail', trail);
      }
    },
    mounted() {
      this.fetchTrails();
    }
  };
  </script>
  
  <style scoped>
  ul {
    list-style-type: none;
    padding: 0;
  }
  
  li {
    cursor: pointer;
    padding: 10px;
    border-bottom: 1px solid #ccc;
  }
  
  li:hover {
    background-color: #f0f0f0;
  }
  </style>