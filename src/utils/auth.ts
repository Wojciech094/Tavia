interface StoredUser {
	name: string;
	email: string;
	venueManager?: boolean | string;
	avatar?: {
		url: string;
		alt?: string;
	};
	banner?: {
		url: string;
		alt?: string;
	};
}

const USER_KEY = 'user';
const TOKEN_KEY = 'token';
const API_KEY = 'apiKey';

export function saveAuth(user: StoredUser, token: string, apiKey: string) {
	const safeUser = {
		...user,
		venueManager: user.venueManager === true || String(user.venueManager) === 'true',
	};

	localStorage.setItem(USER_KEY, JSON.stringify(safeUser));
	localStorage.setItem(TOKEN_KEY, token);
	localStorage.setItem(API_KEY, apiKey);

	window.dispatchEvent(new Event('auth-change'));
}

export function getUser(): StoredUser | null {
	const user = localStorage.getItem(USER_KEY);

	if (!user) return null;

	try {
		return JSON.parse(user) as StoredUser;
	} catch {
		return null;
	}
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

	window.dispatchEvent(new Event('auth-change'));
}
