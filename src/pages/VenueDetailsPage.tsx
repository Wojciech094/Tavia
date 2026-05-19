import { useEffect, useMemo, useState } from 'react';
import { DayPicker, type DateRange } from 'react-day-picker';
import 'react-day-picker/style.css';
import { differenceInCalendarDays, eachDayOfInterval, format, isBefore, parseISO, startOfDay, subDays } from 'date-fns';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { fetchVenueById } from '../api/venues';
import Footer from '../components/layout/Footer';
import Navbar from '../components/layout/Navbar';
import Toast from '../components/ui/Toast';
import { PageSkeleton } from '../components/ui/Skeleton';
import { MapPin, Star, Users, X } from 'lucide-react';

interface Booking {
	id: string;
	dateFrom: string;
	dateTo: string;
	guests: number;
}

interface Venue {
	id: string;
	name: string;
	description: string;
	media?: { url: string; alt?: string }[];
	price: number;
	maxGuests: number;
	rating: number;
	bookings?: Booking[];
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
		email?: string;
	};
}

interface StoredUser {
	name?: string;
	email?: string;
	venueManager?: boolean;
}

function getStoredUser(): StoredUser | null {
	try {
		const storedUser = localStorage.getItem('user');
		return storedUser ? JSON.parse(storedUser) : null;
	} catch {
		return null;
	}
}

function toApiDate(date?: Date) {
	return date ? format(date, 'yyyy-MM-dd') : '';
}

function toDisplayDate(date?: Date) {
	return date ? format(date, 'dd MMM yyyy') : 'Select date';
}

function getBookedDays(bookings: Booking[]) {
	return bookings.flatMap(booking => {
		const start = startOfDay(parseISO(booking.dateFrom));
		const end = startOfDay(parseISO(booking.dateTo));
		const lastBookedNight = subDays(end, 1);

		if (isBefore(lastBookedNight, start)) return [];

		return eachDayOfInterval({
			start,
			end: lastBookedNight,
		});
	});
}

function hasDateConflict(range: DateRange | undefined, bookings: Booking[]) {
	if (!range?.from || !range?.to) return false;

	const selectedFrom = startOfDay(range.from).getTime();
	const selectedTo = startOfDay(range.to).getTime();

	return bookings.some(booking => {
		const bookedFrom = startOfDay(parseISO(booking.dateFrom)).getTime();
		const bookedTo = startOfDay(parseISO(booking.dateTo)).getTime();

		return selectedFrom < bookedTo && selectedTo > bookedFrom;
	});
}

export default function VenueDetailsPage() {
	const { id } = useParams();
	const navigate = useNavigate();
	const location = useLocation();

	const [venue, setVenue] = useState<Venue | null>(null);
	const [selectedImage, setSelectedImage] = useState('');
	const [selectedRange, setSelectedRange] = useState<DateRange | undefined>();
	const [guests, setGuests] = useState(1);

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [bookingError, setBookingError] = useState('');
	const [bookingSuccess, setBookingSuccess] = useState('');
	const [acceptBookingTerms, setAcceptBookingTerms] = useState(false);
	const [isContinuing, setIsContinuing] = useState(false);
	const [showLoginPrompt, setShowLoginPrompt] = useState(false);

	const currentUser = getStoredUser();
	const token = localStorage.getItem('token');

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [id]);

	useEffect(() => {
		let isMounted = true;

		async function loadVenue() {
			try {
				if (!id) return;

				setLoading(true);
				setError('');

				const data = await fetchVenueById(id);

				if (!isMounted) return;

				setVenue(data.data);
				setSelectedImage(data.data.media?.[0]?.url || '');
			} catch {
				if (isMounted) {
					setError('Failed to load venue. Please try again.');
				}
			} finally {
				if (isMounted) {
					setLoading(false);
				}
			}
		}

		void loadVenue();

		return () => {
			isMounted = false;
		};
	}, [id]);

	const bookings = useMemo(() => venue?.bookings ?? [], [venue?.bookings]);
	const bookedDays = useMemo(() => getBookedDays(bookings), [bookings]);

	const isOwner = Boolean(venue?.owner?.name && currentUser?.name && venue.owner.name === currentUser.name);

	const nights =
		selectedRange?.from && selectedRange?.to ? differenceInCalendarDays(selectedRange.to, selectedRange.from) : 0;

	const dateFrom = toApiDate(selectedRange?.from);
	const dateTo = toApiDate(selectedRange?.to);
	const dateConflict = hasDateConflict(selectedRange, bookings);

	const selectedDatesAreAvailable = Boolean(
		selectedRange?.from && selectedRange?.to && nights > 0 && !dateConflict && !isOwner,
	);

	const cleaningFee = 350;
	const serviceFee = 220;
	const subtotal = venue && nights > 0 ? nights * venue.price : 0;
	const total = nights > 0 ? subtotal + cleaningFee + serviceFee : 0;

	function handleBooking() {
		if (!venue || isContinuing) return;

		setBookingError('');
		setBookingSuccess('');

		if (isOwner) {
			setBookingError('You manage this venue, so you cannot book it yourself.');
			return;
		}

		if (!selectedRange?.from || !selectedRange?.to) {
			setBookingError('Please select your check-in and check-out dates.');
			return;
		}

		if (nights <= 0) {
			setBookingError('Check-out date must be after check-in date.');
			return;
		}

		if (dateConflict) {
			setBookingError('Selected dates are already booked. Please choose another period.');
			return;
		}

		if (guests < 1 || guests > venue.maxGuests) {
			setBookingError(`This venue allows between 1 and ${venue.maxGuests} guests.`);
			return;
		}

		if (!acceptBookingTerms) {
			setBookingError('You must accept the booking terms.');
			return;
		}

		if (!token) {
			setShowLoginPrompt(true);
			return;
		}

		setBookingSuccess('Dates selected successfully. Taking you to checkout...');
		setIsContinuing(true);

		window.setTimeout(() => {
			navigate(`/checkout/${venue.id}`, {
				state: {
					dateFrom,
					dateTo,
					guests,
				},
			});
		}, 1500);
	}

	if (loading) {
		return (
			<div className='min-h-screen bg-[#f5f5f7] text-[#1f2a5a]'>
				<Navbar />
				<PageSkeleton />
				<Footer />
			</div>
		);
	}

	if (error || !venue) {
		return (
			<div className='min-h-screen bg-[#f5f5f7] text-[#1f2a5a]'>
				<Navbar />

				<Toast
					type='error'
					message={error || 'Venue not found.'}
					onClose={() => setError('')}
				/>

				<main className='mx-auto max-w-6xl px-6 py-10'>
					<div className='rounded-3xl border border-red-100 bg-white p-8 shadow-sm'>
						<h1 className='text-2xl font-bold text-red-600'>Something went wrong</h1>
						<p className='mt-2 text-[#1f2a5a]/70'>{error || 'Venue not found.'}</p>

						<Link
							to='/venues'
							className='mt-5 inline-block rounded-xl bg-[#1f2a5a] px-5 py-3 font-semibold text-white'>
							Back to venues
						</Link>
					</div>
				</main>

				<Footer />
			</div>
		);
	}

	const images = venue.media || [];
	const locationText = `${venue.location?.city || 'Unknown city'}${
		venue.location?.country ? `, ${venue.location.country}` : ''
	}`;

	return (
		<div className='min-h-screen bg-[#f5f5f7] text-[#1f2a5a]'>
			<Navbar />

			<Toast
				type='error'
				message={bookingError}
				onClose={() => setBookingError('')}
			/>

			<Toast
				type='success'
				message={bookingSuccess}
				onClose={() => setBookingSuccess('')}
			/>

			{showLoginPrompt && (
				<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm'>
					<div className='relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl'>
						<button
							type='button'
							onClick={() => setShowLoginPrompt(false)}
							className='absolute right-4 top-4 rounded-full p-2 text-[#1f2a5a]/50 transition hover:bg-[#f2efff] hover:text-[#1f2a5a]'>
							<X className='h-5 w-5' />
						</button>

						<p className='text-sm font-semibold uppercase tracking-[0.2em] text-[#7c6ee6]'>Account required</p>

						<h2 className='mt-3 text-2xl font-bold text-[#1f2a5a]'>Log in to continue</h2>

						<p className='mt-3 leading-7 text-[#1f2a5a]/70'>
							You need to be logged in before you can book this venue. After logging in, you will return to this venue
							page and can continue your booking.
						</p>

						<div className='mt-6 flex flex-col gap-3 sm:flex-row'>
							<button
								type='button'
								onClick={() => setShowLoginPrompt(false)}
								className='w-full rounded-xl border border-[#d9dbe8] px-5 py-3 font-semibold text-[#1f2a5a] transition hover:bg-[#f2efff]'>
								Stay here
							</button>

							<button
								type='button'
								onClick={() =>
									navigate('/login', {
										state: { from: location },
									})
								}
								className='w-full rounded-xl bg-[#1f2a5a] px-5 py-3 font-semibold text-white transition hover:opacity-90'>
								Log in
							</button>
						</div>
					</div>
				</div>
			)}

			<main className='mx-auto grid max-w-6xl gap-8 px-6 py-8 md:grid-cols-[1fr_380px] md:px-10'>
				<section>
					<Link
						to='/venues'
						className='mb-4 inline-block text-sm text-[#1f2a5a]/60 hover:text-[#1f2a5a]'>
						← Back to venues
					</Link>

					<div className='h-105 overflow-hidden rounded-2xl bg-gray-300 shadow-sm'>
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

						<div className='mt-2 flex flex-wrap items-center gap-3 text-sm text-[#1f2a5a]/65'>
							<span className='inline-flex items-center gap-1.5'>
								<MapPin className='h-4 w-4' />
								{locationText}
							</span>

							<span className='inline-flex items-center gap-1.5'>
								<Star className='h-4 w-4 fill-amber-400 text-amber-400' />
								{venue.rating}
							</span>

							<span className='inline-flex items-center gap-1.5'>
								<Users className='h-4 w-4' />
								{venue.maxGuests} guests
							</span>
						</div>

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

								{!venue.meta?.wifi && !venue.meta?.parking && !venue.meta?.breakfast && !venue.meta?.pets && (
									<p className='text-sm text-[#1f2a5a]/60'>No amenities listed.</p>
								)}
							</div>
						</div>

						<div className='mt-8 rounded-2xl border border-[#d9dbe8] bg-white p-5 shadow-sm'>
							<h2 className='font-bold'>Availability</h2>
							<p className='mt-1 text-sm text-[#1f2a5a]/60'>Booked dates are marked in red and cannot be selected.</p>

							<div className='mt-4 flex flex-wrap gap-3 text-xs'>
								<span className='rounded-full bg-[#f2efff] px-3 py-1'>Selected stay</span>
								<span className='rounded-full bg-red-50 px-3 py-1 text-red-600'>Booked</span>
								<span className='rounded-full bg-green-50 px-3 py-1 text-green-700'>Available</span>
							</div>
						</div>
					</div>
				</section>

				<aside className='h-fit rounded-2xl border border-[#d9dbe8] bg-white p-5 shadow-sm'>
					<div>
						<p className='text-2xl font-bold'>NOK {venue.price}</p>
						<p className='text-xs text-[#1f2a5a]/60'>per night · Free cancellation</p>
					</div>

					{isOwner && (
						<div className='mt-4 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700'>
							You manage this venue, so you cannot book it yourself.
						</div>
					)}

					<div className='mt-4 grid grid-cols-2 gap-2'>
						<div className='rounded-xl border border-[#d7c6ff] bg-[#f2efff] px-3 py-3'>
							<p className='text-xs text-[#1f2a5a]/60'>Check-in</p>
							<p className='mt-1 text-sm font-bold'>{toDisplayDate(selectedRange?.from)}</p>
						</div>

						<div className='rounded-xl border border-[#d7c6ff] bg-[#f2efff] px-3 py-3'>
							<p className='text-xs text-[#1f2a5a]/60'>Check-out</p>
							<p className='mt-1 text-sm font-bold'>{toDisplayDate(selectedRange?.to)}</p>
						</div>
					</div>

					<div className='mt-4 rounded-2xl border border-[#d9dbe8] bg-[#fbfbff] p-3'>
						<DayPicker
							mode='range'
							selected={selectedRange}
							onSelect={range => {
								setSelectedRange(range);
								setBookingError('');
								setBookingSuccess('');
							}}
							numberOfMonths={1}
							min={1}
							disabled={[{ before: startOfDay(new Date()) }, ...bookedDays]}
							modifiers={{
								booked: bookedDays,
							}}
							modifiersClassNames={{
								booked: 'bg-red-100 text-red-600 line-through rounded-full',
								selected: 'bg-[#1f2a5a] text-white rounded-full',
								range_middle: 'bg-[#e8fff2] text-green-800',
								range_start: 'bg-green-600 text-white rounded-full',
								range_end: 'bg-green-600 text-white rounded-full',
							}}
							classNames={{
								root: 'w-full text-[#1f2a5a]',
								month_caption: 'flex justify-center py-2 font-bold',
								nav: 'flex items-center justify-between',
								button_previous: 'rounded-full p-2 hover:bg-[#f2efff]',
								button_next: 'rounded-full p-2 hover:bg-[#f2efff]',
								weekdays: 'grid grid-cols-7 text-xs text-[#1f2a5a]/50',
								weekday: 'py-2 text-center',
								week: 'grid grid-cols-7',
								day: 'flex justify-center p-1',
								day_button:
									'h-9 w-9 rounded-full text-sm font-medium transition hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-40',
								today: 'font-bold text-[#1f2a5a]',
							}}
						/>

						<button
							type='button'
							onClick={() => {
								setSelectedRange(undefined);
								setBookingError('');
								setBookingSuccess('');
							}}
							className='mt-2 text-sm font-semibold text-[#1f2a5a]/60 hover:text-[#1f2a5a]'>
							Clear dates
						</button>
					</div>

					{selectedDatesAreAvailable && (
						<p className='mt-3 rounded-lg border border-green-100 bg-green-50 px-3 py-2 text-sm font-semibold text-green-700'>
							Selected dates are available.
						</p>
					)}

					{dateConflict && (
						<p className='mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600'>
							Selected dates overlap with an existing booking.
						</p>
					)}

					<div>
						<label
							htmlFor='booking-guests'
							className='mb-2 block text-sm font-semibold text-[#1f2a5a]'>
							Guests
						</label>

						<input
							id='booking-guests'
							type='number'
							min='1'
							max={venue.maxGuests}
							value={guests}
							onChange={event => setGuests(Number(event.target.value))}
							className='w-full rounded-2xl border border-[#d9dbe8] bg-white px-4 py-3 text-sm font-semibold text-[#1f2a5a] outline-none transition focus:border-[#1f2a5a] focus:ring-4 focus:ring-[#1f2a5a]/10'
						/>
					</div>

					<div className='mt-5 space-y-2 border-b border-[#d9dbe8] pb-4 text-sm'>
						<div className='flex justify-between'>
							<span>
								NOK {venue.price} x {nights || 0} nights
							</span>
							<span>NOK {subtotal}</span>
						</div>

						<div className='flex justify-between'>
							<span>Cleaning fee</span>
							<span>NOK {nights > 0 ? cleaningFee : 0}</span>
						</div>

						<div className='flex justify-between'>
							<span>Service fee</span>
							<span>NOK {nights > 0 ? serviceFee : 0}</span>
						</div>
					</div>

					<div className='mt-4 flex justify-between font-bold'>
						<span>Total</span>
						<span>NOK {total}</span>
					</div>

					<label className='mt-4 flex gap-3 rounded-xl bg-[#f2efff] p-3 text-sm text-[#1f2a5a]/75'>
						<input
							type='checkbox'
							checked={acceptBookingTerms}
							onChange={e => setAcceptBookingTerms(e.target.checked)}
							disabled={isOwner || isContinuing}
							className='mt-1'
						/>
						<span>I agree to the booking terms. Bookings cannot be cancelled within 24 hours of check-in.</span>
					</label>

					<button
						type='button'
						onClick={handleBooking}
						disabled={
							isContinuing ||
							isOwner ||
							!selectedRange?.from ||
							!selectedRange?.to ||
							nights <= 0 ||
							dateConflict ||
							guests < 1 ||
							guests > venue.maxGuests ||
							!acceptBookingTerms
						}
						className='mt-5 w-full rounded-lg bg-[#1f2a5a] py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50'>
						{isContinuing ? 'Preparing checkout...' : isOwner ? 'Owner cannot book' : 'Continue to checkout'}
					</button>

					<p className='mt-3 text-center text-xs text-[#1f2a5a]/50'>You will confirm payment on the next step</p>
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
