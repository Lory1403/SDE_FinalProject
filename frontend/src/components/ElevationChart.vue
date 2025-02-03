<template>
    <div class="chart-container">
        <Line v-if="chartReady" :data="chartData" :options="options" />
    </div>
</template>

<script>
import { Line } from 'vue-chartjs';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export default {
    name: 'ElevationChart',
    components: {
        Line,
    },
    props: {
        chartData: {
            type: Object,
            required: true,
        },
        options: {
            type: Object,
            required: true,
        },
        chartReady: {
            type: Boolean,
            required: true,
        },
    },
    data() {
        return {
            // Opzioni per Bézier smoothing
            smoothOptions: {
                tension: 1, // Curva Bézier, maggiore tensione, più curva
                fill: false,  // Non riempiamo sotto la curva
                cubicInterpolationMode: 'monotone', // Interpolazione monotona per evitare picchi
            },
        };
    },
    watch: {
        // Assicurati che le opzioni di Bézier vengano applicate ai dati
        chartData: {
            handler(newData) {
                this.chartData.datasets.forEach(dataset => {
                    dataset.tension = this.smoothOptions.tension; // Definisce la Bézier curve
                    dataset.cubicInterpolationMode = this.smoothOptions.cubicInterpolationMode; // Controllo della forma della curva
                    
                    // Imposta il raggio dei punti a 0 per rimuovere i cerchi
                    dataset.pointRadius = 0; // Rimuove i cerchi dai punti
                });
            },
            immediate: true
        },
    }
};
</script>

<style scoped>
.chart-container {
    width: 100%;
    height: 300px; /* Altezza personalizzabile */
    position: relative;
}
</style>
