import { memo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Car, Coffee, MapPin, PawPrint, Star, Users, Wifi } from 'lucide-react';

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

const BLOCKED_IMAGE_DOMAINS = [
	'bing.com',
	'th.bing.com',
	'reddit.com',
	'i.redd.it',
	'm-boe.com',
	'platform.polygon.com',
	'sciencenews.org',
	'usatoday.com',
	'trvl-media.com',
	'realtor.ca',
	'cdn.realtor.ca',
	'uniktur.com',
	'io.wp.com',
	'wp.com',
];

function isSafeImageUrl(url?: string) {
	if (!url) return false;

	try {
		const parsedUrl = new URL(url);
		const hostname = parsedUrl.hostname.toLowerCase();

		if (parsedUrl.protocol !== 'https:') return false;

		return !BLOCKED_IMAGE_DOMAINS.some(domain => hostname.includes(domain));
	} catch {
		return false;
	}
}

function getSafeImage(media?: { url: string; alt?: string }[]) {
	if (!media || media.length === 0) return null;

	return media.find(image => isSafeImageUrl(image.url)) || null;
}

function VenueCard({ venue, badge }: VenueCardProps) {
	const safeImage = getSafeImage(venue.media);
	const image = safeImage?.url;
	const imageAlt = safeImage?.alt || venue.name;

	const hasRating = typeof venue.rating === 'number' && venue.rating > 0;
	const ratingText = hasRating ? venue.rating.toFixed(1) : 'No reviews yet';

	const locationText = `${venue.location?.city || 'Unknown'}${
		venue.location?.country ? `, ${venue.location.country}` : ''
	}`;

	const amenities = [
		venue.meta?.wifi && { label: 'Wifi', icon: Wifi },
		venue.meta?.parking && { label: 'Parking', icon: Car },
		venue.meta?.breakfast && { label: 'Breakfast', icon: Coffee },
		venue.meta?.pets && { label: 'Pets', icon: PawPrint },
	].filter(Boolean) as { label: string; icon: typeof Wifi }[];

	return (
		<Link
			to={`/venues/${venue.id}`}
			className='group flex h-full flex-col overflow-hidden rounded-4xl bg-white shadow-[0_18px_45px_rgba(31,42,90,0.08)] ring-1 ring-black/5 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_80px_rgba(31,42,90,0.18)]'>
			<div className='relative h-72 shrink-0 overflow-hidden bg-slate-200'>
				{image ? (
					<img
						src={image}
						alt={imageAlt}
						loading='lazy'
						decoding='async'
						referrerPolicy='no-referrer'
						className='h-full w-full object-cover transition duration-700 group-hover:scale-110'
					/>
				) : (
					<div className='relative flex h-full items-center justify-center overflow-hidden bg-linear-to-br from-slate-200 via-slate-300 to-slate-400'>
						<div className='absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.55),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.35),transparent_28%)]' />

						<div className='relative text-center'>
							<p className='text-sm font-bold text-slate-600'>No image available</p>
						</div>
					</div>
				)}

				<div className='absolute inset-0 bg-linear-to-t from-black/90 via-black/35 to-black/5' />

				<div className='absolute left-4 right-4 top-4 flex items-center justify-between gap-3'>
					{badge ? (
						<span className='rounded-full bg-white/95 px-4 py-1.5 text-xs font-black uppercase tracking-wide text-[#1f2a5a] shadow-lg backdrop-blur'>
							{badge}
						</span>
					) : (
						<span />
					)}

					{hasRating ? (
						<span className='inline-flex shrink-0 items-center gap-1.5 rounded-full bg-black/35 px-3 py-1.5 text-xs font-bold text-white ring-1 ring-white/20 backdrop-blur-md'>
							<Star className='h-3.5 w-3.5 fill-yellow-400 text-yellow-400' />
							{ratingText}
						</span>
					) : (
						<span className='inline-flex shrink-0 items-center rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-[#1f2a5a] ring-1 ring-white/30 backdrop-blur-md'>
							{ratingText}
						</span>
					)}
				</div>

				<div className='absolute bottom-4 left-4 right-4 rounded-3xl bg-white/10 p-4 ring-1 ring-white/15 backdrop-blur-md'>
					<h3 className='line-clamp-2 text-2xl font-black leading-tight text-white drop-shadow'>{venue.name}</h3>

					<div className='mt-3 flex min-w-0 flex-nowrap items-center gap-3 overflow-hidden text-sm font-semibold text-white/95'>
						<span className='inline-flex min-w-0 flex-1 items-center gap-1.5 overflow-hidden whitespace-nowrap'>
							<MapPin className='h-4 w-4 shrink-0 text-white/75' />
							<span className='truncate'>{locationText}</span>
						</span>

						<span className='inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap'>
							<Users className='h-4 w-4 shrink-0 text-white/75' />
							<span>{venue.maxGuests} guests</span>
						</span>
					</div>
				</div>
			</div>

			<div className='flex flex-1 flex-col p-5'>
				<div className='flex items-end justify-between gap-4 rounded-3xl bg-[#f8f9fc] px-4 py-4 ring-1 ring-slate-100'>
					<div>
						<p className='text-[10px] font-black uppercase tracking-[0.2em] text-slate-400'>From</p>
						<p className='mt-1 text-2xl font-black text-[#1f2a5a]'>NOK {venue.price}</p>
					</div>

					<p className='pb-1 text-sm font-semibold text-slate-400'>/ night</p>
				</div>

				<div className='mt-4 flex min-h-18 flex-wrap content-start gap-2'>
					{amenities.length > 0 ? (
						amenities.slice(0, 4).map(amenity => {
							const Icon = amenity.icon;

							return (
								<span
									key={amenity.label}
									className='inline-flex h-fit items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-[#1f2a5a] ring-1 ring-blue-100'>
									<Icon className='h-3.5 w-3.5' />
									{amenity.label}
								</span>
							);
						})
					) : (
						<span className='h-fit rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-500 ring-1 ring-slate-200'>
							Standard stay
						</span>
					)}
				</div>

				<div className='mt-auto pt-5'>
					<div className='flex items-center justify-between rounded-3xl border border-slate-100 bg-white px-4 py-3 transition duration-300 group-hover:border-[#1f2a5a]/20 group-hover:bg-[#f8f9fc]'>
						<div>
							<span className='block text-sm font-black text-[#1f2a5a]'>View full venue</span>
							<span className='text-xs font-semibold text-slate-400'>Check availability and details</span>
						</div>

						<div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#1f2a5a] text-white shadow-lg transition duration-300 group-hover:translate-x-1 group-hover:bg-[#2f3f7a]'>
							<ArrowRight className='h-5 w-5' />
						</div>
					</div>
				</div>
			</div>
		</Link>
	);
}

export default memo(VenueCard);
