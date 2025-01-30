<template>
    <div class="home-view">
        <h1>Welcome to Trails App</h1>
        <p>Discover amazing trails around you. Please log in to continue.</p>
        <button class="login-button" @click="loginWithGoogle">Login with Google</button>
    </div>
</template>

<script>
import { jwtDecode } from "jwt-decode";

export default {
    name: 'HomeView',
    mounted() {
        if (localStorage.getItem('authToken') && this.isTokenValid(localStorage.getItem('authToken'))) {
            this.$router.push('/dashboard');
        } else {
            // Controlla se nell'URL è presente un token
            const urlParams = new URLSearchParams(window.location.search);
            const token = urlParams.get('token');

            if (token && this.isTokenValid(token)) {
                // Memorizza il token in localStorage
                localStorage.setItem('authToken', token);

                // Reindirizza alla dashboard
                this.$router.push('/dashboard');
            }
        }

    },
    methods: {
        loginWithGoogle() {
            window.location.href = `http://localhost:8080/auth/google`;
        },
        isTokenValid(token) {
            try {
                // Decodifica il token JWT
                const decodedToken = jwtDecode(token);

                // Verifica se la data di scadenza (exp) è maggiore della data corrente
                const currentTime = Date.now() / 1000; // Il tempo in secondi
                if (decodedToken.exp < currentTime) {
                    console.log("Il token è scaduto.");
                    return false;
                }

                return true; // Il token è valido
            } catch (error) {
                console.error("Errore nella decodifica del token:", error);
                return false;
            }
        }
    },
};
</script>

<style scoped>
.home-view {
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
    margin-bottom: 2rem;
}

.login-button {
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

.login-button:hover {
    background-color: #357ae8;
}
</style>