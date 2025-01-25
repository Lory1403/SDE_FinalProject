require('dotenv').config({ path: '.env' });
const app = require('./app.js');
const mongoose = require('mongoose');
const port = process.env.PORT;

app.locals.db = mongoose.connect(
    process.env.DB_URL
).then(() => {
    console.log("Connected to Database");

    // Avvio del server dopo la connessione al DB
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
}).catch((error) => {
    console.error("Database connection error:", error);
    process.exit(1); // Chiudi il processo in caso di errore
});