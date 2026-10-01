const API_BASE_URL = 'http://localhost:8000/api';

async function request(endpoint, options = {}) {
    const {
        method = 'GET',
            body,
            headers = {},
            params = {},
    } = options;

    const url = new URL(`${API_BASE_URL.replace(/\/$/, '')}/${String(endpoint).replace(/^\/+/, '')}`);

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            url.searchParams.append(key, String(value));
        }
    });

    const isFormData = body instanceof FormData;

    const config = {
        method,
        headers: {
            ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
            ...headers,
        },
    };

    if (body !== undefined && body !== null) {
        config.body = isFormData ? body : JSON.stringify(body);
    }

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
};

export { request };
export default apiClient;

if (typeof window !== 'undefined') {
    window.apiClient = apiClient;
}