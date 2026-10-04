<<<<<<< HEAD
const API_BASE_URL = 'http://localhost:8000/api';

async function request(endpoint, options = {}) {
    const {
        method = 'GET',
            body,
            headers = {},
            params = {},
    } = options;

    const url = new URL(`${API_BASE_URL.replace(/\/$/, '')}/${String(endpoint).replace(/^\/+/, '')}`);
=======
const API_BASE_URL =
    typeof window !== 'undefined' && window.location.port === '3000'
        ? `${window.location.origin}/api`
        : 'http://localhost:3000/api';
// Doit correspondre à API_KEY dans server/.env
const API_KEY = 'sadissa-v1-secret-key';

const AUTH_SKIP_REFRESH = new Set([
    'v1/auth/login',
    'v1/auth/register',
    'v1/auth/refresh',
    'v1/auth/logout',
]);

let refreshPromise = null;

function normalizeEndpoint(endpoint) {
    return String(endpoint).replace(/^\/+/, '');
}

function buildUrl(endpoint, params = {}) {
    const url = new URL(`${API_BASE_URL.replace(/\/$/, '')}/${normalizeEndpoint(endpoint)}`);
>>>>>>> origin/develop

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            url.searchParams.append(key, String(value));
        }
    });

<<<<<<< HEAD
=======
    return url;
}

function createApiError(response, data) {
    const message =
        typeof data === 'object' && data !== null && data.message
            ? data.message
            : 'Erreur API';

    const error = new Error(message);
    error.status = response.status;
    if (typeof data === 'object' && data !== null && data.data) {
        error.errors = data.data;
    }
    return error;
}

async function parseResponse(response) {
    const contentType = response.headers.get('content-type') || '';
    return contentType.includes('application/json')
        ? await response.json()
        : await response.text();
}

async function refreshSession() {
    if (!refreshPromise) {
        refreshPromise = (async () => {
            const response = await fetch(buildUrl('v1/auth/refresh'), {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'x-api-key': API_KEY,
                    'Content-Type': 'application/json',
                },
            });

            const data = await parseResponse(response);
            if (!response.ok) {
                throw createApiError(response, data);
            }
            return data;
        })().finally(() => {
            refreshPromise = null;
        });
    }

    return refreshPromise;
}

async function request(endpoint, options = {}) {
    const {
        method = 'GET',
        body,
        headers = {},
        params = {},
        _retry = false,
    } = options;

    const normalized = normalizeEndpoint(endpoint);
>>>>>>> origin/develop
    const isFormData = body instanceof FormData;

    const config = {
        method,
<<<<<<< HEAD
        headers: {
=======
        credentials: 'include',
        headers: {
            'x-api-key': API_KEY,
>>>>>>> origin/develop
            ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
            ...headers,
        },
    };

    if (body !== undefined && body !== null) {
        config.body = isFormData ? body : JSON.stringify(body);
    }

<<<<<<< HEAD
    const response = await fetch(url, config);
    const contentType = response.headers.get('content-type') || '';
    const data = contentType.includes('application/json') ?
        await response.json() :
        await response.text();

    if (!response.ok) {
        const message =
            typeof data === 'object' && data !== null && data.message ?
            data.message :
            'Erreur API';

        throw new Error(message);
    }

    return data;
=======
    const response = await fetch(buildUrl(normalized, params), config);
    const data = await parseResponse(response);

    if (response.ok) return data;

    const canRefresh =
        response.status === 401 &&
        !_retry &&
        !AUTH_SKIP_REFRESH.has(normalized);

    if (canRefresh) {
        try {
            await refreshSession();
            return request(endpoint, { ...options, _retry: true });
        } catch {
            // refresh échoué : on remonte l'erreur d'origine
        }
    }

    throw createApiError(response, data);
>>>>>>> origin/develop
}

const apiClient = {
    get: (endpoint, params = {}) => request(endpoint, { method: 'GET', params }),
    post: (endpoint, body, params = {}) => request(endpoint, { method: 'POST', body, params }),
    put: (endpoint, body, params = {}) => request(endpoint, { method: 'PUT', body, params }),
    patch: (endpoint, body, params = {}) => request(endpoint, { method: 'PATCH', body, params }),
    delete: (endpoint, params = {}) => request(endpoint, { method: 'DELETE', params }),
    upload: (endpoint, formData, params = {}) =>
        request(endpoint, {
            method: 'POST',
            body: formData,
            params,
            headers: {},
        }),
<<<<<<< HEAD
};

export { request };
=======
    refresh: () => refreshSession(),
    logout: () => request('v1/auth/logout', { method: 'POST', body: {} }),
    me: () => request('v1/auth/me'),
};

export { request, refreshSession };
>>>>>>> origin/develop
export default apiClient;

if (typeof window !== 'undefined') {
    window.apiClient = apiClient;
<<<<<<< HEAD
}
=======
}
>>>>>>> origin/develop
