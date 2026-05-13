import { Link } from 'react-router-dom';

export default function Footer() {
	return (
		<footer className='border-t border-[#d9dbe8] bg-[#f5f5f7] text-[#1f2a5a]'>
			<div className='mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10 md:px-10 md:py-12'>
				<div className='flex flex-col gap-8 md:flex-row md:items-start md:justify-between'>
					<div className='max-w-sm'>
						<Link
							to='/'
							className='mb-3 inline-block text-xl font-bold tracking-wide transition hover:text-[#4b5bbd]'>
							Tavia
						</Link>

						<p className='text-sm leading-6 text-[#1f2a5a]/70'>
							Discover handpicked venues for your next escape, across Norway and beyond.
						</p>
					</div>

					<div className='grid grid-cols-2 gap-8 sm:grid-cols-3'>
						<div>
							<h3 className='mb-3 text-sm font-semibold uppercase tracking-wide text-[#1f2a5a]'>Explore</h3>

							<ul className='space-y-2 text-sm text-[#1f2a5a]/70'>
								<li>
									<Link
										to='/venues'
										className='transition hover:text-[#1f2a5a]'>
										Venues
									</Link>
								</li>

								<li>
									<Link
										to='/venues'
										className='transition hover:text-[#1f2a5a]'>
										Destinations
									</Link>
								</li>

								<li>
									<Link
										to='/venues'
										className='transition hover:text-[#1f2a5a]'>
										Popular stays
									</Link>
								</li>
							</ul>
						</div>

						<div>
							<h3 className='mb-3 text-sm font-semibold uppercase tracking-wide text-[#1f2a5a]'>Company</h3>

							<ul className='space-y-2 text-sm text-[#1f2a5a]/70'>
								<li>
									<Link
										to='/about'
										className='transition hover:text-[#1f2a5a]'>
										About
									</Link>
								</li>

								<li>
									<Link
										to='/contact'
										className='transition hover:text-[#1f2a5a]'>
										Contact
									</Link>
								</li>

								<li>
									<Link
										to='/register'
										className='transition hover:text-[#1f2a5a]'>
										Create account
									</Link>
								</li>

								<li>
									<Link
										to='/login'
										className='transition hover:text-[#1f2a5a]'>
										Login
									</Link>
								</li>
							</ul>
						</div>

						<div>
							<h3 className='mb-3 text-sm font-semibold uppercase tracking-wide text-[#1f2a5a]'>Support</h3>

							<ul className='space-y-2 text-sm text-[#1f2a5a]/70'>
								<li>
									<Link
										to='/about'
										className='transition hover:text-[#1f2a5a]'>
										How Tavia works
									</Link>
								</li>

								<li>
									<Link
										to='/profile'
										className='transition hover:text-[#1f2a5a]'>
										My profile
									</Link>
								</li>

								<li>
									<Link
										to='/my-bookings'
										className='transition hover:text-[#1f2a5a]'>
										My bookings
									</Link>
								</li>
							</ul>
						</div>
					</div>
				</div>

				<div className='flex flex-col gap-3 border-t border-[#d9dbe8] pt-5 text-sm text-[#1f2a5a]/60 md:flex-row md:items-center md:justify-between'>
					<p>© 2026 Tavia. All rights reserved.</p>

					<div className='flex gap-4'>
						<a
							href='https://www.instagram.com'
							target='_blank'
							rel='noreferrer'
							className='transition hover:text-[#1f2a5a]'
							aria-label='Visit Instagram'>
							Instagram
						</a>

						<a
							href='https://www.facebook.com'
							target='_blank'
							rel='noreferrer'
							className='transition hover:text-[#1f2a5a]'
							aria-label='Visit Facebook'>
							Facebook
						</a>

						<a
							href='https://x.com'
							target='_blank'
							rel='noreferrer'
							className='transition hover:text-[#1f2a5a]'
							aria-label='Visit X'>
							X
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
}
