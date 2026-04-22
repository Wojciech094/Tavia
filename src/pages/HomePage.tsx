import { useEffect, useState } from 'react';
import { fetchVenues } from '../api/venues';

interface Venue {
	id: string;
	name: string;
	description: string;
}

export default function HomePage() {
	const [venues, setVenues] = useState<Venue[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		async function load() {
			try {
				const data = await fetchVenues();
				setVenues(data.data);
			} catch {
				setError('API error');
			} finally {
				setLoading(false);
			}
		}

		load();
	}, []);

	if (loading) return <p className='p-10 text-white'>Loading...</p>;
	if (error) return <p className='p-10 text-red-500'>{error}</p>;

	return (
		<main className='min-h-screen bg-black p-6 text-white'>
			<h1 className='mb-6 text-3xl'>Tavia</h1>

			<div className='grid gap-4'>
				{venues.slice(0, 5).map(venue => (
					<div
						key={venue.id}
						className='rounded border p-4'>
						<h2 className='text-xl'>{venue.name}</h2>
						<p className='text-sm opacity-70'>{venue.description}</p>
					</div>
				))}
			</div>
		</main>
	);
}
