const CoordinatesConverter = require("../../business-logic/coordinates.converter.js");

class WayMarkedTrailsAdapter {
    constructor() {
        this.range = 0.004;
    }

    async fromEpsg4326toEpsg3857(req, res) {
        lat = parseFloat(req.query.lat);
        lon = parseFloat(req.query.lon);
        const [x, y] = CoordinatesConverter.fromEpsg4326toEpsg3857(lat, lon);
        res.send({
            x: x,
            y: y
        });
    }
    
    async fromEpsg3857toEpsg4326(req, res) {
        x = parseFloat(req.query.x);
        y = parseFloat(req.query.y);
        const [lon, lat] = CoordinatesConverter.fromEpsg3857toEpsg4326(x, y);
        res.send({
            lat: lat,
            lon: lon
        });
    }
    
    async getTrailsByClick(req, res) {
        var lat = parseFloat(req.query.lat);
        var lat1 = lat - this.range;
        var lat2 = lat + this.range;
        var lon = parseFloat(req.query.lon);
        var lon1 = lon - this.range;
        var lon2 = lon + this.range;
        const [y1, x1] = CoordinatesConverter.fromEpsg4326toEpsg3857(lat1, lon1);
        const [y2, x2] = CoordinatesConverter.fromEpsg4326toEpsg3857(lat2, lon2);
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
    }
    
    async getTrailById(req, res) {
        const id = req.query.id;
        try {
            const trailInformation = await fetch(`https://hiking.waymarkedtrails.org/api/v1/details/relation/${id}`);
            const trailData = await trailInformation.json();
    
            const extractedData = {
                name: trailData.name,
                length: trailData.mapped_length,
                description: trailData.tags.description || null
            };
    
            res.json(extractedData);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    
    async getTrailElevation(req, res) {
        const id = req.query.id;
        try {
            const elevation = await fetch(`https://hiking.waymarkedtrails.org/api/v1/details/relation/${id}/elevation`);
            const elevationData = await elevation.json();
    
            // Extract elevation data
            const elevationPoints = elevationData.segments.flatMap(segment =>
                segment.elevation.map(point => {
                    const [lon, lat] = CoordinatesConverter.fromEpsg3857toEpsg4326(point.x, point.y);
                    return {
                        lat: lat,
                        lon: lon,
                        pos: point.pos,
                        ele: point.ele,
                    };
                })
            );
    
            const extractedData = {
                ascent: elevationData.ascent,
                descent: elevationData.descent,
                min_elevation: elevationData.min_elevation,
                max_elevation: elevationData.max_elevation,
                elevation: elevationPoints
            };
    
            res.json(extractedData);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    
    async getHighlightTrail(req, res) {
        const id = req.query.id;
        try {
            const response = await fetch(`https://hiking.waymarkedtrails.org/api/v1/details/relation/${id}/geometry/geojson`);
            const data = await response.json();
    
            // Convert all coordinates in the geometry to EPSG:4326
            const convertedFeatures = data.features.map(feature => {
                if (feature.geometry.type === "MultiLineString") {
                    const convertedCoordinates = feature.geometry.coordinates.map(lineString => {
                        return lineString.map(coord => {
                            const [lon, lat] = CoordinatesConverter.fromEpsg3857toEpsg4326(coord[0], coord[1]);
                            return [lon, lat];
                        });
                    });
                    feature.geometry.coordinates = convertedCoordinates;
                } else if (feature.geometry.type === "LineString") {
                    const convertedCoordinates = feature.geometry.coordinates.map(coord => {
                        const [lon, lat] = CoordinatesConverter.fromEpsg3857toEpsg4326(coord[0], coord[1]);
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
    }
}

module.exports = new WayMarkedTrailsAdapter();  // Esporta un'istanza del service