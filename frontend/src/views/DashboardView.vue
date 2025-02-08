<template>
  <div class="dashboard">
    <h1>Welcome to your Dashboard, {{ decryptedData?.name }}!</h1>
    <p>Email: {{ decryptedData?.email }}</p>

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
import { jwtDecode } from "jwt-decode";
import { ref, onMounted } from "vue";
import aesjs from "aes-js";

export default {
  name: "Dashboard",
  setup() {
    // Reattività per i dati decifrati
    const decryptedData = ref(null);

    // Funzione per decifrare i dati
    const decryptData = (encrypted) => {
      try {
        const encryptedBytes = aesjs.utils.hex.toBytes(encrypted);
        const aesCtr = new aesjs.ModeOfOperation.ctr(
          aesjs.utils.utf8.toBytes(import.meta.env.VITE_APP_ENCRYPTION_KEY)
        );
        const decryptedBytes = aesCtr.decrypt(encryptedBytes);
        const decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
        return JSON.parse(decryptedText);
      } catch (error) {
        console.error("Errore nella decifratura dei dati:", error);
        return null;
      }
    };

    // Funzione per ottenere e decifrare i dati
    const fetchAndDecryptData = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        window.location.href = "/"; // Reindirizza se non c'è il token
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/api/user`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Errore nella richiesta al server");
        }

        const { encryptedData } = await response.json();
        decryptedData.value = decryptData(encryptedData);
      } catch (error) {
        console.error("Errore durante il fetch dei dati:", error);
        window.location.href = "/"; // Reindirizza in caso di errore
      }
    };

    // Verifica token e ottieni dati al mount
    onMounted(() => {
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const currentTime = Date.now() / 1000;
          if (decodedToken.exp < currentTime) {
            console.log("Il token è scaduto.");
            window.location.href = "/";
          } else {
            fetchAndDecryptData();
          }
        } catch (error) {
          console.error("Errore nella decodifica del token:", error);
          window.location.href = "/";
        }
      } else {
        window.location.href = "/"; // Reindirizza se non c'è il token
      }
    });

    return {
      decryptedData,
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
