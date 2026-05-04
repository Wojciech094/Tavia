import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { fetchProfile, updateProfile } from '../api/profiles';
import { getApiKey, getToken, getUser, saveAuth } from '../utils/auth';

interface Profile {
	name: string;
	email: string;
	bio?: string;
	avatar?: {
		url: string;
		alt?: string;
	};
	venueManager?: boolean;
}

export default function ProfilePage() {
	const [profile, setProfile] = useState<Profile | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [showUpgradeModal, setShowUpgradeModal] = useState(false);
	const [upgrading, setUpgrading] = useState(false);

	useEffect(() => {
		async function loadProfile() {
			try {
				const user = getUser();

				if (!user) {
					setError('You must be logged in to view your profile.');
					return;
				}

				const data = await fetchProfile(user.name);
				setProfile(data.data);
			} catch {
				setError('Failed to load profile');
			} finally {
				setLoading(false);
			}
		}

		loadProfile();
	}, []);

	async function handleUpgrade() {
		if (!profile) return;

		try {
			setUpgrading(true);

			const updated = await updateProfile(profile.name, {
				venueManager: true,
			});

			setProfile(updated.data);

			const user = getUser();
			const token = getToken();
			const apiKey = getApiKey();

			if (user && token && apiKey) {
				saveAuth({ ...user, venueManager: true }, token, apiKey);
			}

			setShowUpgradeModal(false);
		} catch {
			alert('Failed to upgrade account');
		} finally {
			setUpgrading(false);
		}
	}

	if (loading) {
		return (
			<div className='min-h-screen bg-[#eef1f6] text-[#1f2a5a]'>
				<Navbar />
				<main className='mx-auto max-w-6xl px-6 py-10'>Loading profile...</main>
			</div>
		);
	}

	if (error || !profile) {
		return (
			<div className='min-h-screen bg-[#eef1f6] text-[#1f2a5a]'>
				<Navbar />
				<main className='mx-auto max-w-6xl px-6 py-10'>
					<p className='text-red-600'>{error || 'Profile not found.'}</p>
				</main>
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-[#eef1f6] text-[#1f2a5a]'>
			<Navbar />

			<main className='mx-auto grid max-w-6xl gap-6 px-6 py-10 md:grid-cols-[320px_1fr] md:px-10'>
				<aside className='h-fit rounded-3xl bg-[#1f2a5a] p-6 text-white shadow-md'>
					<div className='flex items-center gap-4'>
						<div className='h-20 w-20 overflow-hidden rounded-2xl bg-[#d7c6ff]'>
							{profile.avatar?.url ? (
								<img
									src={profile.avatar.url}
									alt={profile.avatar.alt || profile.name}
									className='h-full w-full object-cover'
								/>
							) : (
								<div className='flex h-full w-full items-center justify-center text-3xl font-bold text-[#1f2a5a]'>
									{profile.name.charAt(0).toUpperCase()}
								</div>
							)}
						</div>

						<div>
							<h1 className='text-2xl font-bold'>{profile.name}</h1>
							<p className='text-sm text-white/65'>{profile.email}</p>
						</div>
					</div>

					<div className='mt-6 rounded-2xl bg-white/10 p-4'>
						<p className='text-xs uppercase tracking-wide text-white/50'>Account type</p>
						<p className='mt-1 text-lg font-bold'>{profile.venueManager ? 'Venue Manager' : 'Customer'}</p>
					</div>

					<div className='mt-4 rounded-2xl bg-white/10 p-4'>
						<p className='text-xs uppercase tracking-wide text-white/50'>Bio</p>
						<p className='mt-2 text-sm leading-6 text-white/75'>
							{profile.bio || 'No bio yet. Add a short introduction to personalize your account.'}
						</p>
					</div>

					<button className='mt-5 w-full rounded-xl bg-[#d7c6ff] py-3 font-semibold text-[#1f2a5a] transition hover:opacity-90'>
						Edit Profile
					</button>

					{!profile.venueManager && (
						<button
							type='button'
							onClick={() => setShowUpgradeModal(true)}
							className='mt-3 w-full rounded-xl border border-white/25 py-3 font-semibold transition hover:bg-white/10'>
							Become a Venue Manager
						</button>
					)}
				</aside>

				<section className='space-y-6'>
					<div>
						<p className='text-sm font-semibold text-[#1f2a5a]/60'>Account overview</p>
						<h2 className='text-4xl font-bold'>Welcome back, {profile.name}</h2>
					</div>

					<div className='grid gap-4 md:grid-cols-3'>
						<div className='rounded-3xl bg-white p-6 shadow-sm'>
							<p className='text-sm text-[#1f2a5a]/60'>Role</p>
							<p className='mt-2 text-2xl font-bold'>{profile.venueManager ? 'Host' : 'Guest'}</p>
						</div>

						<div className='rounded-3xl bg-white p-6 shadow-sm'>
							<p className='text-sm text-[#1f2a5a]/60'>Bookings</p>
							<p className='mt-2 text-2xl font-bold'>Coming soon</p>
						</div>

						<div className='rounded-3xl bg-white p-6 shadow-sm'>
							<p className='text-sm text-[#1f2a5a]/60'>Managed venues</p>
							<p className='mt-2 text-2xl font-bold'>{profile.venueManager ? 'Available' : 'Locked'}</p>
						</div>
					</div>

					<div className={`grid gap-4 ${profile.venueManager ? 'md:grid-cols-2' : 'md:grid-cols-1'}`}>
						<div className='rounded-3xl bg-white p-6 shadow-sm'>
							<h3 className='text-xl font-bold'>Travel tools</h3>
							<p className='mt-2 text-sm text-[#1f2a5a]/60'>
								Manage your bookings and continue planning your next stay.
							</p>

							<div className='mt-5 space-y-3'>
								<Link
									to='/my-bookings'
									className='flex items-center justify-between rounded-2xl bg-[#1f2a5a] px-5 py-4 font-semibold text-white transition hover:opacity-90'>
									<span>My bookings</span>
									<span>→</span>
								</Link>
								<Link
									to='/venues'
									className='flex items-center justify-between rounded-2xl border border-[#d9dbe8] px-5 py-4 font-semibold transition hover:bg-[#f5f5f7]'>
									<span>Browse venues</span>
									<span>→</span>
								</Link>
							</div>
						</div>

						{profile.venueManager && (
							<div className='rounded-3xl bg-white p-6 shadow-sm'>
								<h3 className='text-xl font-bold'>Manager tools</h3>
								<p className='mt-2 text-sm text-[#1f2a5a]/60'>
									Host venues, manage bookings, and keep your listings up to date.
								</p>

								<div className='mt-5 space-y-3'>
									<Link
										to='/manager'
										className='block w-full rounded-2xl bg-[#f2efff] px-4 py-4 text-left font-semibold transition hover:bg-[#e8e0ff]'>
										Manager dashboard
									</Link>
									<Link
										to='/manager/create'
										className='block w-full rounded-2xl bg-[#f2efff] px-4 py-4 text-left font-semibold transition hover:bg-[#e8e0ff]'>
										Create venue
									</Link>
								</div>
							</div>
						)}
					</div>

					<div className='rounded-3xl bg-white p-6 shadow-sm'>
						<h3 className='text-xl font-bold'>Account status</h3>
						<p className='mt-2 text-sm text-[#1f2a5a]/60'>
							Your account is active and connected to the Tavia booking platform.
						</p>
					</div>
				</section>
			</main>

			{showUpgradeModal && (
				<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6'>
					<div className='w-full max-w-md rounded-2xl bg-white p-6 text-[#1f2a5a] shadow-2xl'>
						<h2 className='text-xl font-bold'>Become a Venue Manager</h2>
						<p className='mt-3 text-sm text-[#1f2a5a]/70'>You are about to upgrade your account to a Venue Manager.</p>
						<p className='mt-2 text-sm font-semibold text-red-600'>This action cannot be undone.</p>
						<p className='mt-2 text-sm text-[#1f2a5a]/70'>
							You will be able to create and manage venues after upgrading.
						</p>

						<div className='mt-6 flex gap-3'>
							<button
								type='button'
								onClick={() => setShowUpgradeModal(false)}
								className='flex-1 rounded-xl border border-[#d9dbe8] py-2 transition hover:bg-[#f5f5f7]'>
								Cancel
							</button>

							<button
								type='button'
								onClick={handleUpgrade}
								disabled={upgrading}
								className='flex-1 rounded-xl bg-[#1f2a5a] py-2 text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50'>
								{upgrading ? 'Upgrading...' : 'Confirm'}
							</button>
						</div>
					</div>
				</div>
			)}

			<Footer />
		</div>
	);
}
