import { API_BASE, getHeaders } from './config';
import { getToken, getApiKey, getUser } from '../utils/auth';

export async function fetchMyBookings() {
	const token = getToken();
	const apiKey = getApiKey();
	const user = getUser();

	if (!token || !apiKey || !user) {
		throw new Error('Not authenticated');
	}

	const res = await fetch(`${API_BASE}/holidaze/profiles/${user.name}/bookings?_venue=true`, {
		headers: getHeaders(token, apiKey),
	});

	if (!res.ok) {
		throw new Error('Failed to fetch bookings');
	}

	return res.json();
}
