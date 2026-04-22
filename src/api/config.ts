export const API_BASE = 'https://v2.api.noroff.dev';

export const API_KEY = import.meta.env.VITE_API_KEY;

export function getHeaders(token?: string) {
	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
		'X-Noroff-API-Key': API_KEY,
	};

	if (token) {
		headers['Authorization'] = `Bearer ${token}`;
	}

	return headers;
}
