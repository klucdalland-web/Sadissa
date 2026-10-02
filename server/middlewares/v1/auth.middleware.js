const jwt = require("jsonwebtoken");
const { res } = require("../../utils/function");

function requireAuth(req, resp, next) {
    const token = req.cookies && req.cookies.access_token;
    if (!token) return res(resp, 401, "Non connecté", null);

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET, {
            algorithms: ["HS256"],
        });
        req.userId = Number(payload.sub);
        next();
    } catch (error) {
        return res(resp, 401, "Token invalide ou expiré", null);
    }
}

module.exports = { requireAuth };