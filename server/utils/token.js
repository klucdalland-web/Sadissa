const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");

const ACCESS_TTL_MIN = 15;
const REFRESH_TTL_DAYS = 30;
const isProd = process.env.NODE_ENV === "production";

const baseCookie = { httpOnly: true, secure: isProd, sameSite: "lax" };
const refreshCookie = {...baseCookie, path: "/api/v1/auth" };

function hashToken(token) {
    return crypto.createHash("sha256").update(token).digest("hex");
}

function signAccessToken(userId) {
    // "sub" doit être une chaîne pour jsonwebtoken
    return jwt.sign({ sub: String(userId) }, process.env.JWT_SECRET, {
        expiresIn: `${ACCESS_TTL_MIN}m`,
    });
}

async function createSession(userId) {
    const refreshToken = crypto.randomBytes(48).toString("hex");
    const expiresAt = new Date(Date.now() + REFRESH_TTL_DAYS * 24 * 3600 * 1000);

    await prisma.session.create({
        data: { userId, refreshTokenHash: hashToken(refreshToken), expiresAt },
    });

    return { accessToken: signAccessToken(userId), refreshToken };
}

function setAuthCookies(resp, accessToken, refreshToken) {
    resp.cookie("access_token", accessToken, {
        ...baseCookie,
        maxAge: ACCESS_TTL_MIN * 60 * 1000,
    });
    resp.cookie("refresh_token", refreshToken, {
        ...refreshCookie,
        maxAge: REFRESH_TTL_DAYS * 24 * 3600 * 1000,
    });
}

function clearAuthCookies(resp) {
    resp.clearCookie("access_token", baseCookie);
    resp.clearCookie("refresh_token", refreshCookie);
}

module.exports = { hashToken, createSession, setAuthCookies, clearAuthCookies };