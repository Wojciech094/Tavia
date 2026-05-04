import { Link } from 'react-router-dom';

interface VenueCardProps {
	venue: {
		id: string;
		name: string;
		price: number;
		maxGuests: number;
		rating: number;
		media?: { url: string; alt?: string }[];
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
	};
	badge?: string;
}

export default function VenueCard({ venue, badge }: VenueCardProps) {
	const image = venue.media?.[0]?.url;
	const imageAlt = venue.media?.[0]?.alt || venue.name;

	return (
		<Link
			to={`/venues/${venue.id}`}
			className='group flex h-135 flex-col overflow-hidden rounded-4xl bg-white shadow-[0_18px_45px_rgba(31,42,90,0.08)] ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_25px_70px_rgba(31,42,90,0.18)]'>
			<div className='relative h-72 shrink-0 overflow-hidden'>
				{image ? (
					<img
						src={image}
						alt={imageAlt}
						className='h-full w-full object-cover transition-transform duration-700 group-hover:scale-110'
					/>
				) : (
					<div className='flex h-full items-center justify-center bg-slate-200 text-sm text-slate-500'>No image</div>
				)}

				<div className='absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent' />

				{badge && (
					<span className='absolute left-4 top-4 rounded-full bg-white/95 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-[#1f2a5a] shadow-lg'>
						{badge}
					</span>
				)}

				<span className='absolute right-4 top-4 rounded-full bg-[#1f2a5a] px-4 py-1.5 text-xs font-bold text-white shadow-lg'>
					⭐ {venue.rating || 'New'}
				</span>

				<div className='absolute bottom-4 left-4 right-4'>
					<p className='truncate text-sm font-medium text-white/80'>
						{venue.location?.city || 'Unknown'}
						{venue.location?.country ? `, ${venue.location.country}` : ''}
					</p>

					<h3 className='mt-1 line-clamp-2 text-2xl font-bold leading-tight text-white'>{venue.name}</h3>
				</div>
			</div>

			<div className='flex flex-1 flex-col p-5'>
				<div className='flex items-center justify-between gap-4'>
					<div className='min-w-0'>
						<p className='text-xs font-semibold uppercase tracking-[0.18em] text-slate-400'>From</p>
						<p className='truncate text-2xl font-black text-[#1f2a5a]'>
							NOK {venue.price}
							<span className='text-sm font-medium text-slate-400'> / night</span>
						</p>
					</div>

					<div className='shrink-0 rounded-2xl bg-[#f1f2f6] px-4 py-3 text-center'>
						<p className='text-xl font-black text-[#1f2a5a]'>{venue.maxGuests}</p>
						<p className='text-xs font-medium text-slate-500'>guests</p>
					</div>
				</div>

				<div className='mt-4 flex min-h-17 flex-wrap content-start gap-2 overflow-hidden'>
					{venue.meta?.wifi && <Amenity label='Wifi' />}
					{venue.meta?.parking && <Amenity label='Parking' />}
					{venue.meta?.breakfast && <Amenity label='Breakfast' />}
					{venue.meta?.pets && <Amenity label='Pets' />}

					{!venue.meta?.wifi && !venue.meta?.parking && !venue.meta?.breakfast && !venue.meta?.pets && (
						<Amenity label='Standard stay' />
					)}
				</div>

				<div className='mt-auto flex items-center justify-between border-t border-slate-100 pt-4'>
					<span className='text-sm font-medium text-slate-500'>View full venue</span>

					<span className='flex h-11 w-11 items-center justify-center rounded-full bg-[#1f2a5a] text-lg text-white transition group-hover:translate-x-1 group-hover:bg-[#2f3f7a]'>
						→
					</span>
				</div>
			</div>
		</Link>
	);
}

function Amenity({ label }: { label: string }) {
	return <span className='rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-[#1f2a5a]'>{label}</span>;
}
