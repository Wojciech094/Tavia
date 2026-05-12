import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchVenues } from '../api/venues';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import VenueCard from '../components/venues/VenueCard';

// Temporary safeguard: one venue returned by the API contains malformed or heavy data
// that can cause performance issues on the details page (UI freeze).
// To ensure a smooth and stable user experience, known problematic entries are filtered out.
// This is a defensive approach when working with unreliable external API data.
const HIDDEN_VENUE_IDS = ['e75a61fe-dbdb-4c6a-9935-8399a003a1b6'];

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

export default function HomePage() {
	const [venues, setVenues] = useState<Venue[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	const [where, setWhere] = useState('');
	const [guests, setGuests] = useState('');

	const navigate = useNavigate();

	useEffect(() => {
		let cancelled = false;

		async function loadVenues() {
			try {
				setLoading(true);
				setError('');

				const data = await fetchVenues(1, 12);

				if (cancelled) return;

				setVenues(data.data);
			} catch {
				if (!cancelled) {
					setError('Failed to load venues.');
				}
			} finally {
				if (!cancelled) {
					setLoading(false);
				}
			}
		}

		void loadVenues();

		return () => {
			cancelled = true;
		};
	}, []);

	const featuredVenues = useMemo(() => {
		return venues
			.filter(venue => !HIDDEN_VENUE_IDS.includes(venue.id))
			.sort((a, b) => new Date(b.created || '').getTime() - new Date(a.created || '').getTime())
			.slice(0, 6);
	}, [venues]);

	function handleSearch() {
		const params = new URLSearchParams();

		if (where.trim()) params.set('where', where.trim());
		if (guests.trim()) params.set('guests', guests.trim());

		navigate(`/venues?${params.toString()}`);
	}

	return (
		<div className='min-h-screen bg-[#1f2a5a] text-white'>
			<Navbar />

			<main>
				<section className='mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-20'>
					<div className='max-w-4xl'>
						<h1 className='mb-6 text-4xl font-bold leading-tight md:text-6xl'>Find your perfect stay.</h1>

						<p className='mb-6 max-w-2xl text-base text-white/80 md:text-2xl'>
							Discover handpicked venues for your next escape, across Norway and beyond.
						</p>

						<div className='mb-6 inline-flex items-center rounded-full bg-[#d7c6ff] px-4 py-2 text-sm font-medium text-[#1f2a5a]'>
							Trusted by 40,000+ guests
						</div>

						<div className='flex flex-col gap-3 rounded-4xl bg-white p-3 text-black shadow-lg md:flex-row md:items-center'>
							<div className='flex-1 rounded-2xl px-4 py-3'>
								<p className='mb-1 text-xs text-gray-500'>Where</p>
								<input
									type='text'
									value={where}
									onChange={event => setWhere(event.target.value)}
									onKeyDown={event => {
										if (event.key === 'Enter') handleSearch();
									}}
									placeholder='Enter location'
									className='w-full bg-transparent text-sm font-medium outline-none placeholder:text-gray-400'
								/>
							</div>

							<div className='hidden h-10 w-px bg-gray-200 md:block' />

							

							<div className='hidden h-10 w-px bg-gray-200 md:block' />

							<div className='flex-1 rounded-2xl px-4 py-3'>
								<p className='mb-1 text-xs text-gray-500'>Who</p>
								<input
									type='number'
									min='1'
									value={guests}
									onChange={event => setGuests(event.target.value)}
									onKeyDown={event => {
										if (event.key === 'Enter') handleSearch();
									}}
									placeholder='Add guests'
									className='w-full bg-transparent text-sm font-medium outline-none placeholder:text-gray-400'
								/>
							</div>

							<button
								type='button'
								onClick={handleSearch}
								className='rounded-full bg-[#1f2a5a] px-8 py-4 font-medium text-white transition hover:opacity-90'>
								Search
							</button>
						</div>
					</div>
				</section>

				<section className='bg-[#f5f5f7] px-6 py-14 text-black md:px-10'>
					<div className='mx-auto max-w-6xl'>
						<h2 className='text-3xl font-bold text-[#1f2a5a]'>Featured Venues</h2>
						<p className='mb-8 mt-1 text-gray-600'>Newest places you will love</p>

						{loading && <p className='text-gray-600'>Loading venues...</p>}

						{error && <p className='text-red-600'>{error}</p>}

						{!loading && !error && (
							<div className='grid gap-8 md:grid-cols-2 xl:grid-cols-3'>
								{featuredVenues.map((venue, index) => {
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
					</div>
				</section>
			</main>

			<Footer />
		</div>
	);
}
