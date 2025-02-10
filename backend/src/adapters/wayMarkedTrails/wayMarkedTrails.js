const CoordinatesConverter = require("../../business-logic/coordinates.converter.js");

// Classe per interagire con l'API di WayMarkedTrails
class WayMarkedTrailsAdapter {
    constructor() {
        this.range = 0.004; // Range utilizzato per calcolare un'area attorno a un punto dato
    }

    // Converte coordinate EPSG:4326 (latitudine, longitudine) in EPSG:3857 (proiezione metrico-cartesiana)
    async fromEpsg4326toEpsg3857(req, res) {
        lat = parseFloat(req.query.lat); // Recupera e converte la latitudine dalla query string
        lon = parseFloat(req.query.lon); // Recupera e converte la longitudine dalla query string
        const [x, y] = CoordinatesConverter.fromEpsg4326toEpsg3857(lat, lon); // Effettua la conversione
        res.send({
            x: x,
            y: y
        });
    }

    // Converte coordinate EPSG:3857 in EPSG:4326
    async fromEpsg3857toEpsg4326(req, res) {
        x = parseFloat(req.query.x); // Recupera e converte la coordinata X dalla query string
        y = parseFloat(req.query.y); // Recupera e converte la coordinata Y dalla query string
        const [lon, lat] = CoordinatesConverter.fromEpsg3857toEpsg4326(x, y); // Effettua la conversione
        res.send({
            lat: lat,
            lon: lon
        });
    }

    // Recupera i sentieri in un'area basata su un punto cliccato e un range predefinito
    async getTrailsByClick(req, res) {
        var lat = parseFloat(req.query.lat); // Latitudine centrale
        var lat1 = lat - this.range; // Limite inferiore della latitudine
        var lat2 = lat + this.range; // Limite superiore della latitudine
        var lon = parseFloat(req.query.lon); // Longitudine centrale
        var lon1 = lon - this.range; // Limite inferiore della longitudine
        var lon2 = lon + this.range; // Limite superiore della longitudine
        const [y1, x1] = CoordinatesConverter.fromEpsg4326toEpsg3857(lat1, lon1); // Conversione dei limiti inferiori
        const [y2, x2] = CoordinatesConverter.fromEpsg4326toEpsg3857(lat2, lon2); // Conversione dei limiti superiori
        try {
            // Effettua una richiesta all'API per ottenere i sentieri nell'area specificata
            const response = await fetch(`https://hiking.waymarkedtrails.org/api/v1/list/by_area?bbox=${y1},${x1},${y2},${x2}&limit=10&locale=en`);
            const data = await response.json();

            // Estrae solo i dati rilevanti per ogni sentiero
            const extractedData = data.results.map(element => ({
                ref: element.ref || null,
                id: element.id,
                name: element.name
            }));

            res.json(extractedData); // Risponde con i dati estratti
        } catch (error) {
            res.status(500).json({ message: error.message }); // Gestisce errori durante la richiesta
        }
    }

    // Recupera informazioni dettagliate su un singolo sentiero dato il suo ID
    async getTrailById(req, res) {
        const id = req.query.id; // Recupera l'ID del sentiero dalla query string
        try {
            const trailInformation = await fetch(`https://hiking.waymarkedtrails.org/api/v1/details/relation/${id}`);
            const trailData = await trailInformation.json();

            // Estrae le informazioni rilevanti
            const extractedData = {
                name: trailData.name,
                length: trailData.mapped_length,
                description: trailData.tags.description || null
            };

            res.json(extractedData); // Risponde con i dati estratti
        } catch (error) {
            res.status(500).json({ message: error.message }); // Gestisce errori durante la richiesta
        }
    }

    // Recupera i dati sull'altitudine di un sentiero dato il suo ID
    async getTrailElevation(req, res) {
        const id = req.query.id; // Recupera l'ID del sentiero dalla query string
        try {
            const elevation = await fetch(`https://hiking.waymarkedtrails.org/api/v1/details/relation/${id}/elevation`);
            const elevationData = await elevation.json();

            // Estrae i punti di altitudine e li converte in EPSG:4326
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

            // Struttura i dati finali
            const extractedData = {
                ascent: elevationData.ascent,
                descent: elevationData.descent,
                min_elevation: elevationData.min_elevation,
                max_elevation: elevationData.max_elevation,
                elevation: elevationPoints
            };

            res.json(extractedData); // Risponde con i dati estratti
        } catch (error) {
            res.status(500).json({ message: error.message }); // Gestisce errori durante la richiesta
        }
    }

    // Recupera e converte in EPSG:4326 la geometria di un sentiero dato il suo ID
    async getHighlightTrail(req, res) {
        const id = req.query.id; // Recupera l'ID del sentiero dalla query string
        try {
            const response = await fetch(`https://hiking.waymarkedtrails.org/api/v1/details/relation/${id}/geometry/geojson`);
            const data = await response.json();

            // Converte tutte le coordinate della geometria in EPSG:4326
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

            // Struttura i dati finali con le coordinate convertite
            const convertedData = {
                ...data,
                features: convertedFeatures
            };

            res.json(convertedData); // Risponde con i dati convertiti
        } catch (error) {
            res.status(500).json({ message: error.message }); // Gestisce errori durante la richiesta
        }
    }
}

module.exports = new WayMarkedTrailsAdapter(); // Esporta un'istanza del servizio
