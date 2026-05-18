import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { getUser, logout } from '../../utils/auth';

interface User {
	name: string;
	email: string;
	venueManager?: boolean | string;
	avatar?: {
		url: string;
		alt?: string;
	};
}

export default function Navbar() {
	const navigate = useNavigate();

	const [user, setUser] = useState<User | null>(() => getUser());
	const [menuOpen, setMenuOpen] = useState(false);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	const isVenueManager = user?.venueManager === true || String(user?.venueManager) === 'true';

	useEffect(() => {
		function syncUserFromStorage() {
			setUser(getUser());
		}

		window.addEventListener('storage', syncUserFromStorage);
		window.addEventListener('auth-change', syncUserFromStorage);

		return () => {
			window.removeEventListener('storage', syncUserFromStorage);
			window.removeEventListener('auth-change', syncUserFromStorage);
		};
	}, []);

	function closeMenus() {
		setMenuOpen(false);
		setMobileMenuOpen(false);
	}

	function handleLogout() {
		logout();
		window.dispatchEvent(new Event('auth-change'));

		setUser(null);
		closeMenus();
		navigate('/');
	}

	return (
		<nav className='sticky top-0 z-50 border-b border-white/10 bg-[#16204a]/90 text-white backdrop-blur-md'>
			<div className='flex items-center justify-between px-6 py-4 md:px-10'>
				<Link
					to='/'
					onClick={closeMenus}
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

					<Link
						to='/about'
						className='opacity-80 transition hover:opacity-100'>
						About
					</Link>
				</div>

				<div className='flex items-center gap-3'>
					{user ? (
						<div className='relative'>
							<button
								type='button'
								onClick={() => {
									setMenuOpen(prev => !prev);
									setMobileMenuOpen(false);
								}}
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
											{isVenueManager ? 'Venue Manager' : 'Customer'}
										</p>
									</div>

									<div className='p-2 text-sm'>
										<Link
											to='/profile'
											onClick={closeMenus}
											className='block rounded-xl px-3 py-2 transition hover:bg-[#f5f5f7]'>
											Profile
										</Link>

										<Link
											to='/my-bookings'
											onClick={closeMenus}
											className='block rounded-xl px-3 py-2 transition hover:bg-[#f5f5f7]'>
											My Bookings
										</Link>

										{isVenueManager && (
											<>
												<Link
													to='/manager'
													onClick={closeMenus}
													className='block rounded-xl px-3 py-2 transition hover:bg-[#f5f5f7]'>
													Manager Dashboard
												</Link>

												<Link
													to='/manager/create'
													onClick={closeMenus}
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
						<div className='hidden gap-3 sm:flex'>
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

					<button
						type='button'
						onClick={() => {
							setMobileMenuOpen(prev => !prev);
							setMenuOpen(false);
						}}
						aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
						aria-expanded={mobileMenuOpen}
						className='flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/10 transition hover:bg-white/15 md:hidden'>
						{mobileMenuOpen ? <X className='h-5 w-5' /> : <Menu className='h-5 w-5' />}
					</button>
				</div>
			</div>

			{mobileMenuOpen && (
				<div className='border-t border-white/10 bg-[#16204a] px-6 pb-5 pt-2 md:hidden'>
					<div className='grid gap-2 text-sm font-medium'>
						<Link
							to='/'
							onClick={closeMenus}
							className='rounded-xl px-3 py-3 text-white/85 transition hover:bg-white/10 hover:text-white'>
							Explore
						</Link>

						<Link
							to='/venues'
							onClick={closeMenus}
							className='rounded-xl px-3 py-3 text-white/85 transition hover:bg-white/10 hover:text-white'>
							Venues
						</Link>

						<Link
							to='/about'
							onClick={closeMenus}
							className='rounded-xl px-3 py-3 text-white/85 transition hover:bg-white/10 hover:text-white'>
							About
						</Link>

						{!user && (
							<>
								<div className='my-2 h-px bg-white/10' />

								<Link
									to='/login'
									onClick={closeMenus}
									className='rounded-xl border border-white/20 px-3 py-3 text-center text-white transition hover:bg-white/10'>
									Log in
								</Link>

								<Link
									to='/register'
									onClick={closeMenus}
									className='rounded-xl bg-[#d7c6ff] px-3 py-3 text-center font-semibold text-[#1f2a5a] transition hover:opacity-90'>
									Register
								</Link>
							</>
						)}
					</div>
				</div>
			)}
		</nav>
	);
}
