import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { differenceInCalendarDays, format, parseISO } from 'date-fns';
import { createBooking } from '../api/bookings';
import { fetchVenueById } from '../api/venues';
import Footer from '../components/layout/Footer';
import Navbar from '../components/layout/Navbar';

interface CheckoutState {
	dateFrom?: string;
	dateTo?: string;
	guests?: number;
}

interface Venue {
	id: string;
	name: string;
	description: string;
	price: number;
	maxGuests: number;
	media?: { url: string; alt?: string }[];
	location?: {
		city?: string;
		country?: string;
	};
}

interface FieldErrors {
	name?: string;
	card?: string;
	expiry?: string;
	cvc?: string;
	agree?: string;
}

function formatCardNumber(value: string) {
	return value
		.replace(/\D/g, '')
		.slice(0, 19)
		.replace(/(.{4})/g, '$1 ')
		.trim();
}

function formatExpiry(value: string) {
	const numbers = value.replace(/\D/g, '').slice(0, 4);

	if (numbers.length <= 2) {
		return numbers;
	}

	return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
}

function formatCvc(value: string) {
	return value.replace(/\D/g, '').slice(0, 4);
}

function CheckoutPage() {
	const { venueId } = useParams();
	const navigate = useNavigate();
	const location = useLocation();

	const bookingState = location.state as CheckoutState | null;

	const [venue, setVenue] = useState<Venue | null>(null);
	const [loading, setLoading] = useState(true);
	const [paying, setPaying] = useState(false);
	const [error, setError] = useState('');
	const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

	const [cardName, setCardName] = useState('');
	const [cardNumber, setCardNumber] = useState('');
	const [expiry, setExpiry] = useState('');
	const [cvc, setCvc] = useState('');
	const [agree, setAgree] = useState(false);

	useEffect(() => {
		async function loadVenue() {
			try {
				if (!venueId) return;

				setLoading(true);
				setError('');

				const data = await fetchVenueById(venueId);
				setVenue(data.data);
			} catch {
				setError('Failed to load checkout details.');
			} finally {
				setLoading(false);
			}
		}

		void loadVenue();
	}, [venueId]);

	const dateFrom = bookingState?.dateFrom || '';
	const dateTo = bookingState?.dateTo || '';
	const guests = bookingState?.guests || 1;

	const nights = useMemo(() => {
		if (!dateFrom || !dateTo) return 0;
		return differenceInCalendarDays(parseISO(dateTo), parseISO(dateFrom));
	}, [dateFrom, dateTo]);

	const cleaningFee = 350;
	const serviceFee = 220;
	const subtotal = venue && nights > 0 ? venue.price * nights : 0;
	const total = nights > 0 ? subtotal + cleaningFee + serviceFee : 0;

	function validateFields() {
		const errors: FieldErrors = {};
		const cleanCardNumber = cardNumber.replace(/\D/g, '');
		const cleanCvc = cvc.replace(/\D/g, '');

		if (cardName.trim().length < 2) {
			errors.name = 'Name must be at least 2 characters.';
		}

		if (!/^\d{12,19}$/.test(cleanCardNumber)) {
			errors.card = 'Card number must contain 12–19 digits.';
		}

		if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry.trim())) {
			errors.expiry = 'Expiry date must use MM/YY format.';
		}

		if (!/^\d{3,4}$/.test(cleanCvc)) {
			errors.cvc = 'CVC must contain 3 or 4 digits.';
		}

		if (!agree) {
			errors.agree = 'You must confirm the demo payment terms.';
		}

		setFieldErrors(errors);
		return Object.keys(errors).length === 0;
	}

	function clearFieldError(field: keyof FieldErrors) {
		setFieldErrors(prev => {
			const next = { ...prev };
			delete next[field];
			return next;
		});
	}

	async function handlePayment() {
		if (!venueId || !venue) return;

		setError('');

		if (!dateFrom || !dateTo || nights <= 0) {
			setError('Missing booking dates. Please go back and select your stay again.');
			return;
		}

		if (!validateFields()) return;

		try {
			setPaying(true);

			await createBooking({
				dateFrom,
				dateTo,
				guests,
				venueId,
			});

			navigate('/my-bookings', {
				state: {
					success: 'Booking confirmed successfully.',
				},
			});
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Payment failed. Please try again.';
			setError(message);
		} finally {
			setPaying(false);
		}
	}

	function formatDate(date: string) {
		if (!date) return 'Not selected';
		return format(parseISO(date), 'dd MMM yyyy');
	}

	if (loading) {
		return (
			<div className='min-h-screen bg-[#f5f5f7] text-[#1f2a5a]'>
				<Navbar />
				<main className='mx-auto max-w-5xl px-6 py-10'>Loading checkout...</main>
			</div>
		);
	}

	if (!venue || !bookingState) {
		return (
			<div className='min-h-screen bg-[#f5f5f7] text-[#1f2a5a]'>
				<Navbar />
				<main className='mx-auto max-w-5xl px-6 py-10'>
					<h1 className='text-2xl font-bold'>Checkout unavailable</h1>
					<p className='mt-2 text-[#1f2a5a]/70'>Please choose dates from the venue page before checkout.</p>
					<Link
						to={venueId ? `/venues/${venueId}` : '/venues'}
						className='mt-5 inline-block rounded-lg bg-[#1f2a5a] px-5 py-3 font-semibold text-white'>
						Back to venue
					</Link>
				</main>
				<Footer />
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-[#f5f5f7] text-[#1f2a5a]'>
			<Navbar />

			<main className='mx-auto grid max-w-6xl gap-8 px-6 py-8 md:grid-cols-[1fr_380px] md:px-10'>
				<section className='rounded-3xl border border-[#d9dbe8] bg-white p-6 shadow-sm'>
					<Link
						to={`/venues/${venue.id}`}
						className='text-sm font-semibold text-[#1f2a5a]/60 hover:text-[#1f2a5a]'>
						← Back to venue
					</Link>

					<h1 className='mt-5 text-3xl font-bold'>Secure checkout</h1>
					<p className='mt-2 text-[#1f2a5a]/65'>Complete your booking details below. This is a demo payment form.</p>

					<div className='mt-6 rounded-2xl bg-[#f2efff] p-4'>
						<p className='text-sm text-[#1f2a5a]/60'>Booking for</p>
						<h2 className='mt-1 text-xl font-bold'>{venue.name}</h2>
						<p className='mt-1 text-sm text-[#1f2a5a]/70'>
							{venue.location?.city || 'Unknown city'}
							{venue.location?.country ? `, ${venue.location.country}` : ''}
						</p>
					</div>

					<div className='mt-6 grid gap-3 md:grid-cols-3'>
						<SummaryBox
							label='Check-in'
							value={formatDate(dateFrom)}
						/>
						<SummaryBox
							label='Check-out'
							value={formatDate(dateTo)}
						/>
						<SummaryBox
							label='Guests'
							value={`${guests}`}
						/>
					</div>

					<div className='mt-8'>
						<h2 className='text-xl font-bold'>Payment details</h2>

						<div className='mt-4 space-y-4'>
							<label className='block'>
								<span className='text-sm font-semibold'>Name on card</span>
								<input
									type='text'
									value={cardName}
									onChange={e => {
										setCardName(e.target.value);
										clearFieldError('name');
									}}
									placeholder='Test User'
									autoComplete='cc-name'
									className={`mt-2 w-full rounded-xl border px-4 py-3 outline-none transition focus:border-[#1f2a5a] ${
										fieldErrors.name ? 'border-red-400 bg-red-50' : 'border-[#d9dbe8]'
									}`}
								/>
								{fieldErrors.name && <p className='mt-1 text-sm text-red-600'>{fieldErrors.name}</p>}
							</label>

							<label className='block'>
								<span className='text-sm font-semibold'>Card number</span>
								<input
									type='text'
									inputMode='numeric'
									value={cardNumber}
									onChange={e => {
										setCardNumber(formatCardNumber(e.target.value));
										clearFieldError('card');
									}}
									placeholder='4242 4242 4242 4242'
									autoComplete='cc-number'
									maxLength={23}
									className={`mt-2 w-full rounded-xl border px-4 py-3 tracking-wide outline-none transition focus:border-[#1f2a5a] ${
										fieldErrors.card ? 'border-red-400 bg-red-50' : 'border-[#d9dbe8]'
									}`}
								/>
								{fieldErrors.card && <p className='mt-1 text-sm text-red-600'>{fieldErrors.card}</p>}
							</label>

							<div className='grid gap-4 md:grid-cols-2'>
								<label className='block'>
									<span className='text-sm font-semibold'>Expiry date</span>
									<input
										type='text'
										inputMode='numeric'
										value={expiry}
										onChange={e => {
											setExpiry(formatExpiry(e.target.value));
											clearFieldError('expiry');
										}}
										placeholder='09/29'
										autoComplete='cc-exp'
										maxLength={5}
										className={`mt-2 w-full rounded-xl border px-4 py-3 outline-none transition focus:border-[#1f2a5a] ${
											fieldErrors.expiry ? 'border-red-400 bg-red-50' : 'border-[#d9dbe8]'
										}`}
									/>
									{fieldErrors.expiry && <p className='mt-1 text-sm text-red-600'>{fieldErrors.expiry}</p>}
								</label>

								<label className='block'>
									<span className='text-sm font-semibold'>CVC</span>
									<input
										type='password'
										inputMode='numeric'
										value={cvc}
										onChange={e => {
											setCvc(formatCvc(e.target.value));
											clearFieldError('cvc');
										}}
										placeholder='123'
										autoComplete='cc-csc'
										maxLength={4}
										className={`mt-2 w-full rounded-xl border px-4 py-3 outline-none transition focus:border-[#1f2a5a] ${
											fieldErrors.cvc ? 'border-red-400 bg-red-50' : 'border-[#d9dbe8]'
										}`}
									/>
									{fieldErrors.cvc && <p className='mt-1 text-sm text-red-600'>{fieldErrors.cvc}</p>}
								</label>
							</div>
						</div>

						<label className='mt-5 flex gap-3 rounded-xl bg-[#f2efff] p-4 text-sm text-[#1f2a5a]/75'>
							<input
								type='checkbox'
								checked={agree}
								onChange={e => {
									setAgree(e.target.checked);
									clearFieldError('agree');
								}}
								className='mt-1'
							/>
							<span>I confirm that this is a demo payment and agree to complete the booking.</span>
						</label>

						{fieldErrors.agree && <p className='mt-2 text-sm text-red-600'>{fieldErrors.agree}</p>}
						{error && <p className='mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600'>{error}</p>}

						<button
							type='button'
							onClick={handlePayment}
							disabled={paying}
							className='mt-6 w-full rounded-xl bg-[#1f2a5a] py-4 font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50'>
							{paying ? 'Processing payment...' : `Pay NOK ${total} and book`}
						</button>

						<p className='mt-3 text-center text-xs text-[#1f2a5a]/50'>Use demo card number: 4242 4242 4242 4242</p>
					</div>
				</section>

				<aside className='h-fit rounded-3xl border border-[#d9dbe8] bg-white p-5 shadow-sm'>
					{venue.media?.[0]?.url && (
						<img
							src={venue.media[0].url}
							alt={venue.media[0].alt || venue.name}
							className='h-48 w-full rounded-2xl object-cover'
						/>
					)}

					<h2 className='mt-4 text-xl font-bold'>{venue.name}</h2>

					<div className='mt-5 space-y-3 border-b border-[#d9dbe8] pb-4 text-sm'>
						<div className='flex justify-between'>
							<span>
								NOK {venue.price} × {nights} nights
							</span>
							<span>NOK {subtotal}</span>
						</div>

						<div className='flex justify-between'>
							<span>Cleaning fee</span>
							<span>NOK {cleaningFee}</span>
						</div>

						<div className='flex justify-between'>
							<span>Service fee</span>
							<span>NOK {serviceFee}</span>
						</div>
					</div>

					<div className='mt-4 flex justify-between text-lg font-bold'>
						<span>Total</span>
						<span>NOK {total}</span>
					</div>

					<p className='mt-4 rounded-xl bg-green-50 px-4 py-3 text-xs font-semibold text-green-700'>
						Your dates were checked on the venue page before checkout.
					</p>
				</aside>
			</main>

			<Footer />
		</div>
	);
}

function SummaryBox({ label, value }: { label: string; value: string }) {
	return (
		<div className='rounded-2xl border border-[#d9dbe8] bg-[#fbfbff] p-4'>
			<p className='text-xs text-[#1f2a5a]/55'>{label}</p>
			<p className='mt-1 font-bold'>{value}</p>
		</div>
	);
}

export default CheckoutPage;
