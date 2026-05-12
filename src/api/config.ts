export const API_BASE = 'https://v2.api.noroff.dev';

export const API_KEY = import.meta.env.VITE_API_KEY;

export function getHeaders(token?: string, customApiKey?: string) {
	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
	};

	const apiKey = customApiKey || API_KEY;

	if (apiKey) {
		headers['X-Noroff-API-Key'] = apiKey;
	}

	if (token) {
		headers.Authorization = `Bearer ${token}`;
	}

	return headers;
}
