<template>
    <div class="global-container">
        <div class="weather-container">
            <div class="weather-wrap">
                <!-- Location input field -->
                <div class="search-box"> <input type="text" placeholder="Search..." class="search-bar"
                        v-model="query" />
                </div>

                <!-- Date and Time input field -->
                <div class="datetime-box">
                    <input type="datetime-local" id="forecast-time" name="forecast-time" value="2018-06-12T19:30"
                        v-model="datetime" />
                </div>

                <!-- Search Button -->
                <div class="button-box">
                    <button class="search-forecast" @click="fetchWeather">Search</button>
                </div>

                <!-- Weather Info -->
                <div class="weather-info" v-if="weather">
                    <div class="location-box">
                        <div class="location">{{ weather.timezone }} </div>
                        <!--<div class="date">{{ todaysDate() }}</div> -->
                    </div>
                    <div class="weather-box">
                        <div class="temp">{{ Math.round(weather.data[0].temp) }}°c</div>
                        <div class="weather">{{ weather.data[0].weather[0].main }}</div>
                        <div class="icon">
                            <img :src="icon" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Track Map -->
        <div class="track-map" id="extMap"></div>

        <div class="route-info-container">
            <!-- Dropdown Menu -->
            <label for="layer-select" class="menu-label">Select a Trail:</label>
            <select id="layer-select" v-model="selectedLayer" @change="onLayerChange">
                <option v-for="layer in layers" :key="layer.value" :value="layer.value">
                    {{ layer.label }}
                </option>
            </select>

            <!-- Route Label -->
            <div class="route-label">
                <h2 class="route-name" v-if="route_label.name != null">{{ route_label.name }}</h2>
                <p class="route-description" v-if="route_label.description != null">{{ route_label.description }}</p>
                <span class="route-length" v-if="route_label.length != null">Length: {{ route_label.length.toFixed(2) }}
                    meters</span>
            </div>

            <!-- Chart Component -->
            <ElevationChart :chartData="chartData" :options="options" :chartReady="chartReady" />
        </div>
    </div>
</template>

<script>
import axios from "axios";
import L from "leaflet";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js'
import { Line } from 'vue-chartjs'
import { toZonedTime, format } from 'date-fns-tz'
import ElevationChart from "../components/ElevationChart.vue";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
)

export default {
    components: {
        ElevationChart,
        // Line,
    },

    data() {
        return {
            url_base: `${import.meta.env.VITE_APP_BACKEND_URL}/api/weather/timemachine`,
            url_coordinate: `${import.meta.env.VITE_APP_BACKEND_URL}/api/location/search`,
            url_trail: `${import.meta.env.VITE_APP_BACKEND_URL}/api/wayMarkedTrails/trailsByClick`,
            weather_icon: `https://openweathermap.org/img/wn/`,
            latitude: "",
            longitude: "",
            query: "",
            datetime: "",
            weather: {
                data: [
                    {
                        weather: [
                            {
                                icon: "",
                            },
                        ],
                    },
                ],
            },
            icon: "",
            extMap: null,
            layers: [],
            geoJsonLayer: null,             // Aggiungi una proprietà per mantenere il riferimento al layer GeoJSON
            route_label: {},
            selectedLayer: null,
            posEleLatLon: new Map(),        // Map for position, elevation and lat/lon
            circleMarker: null,             // Marker for the map (point corrisponding to the elevation)

            // Chart data
            chartReady: false,
            chartData: {
                labels: [],
                datasets: [
                    {
                        label: 'Elevation',
                        backgroundColor: '#ffffff',
                        borderColor: 'rgb(75, 192, 192)',
                        pointRadius: 0,
                        data: []
                    }
                ]
            },
            options: {
                scales: {
                    x: {
                        display: false,
                    }
                },
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    axis: 'xy',
                    mode: 'nearest',
                },
                plugins: {
                    tooltip: {
                        enabled: true,
                        external: function (context) {                  // Handle chart interactions
                            const tooltipModel = context.tooltip;

                            if (!tooltipModel || tooltipModel.dataPoints.length === 0) return;

                            const dataPoint = tooltipModel.dataPoints[0]; // Closest data point

                            // Get coordinates for the marker position
                            var lat = this.posEleLatLon.get(dataPoint.label).lat;
                            var lon = this.posEleLatLon.get(dataPoint.label).lon;

                            if (lat != null && lon != null) {
                                // If the marker already exists, update its position
                                if (this.circleMarker != null) {
                                    this.circleMarker.remove();
                                    this.circleMarker = L.circleMarker([lat, lon], {
                                        radius: 6,
                                        color: '#0000FF',
                                        fillColor: '#0000FF',
                                        fillOpacity: 0.8
                                    }).addTo(this.extMap).bringToFront();
                                } else {
                                    // Add a marker to the map
                                    this.circleMarker = L.circleMarker([lat, lon], {
                                        radius: 6,
                                        color: '#0000FF',
                                        fillColor: '#0000FF',
                                        fillOpacity: 0.8
                                    }).addTo(this.extMap).bringToFront();
                                }
                            }
                        }.bind(this) // Assicurati di legare `this` al contesto
                    }
                }
            }
        }
    },

    methods: {
        // Method to fetch weather data
        async fetchWeather() {
            // Validation of inputs (latitudine, longitudine and datetime)
            if (this.query === "" || this.datetime === "") {
                alert("Please enter a valid location and a date");
                return;
            }
            else {
                const currentDate = this.todaysDate();
                console.log("Selected date --> " + currentDate);

                // Fetch coordinates from query
                await axios
                    .get(`${this.url_coordinate}?text=${this.query}`, {
                        headers: {
                            "Authorization": `Bearer ${localStorage.getItem("authToken")}`,     
                        }
                    })
                    .then((response) => {
                        this.latitude = response.data.features[0].properties.lat;
                        this.longitude = response.data.features[0].properties.lon;
                    });

                await axios
                    .get(`${this.url_base}?lat=${this.latitude}&lon=${this.longitude}&time=${currentDate}`, {
                        headers: {
                            "Authorization": `Bearer ${localStorage.getItem("authToken")}`,     
                        }
                    })
                    .then((response) => {
                        this.weather = response.data;   // Set the weather data
                        this.icon = `${this.weather_icon}${this.weather.data[0].weather[0].icon}${"@2x.png"}`;
                    })
                    .catch((error) => {
                        console.error("Error fetching weather:", error);
                    });

                // Initialize the map
                if (this.extMap != null)
                    this.extMap.remove();
                await this.initMap();
                // console.log("Map initialized");
            }
        },
        todaysDate() {
            let date = new Date(this.datetime).getTime() / 1000;
            return date.toString();
            //return new Date().toISOString().split("T")[0]; // Returns YYYY-MM-DD
        },

        // Method to fetch trail from coordinates by clicking on the map
        async fetchTrail(lat, lon) {
            // Fetch coordinates from query
            await axios
                .get(`${this.url_trail}?lat=${lat}&lon=${lon}`, {
                        headers: {
                            "Authorization": `Bearer ${localStorage.getItem("authToken")}`,     
                        }
                    })
                .then((response) => {
                    // Clear layers
                    this.layers = [];

                    // Add trails to layers
                    for (const trail of response.data) {
                        if (trail.ref != null)
                            this.layers.push({ label: "[" + trail.ref + "] " + trail.name, value: trail.id });
                        else
                            this.layers.push({ label: trail.name, value: trail.id });
                    }
                })
                .catch((error) => {
                    console.error("Error fetching trail:", error);
                });
        },

        // Event handler for layer change (selection)
        async onLayerChange() {
            // Disable the chart until the data is fetched
            this.chartReady = false;

            // Fetch trail data
            await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}/api/wayMarkedTrails/trailById?id=${this.selectedLayer}`, {
                        headers: {
                            "Authorization": `Bearer ${localStorage.getItem("authToken")}`,     
                        }
                    })
                .then((response) => {
                    // console.log(response.data);

                    this.route_label = response.data;
                }).catch((error) => {
                    console.error("Error fetching trail data:", error);
                });

            // Fetch trail map
            await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}/api/wayMarkedTrails/highlightTrail?id=${this.selectedLayer}`, {
                        headers: {
                            "Authorization": `Bearer ${localStorage.getItem("authToken")}`,     
                        }
                    })
                .then((response) => {
                    // console.log(response.data);

                    // Rimuovi il layer GeoJSON precedente, se esiste
                    if (this.geoJsonLayer != null) {
                        this.extMap.removeLayer(this.geoJsonLayer);
                    }

                    // Crea un nuovo layer GeoJSON e aggiungilo alla mappa
                    this.geoJsonLayer = L.geoJSON(response.data, {
                        style: {
                            color: "#ff7800",
                            weight: 5 // Adjusted weight for better visibility
                        }
                    }).addTo(this.extMap);

                    // Fit the map view to the bounds of the GeoJSON layer
                    this.extMap.fitBounds(this.geoJsonLayer.getBounds());
                }).catch((error) => {
                    console.error("Error fetching trail map:", error);
                });

            // Update the chart data
            await this.updateChart();
        },

        // Method to update data for the chart
        async updateChart() {
            try {
                const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}/api/wayMarkedTrails/trailElevation?id=${this.selectedLayer}`, {
                        headers: {
                            "Authorization": `Bearer ${localStorage.getItem("authToken")}`,     
                        }
                    });

                // Reset data before updating
                this.chartData.labels = [];
                this.chartData.datasets[0].data = [];

                // Create map for later use to draw points on the map
                this.posEleLatLon.clear();

                // Update the chart data
                response.data.elevation.forEach(point => {
                    this.posEleLatLon.set(point.pos.toFixed(2), { ele: point.ele, lat: point.lat, lon: point.lon });    // Map used to draw points on the map
                    this.chartData.labels.push(point.pos.toFixed(2));
                    this.chartData.datasets[0].data.push(point.ele.toFixed(1));
                });

                // Set the chart as ready to render
                this.chartReady = true;
            } catch (error) {
                console.error("Error updating chart:", error);
            }
        },

        async initMap() {
            // Initialize the map
            this.extMap = L.map("extMap"); // Average coordinates of the route

            // Add listener for map click
            this.extMap.on("click", (e) => {
                // console.log("Map clicked at: " + e.latlng);
                this.fetchTrail(e.latlng.lat, e.latlng.lng);
            });

            /*
            // Add OpenStreetMap base layer
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                maxZoom: 19,
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            }).addTo(this.map);
 
            // Add OpenWeather temperature layer
            
            const weatherMapUrl = `http://127.0.0.1:8080/api/weather/map?map_type=rain&z=0&lat=0&lon=0`;
            const weatherBounds = [
                [-90, -180], // Southwest corner (latitude, longitude)
                [90, 180],   // Northeast corner (latitude, longitude)
            ];
 
            //L.imageOverlay(weatherMapUrl, weatherBounds).addTo(map);
            L.imageOverlay(weatherMapUrl, weatherBounds).addTo(this.map);
 
            this.map.setView([this.latitude, this.longitude], 10);
            */

            // Add base OpenStreetMap tiles
            const baseLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            }).addTo(this.extMap);

            // Add Waymarked Trails hiking layer
            const hikingLayer = L.tileLayer("https://tile.waymarkedtrails.org/hiking/{z}/{x}/{y}.png", {
                maxZoom: 18,
                attribution: '&copy; <a href="https://waymarkedtrails.org">Waymarked Trails</a>',
            }).addTo(this.extMap);

            const overlays = {
                "Hiking Trails": hikingLayer,
            };

            L.control.layers({ "Base Map": baseLayer }, overlays).addTo(this.extMap);

            // Initialize an empty layer group for paths
            this.pathsLayer = L.layerGroup().addTo(this.extMap);

            this.extMap.setView([this.latitude, this.longitude], 10);
        },

        // Method to get user location and set it for the forecast
        getUserLocation() {
            // Check if geolocation is supported by the browser
            if (navigator.geolocation) {
                console.log("Geolocation is supported by this browser.");
                navigator.geolocation.getCurrentPosition(this.setPosition, this.showError);
            } else {
                alert("Geolocation is not supported by this browser.");
            }
        },

        // Method to set position given coordinates and set local time
        async setPosition(position) {
            await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/api/location/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}`, {
                        headers: {
                            "Authorization": `Bearer ${localStorage.getItem("authToken")}`,     
                        }
                    })
                .then((response) => response.json())
                .then((data) => {
                    this.query = data.features[0].properties.city;
                    this.datetime = format(toZonedTime(new Date(), data.features[0].properties.timezone.name), "yyyy-MM-dd'T'HH:mm");
                });
        },
    },

    mounted() {
        console.log(localStorage.getItem("authToken"));
        this.getUserLocation();
        // Check latitude and longitude
        if (this.latitude === "" || this.longitude === "") {
            console.error("(Normal error at startup) Latitude and longitude are required.");
            return;
        }
        else {
            this.initMap();
        }
    },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@300;500;700;900&display=swap");

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: "Montserrat";
}

.global-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: flex-start;
    margin: 10px;
    gap: 10px;
}

/* Weather Container */
.weather-container {
    background-image: url("../assets/cold-bg.jpg");
    background-size: cover;
    background-position: center;
    background-position-y: bottom;
    transition: 0.4s;
    max-width: 375px;
    width: 100%;
    margin: 50px auto;
    border-radius: 25px;
    box-shadow: 0px 0px 30px #00000065;
}

/* Weather Wrap */
.weather-wrap {
    max-height: 630px;
    height: 100%;
    padding: 25px;
    border-radius: 25px;
    background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.4));
}

/* Search Box */
.search-box .search-bar {
    display: block;
    width: 100%;
    padding: 15px;
    color: #313131;
    font-size: 20px;
    appearance: none;
    border: none;
    outline: none;
    background: none;
    background-color: rgba(255, 255, 255, 0.5);
    box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.25);
    border-radius: 10px;
    transition: 0.4s;
}

.search-box .search-bar:focus {
    box-shadow: 0px 0px 16px rgba(0, 0, 0, 0.25);
    background-color: rgba(255, 255, 255, 0.75);
}

/* Date & Time Box */
.datetime-box {
    margin-top: 15px;
    text-align: center;
}

.datetime-box input[type="datetime-local"] {
    display: block;
    width: 100%;
    padding: 15px;
    color: #313131;
    font-size: 20px;
    appearance: none;
    border: none;
    outline: none;
    background: none;
    background-color: rgba(255, 255, 255, 0.5);
    box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.25);
    border-radius: 10px;
    transition: 0.4s;
}

.datetime-box input[type="datetime-local"]:focus {
    box-shadow: 0px 0px 16px rgba(0, 0, 0, 0.25);
    background-color: rgba(255, 255, 255, 0.75);
}

.datetime-box input[type="datetime-local"]::-webkit-calendar-picker-indicator {
    filter: invert(1);
    opacity: 0.8;
    cursor: pointer;
    transition: 0.3s;
}

.datetime-box input[type="datetime-local"]::-webkit-calendar-picker-indicator:hover {
    opacity: 1;
}

/* Button */
.button-box {
    text-align: center;
}

.search-forecast {
    padding: 10px 20px;
    font-size: 16px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    margin-top: 10px;
    transition: background-color 0.3s;
}

.search-forecast:hover {
    background-color: #45a049;
}

/* Location Box */
.location-box .location {
    color: #000000;
    font-size: 32px;
    font-weight: 500;
    font-style: italic;
    text-align: center;
    margin-top: 30px;
}

.location-box .date {
    color: #ffffff;
    font-size: 20px;
    font-weight: 300;
    text-align: center;
}

/* Weather Box */
.weather-box {
    text-align: center;
}

.weather-box .temp {
    display: inline-block;
    padding: 10px 25px;
    color: #fff;
    font-size: 70px;
    font-weight: 900;
    text-shadow: 3px 6px rgba(0, 0, 0, 0.25);
    background-color: rgba(255, 255, 255, 0.25);
    border-radius: 16px;
    margin: 20px 0px;
    box-shadow: 3px 6px rgba(0, 0, 0, 0.25);
    font-style: italic;
}

.weather-box .weather {
    color: #fff;
    font-size: 48px;
    font-weight: 700;
    font-style: italic;
    text-shadow: 3px 6px rgba(0, 0, 0, 0.25);
}

.weather-box .icon {
    display: inline-block;
    padding: 0px 10px;
    background-color: rgba(255, 255, 255, 0.6);
    border-radius: 16px;
    margin: 0px 0px;
    box-shadow: 3px 6px rgba(0, 0, 0, 0.25);
}

/* External Map */
#extMap {
    margin: 50px auto;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    flex: 1;
    height: 600px;
    min-width: 500px;
}

/* Route Info */
.route-info-container {
    text-align: center;
    flex: 0.5;
    margin: 50px auto;
    min-width: 500px;
}

/* Menu Styles */
.menu-label {
    font-size: 1.2rem;
    margin-right: 10px;
}

#layer-select {
    font-size: 1rem;
    padding: 5px 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

route-label {
    background: linear-gradient(to right, #4facfe, #00f2fe);
    padding: 15px;
    border-radius: 10px;
    color: white;
    text-align: center;
    max-width: 400px;
    margin: 20px auto;
    box-shadow: 2px 4px 10px rgba(0, 0, 0, 0.2);
}

.route-name {
    font-size: 20px;
    font-weight: bold;
    margin: 5px 0;
}

.route-description {
    font-size: 16px;
    font-style: italic;
    margin: 5px 0;
}

.route-length {
    font-size: 14px;
    background: rgba(255, 255, 255, 0.2);
    padding: 5px 10px;
    border-radius: 5px;
    display: inline-block;
}

.chart-container {
    width: 100%;
    height: 400px;
}
</style>