import { Link } from 'react-router-dom';

export default function Navbar() {
	return (
		<nav className='sticky top-0 z-50 flex items-center justify-between px-6 py-4 md:px-10 bg-[#16204a]/80 text-white backdrop-blur-md border-b border-white/10'>
			<Link
				to='/'
				className='text-xl font-bold tracking-wide'>
				tavia
			</Link>

			<div className='hidden gap-6 text-sm md:flex'>
				<Link
					to='/'
					className='opacity-80 transition hover:opacity-100'>
					Explore
				</Link>
				<Link
					to='/venues'
					className='opacity-80 transition hover:opacity-100'>
					Venues
				</Link>
				<a
					href='#'
					className='opacity-80 transition hover:opacity-100'>
					About
				</a>
			</div>

			<div className='flex gap-3'>
				<button className='rounded-lg border border-white/30 px-4 py-2 text-sm transition hover:bg-white/10'>
					Log in
				</button>

				<button className='rounded-lg bg-[#d7c6ff] px-4 py-2 text-sm font-semibold text-[#1f2a5a] transition hover:opacity-90'>
					Register
				</button>
			</div>
		</nav>
	);
}
