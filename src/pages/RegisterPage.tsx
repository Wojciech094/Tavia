import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser, loginUser, createApiKey } from '../api/auth';
import { saveAuth } from '../utils/auth';
import Navbar from '../components/layout/Navbar';

export default function RegisterPage() {
	const navigate = useNavigate();

	const [mode, setMode] = useState<'customer' | 'manager'>('customer');
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [acceptTerms, setAcceptTerms] = useState(false);
	const [acceptPrivacy, setAcceptPrivacy] = useState(false);
	const [activeModal, setActiveModal] = useState<'terms' | 'privacy' | null>(null);

async function handleRegister(e: React.FormEvent) {
	e.preventDefault();

	if (!acceptTerms || !acceptPrivacy) {
		setError('You must accept the Terms and Privacy Policy.');
		return;
	}

	const trimmedName = name.trim();
	const trimmedEmail = email.trim().toLowerCase();
	const isVenueManager = mode === 'manager';

	if (!trimmedEmail.endsWith('@stud.noroff.no')) {
		setError('You must use a stud.noroff.no email');
		return;
	}

	try {
		setLoading(true);
		setError('');

		await registerUser({
			name: trimmedName,
			email: trimmedEmail,
			password,
			venueManager: isVenueManager,
		});

		const loginData = await loginUser(trimmedEmail, password);
		const token = loginData.data.accessToken;

		const keyData = await createApiKey(token);
		const apiKey = keyData.data.key;

		const user = {
			...loginData.data,
			name: loginData.data.name || trimmedName,
			email: loginData.data.email || trimmedEmail,
			venueManager: isVenueManager,
		};

		saveAuth(user, token, apiKey);

		navigate('/');
	} catch (err) {
		const message = err instanceof Error ? err.message : 'Registration failed';
		setError(message);
	} finally {
		setLoading(false);
	}
}

	return (
		<div className='min-h-screen bg-[#1f2a5a] text-white'>
			<Navbar />

			<main className='mx-auto grid min-h-[calc(100vh-73px)] max-w-6xl items-center gap-10 px-6 py-12 md:grid-cols-[1fr_430px] md:px-10'>
				<section className='hidden md:block'>
					<h1 className='text-5xl font-bold leading-tight'>Join Tavia and start your journey.</h1>

					<p className='mt-5 max-w-lg text-lg text-white/75'>
						Book amazing stays or host your own venues — all in one place.
					</p>

					<div className='mt-8 grid max-w-lg grid-cols-2 gap-3'>
						<div className='rounded-2xl bg-white/10 p-4'>
							<p className='text-2xl font-bold'>Customer</p>
							<p className='text-sm text-white/65'>Book stays and manage your trips.</p>
						</div>

						<div className='rounded-2xl bg-white/10 p-4'>
							<p className='text-2xl font-bold'>Manager</p>
							<p className='text-sm text-white/65'>Host venues and manage bookings.</p>
						</div>
					</div>
				</section>

				<section className='rounded-3xl bg-white p-6 text-[#1f2a5a] shadow-2xl md:p-8'>
					<h2 className='text-3xl font-bold'>Create account</h2>
					<p className='mt-2 text-sm text-[#1f2a5a]/60'>Choose how you want to use Tavia.</p>

					<div className='mt-5 grid grid-cols-2 gap-3'>
						<button
							type='button'
							onClick={() => setMode('customer')}
							className={`rounded-xl border p-3 text-left transition ${
								mode === 'customer' ? 'border-[#1f2a5a] bg-[#f2efff]' : 'border-[#d9dbe8] hover:bg-[#f5f5f7]'
							}`}>
							<p className='font-semibold'>Customer</p>
							<p className='text-xs text-[#1f2a5a]/60'>Book stays</p>
						</button>

						<button
							type='button'
							onClick={() => setMode('manager')}
							className={`rounded-xl border p-3 text-left transition ${
								mode === 'manager' ? 'border-[#1f2a5a] bg-[#f2efff]' : 'border-[#d9dbe8] hover:bg-[#f5f5f7]'
							}`}>
							<p className='font-semibold'>Venue Manager</p>
							<p className='text-xs text-[#1f2a5a]/60'>Host venues</p>
						</button>
					</div>

					{error && (
						<div className='mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600'>
							{error}
						</div>
					)}

					<form
						onSubmit={handleRegister}
						className='mt-5 space-y-4'>
						<div>
							<label
								htmlFor='register-name'
								className='mb-2 block text-sm font-medium'>
								Name
							</label>

							<input
								id='register-name'
								type='text'
								placeholder='Name'
								value={name}
								onChange={e => setName(e.target.value)}
								required
								className='w-full rounded-xl border border-[#d9dbe8] bg-[#f5f5f7] p-3 outline-none transition focus:border-[#1f2a5a]'
							/>
						</div>

						<div>
							<label
								htmlFor='register-email'
								className='mb-2 block text-sm font-medium'>
								Email
							</label>

							<input
								id='register-email'
								type='email'
								placeholder='you@stud.noroff.no'
								value={email}
								onChange={e => setEmail(e.target.value)}
								required
								className='w-full rounded-xl border border-[#d9dbe8] bg-[#f5f5f7] p-3 outline-none transition focus:border-[#1f2a5a]'
							/>
						</div>

						<div>
							<label
								htmlFor='register-password'
								className='mb-2 block text-sm font-medium'>
								Password
							</label>

							<input
								id='register-password'
								type='password'
								placeholder='Password'
								value={password}
								onChange={e => setPassword(e.target.value)}
								required
								className='w-full rounded-xl border border-[#d9dbe8] bg-[#f5f5f7] p-3 outline-none transition focus:border-[#1f2a5a]'
							/>
						</div>

						<div className='space-y-3 rounded-xl bg-[#f5f5f7] p-4 text-sm'>
							<label className='flex gap-3'>
								<input
									type='checkbox'
									checked={acceptTerms}
									onChange={e => setAcceptTerms(e.target.checked)}
									className='mt-1'
								/>
								<span>
									I agree to the{' '}
									<button
										type='button'
										onClick={() => setActiveModal('terms')}
										className='font-semibold underline'>
										Terms of Service
									</button>
									.
								</span>
							</label>

							<label className='flex gap-3'>
								<input
									type='checkbox'
									checked={acceptPrivacy}
									onChange={e => setAcceptPrivacy(e.target.checked)}
									className='mt-1'
								/>
								<span>
									I agree to the{' '}
									<button
										type='button'
										onClick={() => setActiveModal('privacy')}
										className='font-semibold underline'>
										Privacy Policy
									</button>
									.
								</span>
							</label>
						</div>

						<button
							type='submit'
							disabled={loading || !acceptTerms || !acceptPrivacy}
							className='w-full rounded-xl bg-[#1f2a5a] py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50'>
							{loading ? 'Creating account...' : 'Register'}
						</button>
					</form>

					<p className='mt-6 text-center text-sm text-[#1f2a5a]/60'>
						Already have an account?{' '}
						<Link
							to='/login'
							className='font-semibold text-[#1f2a5a] underline'>
							Log in
						</Link>
					</p>
				</section>
			</main>

			{activeModal && (
				<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6'>
					<div className='max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 text-[#1f2a5a] shadow-2xl'>
						<div className='flex items-start justify-between gap-4'>
							<h2 className='text-2xl font-bold'>{activeModal === 'terms' ? 'Terms of Service' : 'Privacy Policy'}</h2>

							<button
								type='button'
								onClick={() => setActiveModal(null)}
								className='rounded-full bg-[#f5f5f7] px-3 py-1 text-lg transition hover:bg-[#e8e8ee]'>
								x
							</button>
						</div>

						<div className='mt-5 space-y-4 text-sm leading-6 text-[#1f2a5a]/75'>
							{activeModal === 'terms' ? (
								<>
									<p>
										By creating a Tavia account, you agree to use the platform responsibly and provide accurate account
										information.
									</p>
									<p>
										Customers are responsible for reviewing venue details before making bookings. Venue managers are
										responsible for keeping venue information accurate and up to date.
									</p>
									<p>
										Tavia may restrict access to accounts that misuse the service, submit misleading information, or
										violate platform rules.
									</p>
								</>
							) : (
								<>
									<p>
										Tavia stores the information needed to manage your account, including your name, email, role,
										avatar, and booking activity.
									</p>
									<p>
										Your information is used only to provide booking, venue management, and profile functionality within
										the application.
									</p>
									<p>Do not submit sensitive personal information through profile fields or venue descriptions.</p>
								</>
							)}
						</div>

						<button
							type='button'
							onClick={() => setActiveModal(null)}
							className='mt-6 w-full rounded-xl bg-[#1f2a5a] py-3 font-semibold text-white transition hover:opacity-90'>
							I understand
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
