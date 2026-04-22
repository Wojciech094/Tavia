import { API_BASE, getHeaders } from './config';

export async function fetchVenues() {
	const res = await fetch(`${API_BASE}/holidaze/venues`, {
		headers: getHeaders(),
	});

	if (!res.ok) {
		throw new Error('Failed to fetch venues');
	}

	return res.json();
}
