import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { createVenue } from '../api/managerVenues';

const amenities = [
	{ key: 'wifi', label: 'Wifi' },
	{ key: 'parking', label: 'Parking' },
	{ key: 'breakfast', label: 'Breakfast' },
	{ key: 'pets', label: 'Pets allowed' },
] as const;

function isEmpty(value: string) {
	return value.trim().length === 0;
}

export default function CreateVenuePage() {
	const navigate = useNavigate();

	const [form, setForm] = useState({
		name: '',
		description: '',
		price: '',
		maxGuests: '',
		city: '',
		country: '',
		wifi: false,
		parking: false,
		breakfast: false,
		pets: false,
	});

	const [images, setImages] = useState<string[]>(['']);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [acceptTerms, setAcceptTerms] = useState(false);

	function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
		const { name, value, type } = event.target;
		const checked = event.target instanceof HTMLInputElement ? event.target.checked : false;

		setForm(prev => ({
			...prev,
			[name]: type === 'checkbox' ? checked : value,
		}));

		if (error) setError('');
	}

	function updateImage(index: number, value: string) {
		setImages(prev => prev.map((image, imageIndex) => (imageIndex === index ? value : image)));
	}

	function addImageField() {
		setImages(prev => [...prev, '']);
	}

	function removeImageField(index: number) {
		setImages(prev => prev.filter((_, imageIndex) => imageIndex !== index));
	}

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setLoading(true);
		setError('');

		const cleanImages = images.map(image => image.trim()).filter(image => image.length > 0);

		if (isEmpty(form.city) || isEmpty(form.country)) {
			setError('City and country are required before creating a venue.');
			setLoading(false);
			return;
		}

		if (!acceptTerms) {
			setError('You must accept the venue manager terms before creating a venue.');
			setLoading(false);
			return;
		}

		try {
			await createVenue({
				name: form.name.trim(),
				description: form.description.trim(),
				price: Number(form.price),
				maxGuests: Number(form.maxGuests),
				media: cleanImages.map((url, index) => ({
					url,
					alt: `${form.name.trim()} image ${index + 1}`,
				})),
				location: {
					city: form.city.trim(),
					country: form.country.trim(),
				},
				meta: {
					wifi: form.wifi,
					parking: form.parking,
					breakfast: form.breakfast,
					pets: form.pets,
				},
			});

			navigate('/manager');
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Something went wrong.');
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className='flex min-h-screen flex-col bg-[#f5f5f7] text-[#1f2a5a]'>
			<Navbar />

			<main className='mx-auto w-full max-w-5xl flex-1 px-6 py-10 md:px-10'>
				<div className='mb-8'>
					<p className='text-sm font-semibold uppercase tracking-[0.2em] text-[#4f46a5]'>Manager tools</p>
					<h1 className='mt-2 text-4xl font-black'>Create Venue</h1>
					<p className='mt-2 text-slate-500'>Add a new venue with images, details and amenities.</p>
				</div>

				<form
					onSubmit={handleSubmit}
					className='grid gap-6 lg:grid-cols-[1.1fr_0.9fr]'>
					<div className='space-y-5 rounded-4xl bg-white p-6 shadow-sm ring-1 ring-black/5'>
						<div>
							<label
								htmlFor='venue-name'
								className='mb-2 block text-sm font-semibold'>
								Venue name <span className='text-red-500'>*</span>
							</label>
							<input
								id='venue-name'
								name='name'
								value={form.name}
								onChange={handleChange}
								placeholder='Modern cabin near the fjord'
								required
								className='w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#1f2a5a] focus:ring-4 focus:ring-[#1f2a5a]/10'
							/>
						</div>

						<div>
							<label
								htmlFor='venue-description'
								className='mb-2 block text-sm font-semibold'>
								Description <span className='text-red-500'>*</span>
							</label>
							<textarea
								id='venue-description'
								name='description'
								value={form.description}
								onChange={handleChange}
								placeholder='Describe the venue, surroundings and experience...'
								required
								rows={6}
								className='w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#1f2a5a] focus:ring-4 focus:ring-[#1f2a5a]/10'
							/>
						</div>

						<div className='grid gap-4 md:grid-cols-2'>
							<div>
								<label
									htmlFor='venue-price'
									className='mb-2 block text-sm font-semibold'>
									Price per night <span className='text-red-500'>*</span>
								</label>
								<input
									id='venue-price'
									name='price'
									type='number'
									min='1'
									value={form.price}
									onChange={handleChange}
									placeholder='1200'
									required
									className='w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#1f2a5a] focus:ring-4 focus:ring-[#1f2a5a]/10'
								/>
							</div>

							<div>
								<label
									htmlFor='venue-max-guests'
									className='mb-2 block text-sm font-semibold'>
									Max guests <span className='text-red-500'>*</span>
								</label>
								<input
									id='venue-max-guests'
									name='maxGuests'
									type='number'
									min='1'
									value={form.maxGuests}
									onChange={handleChange}
									placeholder='4'
									required
									className='w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#1f2a5a] focus:ring-4 focus:ring-[#1f2a5a]/10'
								/>
							</div>
						</div>

						<div className='grid gap-4 md:grid-cols-2'>
							<div>
								<label
									htmlFor='venue-city'
									className='mb-2 block text-sm font-semibold'>
									City <span className='text-red-500'>*</span>
								</label>
								<input
									id='venue-city'
									name='city'
									value={form.city}
									onChange={handleChange}
									placeholder='Oslo'
									required
									aria-required='true'
									className={`w-full rounded-2xl border px-4 py-3 outline-none transition focus:border-[#1f2a5a] focus:ring-4 focus:ring-[#1f2a5a]/10 ${
										error && isEmpty(form.city) ? 'border-red-300 bg-red-50' : 'border-slate-200'
									}`}
								/>
							</div>

							<div>
								<label
									htmlFor='venue-country'
									className='mb-2 block text-sm font-semibold'>
									Country <span className='text-red-500'>*</span>
								</label>
								<input
									id='venue-country'
									name='country'
									value={form.country}
									onChange={handleChange}
									placeholder='Norway'
									required
									aria-required='true'
									className={`w-full rounded-2xl border px-4 py-3 outline-none transition focus:border-[#1f2a5a] focus:ring-4 focus:ring-[#1f2a5a]/10 ${
										error && isEmpty(form.country) ? 'border-red-300 bg-red-50' : 'border-slate-200'
									}`}
								/>
							</div>
						</div>

						<div>
							<label className='mb-3 block text-sm font-semibold'>Amenities</label>

							<div className='grid gap-3 sm:grid-cols-2'>
								{amenities.map(amenity => {
									const checked = form[amenity.key];

									return (
										<label
											key={amenity.key}
											className={`flex cursor-pointer items-center justify-between rounded-2xl border px-4 py-4 text-sm font-semibold transition ${
												checked
													? 'border-[#1f2a5a] bg-[#1f2a5a] text-white shadow-md'
													: 'border-slate-200 bg-[#f5f5f7] text-[#1f2a5a] hover:border-[#1f2a5a]/40'
											}`}>
											<span>{amenity.label}</span>

											<input
												type='checkbox'
												name={amenity.key}
												checked={checked}
												onChange={handleChange}
												className='h-4 w-4 accent-[#1f2a5a]'
											/>
										</label>
									);
								})}
							</div>
						</div>
					</div>

					<div className='space-y-5'>
						<div className='rounded-4xl bg-white p-6 shadow-sm ring-1 ring-black/5'>
							<div className='mb-4 flex items-center justify-between gap-4'>
								<div>
									<h2 className='text-xl font-bold'>Venue images</h2>
									<p className='text-sm text-slate-500'>Add one or more image URLs.</p>
								</div>

								<button
									type='button'
									onClick={addImageField}
									className='rounded-full bg-[#f2efff] px-4 py-2 text-sm font-semibold text-[#1f2a5a] transition hover:bg-[#e8e0ff]'>
									+ Add
								</button>
							</div>

							<div className='space-y-3'>
								{images.map((image, index) => (
									<div
										key={index}
										className='flex gap-2'>
										<label
											htmlFor={`venue-image-${index}`}
											className='sr-only'>
											Image URL {index + 1}
										</label>

										<input
											id={`venue-image-${index}`}
											value={image}
											onChange={event => updateImage(index, event.target.value)}
											placeholder={`Image URL ${index + 1}`}
											className='w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#1f2a5a] focus:ring-4 focus:ring-[#1f2a5a]/10'
										/>

										{images.length > 1 && (
											<button
												type='button'
												onClick={() => removeImageField(index)}
												className='rounded-2xl bg-red-50 px-4 text-sm font-semibold text-red-600 transition hover:bg-red-100'>
												Remove
											</button>
										)}
									</div>
								))}
							</div>
						</div>

						<div className='rounded-4xl bg-white p-6 shadow-sm ring-1 ring-black/5'>
							<h2 className='mb-4 text-xl font-bold'>Image preview</h2>

							{images.some(image => image.trim()) ? (
								<div className='grid gap-3'>
									{images
										.filter(image => image.trim())
										.map((image, index) => (
											<div
												key={`${image}-${index}`}
												className='overflow-hidden rounded-3xl border border-slate-100 bg-slate-100'>
												<img
													src={image}
													alt={`Preview ${index + 1}`}
													className='h-56 w-full object-cover'
													onError={event => {
														event.currentTarget.style.display = 'none';
													}}
												/>
											</div>
										))}
								</div>
							) : (
								<div className='flex h-56 items-center justify-center rounded-3xl bg-[#f5f5f7] text-sm text-slate-500'>
									Image previews will appear here
								</div>
							)}
						</div>

						<label
							htmlFor='venue-manager-terms'
							className='flex gap-3 rounded-3xl border border-[#d7c6ff] bg-[#f2efff] p-4 text-sm leading-6 text-[#1f2a5a]/75'>
							<input
								id='venue-manager-terms'
								type='checkbox'
								checked={acceptTerms}
								onChange={event => {
									setAcceptTerms(event.target.checked);
									setError('');
								}}
								className='mt-1 h-4 w-4 accent-[#1f2a5a]'
							/>

							<span>
								I agree to manage this venue responsibly. I understand that venues should not be removed within 24 hours
								of an upcoming booking, and that fake or misleading bookings are not allowed.
							</span>
						</label>

						{error && <p className='rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600'>{error}</p>}

						<button
							type='submit'
							disabled={loading || !acceptTerms}
							className='w-full rounded-full bg-[#1f2a5a] px-6 py-4 font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#2f3f7a] disabled:cursor-not-allowed disabled:opacity-60'>
							{loading ? 'Creating...' : 'Create Venue'}
						</button>
					</div>
				</form>
			</main>

			<Footer />
		</div>
	);
}
