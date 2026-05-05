export function PageSkeleton() {
	return (
		<div className='mx-auto max-w-6xl px-6 py-10 md:px-10'>
			<div className='animate-pulse space-y-6'>
				<div className='h-8 w-48 rounded-xl bg-[#d9dbe8]' />
				<div className='h-80 rounded-3xl bg-[#d9dbe8]' />
				<div className='grid gap-4 md:grid-cols-3'>
					<div className='h-32 rounded-2xl bg-[#d9dbe8]' />
					<div className='h-32 rounded-2xl bg-[#d9dbe8]' />
					<div className='h-32 rounded-2xl bg-[#d9dbe8]' />
				</div>
			</div>
		</div>
	);
}

export function CardGridSkeleton() {
	return (
		<div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
			{Array.from({ length: 6 }).map((_, index) => (
				<div
					key={index}
					className='animate-pulse rounded-3xl border border-[#d9dbe8] bg-white p-4 shadow-sm'>
					<div className='h-48 rounded-2xl bg-[#d9dbe8]' />
					<div className='mt-4 h-5 w-3/4 rounded bg-[#d9dbe8]' />
					<div className='mt-3 h-4 w-1/2 rounded bg-[#d9dbe8]' />
					<div className='mt-5 h-10 rounded-xl bg-[#d9dbe8]' />
				</div>
			))}
		</div>
	);
}
