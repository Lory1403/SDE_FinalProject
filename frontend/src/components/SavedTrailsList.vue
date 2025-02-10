  <template>
  <div>
    <h2>Saved Trails</h2>
    <ul>
      <li v-for="trail in trails.tracks" :key="trail._id" class="trail-item">
        <p class="trail-name" @click="selectTrail(trail)">{{ trail.name }}</p>
        <button class="delete-button" @click.stop="deleteTrail(trail._id)"><img src="https://uxwing.com/wp-content/themes/uxwing/download/user-interface/red-trash-can-icon.png" style="height: 20px; width: 20px;"/></button>
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
        const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}/api/track/getTracks`, {
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
    },
    async deleteTrail(trailId) {
      try {
        const token = localStorage.getItem('authToken');
        await axios.delete(`${import.meta.env.VITE_APP_BACKEND_URL}/api/track/deleteTrack?trackId=${trailId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        this.fetchTrails();
      } catch (error) {
        console.error('Error deleting trail:', error);
      }
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
  margin-top: 20px;
  /* Aggiunge spazio sopra il titolo */
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
  border: 1px solid #ccc;
  /* Aggiunge un riquadro attorno al nome del tracciato */
  padding: 5px;
  /* Aggiunge un po' di padding all'interno del riquadro */
  border-radius: 10px;
  /* Arrotonda i bordi del riquadro */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  /* Aggiunge un'ombra per un effetto smooth */
}

.trail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #ccc;
}

.trail-name {
  flex-grow: 1;
  margin: 0;
  cursor: pointer;
}

.delete-button {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  color: #fff;
  background-color: #000000;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.delete-button:hover {
  background-color: #ff1a1a;
}

.delete-button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(255, 77, 77, 0.5);
}
</style>