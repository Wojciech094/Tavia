import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUser, logout } from '../../utils/auth';

interface User {
	name: string;
	email: string;
	venueManager?: boolean;
	avatar?: {
		url: string;
		alt?: string;
	};
}

export default function Navbar() {
	const navigate = useNavigate();

	
	const [user, setUser] = useState<User | null>(() => getUser());
	const [menuOpen, setMenuOpen] = useState(false);

	function handleLogout() {
		logout();
		setUser(null);
		setMenuOpen(false);
		navigate('/');
	}

	return (
		<nav className='sticky top-0 z-50 flex items-center justify-between border-b border-white/10 bg-[#16204a]/80 px-6 py-4 text-white backdrop-blur-md md:px-10'>
			<Link
				to='/'
				className='flex items-center gap-2'>
				<img
					src='/logoDark.svg'
					alt='tavia logo'
					className='h-8'
				/>
				<span className='text-xl font-bold text-white'>Tavia</span>
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

			{user ? (
				<div className='relative'>
					<button
						type='button'
						onClick={() => setMenuOpen(prev => !prev)}
						className='flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-2 py-2 pr-4 transition hover:bg-white/15'>
						<div className='h-9 w-9 overflow-hidden rounded-full bg-[#d7c6ff]'>
							{user.avatar?.url ? (
								<img
									src={user.avatar.url}
									alt={user.avatar.alt || user.name}
									className='h-full w-full object-cover'
								/>
							) : (
								<div className='flex h-full w-full items-center justify-center font-bold text-[#1f2a5a]'>
									{user.name.charAt(0).toUpperCase()}
								</div>
							)}
						</div>

						<span className='hidden text-sm font-medium sm:block'>{user.name}</span>
					</button>

					{menuOpen && (
						<div className='absolute right-0 mt-3 w-64 overflow-hidden rounded-2xl border border-[#d9dbe8] bg-white text-[#1f2a5a] shadow-2xl'>
							<div className='border-b border-[#d9dbe8] p-4'>
								<p className='font-semibold'>{user.name}</p>
								<p className='truncate text-sm text-[#1f2a5a]/60'>{user.email}</p>

								<p className='mt-2 inline-flex rounded-full bg-[#f2efff] px-3 py-1 text-xs font-medium'>
									{user.venueManager ? 'Venue Manager' : 'Customer'}
								</p>
							</div>

							<div className='p-2 text-sm'>
								<Link
									to='/profile'
									onClick={() => setMenuOpen(false)}
									className='block rounded-xl px-3 py-2 transition hover:bg-[#f5f5f7]'>
									Profile
								</Link>

								<Link
									to='/my-bookings'
									onClick={() => setMenuOpen(false)}
									className='block rounded-xl px-3 py-2 transition hover:bg-[#f5f5f7]'>
									My Bookings
								</Link>

								{user.venueManager && (
									<>
										<Link
											to='/manager'
											onClick={() => setMenuOpen(false)}
											className='block rounded-xl px-3 py-2 transition hover:bg-[#f5f5f7]'>
											Manager Dashboard
										</Link>

										<Link
											to='/manager/create'
											onClick={() => setMenuOpen(false)}
											className='block rounded-xl px-3 py-2 transition hover:bg-[#f5f5f7]'>
											Create Venue
										</Link>
									</>
								)}

								<button
									type='button'
									onClick={handleLogout}
									className='mt-2 w-full rounded-xl px-3 py-2 text-left text-red-600 transition hover:bg-red-50'>
									Logout
								</button>
							</div>
						</div>
					)}
				</div>
			) : (
				<div className='flex gap-3'>
					<Link
						to='/login'
						className='rounded-lg border border-white/30 px-4 py-2 text-sm transition hover:bg-white/10'>
						Log in
					</Link>

					<Link
						to='/register'
						className='rounded-lg bg-[#d7c6ff] px-4 py-2 text-sm font-semibold text-[#1f2a5a] transition hover:opacity-90'>
						Register
					</Link>
				</div>
			)}
		</nav>
	);
}
