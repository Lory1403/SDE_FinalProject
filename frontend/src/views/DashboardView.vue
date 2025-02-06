<template>
  <div class="dashboard">
    <h1>Welcome to your Dashboard, {{ userInfo.name }}!</h1>
    <p>Email: {{ userInfo.email }}</p>

    <!-- Pulsanti per navigare tra le pagine -->
    <div class="buttons">
      <router-link to="/trails">
        <button class="action-button">Go to Trails</button>
      </router-link>
      <router-link to="/personalTrails">
        <button class="action-button">Go to Personal Trails</button>
      </router-link>
      <router-link to="/createTrail">
        <button class="action-button">Create a Trail</button>
      </router-link>
    </div>
  </div>
</template>

<script>
import { jwtDecode } from 'jwt-decode';
import { ref, onMounted } from 'vue';

export default {
  name: 'Dashboard',
  setup() {
    const userInfo = ref({
      name: '',
      email: '',
    });

    // Funzione per verificare la validità del token e ottenere i dati dell'utente
    const getUserInfo = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        // Se non c'è il token, reindirizza alla home page
        window.location.href = '/';
        return;
      }

      try {
        // Decodifica il token JWT
        const decodedToken = jwtDecode(token);
        // Verifica la scadenza del token
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          console.log('Il token è scaduto.');
          // Se il token è scaduto, reindirizza alla home
          window.location.href = '/';
          return;
        }

        const user = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/api/user/${decodedToken.googleId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }).then((res) => res.json());

        // Assegna i dati del token alla variabile userInfo
        userInfo.value.name = user.name;
        userInfo.value.email = user.email;
      } catch (error) {
        console.error('Errore nella decodifica del token:', error);
        window.location.href = '/'; // In caso di errore nella decodifica, reindirizza alla home
      }
    };

    onMounted(() => {
      getUserInfo();
    });

    return {
      userInfo
    };
  },
};
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  text-align: center;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

p {
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

/* Styling for buttons */
.buttons {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.action-button {
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  color: #fff;
  background-color: #4285f4;
  /* Colore di Google */
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.action-button:hover {
  background-color: #357ae8;
}
</style>
