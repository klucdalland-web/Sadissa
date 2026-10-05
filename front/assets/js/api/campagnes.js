import apiClient from './client.js';

/**
 * Service campagnes — consomme GET /api/v1/campaigns[/:id]
 * L'URL de base est centralisée dans client.js (API_BASE_URL).
 */

function unwrapList(payload) {
    const data = payload?.data;
    if (Array.isArray(data)) return data;
    if (Array.isArray(payload)) return payload;
    return [];
}

function unwrapOne(payload) {
    const data = payload?.data ?? payload;
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
        const error = new Error('Campagne introuvable');
        error.status = 404;
        throw error;
    }
    return data;
}

/**
 * @param {{ sort?: string, limit?: number }} [params]
 * @returns {Promise<object[]>}
 */
export async function getCampagnes(params = {}) {
    const payload = await apiClient.get('v1/campaigns', params);
    return unwrapList(payload);
}

/**
 * @param {string|number} id
 * @returns {Promise<object>}
 */
export async function getCampagneById(id) {
    if (id === undefined || id === null || id === '') {
        const error = new Error('Identifiant de campagne manquant');
        error.status = 400;
        throw error;
    }

    try {
        const payload = await apiClient.get(`v1/campaigns/${encodeURIComponent(id)}`);
        return unwrapOne(payload);
    } catch (error) {
        if (error.status === 404) {
            error.message = 'Campagne introuvable';
        }
        throw error;
    }
}

/**
 * Les 4 campagnes les plus récentes (tri API createdAt desc).
 * @returns {Promise<object[]>}
 */
export async function getCampagnesRecentes(limit = 4) {
    return getCampagnes({ sort: 'createdAt:desc', limit });
}

/**
 * Enregistre une contribution sur une campagne.
 * POST /api/v1/campaigns/:id/contributions
 * @param {string|number} id
 * @param {{ amount: number, name: string, paymentMethod: 'airtel'|'mtn' }} payload
 * @returns {Promise<{ campaign: object, raised: number }>}
 */
export async function createContribution(id, payload) {
    if (id === undefined || id === null || id === '') {
        const error = new Error('Identifiant de campagne manquant');
        error.status = 400;
        throw error;
    }

    const response = await apiClient.post(
        `v1/campaigns/${encodeURIComponent(id)}/contributions`,
        payload,
    );

    const data = response?.data ?? response;
    if (!data || typeof data !== 'object') {
        const error = new Error('Réponse de contribution invalide');
        error.status = 500;
        throw error;
    }

    return data;
}
