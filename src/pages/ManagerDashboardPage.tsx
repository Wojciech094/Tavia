import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertTriangle, CalendarCheck, Home, Plus, Trash2 } from 'lucide-react';
import { deleteVenue, fetchMyVenues } from '../api/managerVenues';
import Footer from '../components/layout/Footer';
import Navbar from '../components/layout/Navbar';

interface Booking {
	id: string;
	dateFrom: string;
	dateTo: string;
	guests: number;
	customer?: {
		name?: string;
		email?: string;
	};
}

interface Venue {
	id: string;
	name: string;
	price: number;
	maxGuests: number;
	media?: { url: string; alt?: string }[];
	bookings?: Booking[];
}

function formatDate(date: string) {
	return new Date(date).toLocaleDateString('en-GB', {
		day: '2-digit',
		month: 'short',
		year: 'numeric',
	});
}

function getUpcomingBookings(bookings: Booking[] = []) {
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	return bookings
		.filter(booking => new Date(booking.dateTo) >= today)
		.sort((a, b) => new Date(a.dateFrom).getTime() - new Date(b.dateFrom).getTime());
}

export default function ManagerDashboardPage() {
	const navigate = useNavigate();

	const [venues, setVenues] = useState<Venue[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [deletingId, setDeletingId] = useState<string | null>(null);
	const [venueToDelete, setVenueToDelete] = useState<Venue | null>(null);

	useEffect(() => {
		async function load() {
			try {
				setLoading(true);
				setError('');

				const data = await fetchMyVenues();
				setVenues(data);
			} catch {
				setError('Failed to load your venues.');
			} finally {
				setLoading(false);
			}
		}

		void load();
	}, []);

	async function confirmDelete() {
		if (!venueToDelete) return;

		const upcomingBookings = getUpcomingBookings(venueToDelete.bookings);

		if (upcomingBookings.length > 0) {
			setVenueToDelete(null);
			setError('This venue cannot be deleted because it has active upcoming bookings.');
			return;
		}

		try {
			setDeletingId(venueToDelete.id);
			setError('');
			setSuccess('');

			await deleteVenue(venueToDelete.id);

			setVenues(prev => prev.filter(venue => venue.id !== venueToDelete.id));
			setSuccess('Venue deleted successfully.');
			setVenueToDelete(null);
		} catch {
			setError('Failed to delete venue. Please try again.');
		} finally {
			setDeletingId(null);
		}
	}

	return (
		<div className='flex min-h-screen flex-col bg-[#f5f5f7] text-[#1f2a5a]'>
			<Navbar />

			<main className='mx-auto w-full max-w-6xl flex-1 px-6 py-10 md:px-10'>
				<div className='mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
					<div>
						<p className='text-sm font-semibold uppercase tracking-[0.25em] text-[#1f2a5a]/45'>Venue manager</p>
						<h1 className='mt-2 text-3xl font-bold'>Manager Dashboard</h1>
						<p className='mt-1 text-gray-500'>Manage your venues and upcoming bookings.</p>
					</div>

					<Link
						to='/manager/create'
						className='inline-flex items-center justify-center gap-2 rounded-full bg-[#1f2a5a] px-6 py-3 text-center text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg'>
						<Plus size={18} />
						Create venue
					</Link>
				</div>

				{success && (
					<div className='mb-6 rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700'>
						{success}
					</div>
				)}

				{error && (
					<div className='mb-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600'>
						{error}
					</div>
				)}

				{loading && (
					<div className='grid gap-6 md:grid-cols-2 xl:grid-cols-3'>
						{Array.from({ length: 6 }).map((_, index) => (
							<div
								key={index}
								className='rounded-2xl bg-white p-4 shadow-sm'>
								<div className='h-40 animate-pulse rounded-xl bg-gray-200' />
								<div className='mt-4 h-5 w-2/3 animate-pulse rounded bg-gray-200' />
								<div className='mt-2 h-4 w-1/2 animate-pulse rounded bg-gray-200' />
								<div className='mt-4 h-24 animate-pulse rounded-xl bg-gray-100' />
							</div>
						))}
					</div>
				)}

				{!loading && !error && venues.length === 0 && (
					<div className='rounded-2xl border border-dashed border-[#d9dbe8] bg-white p-10 text-center shadow-sm'>
						<div className='mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f2efff] text-[#1f2a5a]'>
							<Home size={30} />
						</div>

						<h2 className='mt-4 text-xl font-bold'>No venues yet</h2>

						<p className='mx-auto mt-2 max-w-md text-sm text-gray-500'>
							Create your first venue to start receiving bookings from customers.
						</p>

						<Link
							to='/manager/create'
							className='mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[#1f2a5a] px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg'>
							<Plus size={18} />
							Create your first venue
						</Link>
					</div>
				)}

				{!loading && venues.length > 0 && (
					<div className='grid gap-6 md:grid-cols-2 xl:grid-cols-3'>
						{venues.map(venue => {
							const image = venue.media?.[0]?.url;
							const upcomingBookings = getUpcomingBookings(venue.bookings);
							const hasUpcomingBookings = upcomingBookings.length > 0;

							return (
								<article
									key={venue.id}
									role='link'
									tabIndex={0}
									onClick={() => navigate(`/venues/${venue.id}`)}
									onKeyDown={event => {
										if (event.key === 'Enter' || event.key === ' ') {
											navigate(`/venues/${venue.id}`);
										}
									}}
									className='cursor-pointer rounded-2xl bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-xl'>
									<div className='h-40 overflow-hidden rounded-xl bg-gray-200'>
										{image ? (
											<img
												src={image}
												alt={venue.media?.[0]?.alt || venue.name}
												className='h-full w-full object-cover transition duration-500 hover:scale-105'
											/>
										) : (
											<div className='flex h-full items-center justify-center text-sm text-gray-400'>No image</div>
										)}
									</div>

									<div className='mt-4'>
										<h3 className='font-semibold'>{venue.name}</h3>
										<p className='mt-1 text-sm text-gray-500'>
											NOK {venue.price} · {venue.maxGuests} guests
										</p>
									</div>

									<div className='mt-4 rounded-xl border border-[#d9dbe8] bg-[#fbfbff] p-3'>
										<div className='flex items-center justify-between'>
											<h4 className='flex items-center gap-2 text-sm font-bold'>
												<CalendarCheck size={16} />
												Upcoming bookings
											</h4>

											<span className='rounded-full bg-[#f2efff] px-2 py-1 text-xs font-semibold text-[#1f2a5a]'>
												{upcomingBookings.length}
											</span>
										</div>

										{upcomingBookings.length === 0 ? (
											<p className='mt-3 rounded-lg bg-white px-3 py-3 text-xs text-gray-500'>
												No upcoming bookings yet.
											</p>
										) : (
											<div className='mt-3 space-y-2'>
												{upcomingBookings.slice(0, 3).map(booking => (
													<div
														key={booking.id}
														className='rounded-lg bg-[#f2efff] px-3 py-2 text-xs'>
														<p className='font-semibold text-[#1f2a5a]'>
															{formatDate(booking.dateFrom)} → {formatDate(booking.dateTo)}
														</p>

														<div className='mt-1 flex items-center justify-between gap-2 text-gray-500'>
															<span>
																{booking.guests} {booking.guests === 1 ? 'guest' : 'guests'}
															</span>

															{booking.customer?.name && <span className='truncate'>{booking.customer.name}</span>}
														</div>
													</div>
												))}

												{upcomingBookings.length > 3 && (
													<p className='text-xs font-semibold text-[#1f2a5a]/60'>
														+ {upcomingBookings.length - 3} more upcoming bookings
													</p>
												)}
											</div>
										)}
									</div>

									{hasUpcomingBookings && (
										<p className='mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700'>
											This venue has active bookings and cannot be deleted.
										</p>
									)}

									<div className='mt-4 flex gap-2'>
										<Link
											to={`/venues/${venue.id}`}
											onClick={event => event.stopPropagation()}
											className='flex-1 rounded-lg bg-gray-100 py-2 text-center text-sm font-semibold transition hover:bg-gray-200'>
											View
										</Link>

										<Link
											to={`/manager/edit/${venue.id}`}
											onClick={event => event.stopPropagation()}
											className='flex-1 rounded-lg bg-blue-100 py-2 text-center text-sm font-semibold transition hover:bg-blue-200'>
											Edit
										</Link>

										<button
											type='button'
											onClick={event => {
												event.stopPropagation();

												if (hasUpcomingBookings) {
													setSuccess('');
													setError('This venue cannot be deleted because it has active upcoming bookings.');
													return;
												}

												setVenueToDelete(venue);
												setError('');
												setSuccess('');
											}}
											disabled={deletingId === venue.id}
											className={`flex-1 rounded-lg py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
												hasUpcomingBookings
													? 'cursor-not-allowed bg-gray-100 text-gray-400 hover:bg-gray-100'
													: 'bg-red-100 text-red-700 hover:bg-red-200'
											}`}>
											{deletingId === venue.id ? 'Deleting...' : 'Delete'}
										</button>
									</div>
								</article>
							);
						})}
					</div>
				)}
			</main>

			{venueToDelete && (
				<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm'>
					<div className='w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl'>
						<div className='flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600'>
							<Trash2 size={24} />
						</div>

						<h2 className='mt-4 text-xl font-bold'>Delete venue?</h2>

						<p className='mt-2 text-sm leading-6 text-gray-500'>
							Are you sure you want to delete <span className='font-semibold text-[#1f2a5a]'>{venueToDelete.name}</span>
							? This action cannot be undone.
						</p>

						<div className='mt-4 flex gap-2 rounded-xl border border-amber-100 bg-amber-50 p-3 text-sm text-amber-700'>
							<AlertTriangle
								className='mt-0.5 shrink-0'
								size={18}
							/>
							<p>Only venues without active upcoming bookings can be deleted.</p>
						</div>

						<div className='mt-6 flex gap-3'>
							<button
								type='button'
								onClick={() => setVenueToDelete(null)}
								disabled={deletingId === venueToDelete.id}
								className='flex-1 rounded-lg bg-gray-100 py-3 text-sm font-semibold transition hover:bg-gray-200 disabled:opacity-50'>
								Cancel
							</button>

							<button
								type='button'
								onClick={confirmDelete}
								disabled={deletingId === venueToDelete.id}
								className='flex-1 rounded-lg bg-red-600 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50'>
								{deletingId === venueToDelete.id ? 'Deleting...' : 'Yes, delete'}
							</button>
						</div>
					</div>
				</div>
			)}

			<Footer />
		</div>
	);
}
