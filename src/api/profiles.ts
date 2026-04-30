import { API_BASE, getHeaders } from './config';
import { getApiKey, getToken } from '../utils/auth';

export async function fetchProfile(name: string) {
	const token = getToken();
	const apiKey = getApiKey();

	const res = await fetch(`${API_BASE}/holidaze/profiles/${name}?_bookings=true&_venues=true`, {
		headers: getHeaders(token ?? undefined, apiKey ?? undefined),
	});

	if (!res.ok) {
		throw new Error('Failed to fetch profile');
	}

	return res.json();
}

export async function updateProfile(
	name: string,
	payload: {
		bio?: string;
		avatar?: {
			url: string;
			alt?: string;
		};
		banner?: {
			url: string;
			alt?: string;
		};
		venueManager?: boolean;
	},
) {
	const token = getToken();
	const apiKey = getApiKey();

	const res = await fetch(`${API_BASE}/holidaze/profiles/${name}`, {
		method: 'PUT',
		headers: getHeaders(token ?? undefined, apiKey ?? undefined),
		body: JSON.stringify(payload),
	});

	if (!res.ok) {
		const data = await res.json();
		throw new Error(data.errors?.[0]?.message || 'Failed to update profile');
	}

	return res.json();
}
