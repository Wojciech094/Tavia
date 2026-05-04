import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { fetchMyVenues, deleteVenue } from '../api/managerVenues';

interface Venue {
	id: string;
	name: string;
	price: number;
	maxGuests: number;
	media?: { url: string }[];
	bookings?: { id: string }[];
}

export default function ManagerDashboardPage() {
	const [venues, setVenues] = useState<Venue[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		async function load() {
			try {
				const data = await fetchMyVenues();
				setVenues(data);
			} catch {
				setError('Failed to load your venues.');
			} finally {
				setLoading(false);
			}
		}

		load();
	}, []);

	async function handleDelete(id: string) {
		const confirmDelete = confirm('Delete this venue?');

		if (!confirmDelete) return;

		try {
			await deleteVenue(id);
			setVenues(prev => prev.filter(v => v.id !== id));
		} catch {
			alert('Failed to delete venue');
		}
	}

	return (
		<div className='flex min-h-screen flex-col bg-[#f5f5f7] text-[#1f2a5a]'>
			<Navbar />

			<main className='mx-auto w-full max-w-6xl flex-1 px-6 py-10 md:px-10'>
				<div className='mb-8 flex items-center justify-between'>
					<div>
						<h1 className='text-3xl font-bold'>Manager Dashboard</h1>
						<p className='text-gray-500'>Manage your venues</p>
					</div>

					<Link
						to='/manager/create'
						className='rounded-full bg-[#1f2a5a] px-6 py-3 text-sm font-semibold text-white'>
						+ Create venue
					</Link>
				</div>

				{loading && <p>Loading...</p>}
				{error && <p className='text-red-500'>{error}</p>}

				{!loading && venues.length === 0 && <p>You have no venues yet.</p>}

				<div className='grid gap-6 md:grid-cols-2 xl:grid-cols-3'>
					{venues.map(venue => {
						const image = venue.media?.[0]?.url;

						return (
							<div
								key={venue.id}
								className='rounded-2xl bg-white p-4 shadow'>
								<div className='h-40 overflow-hidden rounded-xl bg-gray-200'>
									{image && (
										<img
											src={image}
											className='h-full w-full object-cover'
										/>
									)}
								</div>

								<h3 className='mt-3 font-semibold'>{venue.name}</h3>

								<p className='text-sm text-gray-500'>
									NOK {venue.price} · {venue.maxGuests} guests
								</p>

								<p className='mt-1 text-sm text-gray-500'>Bookings: {venue.bookings?.length || 0}</p>

								<div className='mt-4 flex gap-2'>
									<Link
										to={`/venues/${venue.id}`}
										className='flex-1 rounded-lg bg-gray-100 py-2 text-center text-sm'>
										View
									</Link>

									<Link
										to={`/manager/edit/${venue.id}`}
										className='flex-1 rounded-lg bg-blue-100 py-2 text-center text-sm'>
										Edit
									</Link>

									<button
										onClick={() => handleDelete(venue.id)}
										className='flex-1 rounded-lg bg-red-100 py-2 text-sm'>
										Delete
									</button>
								</div>
							</div>
						);
					})}
				</div>
			</main>

			<Footer />
		</div>
	);
}
