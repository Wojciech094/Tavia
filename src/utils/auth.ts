interface StoredUser {
	name: string;
	email: string;
	venueManager?: boolean;
	avatar?: {
		url: string;
		alt?: string;
	};
}

const USER_KEY = 'user';
const TOKEN_KEY = 'token';
const API_KEY = 'apiKey';

export function saveAuth(user: StoredUser, token: string, apiKey: string) {
	localStorage.setItem(USER_KEY, JSON.stringify(user));
	localStorage.setItem(TOKEN_KEY, token);
	localStorage.setItem(API_KEY, apiKey);
}

export function getUser(): StoredUser | null {
	const user = localStorage.getItem(USER_KEY);
	return user ? JSON.parse(user) : null;
}

export function getToken(): string | null {
	return localStorage.getItem(TOKEN_KEY);
}

export function getApiKey(): string | null {
	return localStorage.getItem(API_KEY);
}

export function logout() {
	localStorage.removeItem(USER_KEY);
	localStorage.removeItem(TOKEN_KEY);
	localStorage.removeItem(API_KEY);
}
