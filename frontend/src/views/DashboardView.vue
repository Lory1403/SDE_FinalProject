<template>
  <div class="dashboard">
    <h1>Welcome to your Dashboard, {{ userInfo.name }}!</h1>
    <p>Email: {{ userInfo.email }}</p>
    <p>Token Expiration: {{ expirationTime }}</p>

    <!-- Pulsanti per navigare tra le pagine -->
    <div class="buttons">
      <router-link to="/trails">
        <button class="action-button">Go to Trails</button>
      </router-link>
      <router-link to="/personalTrails">
        <button class="action-button">Go to Personal Trails</button>
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
    const expirationTime = ref('');

    // Funzione per verificare la validità del token e ottenere i dati dell'utente
    const getUserInfo = () => {
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

        // Assegna i dati del token alla variabile userInfo
        userInfo.value.name = decodedToken.name;
        userInfo.value.email = decodedToken.email;

        // Calcola e formatta la data di scadenza
        const expDate = new Date(decodedToken.exp * 1000);
        expirationTime.value = expDate.toLocaleString();
      } catch (error) {
        console.error('Errore nella decodifica del token:', error);
        window.location.href = '/'; // In caso di errore nella decodifica, reindirizza alla home
      }
    };

    onMounted(() => {
      getUserInfo();
    });

    return {
      userInfo,
      expirationTime,
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
