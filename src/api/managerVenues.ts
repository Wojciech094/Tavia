import { API_BASE, getHeaders } from './config';
import { getApiKey, getToken } from '../utils/auth';

export interface VenueFormData {
	name: string;
	description: string;
	price: number;
	maxGuests: number;
	media: {
		url: string;
		alt?: string;
	}[];
	location: {
		city?: string;
		country?: string;
	};
	meta: {
		wifi: boolean;
		parking: boolean;
		breakfast: boolean;
		pets: boolean;
	};
}

interface StoredUser {
	name?: string;
	email?: string;
	venueManager?: boolean;
}

function getUserName() {
	const storedUser = localStorage.getItem('user');

	if (!storedUser) {
		throw new Error('User not found. Please log in again.');
	}

	const user = JSON.parse(storedUser) as StoredUser;

	if (!user.name) {
		throw new Error('Username not found. Please log in again.');
	}

	return user.name;
}

function getManagerHeaders() {
	const token = getToken();
	const apiKey = getApiKey();

	if (!token || !apiKey) {
		throw new Error('You must be logged in and have an API key.');
	}

	return getHeaders(token, apiKey);
}

export async function fetchMyVenues() {
	const userName = getUserName();

	const res = await fetch(`${API_BASE}/holidaze/profiles/${userName}/venues?_bookings=true`, {
		headers: getManagerHeaders(),
	});

	const data = await res.json();

	if (!res.ok) {
		throw new Error(data.errors?.[0]?.message || 'Failed to fetch your venues.');
	}

	return data.data;
}

export async function fetchVenueForEdit(id: string) {
	const res = await fetch(`${API_BASE}/holidaze/venues/${id}`, {
		headers: getManagerHeaders(),
	});

	const data = await res.json();

	if (!res.ok) {
		throw new Error(data.errors?.[0]?.message || 'Failed to fetch venue.');
	}

	return data.data;
}

export async function createVenue(venueData: VenueFormData) {
	const res = await fetch(`${API_BASE}/holidaze/venues`, {
		method: 'POST',
		headers: getManagerHeaders(),
		body: JSON.stringify(venueData),
	});

	const data = await res.json();

	if (!res.ok) {
		throw new Error(data.errors?.[0]?.message || 'Failed to create venue.');
	}

	return data.data;
}

export async function updateVenue(id: string, venueData: VenueFormData) {
	const res = await fetch(`${API_BASE}/holidaze/venues/${id}`, {
		method: 'PUT',
		headers: getManagerHeaders(),
		body: JSON.stringify(venueData),
	});

	const data = await res.json();

	if (!res.ok) {
		throw new Error(data.errors?.[0]?.message || 'Failed to update venue.');
	}

	return data.data;
}

export async function deleteVenue(id: string) {
	const res = await fetch(`${API_BASE}/holidaze/venues/${id}`, {
		method: 'DELETE',
		headers: getManagerHeaders(),
	});

	if (!res.ok) {
		const data = await res.json().catch(() => null);
		throw new Error(data?.errors?.[0]?.message || 'Failed to delete venue.');
	}
}
