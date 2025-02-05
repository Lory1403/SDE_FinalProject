<template>
    <div>
      <h2>Saved Trails</h2>
      <ul>
        <li v-for="trail in trails.tracks" :key="trail._id" @click="selectTrail(trail)">
          <p>{{ trail.name }}</p>
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