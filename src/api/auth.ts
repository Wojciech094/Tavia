import { API_BASE, getHeaders } from './config';

interface RegisterPayload {
	name: string;
	email: string;
	password: string;
	venueManager: boolean;
}

interface LoginResponse {
	data: {
		name: string;
		email: string;
		venueManager: boolean;
		accessToken: string;
		avatar?: {
			url: string;
			alt: string;
		};
	};
}

interface ApiKeyResponse {
	data: {
		name: string;
		status: string;
		key: string;
	};
}

export async function registerUser(payload: RegisterPayload) {
	const res = await fetch(`${API_BASE}/auth/register`, {
		method: 'POST',
		headers: getHeaders(),
		body: JSON.stringify(payload),
	});

	if (!res.ok) {
		const data = await res.json();
		throw new Error(data.errors?.[0]?.message || 'Registration failed');
	}

	return res.json();
}

export async function loginUser(email: string, password: string) {
	const res = await fetch(`${API_BASE}/auth/login`, {
		method: 'POST',
		headers: getHeaders(),
		body: JSON.stringify({ email, password }),
	});

	if (!res.ok) {
		const data = await res.json();
		throw new Error(data.errors?.[0]?.message || 'Login failed');
	}

	return res.json() as Promise<LoginResponse>;
}

export async function createApiKey(accessToken: string) {
	const res = await fetch(`${API_BASE}/auth/create-api-key`, {
		method: 'POST',
		headers: getHeaders(accessToken),
		body: JSON.stringify({ name: 'Tavia API Key' }),
	});

	if (!res.ok) {
		const data = await res.json();
		throw new Error(data.errors?.[0]?.message || 'Could not create API key');
	}

	return res.json() as Promise<ApiKeyResponse>;
}
