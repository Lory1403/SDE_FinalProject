<template>
    <div class="weather-container">
        <div class="weather-wrap">
            <!-- Location input field -->
            <div class="search-box"> <input type="text" placeholder="Search..." class="search-bar" v-model="query" />
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

    <!-- Weather Map -->
    <div class="weather-map" id="map" style="height: 500px; width: 1000px;"></div>

    <!-- Dropdown Menu -->
    <label for="layer-select" class="menu-label">Select a Trail:</label>
    <select id="layer-select" v-model="selectedLayer" @change="onLayerChange">
        <option v-for="layer in layers" :key="layer.value" :value="layer.value">
            {{ layer.label }}
        </option>
    </select>
</template>

<script>
import axios from "axios";
import L from "leaflet";

export default {
    data() {
        return {
            url_base: "http://127.0.0.1:8080/api/weather/timemachine",
            url_coordinate: "http://127.0.0.1:8080/api/location/search",
            url_trail: "http://127.0.0.1:8080/api/wayMarkedTrails/trailsByClick",
            weather_icon: "https://openweathermap.org/img/wn/",
            latitude: "",
            longitude: "",
            query: "",
            datetime: "cazzo",
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
            map: null,
            layers: [],
            geoJsonLayer: null, // Aggiungi una proprietà per mantenere il riferimento al layer GeoJSON
        };
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
                    .get(`${this.url_coordinate}?text=${this.query}`)
                    .then((response) => {
                        this.latitude = response.data.features[0].properties.lat;
                        this.longitude = response.data.features[0].properties.lon;
                        console.log("Latitude: " + this.latitude + " Longitude: " + this.longitude);
                    });

                /*  ##### DISABLED JUST FOR TESTING #####
                await axios
                    .get(`${this.url_base}?lat=${this.latitude}&lon=${this.longitude}&time=${currentDate}`)
                    .then((response) => {
                        //console.log(this.weather);
                        this.weather = response.data;
                        //console.log(response.data);
                        this.icon = `${this.weather_icon}${this.weather.data[0].weather[0].icon}${"@2x.png"}`;
                    })
                    .catch((error) => {
                        console.error("Error fetching weather:", error);
                    });
                */

                // Initialize the map
                if (this.map != null)
                    this.map.remove();
                await this.initMap();
                console.log("Map initialized");
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
                .get(`${this.url_trail}?lat=${lat}&lon=${lon}`)
                .then((response) => {
                    console.log(response.data);

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
            console.log("Selected layer:", this.selectedLayer);

            // Fetch trail data
            await axios.get(`https://hiking.waymarkedtrails.org/api/v1/details/relation/${this.selectedLayer}`)
                .then((response) => {
                    console.log(response.data);
                }).catch((error) => {
                    console.error("Error fetching trail data:", error);
                });

            // Fetch trail map
            await axios.get(`http://127.0.0.1:8080/api/wayMarkedTrails/highlightTrail?id=${this.selectedLayer}`)
                .then((response) => {
                    console.log(response.data);

                    // Rimuovi il layer GeoJSON precedente, se esiste
                    if (this.geoJsonLayer) {
                        this.map.removeLayer(this.geoJsonLayer);
                    }

                    // Crea un nuovo layer GeoJSON e aggiungilo alla mappa
                    this.geoJsonLayer = L.geoJSON(response.data, {
                        style: {
                            color: "#ff7800",
                            weight: 5 // Adjusted weight for better visibility
                        }
                    }).addTo(this.map);

                    // Fit the map view to the bounds of the GeoJSON layer
                    this.map.fitBounds(geoJsonLayer.getBounds());
                }).catch((error) => {
                    console.error("Error fetching trail map:", error);
                });
        },

        async initMap() {
            // Initialize the map
            this.map = L.map("map"); // Average coordinates of the route

            // Add listener for map click
            this.map.on("click", (e) => {
                console.log("Map clicked at: " + e.latlng);
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
            }).addTo(this.map);

            // Add Waymarked Trails hiking layer
            const hikingLayer = L.tileLayer("https://tile.waymarkedtrails.org/hiking/{z}/{x}/{y}.png", {
                maxZoom: 18,
                attribution: '&copy; <a href="https://waymarkedtrails.org">Waymarked Trails</a>',
            }).addTo(this.map);

            const overlays = {
                "Hiking Trails": hikingLayer,
            };

            L.control.layers({ "Base Map": baseLayer }, overlays).addTo(this.map);

            // Initialize an empty layer group for paths
            this.pathsLayer = L.layerGroup().addTo(this.map);

            this.map.setView([this.latitude, this.longitude], 10);

            // https://hiking.waymarkedtrails.org/api/v1/details/relation/5146467   5146467 --> id percorso???
            // https://hiking.waymarkedtrails.org/api/v1/list/by_ids?relations=2896352,2899003  --> lista dei percorsi
        },
    },

    mounted() {
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

.weather-container {
    background-image: url("../assets/cold-bg.jpg");
    background-size: cover;
    background-position: center;
    background-position-y: bottom;
    transition: 0.4s;
    width: 375px;
    margin: 0 auto;
    border-radius: 25px;
    margin-top: 50px;
    box-shadow: 0px 0px 30px #00000065;
}

.weather-wrap {
    height: 600px;
    padding: 25px;
    border-radius: 25px;
    background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.4));
}

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

#map {
    margin: 0 auto;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

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
</style>