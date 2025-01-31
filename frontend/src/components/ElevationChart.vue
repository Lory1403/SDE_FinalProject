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
};
</script>

<style scoped>
.chart-container {
    width: 100%;
    height: 300px; /* Altezza personalizzabile */
    position: relative;
}
</style>
