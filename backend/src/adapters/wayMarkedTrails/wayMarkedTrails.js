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

router.get("/trailsByClick", async (req, res) => {
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
            ref: element.ref || null,
            id: element.id,
            name: element.name
        }));

        res.json(extractedData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/trailById", async (req, res) => {
    const id = req.query.id;
    try {
        const trailInformation = await fetch(`https://hiking.waymarkedtrails.org/api/v1/details/relation/${id}`);
        const trailData = await trailInformation.json();

        const elevation = await fetch(`https://hiking.waymarkedtrails.org/api/v1/details/relation/${id}/elevation`);
        const elevationData = await elevation.json();

        // Extract elevation data
        const elevationPoints = elevationData.segments.flatMap(segment => 
            segment.elevation.map(point => {
                const [lon, lat] = fromEpsg3857toEpsg4326(point.x, point.y);
                return {
                    lat: lat,
                    lon: lon,
                    pos: point.pos,
                    ele: point.ele,
                };
            })
        );

        const extractedData = {
            name: trailData.name,
            length: trailData.mapped_length,
            description: trailData.tags.description || null,
            ascent: trailData.ascent,
            descent: trailData.descent,
            min_elevation: trailData.min_elevation,
            max_elevation: trailData.max_elevation,
            elevation: elevationPoints
        };

        res.json(extractedData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/highlightTrail", async (req, res) => {
    const id = req.query.id;
    try {
        const response = await fetch(`https://hiking.waymarkedtrails.org/api/v1/details/relation/${id}/geometry/geojson`);
        const data = await response.json();

        // Convert all coordinates in the geometry to EPSG:4326
        const convertedFeatures = data.features.map(feature => {
            if (feature.geometry.type === "MultiLineString") {
                const convertedCoordinates = feature.geometry.coordinates.map(lineString => {
                    return lineString.map(coord => {
                        const [lon, lat] = fromEpsg3857toEpsg4326(coord[0], coord[1]);
                        return [lon, lat];
                    });
                });
                feature.geometry.coordinates = convertedCoordinates;
            } else if (feature.geometry.type === "LineString") {
                const convertedCoordinates = feature.geometry.coordinates.map(coord => {
                    const [lon, lat] = fromEpsg3857toEpsg4326(coord[0], coord[1]);
                    return [lon, lat];
                });
                feature.geometry.coordinates = convertedCoordinates;
            }
            return feature;
        });

        const convertedData = {
            ...data,
            features: convertedFeatures
        };

        res.json(convertedData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;  // Esporta un'istanza del service