const TrackModel = require("../adapters/database/models/track.model");  // Importa il modello Track per interagire con il database

// Funzione per salvare un nuovo track nel database
const saveTrack = async (trackData) => {
    try {
        // Estrae i dati necessari dal trackData
        const { summary, difficulty, geometry, name } = trackData.track;

        // Crea una nuova istanza del modello Track con i dati estratti
        const newTrack = new TrackModel({
            name: name,
            distance: summary.distance,  // Distanza del percorso
            duration: summary.duration,  // Durata del percorso
            heightDiff: summary.heightDiff,  // Differenza di altitudine
            up: summary.up,  // Distanza in salita
            down: summary.down,  // Distanza in discesa
            coordinates: geometry.coordinates,  // Coordinate geografiche
            googleId: trackData.googleId,  // ID di Google dell'utente
            timestamp: trackData.timestamp,  // Timestamp dell'azione
            cmpIdx: difficulty.cmpIdx,  // Indice di difficoltà
            CAI: difficulty.CAI  // Indice di difficoltà CAI
        });

        // Salva il nuovo track nel database e restituisce il track salvato
        const savedTrack = await newTrack.save();
        return savedTrack;
    } catch (error) {
        // Se si verifica un errore, lancia un errore con il messaggio
        throw new Error("Error saving track: " + error.message);
    }
};

// Funzione per ottenere tutti i track di un utente, dato l'ID Google
const getUserTracks = async (googleId) => {
    try {
        // Recupera tutti i track associati all'ID Google
        const userTracks = await TrackModel.find({ googleId });
        return userTracks;
    } catch (error) {
        // Se si verifica un errore, lancia un errore con il messaggio
        throw new Error("Error retrieving user tracks: " + error.message);
    }
};

// Funzione per eliminare un track da un utente, dato l'ID Google e l'ID del track
const deleteTrack = async (googleId, trackId) => {
    try {
        // Cerca il track da eliminare utilizzando l'ID del track e l'ID dell'utente
        const track = await TrackModel.findOne({ _id: trackId, googleId });
        console.log(track);  // Log per debug

        // Se il track non esiste o l'utente non è autorizzato, lancia un errore
        if (!track) {
            throw new Error("Track not found or user not authorized to delete this track");
        }

        // Elimina il track dal database
        await TrackModel.deleteOne({ _id: trackId });
        return { message: "Track deleted successfully" };  // Restituisce un messaggio di successo
    } catch (error) {
        // Se si verifica un errore, lancia un errore con il messaggio
        throw new Error("Error deleting track: " + error.message);
    }
};

// Esporta le funzioni per poterle utilizzare in altri moduli
module.exports = { saveTrack, getUserTracks, deleteTrack };
