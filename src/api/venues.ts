import { API_BASE, getHeaders } from './config';

export async function fetchVenues(page = 1, limit = 6) {
	const res = await fetch(`${API_BASE}/holidaze/venues?page=${page}&limit=${limit}`, {
		headers: getHeaders(),
	});

	if (!res.ok) {
		throw new Error('Failed to fetch venues');
	}

	return res.json();
}
