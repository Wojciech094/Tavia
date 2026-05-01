import { API_BASE, getHeaders } from './config';
import { getApiKey, getToken } from '../utils/auth';

interface CreateBookingPayload {
	dateFrom: string;
	dateTo: string;
	guests: number;
	venueId: string;
}

export async function createBooking(payload: CreateBookingPayload) {
	const token = getToken();
	const apiKey = getApiKey();

	if (!token || !apiKey) {
		throw new Error('You must be logged in to create a booking.');
	}

	const res = await fetch(`${API_BASE}/holidaze/bookings`, {
		method: 'POST',
		headers: getHeaders(token, apiKey),
		body: JSON.stringify(payload),
	});

	if (!res.ok) {
		const data = await res.json();
		throw new Error(data.errors?.[0]?.message || 'Booking failed.');
	}

	return res.json();
}
export async function deleteBooking(id: string) {
	const token = getToken();
	const apiKey = getApiKey();

	if (!token || !apiKey) {
		throw new Error('Not authenticated');
	}

	const res = await fetch(`${API_BASE}/holidaze/bookings/${id}`, {
		method: 'DELETE',
		headers: getHeaders(token, apiKey),
	});

	if (!res.ok) {
		throw new Error('Failed to delete booking');
	}
}