import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createApiKey, loginUser } from '../api/auth';
import Navbar from '../components/layout/Navbar';
import { saveAuth } from '../utils/auth';

export default function LoginPage() {
	const navigate = useNavigate();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	async function handleLogin(e: React.FormEvent) {
		e.preventDefault();

		try {
			setLoading(true);
			setError('');

			const loginData = await loginUser(email, password);
			const user = loginData.data;
			const token = loginData.data.accessToken;

			const keyData = await createApiKey(token);
			const apiKey = keyData.data.key;

			saveAuth(user, token, apiKey);
			navigate('/');
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Login failed';
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
					<p className='mb-4 inline-flex rounded-full bg-[#d7c6ff] px-4 py-2 text-sm font-medium text-[#1f2a5a]'>
						Welcome back
					</p>

					<h1 className='max-w-xl text-5xl font-bold leading-tight'>Continue your next stay with Tavia.</h1>

					<p className='mt-5 max-w-lg text-lg text-white/75'>
						Manage bookings, discover handpicked venues, and continue planning your next escape.
					</p>

					<div className='mt-8 grid max-w-lg grid-cols-3 gap-3'>
						<div className='rounded-2xl bg-white/10 p-4'>
							<p className='text-2xl font-bold'>40k+</p>
							<p className='text-sm text-white/65'>guests</p>
						</div>
						<div className='rounded-2xl bg-white/10 p-4'>
							<p className='text-2xl font-bold'>4.8</p>
							<p className='text-sm text-white/65'>avg rating</p>
						</div>
						<div className='rounded-2xl bg-white/10 p-4'>
							<p className='text-2xl font-bold'>24/7</p>
							<p className='text-sm text-white/65'>support</p>
						</div>
					</div>
				</section>

				<section className='rounded-3xl bg-white p-6 text-[#1f2a5a] shadow-2xl md:p-8'>
					<div className='mb-6'>
						<h2 className='text-3xl font-bold'>Log in</h2>
						<p className='mt-2 text-sm text-[#1f2a5a]/60'>Access your bookings and saved venues.</p>
					</div>

					{error && (
						<div className='mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600'>
							{error}
						</div>
					)}

					<form
						onSubmit={handleLogin}
						className='space-y-4'>
						<div>
							<label className='mb-2 block text-sm font-medium'>Email</label>
							<input
								type='email'
								placeholder='you@stud.noroff.no'
								value={email}
								onChange={e => setEmail(e.target.value)}
								required
								className='w-full rounded-xl border border-[#d9dbe8] bg-[#f5f5f7] px-4 py-3 text-sm outline-none transition focus:border-[#1f2a5a]'
							/>
						</div>

						<div>
							<label className='mb-2 block text-sm font-medium'>Password</label>
							<input
								type='password'
								placeholder='Your password'
								value={password}
								onChange={e => setPassword(e.target.value)}
								required
								className='w-full rounded-xl border border-[#d9dbe8] bg-[#f5f5f7] px-4 py-3 text-sm outline-none transition focus:border-[#1f2a5a]'
							/>
						</div>

						<button
							type='submit'
							disabled={loading}
							className='w-full rounded-xl bg-[#1f2a5a] py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60'>
							{loading ? 'Logging in...' : 'Log in'}
						</button>
					</form>

					<p className='mt-6 text-center text-sm text-[#1f2a5a]/60'>
						Don&apos;t have an account?{' '}
						<Link
							to='/register'
							className='font-semibold text-[#1f2a5a] underline'>
							Register
						</Link>
					</p>
				</section>
			</main>
		</div>
	);
}
