const { res } = require("../utils/function");

function requireApiKey(req, resp, next) {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {

        return res(resp, 401, "Unauthorized: Clé API manquante", null);
    }
    if (!apiKey || apiKey !== process.env.API_KEY) {
        return res(resp, 403, "Forbidden: Clé API invalide", null);
    }
    next();
}

module.exports = requireApiKey;