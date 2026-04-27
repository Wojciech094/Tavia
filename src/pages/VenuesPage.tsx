import { useCallback, useEffect, useRef, useState } from 'react';
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

	const loadMoreRef = useRef<HTMLDivElement | null>(null);

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
					<div className='flex items-center justify-between rounded-full bg-[#f1f2f6] px-6 py-3'>
						<span className='text-sm text-gray-600'>Where · When · Who</span>
						<button className='rounded-full bg-[#1f2a5a] px-5 py-2 text-white'>→</button>
					</div>

					<div className='flex flex-wrap gap-2'>
						{['All', 'Price', 'Amenities', 'Rating', 'Property Type'].map(filter => (
							<button
								key={filter}
								className='rounded-full border px-4 py-1 text-sm text-gray-600 transition hover:bg-gray-100'>
								{filter}
							</button>
						))}
					</div>

					<div className='flex items-center justify-between text-sm text-gray-600'>
						<span>{venues.length} venues loaded</span>
						<span>Sort: Recommended</span>
					</div>
				</div>
			</div>

			<main className='mx-auto max-w-6xl px-6 py-10 md:px-10'>
				{loading ? (
					<p>Loading venues...</p>
				) : (
					<>
						<div className='grid gap-6 md:grid-cols-2 xl:grid-cols-3'>
							{venues.map((venue, index) => {
								const image = venue.media?.[0]?.url;
								const imageAlt = venue.media?.[0]?.alt || venue.name;
								const badge = index === 0 ? 'Trending' : index === 1 ? 'New' : index === 5 ? 'Popular' : '';

								return (
									<article
										key={venue.id}
										className='overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-md'>
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

											<button className='mt-3 w-full rounded-lg bg-[#1f2a5a] py-2 font-medium text-white transition hover:opacity-90'>
												Book Now
											</button>
										</div>
									</article>
								);
							})}
						</div>

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
