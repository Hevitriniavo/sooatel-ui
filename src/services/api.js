import axios from 'axios';

const baseURL = 'http://localhost:8086';

export const axiosConf = axios.create({
    baseURL,
});

export const apiUrl = (path) => `${baseURL}${path}`;

export const fetchData = async (path, method = 'GET', data = null, headers = {}) => {
    try {
        const response = await axiosConf.request({
            url: path,
            method,
            data,
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        throw error;
    }
};

export const fetchJson = async (urlOrFunc, method = 'GET', data = null, headers = {}) => {
    const url = typeof urlOrFunc === 'function' ? urlOrFunc() : urlOrFunc; 
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    // eslint-disable-next-line no-useless-catch
    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            const text = await response.text();
            throw new Error(text);
        }

        if (response.status === 204) {
            return null; 
        }

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        }

        return await response.text();
    } catch (error) {
        throw error;
    }
};

export const fetchJsonWithParams = async (urlOrFunc, { params = {}, ...options } = {}) => {
    const searchQuery = new URLSearchParams(params).toString();
    const url = typeof urlOrFunc === 'function' ? urlOrFunc() : urlOrFunc; 
    const fullUrl = searchQuery ? `${apiUrl(url)}?${searchQuery}` : apiUrl(url);

    return fetchJson(fullUrl, options.method || 'GET', options.data, options.headers);
};
