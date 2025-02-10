<template>
    <div class="chart-container">
        <Line v-if="chartReady" :key="chartKey" :data="chartData" :options="options" />
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
            chartKey: 0,    // Key used to force graph re-rendering
        };
    },
    watch: {
        chartData: {
            handler() {
                this.chartKey++;    // Increment key to force re-rendering
            },
            deep: true,
        },
        chartReady() {
            this.chartKey++;    // Increment key to force re-rendering
        },
    },
};
</script>

<style scoped>
.chart-container {
    width: 100%;
    height: 300px;
    /* Altezza personalizzabile */
    position: relative;
}
</style>
