import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { fetchVenues } from '../api/venues';
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
	meta?: {
		wifi?: boolean;
		parking?: boolean;
		breakfast?: boolean;
		pets?: boolean;
	};
	location?: {
		city?: string;
		country?: string;
	};
}

export default function VenuesPage() {
	const [venues, setVenues] = useState<Venue[]>([]);
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(true);
	const [loadingMore, setLoadingMore] = useState(false);
	const [hasMore, setHasMore] = useState(true);

	const [searchParams, setSearchParams] = useSearchParams();

	const where = searchParams.get('where') || '';
	const guests = searchParams.get('guests') || '';
	const minPrice = searchParams.get('minPrice') || '';
	const maxPrice = searchParams.get('maxPrice') || '';
	const amenity = searchParams.get('amenity') || '';
	const minRating = searchParams.get('minRating') || '';
	const sort = searchParams.get('sort') || 'recommended';

	const [localWhere, setLocalWhere] = useState(where);
	const [localGuests, setLocalGuests] = useState(guests);

	const loadMoreRef = useRef<HTMLDivElement | null>(null);

	function updateParam(key: string, value: string) {
		const nextParams = new URLSearchParams(searchParams);

		if (value) {
			nextParams.set(key, value);
		} else {
			nextParams.delete(key);
		}

		setSearchParams(nextParams);
	}

	function applySearch() {
		const nextParams = new URLSearchParams(searchParams);

		if (localWhere.trim()) {
			nextParams.set('where', localWhere.trim());
		} else {
			nextParams.delete('where');
		}

		if (localGuests.trim()) {
			nextParams.set('guests', localGuests.trim());
		} else {
			nextParams.delete('guests');
		}

		setSearchParams(nextParams);
	}

	function resetFilters() {
		setLocalWhere('');
		setLocalGuests('');
		setSearchParams({});
	}

	const filteredVenues = useMemo(() => {
		const searchValue = where.toLowerCase().trim();

		const filtered = venues.filter(venue => {
			const venueName = venue.name.toLowerCase();
			const venueDescription = venue.description.toLowerCase();
			const venueCity = venue.location?.city?.toLowerCase() || '';
			const venueCountry = venue.location?.country?.toLowerCase() || '';

			const matchesSearch =
				!searchValue ||
				venueName.includes(searchValue) ||
				venueDescription.includes(searchValue) ||
				venueCity.includes(searchValue) ||
				venueCountry.includes(searchValue);

			const matchesGuests = !guests || venue.maxGuests >= Number(guests);
			const matchesMinPrice = !minPrice || venue.price >= Number(minPrice);
			const matchesMaxPrice = !maxPrice || venue.price <= Number(maxPrice);
			const matchesRating = !minRating || venue.rating >= Number(minRating);

			const matchesAmenity = !amenity || Boolean(venue.meta?.[amenity as keyof NonNullable<Venue['meta']>]);

			return matchesSearch && matchesGuests && matchesMinPrice && matchesMaxPrice && matchesRating && matchesAmenity;
		});

		return [...filtered].sort((a, b) => {
			if (sort === 'price-low') return a.price - b.price;
			if (sort === 'price-high') return b.price - a.price;
			if (sort === 'rating-high') return b.rating - a.rating;
			if (sort === 'guests-high') return b.maxGuests - a.maxGuests;

			return 0;
		});
	}, [venues, where, guests, minPrice, maxPrice, minRating, amenity, sort]);

	const loadMoreVenues = useCallback(async () => {
		if (loadingMore || !hasMore) return;

		try {
			setLoadingMore(true);

			const nextPage = page + 1;
			const data = await fetchVenues(nextPage, 6);

			setVenues(currentVenues => [...currentVenues, ...data.data]);
			setHasMore(!data.meta.isLastPage);
			setPage(nextPage);
		} catch {
			setHasMore(false);
		} finally {
			setLoadingMore(false);
		}
	}, [page, loadingMore, hasMore]);

	useEffect(() => {
		async function initVenues() {
			try {
				setLoading(true);

				const data = await fetchVenues(1, 6);

				setVenues(data.data);
				setHasMore(!data.meta.isLastPage);
				setPage(1);
			} catch {
				setHasMore(false);
			} finally {
				setLoading(false);
			}
		}

		initVenues();
	}, []);

	useEffect(() => {
		const target = loadMoreRef.current;

		if (!target || loading || loadingMore || !hasMore) return;

		const observer = new IntersectionObserver(
			entries => {
				if (entries[0].isIntersecting) {
					loadMoreVenues();
				}
			},
			{ rootMargin: '200px' },
		);

		observer.observe(target);

		return () => observer.disconnect();
	}, [loading, loadingMore, hasMore, loadMoreVenues]);

	return (
		<div className='min-h-screen bg-[#f5f5f7] text-[#1f2a5a]'>
			<Navbar />

			<div className='border-b bg-white px-6 py-4 md:px-10'>
				<div className='mx-auto max-w-6xl space-y-4'>
					<div className='grid gap-3 rounded-4xl bg-[#f1f2f6] p-3 md:grid-cols-[1.3fr_0.7fr_auto] md:items-center'>
						<div className='rounded-2xl bg-white px-4 py-3 md:bg-transparent'>
							<label className='mb-1 block text-xs text-gray-500'>Where</label>
							<input
								type='text'
								value={localWhere}
								onChange={event => setLocalWhere(event.target.value)}
								onKeyDown={event => {
									if (event.key === 'Enter') applySearch();
								}}
								placeholder='Search by name, city or country'
								className='w-full bg-transparent text-sm font-medium outline-none placeholder:text-gray-400'
							/>
						</div>

						<div className='rounded-2xl bg-white px-4 py-3 md:bg-transparent'>
							<label className='mb-1 block text-xs text-gray-500'>Who</label>
							<input
								type='number'
								min='1'
								value={localGuests}
								onChange={event => setLocalGuests(event.target.value)}
								onKeyDown={event => {
									if (event.key === 'Enter') applySearch();
								}}
								placeholder='Add guests'
								className='w-full bg-transparent text-sm font-medium outline-none placeholder:text-gray-400'
							/>
						</div>

						<div className='flex gap-2'>
							<button
								type='button'
								onClick={applySearch}
								className='rounded-full bg-[#1f2a5a] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90'>
								Search
							</button>

							<button
								type='button'
								onClick={resetFilters}
								className='rounded-full border border-[#1f2a5a]/20 bg-white px-6 py-3 text-sm font-semibold text-[#1f2a5a] transition hover:bg-[#f1f2f6]'>
								Reset
							</button>
						</div>
					</div>

					<div className='grid gap-3 md:grid-cols-5'>
						<select
							value={minPrice}
							onChange={event => updateParam('minPrice', event.target.value)}
							className='rounded-full border bg-white px-4 py-2 text-sm text-gray-600 outline-none'>
							<option value=''>Min price</option>
							<option value='500'>NOK 500+</option>
							<option value='1000'>NOK 1000+</option>
							<option value='2000'>NOK 2000+</option>
						</select>

						<select
							value={maxPrice}
							onChange={event => updateParam('maxPrice', event.target.value)}
							className='rounded-full border bg-white px-4 py-2 text-sm text-gray-600 outline-none'>
							<option value=''>Max price</option>
							<option value='1000'>Up to NOK 1000</option>
							<option value='2500'>Up to NOK 2500</option>
							<option value='5000'>Up to NOK 5000</option>
						</select>

						<select
							value={amenity}
							onChange={event => updateParam('amenity', event.target.value)}
							className='rounded-full border bg-white px-4 py-2 text-sm text-gray-600 outline-none'>
							<option value=''>Amenities</option>
							<option value='wifi'>Wifi</option>
							<option value='parking'>Parking</option>
							<option value='breakfast'>Breakfast</option>
							<option value='pets'>Pets</option>
						</select>

						<select
							value={minRating}
							onChange={event => updateParam('minRating', event.target.value)}
							className='rounded-full border bg-white px-4 py-2 text-sm text-gray-600 outline-none'>
							<option value=''>Rating</option>
							<option value='3'>3+ stars</option>
							<option value='4'>4+ stars</option>
							<option value='4.5'>4.5+ stars</option>
						</select>

						<select
							value={sort}
							onChange={event => updateParam('sort', event.target.value)}
							className='rounded-full border bg-white px-4 py-2 text-sm text-gray-600 outline-none'>
							<option value='recommended'>Recommended</option>
							<option value='price-low'>Price: Low to high</option>
							<option value='price-high'>Price: High to low</option>
							<option value='rating-high'>Highest rating</option>
							<option value='guests-high'>Most guests</option>
						</select>
					</div>

					<div className='flex items-center justify-between text-sm text-gray-600'>
						<span>{filteredVenues.length} venues found</span>
						<span>Sort: {sort}</span>
					</div>
				</div>
			</div>

			<main className='mx-auto max-w-6xl px-6 py-10 md:px-10'>
				{loading ? (
					<p>Loading venues...</p>
				) : (
					<>
						{filteredVenues.length === 0 ? (
							<div className='rounded-3xl bg-white p-10 text-center shadow-sm'>
								<h2 className='text-2xl font-bold'>No venues found</h2>
								<p className='mt-2 text-gray-500'>Try changing your search or removing some filters.</p>
								<button
									type='button'
									onClick={resetFilters}
									className='mt-6 rounded-full bg-[#1f2a5a] px-6 py-3 text-sm font-semibold text-white'>
									Clear filters
								</button>
							</div>
						) : (
							<div className='grid min-h-180 gap-6 md:grid-cols-2 xl:grid-cols-3'>
								{filteredVenues.map((venue, index) => {
									const image = venue.media?.[0]?.url;
									const imageAlt = venue.media?.[0]?.alt || venue.name;
									const badge = index === 0 ? 'Trending' : index === 1 ? 'New' : index === 5 ? 'Popular' : '';

									return (
										<Link
											to={`/venues/${venue.id}`}
											key={venue.id}
											className='block overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md'>
											<div className='relative h-56 bg-gray-300'>
												{badge && (
													<span className='absolute left-3 top-3 z-10 rounded-md bg-[#1f2a5a] px-3 py-1 text-xs font-semibold text-white'>
														{badge}
													</span>
												)}

												{image ? (
													<img
														src={image}
														alt={imageAlt}
														className='h-full w-full object-cover'
													/>
												) : (
													<div className='flex h-full items-center justify-center text-sm text-gray-500'>No image</div>
												)}
											</div>

											<div className='space-y-2 p-4'>
												<div className='flex items-start justify-between gap-4'>
													<h3 className='font-semibold'>{venue.name}</h3>
													<span className='whitespace-nowrap font-bold'>NOK {venue.price}</span>
												</div>

												<p className='text-sm text-gray-500'>
													{venue.location?.city || 'Unknown'}
													{venue.location?.country ? `, ${venue.location.country}` : ''}
												</p>

												<p className='text-sm text-gray-500'>
													⭐ {venue.rating} · {venue.maxGuests} guests
												</p>

												<div className='mt-3 w-full rounded-lg bg-[#1f2a5a] py-2 text-center font-medium text-white transition hover:opacity-90'>
													View Details
												</div>
											</div>
										</Link>
									);
								})}
							</div>
						)}

						{hasMore && (
							<div
								ref={loadMoreRef}
								className='mt-10 flex justify-center'>
								{loadingMore && <p className='text-sm text-[#1f2a5a]/60'>Loading more venues...</p>}
							</div>
						)}

						{!hasMore && venues.length > 0 && (
							<p className='mt-10 text-center text-sm text-[#1f2a5a]/60'>You have reached the end.</p>
						)}
					</>
				)}
			</main>

			<Footer />
		</div>
	);
}
