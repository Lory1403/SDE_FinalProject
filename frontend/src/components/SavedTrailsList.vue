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
  h2 {
    color: white;
    text-align: center;
    margin-top: 20px; /* Aggiunge spazio sopra il titolo */
  }

  ul {
    list-style-type: none;
    padding: 0;
  }
  
  li {
    cursor: pointer;
    padding: 10px;
    border-bottom: 1px solid #ccc;
    color: white;
  }
  
  li:hover {
    background-color: #333;
  }

  p {
    margin: 0;
    border: 1px solid #ccc; /* Aggiunge un riquadro attorno al nome del tracciato */
    padding: 5px; /* Aggiunge un po' di padding all'interno del riquadro */
    border-radius: 10px; /* Arrotonda i bordi del riquadro */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Aggiunge un'ombra per un effetto smooth */
  }
  </style>