import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarCheck, CalendarClock, CircleAlert, Eye, Plane, Trash2, Users } from 'lucide-react';
import { deleteBooking } from '../api/bookings';
import { fetchMyBookings } from '../api/myBookings';
import Footer from '../components/layout/Footer';
import Navbar from '../components/layout/Navbar';

interface Booking {
	id: string;
	dateFrom: string;
	dateTo: string;
	guests: number;
	venue?: {
		id?: string;
		name: string;
		price: number;
		media?: { url: string; alt?: string }[];
		location?: {
			city?: string;
			country?: string;
		};
	};
}

function formatDate(date: string) {
	return new Date(date).toLocaleDateString('en-GB', {
		day: '2-digit',
		month: 'short',
		year: 'numeric',
	});
}

function getNights(dateFrom: string, dateTo: string) {
	const from = new Date(dateFrom).getTime();
	const to = new Date(dateTo).getTime();

	return Math.max(Math.ceil((to - from) / (1000 * 60 * 60 * 24)), 0);
}

function canCancelBooking(dateFrom: string) {
	return new Date(dateFrom).getTime() - Date.now() > 24 * 60 * 60 * 1000;
}

function getUpcomingBookings(bookings: Booking[]) {
	const today = new Date();

	return bookings
		.filter(booking => new Date(booking.dateTo) >= today)
		.sort((a, b) => new Date(a.dateFrom).getTime() - new Date(b.dateFrom).getTime());
}

export default function MyBookingsPage() {
	const [bookings, setBookings] = useState<Booking[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);
	const [cancellingId, setCancellingId] = useState<string | null>(null);

	useEffect(() => {
		async function loadBookings() {
			try {
				setLoading(true);
				setError('');

				const data = await fetchMyBookings();
				setBookings(data.data);
			} catch {
				setError('Failed to load bookings.');
			} finally {
				setLoading(false);
			}
		}

		void loadBookings();
	}, []);

	async function confirmCancelBooking() {
		if (!bookingToCancel) return;

		try {
			setCancellingId(bookingToCancel.id);
			setError('');
			setSuccess('');

			await deleteBooking(bookingToCancel.id);

			setBookings(current => current.filter(booking => booking.id !== bookingToCancel.id));
			setSuccess('Booking cancelled successfully.');
			setBookingToCancel(null);
		} catch {
			setError('Failed to cancel booking. Please try again.');
		} finally {
			setCancellingId(null);
		}
	}

	const upcomingBookings = getUpcomingBookings(bookings);
	const activeBookingsCount = upcomingBookings.length;
	const pastBookingsCount = Math.max(bookings.length - activeBookingsCount, 0);
	const upcomingGuests = upcomingBookings.reduce((sum, booking) => sum + booking.guests, 0);

	if (loading) {
		return (
			<div className='min-h-screen bg-[#eef1f6] text-[#1f2a5a]'>
				<Navbar />

				<main className='mx-auto max-w-6xl px-6 py-10 md:px-10'>
					<section className='rounded-3xl bg-[#1f2a5a] p-8 text-white shadow-md'>
						<div className='h-4 w-40 animate-pulse rounded bg-white/20' />
						<div className='mt-4 h-10 w-72 animate-pulse rounded bg-white/20' />
						<div className='mt-4 h-4 max-w-xl animate-pulse rounded bg-white/20' />
					</section>

					<section className='mt-6 grid gap-4 md:grid-cols-3'>
						{Array.from({ length: 3 }).map((_, index) => (
							<div
								key={index}
								className='h-32 animate-pulse rounded-3xl bg-white'
							/>
						))}
					</section>

					<section className='mt-8 space-y-4'>
						{Array.from({ length: 3 }).map((_, index) => (
							<div
								key={index}
								className='grid overflow-hidden rounded-3xl bg-white shadow-sm md:grid-cols-[240px_1fr]'>
								<div className='h-56 animate-pulse bg-gray-200 md:h-full' />
								<div className='space-y-4 p-6'>
									<div className='h-5 w-1/3 animate-pulse rounded bg-gray-200' />
									<div className='h-8 w-2/3 animate-pulse rounded bg-gray-200' />
									<div className='grid gap-3 sm:grid-cols-3'>
										<div className='h-20 animate-pulse rounded-2xl bg-gray-100' />
										<div className='h-20 animate-pulse rounded-2xl bg-gray-100' />
										<div className='h-20 animate-pulse rounded-2xl bg-gray-100' />
									</div>
								</div>
							</div>
						))}
					</section>
				</main>

				<Footer />
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-[#eef1f6] text-[#1f2a5a]'>
			<Navbar />

			<main className='mx-auto max-w-6xl px-6 py-10 md:px-10'>
				<section className='rounded-3xl bg-[#1f2a5a] p-8 text-white shadow-md'>
					<p className='text-sm font-semibold text-white/60'>Travel dashboard</p>
					<h1 className='mt-2 text-4xl font-bold'>My Bookings</h1>
					<p className='mt-3 max-w-2xl text-white/70'>
						Keep track of your active and upcoming stays, guests, dates, and booking details.
					</p>
				</section>

				{success && (
					<p className='mt-6 rounded-2xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-700'>{success}</p>
				)}

				{error && <p className='mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600'>{error}</p>}

				<section className='mt-6 grid gap-4 md:grid-cols-3'>
					<div className='rounded-3xl bg-white p-6 shadow-sm'>
						<div className='flex items-center justify-between'>
							<p className='text-sm text-[#1f2a5a]/60'>Active bookings</p>
							<div className='flex h-10 w-10 items-center justify-center rounded-2xl bg-[#eef1ff] text-[#4b5bbd]'>
								<CalendarCheck size={20} />
							</div>
						</div>

						<p className='mt-2 text-3xl font-bold'>{activeBookingsCount}</p>
					</div>

					<div className='rounded-3xl bg-white p-6 shadow-sm'>
						<div className='flex items-center justify-between'>
							<p className='text-sm text-[#1f2a5a]/60'>Completed stays</p>
							<div className='flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f2efff] text-[#6d5bd0]'>
								<CalendarClock size={20} />
							</div>
						</div>

						<p className='mt-2 text-3xl font-bold'>{pastBookingsCount}</p>
					</div>

					<div className='rounded-3xl bg-white p-6 shadow-sm'>
						<div className='flex items-center justify-between'>
							<p className='text-sm text-[#1f2a5a]/60'>Upcoming guests</p>
							<div className='flex h-10 w-10 items-center justify-center rounded-2xl bg-[#e9f7ef] text-green-700'>
								<Users size={20} />
							</div>
						</div>

						<p className='mt-2 text-3xl font-bold'>{upcomingGuests}</p>
					</div>
				</section>

				<section className='mt-8'>
					<div className='mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
						<div>
							<h2 className='text-2xl font-bold'>Upcoming reservations</h2>
							<p className='mt-1 text-sm text-[#1f2a5a]/60'>Only active and future bookings are shown here.</p>
						</div>

						<span className='w-fit rounded-full bg-white px-4 py-2 text-sm font-semibold shadow-sm'>
							{activeBookingsCount} active
						</span>
					</div>

					{bookings.length === 0 ? (
						<div className='rounded-3xl bg-white p-10 text-center shadow-sm'>
							<div className='mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f2efff] text-[#4b5bbd]'>
								<Plane size={30} />
							</div>

							<h2 className='mt-4 text-2xl font-bold'>No bookings yet</h2>

							<p className='mx-auto mt-2 max-w-md text-[#1f2a5a]/60'>Explore venues and reserve your first stay.</p>

							<Link
								to='/venues'
								className='mt-6 inline-block rounded-full bg-[#1f2a5a] px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg'>
								Browse venues
							</Link>
						</div>
					) : upcomingBookings.length === 0 ? (
						<div className='rounded-3xl bg-white p-10 text-center shadow-sm'>
							<div className='mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f2efff] text-[#4b5bbd]'>
								<CalendarClock size={30} />
							</div>

							<h2 className='mt-4 text-2xl font-bold'>No upcoming stays</h2>

							<p className='mx-auto mt-2 max-w-md text-[#1f2a5a]/60'>
								Your previous bookings are complete. Browse venues to plan your next trip.
							</p>

							<Link
								to='/venues'
								className='mt-6 inline-block rounded-full bg-[#1f2a5a] px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg'>
								Find a new stay
							</Link>
						</div>
					) : (
						<div className='space-y-4'>
							{upcomingBookings.map(booking => {
								const image = booking.venue?.media?.[0]?.url;
								const imageAlt = booking.venue?.media?.[0]?.alt || booking.venue?.name || 'Venue';
								const nights = getNights(booking.dateFrom, booking.dateTo);
								const total = (booking.venue?.price || 0) * nights;
								const canCancel = canCancelBooking(booking.dateFrom);

								return (
									<article
										key={booking.id}
										className='grid overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md md:grid-cols-[240px_1fr]'>
										<div className='h-56 bg-gray-300 md:h-full'>
											{image ? (
												<img
													src={image}
													alt={imageAlt}
													className='h-full w-full object-cover'
												/>
											) : (
												<div className='flex h-full items-center justify-center text-gray-500'>No image</div>
											)}
										</div>

										<div className='p-6'>
											<div className='flex flex-col gap-4 md:flex-row md:items-start md:justify-between'>
												<div>
													<p className='text-sm font-semibold text-[#1f2a5a]/50'>Booking #{booking.id.slice(0, 6)}</p>

													<h3 className='mt-1 text-2xl font-bold'>{booking.venue?.name || 'Venue'}</h3>

													<p className='mt-1 text-sm text-[#1f2a5a]/60'>
														{booking.venue?.location?.city || 'Unknown location'}
														{booking.venue?.location?.country ? `, ${booking.venue.location.country}` : ''}
													</p>
												</div>

												<span className='w-fit rounded-full bg-green-50 px-4 py-2 text-sm font-semibold text-green-700'>
													Confirmed
												</span>
											</div>

											<div className='mt-6 grid gap-3 sm:grid-cols-3'>
												<div className='rounded-2xl bg-[#f5f5f7] p-4'>
													<p className='text-xs text-[#1f2a5a]/50'>Check-in</p>
													<p className='mt-1 font-bold'>{formatDate(booking.dateFrom)}</p>
												</div>

												<div className='rounded-2xl bg-[#f5f5f7] p-4'>
													<p className='text-xs text-[#1f2a5a]/50'>Check-out</p>
													<p className='mt-1 font-bold'>{formatDate(booking.dateTo)}</p>
												</div>

												<div className='rounded-2xl bg-[#f5f5f7] p-4'>
													<p className='text-xs text-[#1f2a5a]/50'>Guests</p>
													<p className='mt-1 font-bold'>
														{booking.guests} {booking.guests === 1 ? 'guest' : 'guests'}
													</p>
												</div>
											</div>

											<div className='mt-5 flex flex-col gap-4 border-t border-[#d9dbe8] pt-5 md:flex-row md:items-center md:justify-between'>
												<div>
													<p className='text-sm text-[#1f2a5a]/60'>
														{nights} {nights === 1 ? 'night' : 'nights'} · NOK {booking.venue?.price || 0} / night
													</p>

													<p className='text-xl font-bold'>NOK {total}</p>
												</div>

												<div className='text-right'>
													{booking.venue?.id && (
														<Link
															to={`/venues/${booking.venue.id}`}
															className='mr-2 inline-flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold transition hover:bg-gray-200'>
															<Eye size={16} />
															View venue
														</Link>
													)}

													<button
														type='button'
														onClick={() => {
															setBookingToCancel(booking);
															setError('');
															setSuccess('');
														}}
														disabled={!canCancel || cancellingId === booking.id}
														className='inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50'>
														<Trash2 size={16} />
														{cancellingId === booking.id ? 'Cancelling...' : 'Cancel booking'}
													</button>

													{!canCancel && (
														<p className='mt-2 text-xs text-red-500'>Cannot cancel within 24h of check-in</p>
													)}
												</div>
											</div>
										</div>
									</article>
								);
							})}
						</div>
					)}
				</section>
			</main>

			{bookingToCancel && (
				<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm'>
					<div className='w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl'>
						<div className='flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600'>
							<CircleAlert size={24} />
						</div>

						<h2 className='mt-4 text-xl font-bold'>Cancel booking?</h2>

						<p className='mt-2 text-sm leading-6 text-gray-500'>
							Are you sure you want to cancel your stay at{' '}
							<span className='font-semibold text-[#1f2a5a]'>{bookingToCancel.venue?.name || 'this venue'}</span>? This
							action cannot be undone.
						</p>

						<div className='mt-6 flex gap-3'>
							<button
								type='button'
								onClick={() => setBookingToCancel(null)}
								disabled={cancellingId === bookingToCancel.id}
								className='flex-1 rounded-lg bg-gray-100 py-3 text-sm font-semibold transition hover:bg-gray-200 disabled:opacity-50'>
								Keep booking
							</button>

							<button
								type='button'
								onClick={confirmCancelBooking}
								disabled={cancellingId === bookingToCancel.id}
								className='flex-1 rounded-lg bg-red-600 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50'>
								{cancellingId === bookingToCancel.id ? 'Cancelling...' : 'Yes, cancel'}
							</button>
						</div>
					</div>
				</div>
			)}

			<Footer />
		</div>
	);
}
