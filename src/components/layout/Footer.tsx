export default function Footer() {
	return (
		<footer className='border-t border-[#d9dbe8] bg-[#f5f5f7] text-[#1f2a5a]'>
			<div className='mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10 md:px-10 md:py-12'>
				<div className='flex flex-col gap-8 md:flex-row md:items-start md:justify-between'>
					<div className='max-w-sm'>
						<div className='mb-3 text-xl font-bold tracking-wide'>tavia</div>
						<p className='text-sm leading-6 text-[#1f2a5a]/70'>
							Discover handpicked venues for your next escape, across Norway and beyond.
						</p>
					</div>

					<div className='grid grid-cols-2 gap-8 sm:grid-cols-3'>
						<div>
							<h3 className='mb-3 text-sm font-semibold uppercase tracking-wide text-[#1f2a5a]'>Explore</h3>
							<ul className='space-y-2 text-sm text-[#1f2a5a]/70'>
								<li>
									<a
										href='#'
										className='transition hover:text-[#1f2a5a]'>
										Venues
									</a>
								</li>
								<li>
									<a
										href='#'
										className='transition hover:text-[#1f2a5a]'>
										Destinations
									</a>
								</li>
								<li>
									<a
										href='#'
										className='transition hover:text-[#1f2a5a]'>
										Popular stays
									</a>
								</li>
							</ul>
						</div>

						<div>
							<h3 className='mb-3 text-sm font-semibold uppercase tracking-wide text-[#1f2a5a]'>Company</h3>
							<ul className='space-y-2 text-sm text-[#1f2a5a]/70'>
								<li>
									<a
										href='#'
										className='transition hover:text-[#1f2a5a]'>
										About
									</a>
								</li>
								<li>
									<a
										href='#'
										className='transition hover:text-[#1f2a5a]'>
										Contact
									</a>
								</li>
								<li>
									<a
										href='#'
										className='transition hover:text-[#1f2a5a]'>
										Careers
									</a>
								</li>
							</ul>
						</div>

						<div>
							<h3 className='mb-3 text-sm font-semibold uppercase tracking-wide text-[#1f2a5a]'>Support</h3>
							<ul className='space-y-2 text-sm text-[#1f2a5a]/70'>
								<li>
									<a
										href='#'
										className='transition hover:text-[#1f2a5a]'>
										Help Center
									</a>
								</li>
								<li>
									<a
										href='#'
										className='transition hover:text-[#1f2a5a]'>
										Terms
									</a>
								</li>
								<li>
									<a
										href='#'
										className='transition hover:text-[#1f2a5a]'>
										Privacy
									</a>
								</li>
							</ul>
						</div>
					</div>
				</div>

				<div className='flex flex-col gap-3 border-t border-[#d9dbe8] pt-5 text-sm text-[#1f2a5a]/60 md:flex-row md:items-center md:justify-between'>
					<p>© 2026 Tavia. All rights reserved.</p>
					<div className='flex gap-4'>
						<a
							href='#'
							className='transition hover:text-[#1f2a5a]'>
							Instagram
						</a>
						<a
							href='#'
							className='transition hover:text-[#1f2a5a]'>
							Facebook
						</a>
						<a
							href='#'
							className='transition hover:text-[#1f2a5a]'>
							X
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
}
