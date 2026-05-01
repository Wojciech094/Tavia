import { useEffect, useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { fetchMyBookings } from '../api/myBookings';
import { deleteBooking } from '../api/bookings';

interface Booking {
	id: string;
	dateFrom: string;
	dateTo: string;
	guests: number;
	venue?: {
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

export default function MyBookingsPage() {
	const [bookings, setBookings] = useState<Booking[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	async function handleCancel(id: string) {
		const confirmDelete = confirm('Are you sure you want to cancel this booking?');

		if (!confirmDelete) return;

		try {
			await deleteBooking(id);
			setBookings(current => current.filter(booking => booking.id !== id));
		} catch {
			alert('Failed to cancel booking');
		}
	}

	useEffect(() => {
		async function loadBookings() {
			try {
				const data = await fetchMyBookings();
				setBookings(data.data);
			} catch {
				setError('Failed to load bookings');
			} finally {
				setLoading(false);
			}
		}

		loadBookings();
	}, []);

	if (loading) {
		return (
			<div className='min-h-screen bg-[#eef1f6] text-[#1f2a5a]'>
				<Navbar />
				<main className='mx-auto max-w-6xl px-6 py-10'>Loading bookings...</main>
			</div>
		);
	}

	if (error) {
		return (
			<div className='min-h-screen bg-[#eef1f6] text-[#1f2a5a]'>
				<Navbar />
				<main className='mx-auto max-w-6xl px-6 py-10'>
					<p className='rounded-2xl bg-red-50 p-4 text-red-600'>{error}</p>
				</main>
			</div>
		);
	}

	const upcomingBookings = bookings.filter(booking => new Date(booking.dateTo) >= new Date());

	return (
		<div className='min-h-screen bg-[#eef1f6] text-[#1f2a5a]'>
			<Navbar />

			<main className='mx-auto max-w-6xl px-6 py-10 md:px-10'>
				<section className='rounded-3xl bg-[#1f2a5a] p-8 text-white shadow-md'>
					<p className='text-sm font-semibold text-white/60'>Travel dashboard</p>
					<h1 className='mt-2 text-4xl font-bold'>My Bookings</h1>
					<p className='mt-3 max-w-2xl text-white/70'>
						Keep track of your upcoming stays, guests, dates, and booking details.
					</p>
				</section>

				<section className='mt-6 grid gap-4 md:grid-cols-3'>
					<div className='rounded-3xl bg-white p-6 shadow-sm'>
						<p className='text-sm text-[#1f2a5a]/60'>Total bookings</p>
						<p className='mt-2 text-3xl font-bold'>{bookings.length}</p>
					</div>

					<div className='rounded-3xl bg-white p-6 shadow-sm'>
						<p className='text-sm text-[#1f2a5a]/60'>Upcoming stays</p>
						<p className='mt-2 text-3xl font-bold'>{upcomingBookings.length}</p>
					</div>

					<div className='rounded-3xl bg-white p-6 shadow-sm'>
						<p className='text-sm text-[#1f2a5a]/60'>Total guests</p>
						<p className='mt-2 text-3xl font-bold'>{bookings.reduce((sum, booking) => sum + booking.guests, 0)}</p>
					</div>
				</section>

				<section className='mt-8'>
					<div className='mb-4 flex items-center justify-between'>
						<h2 className='text-2xl font-bold'>Upcoming reservations</h2>
						<span className='rounded-full bg-white px-4 py-2 text-sm font-semibold shadow-sm'>
							{upcomingBookings.length} active
						</span>
					</div>

					{bookings.length === 0 ? (
						<div className='rounded-3xl bg-white p-10 text-center shadow-sm'>
							<p className='text-4xl'></p>
							<h2 className='mt-4 text-2xl font-bold'>No bookings yet</h2>
							<p className='mt-2 text-[#1f2a5a]/60'>Explore venues and reserve your first stay.</p>
						</div>
					) : (
						<div className='space-y-4'>
							{bookings.map(booking => {
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
													<p className='mt-1 font-bold'>{booking.guests}</p>
												</div>
											</div>

											<div className='mt-5 flex flex-col gap-4 border-t border-[#d9dbe8] pt-5 md:flex-row md:items-center md:justify-between'>
												<div>
													<p className='text-sm text-[#1f2a5a]/60'>
														{nights} nights · NOK {booking.venue?.price || 0} / night
													</p>
													<p className='text-xl font-bold'>NOK {total}</p>
												</div>

												<div className='text-right'>
													<button
														type='button'
														onClick={() => handleCancel(booking.id)}
														disabled={!canCancel}
														className='rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50'>
														Cancel booking
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

			<Footer />
		</div>
	);
}
