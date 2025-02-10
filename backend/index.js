require('dotenv').config({ path: '.env' });  // Carica le variabili di ambiente dal file .env nella root del progetto
const app = require('./app.js');  // Importa l'applicazione Express definita nel file app.js
const mongoose = require('mongoose');  // Importa Mongoose per la gestione del database MongoDB
const port = process.env.PORT;  // Ottiene il valore della variabile d'ambiente PORT (porta su cui il server ascolterà)

app.locals.db = mongoose.connect(  // Stabilisce la connessione al database MongoDB
    process.env.DB_URL  // Usa l'URL del database definito nelle variabili di ambiente
).then(() => {
    console.log("Connected to Database");  // Stampa un messaggio di successo quando la connessione al database è riuscita

    // Avvio del server dopo che la connessione al database è stata stabilita
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);  // Stampa un messaggio quando il server inizia ad ascoltare sulla porta definita
    });
}).catch((error) => {
    console.error("Database connection error:", error);  // Se la connessione al database fallisce, stampa l'errore
    process.exit(1);  // Termina il processo con un codice di errore (1) se la connessione non va a buon fine
});
