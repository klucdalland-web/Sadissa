const { res } = require("../utils/function");

function requireApiKey(req, resp, next) {
<<<<<<< HEAD
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {

        return res(resp, 401, "Unauthorized: Clé API manquante", null);
    }
    if (!apiKey || apiKey !== process.env.API_KEY) {
=======
    // Le preflight CORS n'envoie pas la clé API
    if (req.method === "OPTIONS") return next();

    const apiKey = req.headers["x-api-key"];

    if (!apiKey) {
        return res(resp, 401, "Unauthorized: Clé API manquante", null);
    }
    if (apiKey !== process.env.API_KEY) {
>>>>>>> origin/develop
        return res(resp, 403, "Forbidden: Clé API invalide", null);
    }
    next();
}

module.exports = requireApiKey;