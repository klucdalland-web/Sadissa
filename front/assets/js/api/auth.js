import apiClient from './client.js';

let currentUser = null;
let loadPromise = null;

/**
 * Vérifie si l'utilisateur est connecté via GET /auth/me
 * (les cookies httpOnly access_token / refresh_token).
 * En cas d'access_token expiré, le client tente un refresh automatique.
 */
export async function getCurrentUser({ force = false } = {}) {
    if (!force && currentUser) return currentUser;
    if (!force && loadPromise) return loadPromise;

    loadPromise = (async () => {
        try {
            const response = await apiClient.me();
            currentUser = response?.data ?? null;
        } catch {
            currentUser = null;
        } finally {
            loadPromise = null;
        }
        return currentUser;
    })();

    return loadPromise;
}

export function isAuthenticated() {
    return currentUser !== null;
}

export function getCachedUser() {
    return currentUser;
}

export async function logout() {
    try {
        await apiClient.logout();
    } catch {
        // même si l'API échoue, on considère la session locale terminée
    }
    currentUser = null;
    return null;
}
