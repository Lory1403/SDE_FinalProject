const express = require("express");
const router = express.Router();

// var osmtogeojson = require('osmtogeojson');
const proj4 = require('proj4');

const epsg4326 = "EPSG:4326"; // WGS84 (lat/lon)
const epsg3857 = "EPSG:3857"; // Web Mercator
const range = 0.004;

function fromEpsg4326toEpsg3857(lat, lon) {
    return proj4(epsg4326, epsg3857, [lon, lat]);
}

function fromEpsg3857toEpsg4326(x, y) {
    return proj4(epsg3857, epsg4326, [x, y]);
}


router.get("/fromEpsg4326toEpsg3857", async (req, res) => {
    lat = parseFloat(req.query.lat);
    lon = parseFloat(req.query.lon);
    const [x, y] = fromEpsg4326toEpsg3857(lat, lon);
    res.send({
        x: x,
        y: y
    });
});

router.get("/fromEpsg3857toEpsg4326", async (req, res) => {
    x = parseFloat(req.query.x);
    y = parseFloat(req.query.y);
    const [lon, lat] = fromEpsg3857toEpsg4326(x, y);
    res.send({
        lat: lat,
        lon: lon
    });
});

router.get("/trailByClick", async (req, res) => {
    var lat = parseFloat(req.query.lat);
    var lat1 = lat - range;
    var lat2 = lat + range; 
    var lon = parseFloat(req.query.lon);
    var lon1 = lon - range;
    var lon2 = lon + range;
    const [y1, x1] = fromEpsg4326toEpsg3857(lat1, lon1);
    const [y2, x2] = fromEpsg4326toEpsg3857(lat2, lon2);
    try {
        const response = await fetch(`https://hiking.waymarkedtrails.org/api/v1/list/by_area?bbox=${y1},${x1},${y2},${x2}&limit=10&locale=en`);

        const data = await response.json();

        const extractedData = data.results.map(element => ({
            id: element.id,
            name: element.name
        }));

        res.json(extractedData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;  // Esporta un'istanza del service