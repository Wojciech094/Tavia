import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useSearchParams } from 'react-router-dom';
import { fetchVenues } from '../api/venues';
import Footer from '../components/layout/Footer';
import Navbar from '../components/layout/Navbar';
import { CardGridSkeleton } from '../components/ui/Skeleton';
import VenueCard from '../components/venues/VenueCard';

interface Venue {
	id: string;
	name: string;
	description: string;
	media?: { url: string; alt?: string }[];
	price: number;
	maxGuests: number;
	rating: number;
	created?: string;
	updated?: string;
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

const DEFAULT_LIMIT = 13;
const SEARCH_LIMIT = 100;
const MAX_EMPTY_ATTEMPTS = 3;

const HIDDEN_VENUE_IDS = ['e75a61fe-dbdb-4c6a-9935-8399a003a1b6'];

function cleanVenues(venues: Venue[]) {
	const seen = new Set<string>();

	return venues.filter(venue => {
		if (!venue.id) return false;
		if (HIDDEN_VENUE_IDS.includes(venue.id)) return false;
		if (seen.has(venue.id)) return false;

		seen.add(venue.id);
		return true;
	});
}

function mergeUniqueVenues(currentVenues: Venue[], newVenues: Venue[]) {
	const existingIds = new Set(currentVenues.map(venue => venue.id));
	const uniqueNewVenues = newVenues.filter(venue => !existingIds.has(venue.id));

	return {
		venues: [...currentVenues, ...uniqueNewVenues],
		addedCount: uniqueNewVenues.length,
	};
}

function getCreatedTime(venue: Venue) {
	const createdTime = new Date(venue.created || '').getTime();

	return Number.isNaN(createdTime) ? 0 : createdTime;
}

export default function VenuesPage() {
	const [venues, setVenues] = useState<Venue[]>([]);
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(true);
	const [loadingMore, setLoadingMore] = useState(false);
	const [hasMore, setHasMore] = useState(true);
	const [globalSearchLoading, setGlobalSearchLoading] = useState(false);

	const loadingMoreRef = useRef(false);

	const { ref: loadMoreRef, inView } = useInView({
		rootMargin: '350px 0px',
		threshold: 0,
	});

	const [searchParams, setSearchParams] = useSearchParams();

	const where = searchParams.get('where') || '';
	const guests = searchParams.get('guests') || '';
	const minPrice = searchParams.get('minPrice') || '';
	const maxPrice = searchParams.get('maxPrice') || '';
	const amenity = searchParams.get('amenity') || '';
	const minRating = searchParams.get('minRating') || '';
	const sort = searchParams.get('sort') || '';

	const [localWhere, setLocalWhere] = useState(() => where);
	const [localGuests, setLocalGuests] = useState(() => guests);

	const hasSearchFilters = Boolean(where || guests || minPrice || maxPrice || amenity || minRating || sort);

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
			const venueName = venue.name?.toLowerCase() || '';
			const venueDescription = venue.description?.toLowerCase() || '';
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
			if (sort === 'newest') return getCreatedTime(b) - getCreatedTime(a);
			if (sort === 'oldest') return getCreatedTime(a) - getCreatedTime(b);
			if (sort === 'price-low') return a.price - b.price;
			if (sort === 'price-high') return b.price - a.price;
			if (sort === 'rating-high') return b.rating - a.rating;
			if (sort === 'guests-high') return b.maxGuests - a.maxGuests;

			return 0;
		});
	}, [venues, where, guests, minPrice, maxPrice, minRating, amenity, sort]);

	useEffect(() => {
		if (hasSearchFilters) return;

		let cancelled = false;

		async function loadInitialVenues() {
			try {
				setLoading(true);
				setLoadingMore(false);
				setGlobalSearchLoading(false);
				setHasMore(true);
				loadingMoreRef.current = false;

				const data = await fetchVenues(1, DEFAULT_LIMIT);

				if (cancelled) return;

				setVenues(cleanVenues(data.data));
				setHasMore(!data.meta.isLastPage);
				setPage(1);
			} catch {
				if (!cancelled) {
					setVenues([]);
					setHasMore(false);
				}
			} finally {
				if (!cancelled) {
					setLoading(false);
				}
			}
		}

		void loadInitialVenues();

		return () => {
			cancelled = true;
		};
	}, [hasSearchFilters]);

	useEffect(() => {
		if (!hasSearchFilters) return;

		let cancelled = false;

		async function loadAllVenuesForFilters() {
			try {
				setLoading(true);
				setLoadingMore(false);
				setGlobalSearchLoading(true);
				setHasMore(false);
				loadingMoreRef.current = false;

				let currentPage = 1;
				let allVenues: Venue[] = [];
				let isLastPage = false;

				while (!isLastPage) {
					const data = await fetchVenues(currentPage, SEARCH_LIMIT);

					if (cancelled) return;

					const cleanedVenues = cleanVenues(data.data);
					const merged = mergeUniqueVenues(allVenues, cleanedVenues);

					allVenues = merged.venues;
					isLastPage = data.meta.isLastPage;
					currentPage += 1;
				}

				if (cancelled) return;

				setVenues(allVenues);
				setPage(1);
				setHasMore(false);
			} catch {
				if (!cancelled) {
					setVenues([]);
					setHasMore(false);
				}
			} finally {
				if (!cancelled) {
					setLoading(false);
					setGlobalSearchLoading(false);
				}
			}
		}

		void loadAllVenuesForFilters();

		return () => {
			cancelled = true;
		};
	}, [hasSearchFilters, where, guests, minPrice, maxPrice, amenity, minRating, sort]);

	const loadMoreVenues = useCallback(async () => {
		if (loadingMoreRef.current || loadingMore || !hasMore || hasSearchFilters) return;

		try {
			loadingMoreRef.current = true;
			setLoadingMore(true);

			let nextPage = page + 1;
			let foundNewVenues = false;
			let reachedLastPage = false;
			let attempts = 0;

			while (!foundNewVenues && !reachedLastPage && attempts < MAX_EMPTY_ATTEMPTS) {
				const data = await fetchVenues(nextPage, DEFAULT_LIMIT);
				const cleanedVenues = cleanVenues(data.data);

				setVenues(currentVenues => {
					const merged = mergeUniqueVenues(currentVenues, cleanedVenues);

					if (merged.addedCount > 0) {
						foundNewVenues = true;
					}

					return merged.venues;
				});

				reachedLastPage = data.meta.isLastPage;
				nextPage += 1;
				attempts += 1;
			}

			setPage(nextPage - 1);

			if (reachedLastPage || !foundNewVenues) {
				setHasMore(false);
			}
		} catch {
			setHasMore(false);
		} finally {
			loadingMoreRef.current = false;
			setLoadingMore(false);
		}
	}, [page, loadingMore, hasMore, hasSearchFilters]);

	useEffect(() => {
		if (!inView || loading || loadingMore || !hasMore || hasSearchFilters) return;

		const timeoutId = window.setTimeout(() => {
			void loadMoreVenues();
		}, 0);

		return () => {
			window.clearTimeout(timeoutId);
		};
	}, [inView, loading, loadingMore, hasMore, hasSearchFilters, loadMoreVenues]);

	return (
		<div className='min-h-screen bg-[#f5f5f7] text-[#1f2a5a]'>
			<Navbar />

			<div className='px-6 py-8 md:px-10'>
				<div className='mx-auto max-w-6xl'>
					<div className='mb-10 overflow-hidden rounded-[2.25rem] bg-white p-4 shadow-lg shadow-black/5 ring-1 ring-black/5 md:p-6'>
						<div className='grid gap-3 rounded-4XL bg-[#f1f2f6] p-3 md:grid-cols-[1.3fr_0.7fr_auto] md:items-center md:rounded-full md:p-2 md:pl-5'>
							<div className='rounded-3XL bg-white px-4 py-3 md:bg-transparent md:py-2 md:pr-6'>
								<label
									htmlFor='venues-search-location'
									className='mb-1 block text-xs text-gray-500'>
									Where
								</label>

								<input
									id='venues-search-location'
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

							<div className='rounded-3XL bg-white px-4 py-3 md:bg-transparent md:py-2 md:pl-6 md:pr-6 md:border-l md:border-gray-300'>
								<label
									htmlFor='venues-search-guests'
									className='mb-1 block text-xs text-gray-500'>
									Who
								</label>

								<input
									id='venues-search-guests'
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

							<div className='flex flex-col gap-2 sm:flex-row md:justify-end'>
								<button
									type='button'
									onClick={applySearch}
									disabled={loading}
									className='w-full rounded-full bg-[#1f2a5a] px-7 py-3 text-sm font-bold text-white shadow-md shadow-[#1f2a5a]/15 transition hover:bg-[#2f3f7a] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto'>
									{globalSearchLoading ? 'Searching...' : 'Search'}
								</button>

								<button
									type='button'
									onClick={resetFilters}
									disabled={loading}
									className='w-full rounded-full border border-[#1f2a5a]/15 bg-white px-7 py-3 text-sm font-bold text-[#1f2a5a] shadow-sm transition hover:bg-[#f8f8fb] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto'>
									Reset
								</button>
							</div>
						</div>

						<div className='mt-5 grid gap-3 md:grid-cols-5'>
							<div>
								<label
									htmlFor='filter-min-price'
									className='sr-only'>
									Minimum price
								</label>

								<select
									id='filter-min-price'
									value={minPrice}
									onChange={event => updateParam('minPrice', event.target.value)}
									disabled={loading}
									className='w-full rounded-full border border-[#1f2a5a]/15 bg-white px-4 py-3 text-sm text-gray-600 outline-none transition focus:border-[#1f2a5a] disabled:cursor-not-allowed disabled:opacity-60'>
									<option value=''>Min price</option>
									<option value='500'>NOK 500+</option>
									<option value='1000'>NOK 1000+</option>
									<option value='2000'>NOK 2000+</option>
								</select>
							</div>

							<div>
								<label
									htmlFor='filter-max-price'
									className='sr-only'>
									Maximum price
								</label>

								<select
									id='filter-max-price'
									value={maxPrice}
									onChange={event => updateParam('maxPrice', event.target.value)}
									disabled={loading}
									className='w-full rounded-full border border-[#1f2a5a]/15 bg-white px-4 py-3 text-sm text-gray-600 outline-none transition focus:border-[#1f2a5a] disabled:cursor-not-allowed disabled:opacity-60'>
									<option value=''>Max price</option>
									<option value='1000'>Up to NOK 1000</option>
									<option value='2500'>Up to NOK 2500</option>
									<option value='5000'>Up to NOK 5000</option>
								</select>
							</div>

							<div>
								<label
									htmlFor='filter-amenity'
									className='sr-only'>
									Amenity
								</label>

								<select
									id='filter-amenity'
									value={amenity}
									onChange={event => updateParam('amenity', event.target.value)}
									disabled={loading}
									className='w-full rounded-full border border-[#1f2a5a]/15 bg-white px-4 py-3 text-sm text-gray-600 outline-none transition focus:border-[#1f2a5a] disabled:cursor-not-allowed disabled:opacity-60'>
									<option value=''>Amenities</option>
									<option value='wifi'>Wifi</option>
									<option value='parking'>Parking</option>
									<option value='breakfast'>Breakfast</option>
									<option value='pets'>Pets</option>
								</select>
							</div>

							<div>
								<label
									htmlFor='filter-rating'
									className='sr-only'>
									Minimum rating
								</label>

								<select
									id='filter-rating'
									value={minRating}
									onChange={event => updateParam('minRating', event.target.value)}
									disabled={loading}
									className='w-full rounded-full border border-[#1f2a5a]/15 bg-white px-4 py-3 text-sm text-gray-600 outline-none transition focus:border-[#1f2a5a] disabled:cursor-not-allowed disabled:opacity-60'>
									<option value=''>Rating</option>
									<option value='3'>3+ rating</option>
									<option value='4'>4+ rating</option>
									<option value='4.5'>4.5+ rating</option>
								</select>
							</div>

							<div>
								<label
									htmlFor='filter-sort'
									className='sr-only'>
									Sort venues
								</label>

								<select
									id='filter-sort'
									value={sort}
									onChange={event => updateParam('sort', event.target.value)}
									disabled={loading}
									className='w-full rounded-full border border-[#1f2a5a]/15 bg-white px-4 py-3 text-sm text-gray-600 outline-none transition focus:border-[#1f2a5a] disabled:cursor-not-allowed disabled:opacity-60'>
									<option value=''>Sort by</option>
									<option value='newest'>Newest</option>
									<option value='oldest'>Oldest</option>
									<option value='price-low'>Price: Low to high</option>
									<option value='price-high'>Price: High to low</option>
									<option value='rating-high'>Highest rating</option>
									<option value='guests-high'>Most guests</option>
								</select>
							</div>
						</div>

						<div className='mt-5 flex flex-col gap-1 text-sm text-gray-600 md:flex-row md:items-center md:justify-between'>
							<span>{loading ? 'Loading venues...' : `${filteredVenues.length} venues found`}</span>

							{hasSearchFilters ? (
								<span>{globalSearchLoading ? 'Searching all venues...' : 'Showing results from all API pages'}</span>
							) : (
								<span>{hasMore ? 'Scroll to load more venues' : 'All venues loaded'}</span>
							)}
						</div>
					</div>

					<main>
						{loading ? (
							<CardGridSkeleton />
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
									<div className='grid items-stretch gap-8 md:grid-cols-2 xl:grid-cols-3'>
										{filteredVenues.map((venue, index) => {
											const badge = index === 0 ? 'Trending' : index === 1 ? 'New' : index === 5 ? 'Popular' : '';

											return (
												<VenueCard
													key={venue.id}
													venue={venue}
													badge={badge}
												/>
											);
										})}
									</div>
								)}

								{hasMore && !hasSearchFilters && (
									<div
										ref={loadMoreRef}
										className='mt-10 flex min-h-24 items-center justify-center'>
										{loadingMore && (
											<div className='rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#1f2a5a] shadow-sm ring-1 ring-black/5'>
												Loading more venues...
											</div>
										)}
									</div>
								)}

								{!hasMore && venues.length > 0 && !hasSearchFilters && (
									<p className='mt-10 text-center text-sm text-[#1f2a5a]/60'>You have reached the end.</p>
								)}
							</>
						)}
					</main>
				</div>
			</div>

			<Footer />
		</div>
	);
}
