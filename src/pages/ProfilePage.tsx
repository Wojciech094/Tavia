import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { fetchProfile, updateProfile } from '../api/profiles';
import Footer from '../components/layout/Footer';
import Navbar from '../components/layout/Navbar';
import { getApiKey, getToken, getUser, saveAuth } from '../utils/auth';

interface Profile {
	name: string;
	email: string;
	bio?: string;
	avatar?: {
		url: string;
		alt?: string;
	};
	banner?: {
		url: string;
		alt?: string;
	};
	venueManager?: boolean;
	bookings?: unknown[];
	venues?: unknown[];
}

export default function ProfilePage() {
	const [profile, setProfile] = useState<Profile | null>(null);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	const [isEditing, setIsEditing] = useState(false);
	const [bio, setBio] = useState('');
	const [avatarUrl, setAvatarUrl] = useState('');
	const [bannerUrl, setBannerUrl] = useState('');

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
				const loadedProfile = data.data as Profile;

				setProfile(loadedProfile);
				setBio(loadedProfile.bio || '');
				setAvatarUrl(loadedProfile.avatar?.url || '');
				setBannerUrl(loadedProfile.banner?.url || '');
			} catch {
				setError('Failed to load profile.');
			} finally {
				setLoading(false);
			}
		}

		void loadProfile();
	}, []);

	async function handleSaveProfile(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		if (!profile) return;

		try {
			setSaving(true);
			setError('');
			setSuccess('');

			const updated = await updateProfile(profile.name, {
				bio: bio.trim(),
				avatar: avatarUrl.trim()
					? {
							url: avatarUrl.trim(),
							alt: `${profile.name} avatar`,
						}
					: undefined,
				banner: bannerUrl.trim()
					? {
							url: bannerUrl.trim(),
							alt: `${profile.name} banner`,
						}
					: undefined,
			});

			const updatedProfile = updated.data as Profile;

			setProfile(updatedProfile);
			setBio(updatedProfile.bio || '');
			setAvatarUrl(updatedProfile.avatar?.url || '');
			setBannerUrl(updatedProfile.banner?.url || '');
			setSuccess('Profile updated successfully.');
			setIsEditing(false);

			const user = getUser();
			const token = getToken();
			const apiKey = getApiKey();

			if (user && token && apiKey) {
				saveAuth(
					{
						...user,
						avatar: updatedProfile.avatar,
					},
					token,
					apiKey,
				);
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to update profile.');
		} finally {
			setSaving(false);
		}
	}

	async function handleUpgrade() {
		if (!profile) return;

		try {
			setUpgrading(true);
			setError('');
			setSuccess('');

			const updated = await updateProfile(profile.name, {
				venueManager: true,
			});

			const updatedProfile = updated.data as Profile;
			setProfile(updatedProfile);

			const user = getUser();
			const token = getToken();
			const apiKey = getApiKey();

			if (user && token && apiKey) {
				saveAuth({ ...user, venueManager: true }, token, apiKey);
			}

			setSuccess('Account upgraded to Venue Manager.');
			setShowUpgradeModal(false);
		} catch {
			setError('Failed to upgrade account.');
		} finally {
			setUpgrading(false);
		}
	}

	function cancelEdit() {
		if (!profile) return;

		setBio(profile.bio || '');
		setAvatarUrl(profile.avatar?.url || '');
		setBannerUrl(profile.banner?.url || '');
		setIsEditing(false);
		setError('');
		setSuccess('');
	}

	if (loading) {
		return (
			<div className='min-h-screen bg-[#eef1f6] text-[#1f2a5a]'>
				<Navbar />

				<main className='mx-auto grid max-w-6xl gap-6 px-6 py-10 md:grid-cols-[320px_1fr] md:px-10'>
					<div className='h-96 animate-pulse rounded-3xl bg-white' />

					<div className='space-y-4'>
						<div className='h-28 animate-pulse rounded-3xl bg-white' />

						<div className='grid gap-4 md:grid-cols-3'>
							<div className='h-32 animate-pulse rounded-3xl bg-white' />
							<div className='h-32 animate-pulse rounded-3xl bg-white' />
							<div className='h-32 animate-pulse rounded-3xl bg-white' />
						</div>

						<div className='h-64 animate-pulse rounded-3xl bg-white' />
					</div>
				</main>

				<Footer />
			</div>
		);
	}

	if (error && !profile) {
		return (
			<div className='min-h-screen bg-[#eef1f6] text-[#1f2a5a]'>
				<Navbar />

				<main className='mx-auto max-w-6xl px-6 py-10'>
					<p className='rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600'>{error}</p>
				</main>

				<Footer />
			</div>
		);
	}

	if (!profile) return null;

	return (
		<div className='min-h-screen bg-[#eef1f6] text-[#1f2a5a]'>
			<Navbar />

			<main className='mx-auto grid max-w-6xl gap-6 px-6 py-10 md:grid-cols-[320px_1fr] md:px-10'>
				<aside className='h-fit overflow-hidden rounded-3xl bg-[#1f2a5a] text-white shadow-md'>
					<div className='h-32 bg-[#d7c6ff]'>
						{profile.banner?.url ? (
							<img
								src={profile.banner.url}
								alt={profile.banner.alt || `${profile.name} banner`}
								className='h-full w-full object-cover'
							/>
						) : (
							<div className='h-full w-full bg-linear-to-br from-[#d7c6ff] to-[#7b6bd6]' />
						)}
					</div>

					<div className='p-6'>
						<div className='-mt-16 flex items-end gap-4'>
							<div className='h-24 w-24 overflow-hidden rounded-3xl border-4 border-[#1f2a5a] bg-[#d7c6ff]'>
								{profile.avatar?.url ? (
									<img
										src={profile.avatar.url}
										alt={profile.avatar.alt || profile.name}
										className='h-full w-full object-cover'
									/>
								) : (
									<div className='flex h-full w-full items-center justify-center text-4xl font-bold text-[#1f2a5a]'>
										{profile.name.charAt(0).toUpperCase()}
									</div>
								)}
							</div>

							<div className='pb-1'>
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

						<button
							type='button'
							onClick={() => {
								setIsEditing(true);
								setError('');
								setSuccess('');
							}}
							className='mt-5 w-full rounded-xl bg-[#d7c6ff] py-3 font-semibold text-[#1f2a5a] transition hover:opacity-90'>
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
					</div>
				</aside>

				<section className='space-y-6'>
					<div>
						<p className='text-sm font-semibold text-[#1f2a5a]/60'>Account overview</p>
						<h2 className='text-4xl font-bold'>Welcome back, {profile.name}</h2>
					</div>

					{success && (
						<p className='rounded-2xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-700'>{success}</p>
					)}

					{error && <p className='rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600'>{error}</p>}

					{isEditing && (
						<form
							onSubmit={handleSaveProfile}
							className='rounded-3xl bg-white p-6 shadow-sm'>
							<div className='flex flex-col gap-2 md:flex-row md:items-center md:justify-between'>
								<div>
									<h3 className='text-xl font-bold'>Edit profile</h3>
									<p className='mt-1 text-sm text-[#1f2a5a]/60'>Update your bio, avatar and profile banner.</p>
								</div>

								<button
									type='button'
									onClick={cancelEdit}
									className='rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold transition hover:bg-gray-200'>
									Cancel
								</button>
							</div>

							<div className='mt-5 grid gap-4'>
								<div>
									<label className='mb-2 block text-sm font-semibold'>Bio</label>
									<textarea
										value={bio}
										onChange={event => setBio(event.target.value)}
										rows={4}
										placeholder='Tell guests and hosts a little about yourself...'
										className='w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#1f2a5a] focus:ring-4 focus:ring-[#1f2a5a]/10'
									/>
								</div>

								<div>
									<label className='mb-2 block text-sm font-semibold'>Avatar URL</label>
									<input
										value={avatarUrl}
										onChange={event => setAvatarUrl(event.target.value)}
										placeholder='https://example.com/avatar.jpg'
										className='w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#1f2a5a] focus:ring-4 focus:ring-[#1f2a5a]/10'
									/>

									<p className='mt-1 text-xs text-slate-500'>
										Image URL only. File upload is not supported by the API.
									</p>
								</div>

								<div>
									<label className='mb-2 block text-sm font-semibold'>Banner URL</label>
									<input
										value={bannerUrl}
										onChange={event => setBannerUrl(event.target.value)}
										placeholder='https://example.com/banner.jpg'
										className='w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#1f2a5a] focus:ring-4 focus:ring-[#1f2a5a]/10'
									/>
								</div>

								<div className='grid gap-4 md:grid-cols-2'>
									<div className='overflow-hidden rounded-3xl bg-[#f5f5f7]'>
										{avatarUrl.trim() ? (
											<img
												src={avatarUrl}
												alt='Avatar preview'
												className='h-48 w-full object-cover'
											/>
										) : (
											<div className='flex h-48 items-center justify-center text-sm text-slate-400'>Avatar preview</div>
										)}
									</div>

									<div className='overflow-hidden rounded-3xl bg-[#f5f5f7]'>
										{bannerUrl.trim() ? (
											<img
												src={bannerUrl}
												alt='Banner preview'
												className='h-48 w-full object-cover'
											/>
										) : (
											<div className='flex h-48 items-center justify-center text-sm text-slate-400'>Banner preview</div>
										)}
									</div>
								</div>

								<button
									type='submit'
									disabled={saving}
									className='rounded-full bg-[#1f2a5a] px-6 py-4 font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#2f3f7a] disabled:cursor-not-allowed disabled:opacity-60'>
									{saving ? 'Saving...' : 'Save profile'}
								</button>
							</div>
						</form>
					)}

					<div className='grid gap-4 md:grid-cols-3'>
						<div className='rounded-3xl bg-white p-6 shadow-sm'>
							<p className='text-sm text-[#1f2a5a]/60'>Role</p>
							<p className='mt-2 text-2xl font-bold'>{profile.venueManager ? 'Host' : 'Guest'}</p>
						</div>

						<div className='rounded-3xl bg-white p-6 shadow-sm'>
							<p className='text-sm text-[#1f2a5a]/60'>Bookings</p>
							<p className='mt-2 text-2xl font-bold'>{profile.bookings?.length ?? 0}</p>
						</div>

						<div className='rounded-3xl bg-white p-6 shadow-sm'>
							<p className='text-sm text-[#1f2a5a]/60'>Managed venues</p>
							<p className='mt-2 text-2xl font-bold'>
								{profile.venueManager ? (profile.venues?.length ?? 0) : 'Locked'}
							</p>
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
				<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6 backdrop-blur-sm'>
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
								disabled={upgrading}
								className='flex-1 rounded-xl border border-[#d9dbe8] py-2 transition hover:bg-[#f5f5f7] disabled:opacity-50'>
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
