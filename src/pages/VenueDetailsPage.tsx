import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchVenueById } from '../api/venues';
import { createBooking } from '../api/bookings';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

interface Venue {
	id: string;
	name: string;
	description: string;
	media?: { url: string; alt?: string }[];
	price: number;
	maxGuests: number;
	rating: number;
	location?: {
		city?: string;
		country?: string;
		address?: string;
	};
	meta?: {
		wifi?: boolean;
		parking?: boolean;
		breakfast?: boolean;
		pets?: boolean;
	};
	owner?: {
		name: string;
	};
}

export default function VenueDetailsPage() {
	const { id } = useParams();

	const [venue, setVenue] = useState<Venue | null>(null);
	const [selectedImage, setSelectedImage] = useState('');
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	const [dateFrom, setDateFrom] = useState('');
	const [dateTo, setDateTo] = useState('');
	const [guests, setGuests] = useState(1);

	const [bookingLoading, setBookingLoading] = useState(false);
	const [bookingError, setBookingError] = useState('');
	const [bookingSuccess, setBookingSuccess] = useState('');
	const [acceptBookingTerms, setAcceptBookingTerms] = useState(false);

	useEffect(() => {
		async function loadVenue() {
			try {
				if (!id) return;

				const data = await fetchVenueById(id);
				setVenue(data.data);
				setSelectedImage(data.data.media?.[0]?.url || '');
			} catch {
				setError('Failed to load venue.');
			} finally {
				setLoading(false);
			}
		}

		loadVenue();
	}, [id]);

	async function handleBooking() {
		if (!venue) return;

		if (!acceptBookingTerms) {
			setBookingError('You must accept the booking terms.');
			return;
		}

		try {
			setBookingLoading(true);
			setBookingError('');
			setBookingSuccess('');

			await createBooking({
				dateFrom,
				dateTo,
				guests,
				venueId: venue.id,
			});

			setBookingSuccess('Booking successful! 🎉');
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Booking failed';
			setBookingError(message);
		} finally {
			setBookingLoading(false);
		}
	}

	if (loading) {
		return (
			<div className='min-h-screen bg-[#f5f5f7] text-[#1f2a5a]'>
				<Navbar />
				<main className='mx-auto max-w-6xl px-6 py-10'>Loading venue...</main>
			</div>
		);
	}

	if (error || !venue) {
		return (
			<div className='min-h-screen bg-[#f5f5f7] text-[#1f2a5a]'>
				<Navbar />
				<main className='mx-auto max-w-6xl px-6 py-10'>
					<p className='text-red-600'>{error || 'Venue not found.'}</p>
					<Link
						to='/venues'
						className='mt-4 inline-block underline'>
						Back to venues
					</Link>
				</main>
			</div>
		);
	}

	const images = venue.media || [];
	const locationText = `${venue.location?.city || 'Unknown city'}${
		venue.location?.country ? `, ${venue.location.country}` : ''
	}`;

	const dateFromTime = dateFrom ? new Date(dateFrom).getTime() : 0;
	const dateToTime = dateTo ? new Date(dateTo).getTime() : 0;
	const nights =
		dateFromTime && dateToTime && dateToTime > dateFromTime
			? Math.ceil((dateToTime - dateFromTime) / (1000 * 60 * 60 * 24))
			: 0;

	const cleaningFee = 350;
	const serviceFee = 220;
	const subtotal = nights * venue.price;
	const total = nights > 0 ? subtotal + cleaningFee + serviceFee : 0;

	return (
		<div className='min-h-screen bg-[#f5f5f7] text-[#1f2a5a]'>
			<Navbar />

			<main className='mx-auto grid max-w-6xl gap-8 px-6 py-8 md:grid-cols-[1fr_330px] md:px-10'>
				<section>
					<Link
						to='/venues'
						className='mb-4 inline-block text-sm text-[#1f2a5a]/60 hover:text-[#1f2a5a]'>
						← Back to venues
					</Link>

					<div className='h-105 overflow-hidden rounded-2xl bg-gray-300'>
						{selectedImage ? (
							<img
								src={selectedImage}
								alt={venue.name}
								className='h-full w-full object-cover'
							/>
						) : (
							<div className='flex h-full items-center justify-center text-gray-500'>No image</div>
						)}
					</div>

					{images.length > 1 && (
						<div className='mt-3 flex gap-3'>
							{images.slice(0, 4).map(image => (
								<button
									key={image.url}
									type='button'
									onClick={() => setSelectedImage(image.url)}
									className={`h-20 w-28 overflow-hidden rounded-lg border-2 bg-gray-300 transition ${
										selectedImage === image.url ? 'border-[#1f2a5a]' : 'border-transparent hover:border-[#1f2a5a]/40'
									}`}>
									<img
										src={image.url}
										alt={image.alt || venue.name}
										className='h-full w-full object-cover'
									/>
								</button>
							))}
						</div>
					)}

					<div className='mt-6 max-w-3xl'>
						<h1 className='text-3xl font-bold'>{venue.name}</h1>

						<p className='mt-2 text-sm text-[#1f2a5a]/65'>
							📍 {locationText} · ⭐ {venue.rating} · {venue.maxGuests} guests
						</p>

						<div className='mt-5 border-t border-[#d9dbe8] pt-5'>
							<h2 className='font-bold'>About this place</h2>
							<p className='mt-2 leading-7 text-[#1f2a5a]/70'>{venue.description}</p>
						</div>

						<div className='mt-6'>
							<h2 className='font-bold'>Amenities</h2>

							<div className='mt-3 flex flex-wrap gap-2'>
								{venue.meta?.wifi && <Amenity label='Wi-Fi' />}
								{venue.meta?.parking && <Amenity label='Parking' />}
								{venue.meta?.breakfast && <Amenity label='Breakfast' />}
								{venue.meta?.pets && <Amenity label='Pet Friendly' />}
								
							</div>
						</div>
					</div>
				</section>

				<aside className='h-fit rounded-2xl border border-[#d9dbe8] bg-white p-5 shadow-sm'>
					<div>
						<p className='text-2xl font-bold'>NOK {venue.price}</p>
						<p className='text-xs text-[#1f2a5a]/60'>per night · Free cancellation</p>
					</div>

					<div className='mt-4 border-t border-[#d9dbe8] pt-4'>
						<div className='grid grid-cols-2 gap-2'>
							<div className='rounded-lg border border-[#d7c6ff] bg-[#f2efff] px-3 py-2'>
								<label className='text-xs text-[#1f2a5a]/60'>Check-in</label>
								<input
									type='date'
									value={dateFrom}
									onChange={e => setDateFrom(e.target.value)}
									className='w-full bg-transparent text-sm font-semibold outline-none'
								/>
							</div>

							<div className='rounded-lg border border-[#d7c6ff] bg-[#f2efff] px-3 py-2'>
								<label className='text-xs text-[#1f2a5a]/60'>Check-out</label>
								<input
									type='date'
									value={dateTo}
									onChange={e => setDateTo(e.target.value)}
									className='w-full bg-transparent text-sm font-semibold outline-none'
								/>
							</div>
						</div>

						<div className='mt-2 rounded-lg border border-[#d7c6ff] bg-[#f2efff] px-3 py-2'>
							<label className='text-xs text-[#1f2a5a]/60'>Guests</label>
							<input
								type='number'
								min={1}
								max={venue.maxGuests}
								value={guests}
								onChange={e => setGuests(Number(e.target.value))}
								className='w-full bg-transparent text-sm font-semibold outline-none'
							/>
						</div>
					</div>

					<div className='mt-5 space-y-2 border-b border-[#d9dbe8] pb-4 text-sm'>
						<div className='flex justify-between'>
							<span>
								NOK {venue.price} × {nights || 0} nights
							</span>
							<span>{subtotal}</span>
						</div>
						<div className='flex justify-between'>
							<span>Cleaning fee</span>
							<span>{nights > 0 ? cleaningFee : 0}</span>
						</div>
						<div className='flex justify-between'>
							<span>Service fee</span>
							<span>{nights > 0 ? serviceFee : 0}</span>
						</div>
					</div>

					<div className='mt-4 flex justify-between font-bold'>
						<span>Total</span>
						<span>NOK {total}</span>
					</div>

					{guests > venue.maxGuests && (
						<p className='mt-3 text-sm text-red-600'>This venue allows maximum {venue.maxGuests} guests.</p>
					)}

					<label className='mt-4 flex gap-3 rounded-xl bg-[#f2efff] p-3 text-sm text-[#1f2a5a]/75'>
						<input
							type='checkbox'
							checked={acceptBookingTerms}
							onChange={e => setAcceptBookingTerms(e.target.checked)}
							className='mt-1'
						/>
						<span>I agree to the booking terms. Bookings cannot be cancelled within 24 hours of check-in.</span>
					</label>

					{bookingError && <p className='mt-3 text-sm text-red-600'>{bookingError}</p>}
					{bookingSuccess && <p className='mt-3 text-sm text-green-600'>{bookingSuccess}</p>}

					<button
						type='button'
						onClick={handleBooking}
						disabled={
							bookingLoading ||
							!dateFrom ||
							!dateTo ||
							nights <= 0 ||
							guests < 1 ||
							guests > venue.maxGuests ||
							!acceptBookingTerms
						}
						className='mt-5 w-full rounded-lg bg-[#1f2a5a] py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50'>
						{bookingLoading ? 'Booking...' : 'Reserve Now'}
					</button>

					<p className='mt-3 text-center text-xs text-[#1f2a5a]/50'>You will not be charged yet</p>
				</aside>
			</main>

			<Footer />
		</div>
	);
}

function Amenity({ label }: { label: string }) {
	return (
		<span className='rounded-full border border-[#d7c6ff] bg-[#f2efff] px-3 py-1 text-xs text-[#1f2a5a]'>{label}</span>
	);

}
