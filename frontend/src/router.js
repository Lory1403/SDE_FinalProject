import { createRouter, createWebHistory } from 'vue-router';
import HomeView from './views/HomeView.vue';
import TrailsView from './views/TrailsView.vue';
import PersonalTrailsView from './views/PersonalTrailsView.vue';
import DashboardView from './views/DashboardView.vue';
import { jwtDecode } from 'jwt-decode';

// Funzione per verificare se il token esiste e se è valido
const isAuthenticated = () => {
    const token = localStorage.getItem('authToken');
    if (!token) return false;

    try {
        // Decodifica il token e verifica la data di scadenza
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Tempo attuale in secondi
        if (decodedToken.exp < currentTime) {
            console.log('Il token è scaduto.');
            return false;
        }
        return true; // Il token è valido
    } catch (error) {
        console.error('Errore nella decodifica del token:', error);
        return false;
    }
};

const routes = [
    { path: '/', name: 'home', component: HomeView },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: DashboardView,
        meta: { requiresAuth: true },
    },
    {
        path: '/trails',
        name: 'trails',
        component: TrailsView,
        meta: { requiresAuth: true },
    },
    {
        path: '/personalTrails',
        name: 'personalTrails',
        component: PersonalTrailsView,
        meta: { requiresAuth: true },
    },
    // Catch-all route per redirect a / se il percorso non è valido
    { path: '/:pathMatch(.*)*', redirect: '/' },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Verifica prima di ogni navigazione se l'autenticazione è necessaria
router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth && !isAuthenticated()) {
        // Se l'autenticazione è richiesta e l'utente non è autenticato, reindirizza alla home
        next({ name: 'home' });
    } else {
        next(); // Altrimenti, prosegui con la navigazione
    }
});

export default router;
