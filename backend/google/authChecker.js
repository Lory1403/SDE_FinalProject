const authChecker = async (req, res, next) => {
    if (req.session.userInfo) {
        return next(); // Utente autenticato, prosegui con la richiesta
    }
    res.redirect("/auth/google"); // Reindirizza alla pagina di login
}

module.exports = authChecker;