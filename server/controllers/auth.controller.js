const bcrypt = require("bcrypt");
const prisma = require("../config/prisma");
const { res } = require("../utils/function");
const {
    hashToken,
    createSession,
    setAuthCookies,
    clearAuthCookies,
} = require("../utils/token");

const USER_SELECT = {
    id: true,
    email: true,
    firstName: true,
    lastName: true,
    typeUserId: true,
    typePieceId: true,
    createdAt: true,
};

// hash factice : garde un temps de réponse similaire si l'email n'existe pas
const DUMMY_HASH = bcrypt.hashSync("mot-de-passe-factice", 12);

async function register(req, resp) {
    try {
        const data = req.body;
        const email = String(data.email).trim().toLowerCase();

        const typeUser = await prisma.typeUser.findUnique({
            where: { name: "porteur_campaign" },
            select: { id: true },
        });
        if (!typeUser) {
            return res(resp, 500, "Erreur serveur", null);
        }

        const passwordHash = await bcrypt.hash(data.password, 12);

        const user = await prisma.user.create({
            data: {
                email,
                firstName: data.firstname,
                lastName: data.lastname,
                typeUserId: typeUser.id,
                typePieceId: data.type_piece_id,
                numberPiece: data.number_piece,
                passwordHash,
            },
            select: USER_SELECT,
        });

        const { accessToken, refreshToken } = await createSession(user.id);
        setAuthCookies(resp, accessToken, refreshToken);

        return res(resp, 201, "Utilisateur créé avec succès", user);
    } catch (error) {
        if (error.code === "P2002") {
            return res(resp, 409, "Email ou numéro de pièce déjà utilisé", null);
        }
        console.error(error);
        return res(resp, 500, "Erreur serveur", null);
    }
}

async function login(req, resp) {
    try {
        const email = String(req.body.email).trim().toLowerCase();
        const password = String(req.body.password);

        const found = await prisma.user.findFirst({
            where: { email, deletedAt: null },
            select: {...USER_SELECT, passwordHash: true },
        });

        const ok = await bcrypt.compare(
            password,
            found ? found.passwordHash : DUMMY_HASH
        );
        if (!found || !ok) {
            return res(resp, 401, "Email ou mot de passe incorrect", null);
        }

        const { passwordHash, ...user } = found;
        const { accessToken, refreshToken } = await createSession(user.id);
        setAuthCookies(resp, accessToken, refreshToken);

        return res(resp, 200, "Connexion réussie", user);
    } catch (error) {
        console.error(error);
        return res(resp, 500, "Erreur serveur", null);
    }
}

async function refresh(req, resp) {
    try {
        const token = req.cookies ? req.cookies.refresh_token : null;
        if (!token) return res(resp, 401, "Session expirée", null);

        const session = await prisma.session.findUnique({
            where: { refreshTokenHash: hashToken(token) },
            include: { user: { select: { deletedAt: true } } },
        });

        if (!session || session.expiresAt < new Date() || session.user.deletedAt) {
            clearAuthCookies(resp);
            return res(resp, 401, "Session expirée", null);
        }

        // on "consomme" le token : un seul appel peut réussir
        const claimed = await prisma.session.updateMany({
            where: { id: session.id, revokedAt: null },
            data: { revokedAt: new Date() },
        });

        if (claimed.count === 0) {
            // token déjà utilisé : on coupe toutes les sessions de l'utilisateur
            await prisma.session.updateMany({
                where: { userId: session.userId, revokedAt: null },
                data: { revokedAt: new Date() },
            });
            clearAuthCookies(resp);
            return res(resp, 401, "Session invalide", null);
        }

        const { accessToken, refreshToken } = await createSession(session.userId);
        setAuthCookies(resp, accessToken, refreshToken);

        return res(resp, 200, "Session renouvelée", null);
    } catch (error) {
        console.error(error);
        return res(resp, 500, "Erreur serveur", null);
    }
}

async function logout(req, resp) {
    try {
        const token = req.cookies ? req.cookies.refresh_token : null;
        if (token) {
            await prisma.session.updateMany({
                where: { refreshTokenHash: hashToken(token), revokedAt: null },
                data: { revokedAt: new Date() },
            });
        }
        clearAuthCookies(resp);
        return res(resp, 200, "Déconnexion réussie", null);
    } catch (error) {
        console.error(error);
        return res(resp, 500, "Erreur serveur", null);
    }
}

async function me(req, resp) {
    try {
        const user = await prisma.user.findFirst({
            where: { id: req.userId, deletedAt: null },
            select: USER_SELECT,
        });
        if (!user) return res(resp, 404, "Utilisateur introuvable", null);
        return res(resp, 200, "OK", user);
    } catch (error) {
        console.error(error);
        return res(resp, 500, "Erreur serveur", null);
    }
}

module.exports = { register, login, refresh, logout, me };