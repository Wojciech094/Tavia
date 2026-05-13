import { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';

export default function ContactPage() {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		message: '',
	});

	const [successMessage, setSuccessMessage] = useState('');

	function handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
		const { name, value } = event.target;

		setFormData(currentData => ({
			...currentData,
			[name]: value,
		}));
	}

	function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		setSuccessMessage('Thank you! Your message has been received.');

		setFormData({
			name: '',
			email: '',
			message: '',
		});
	}

	return (
		<>
			<Navbar />

			<main className='min-h-screen bg-[#f7f7fb]'>
				<section className='bg-[#252b5c] px-6 py-24 text-white'>
					<div className='mx-auto max-w-6xl'>
						<p className='mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-[#d8ccff]'>Contact</p>

						<h1 className='max-w-3xl text-4xl font-extrabold tracking-tight md:text-6xl'>
							Need help with your stay or venue?
						</h1>

						<p className='mt-6 max-w-2xl text-lg leading-8 text-white/75'>
							Contact the Tavia team for questions about bookings, venues, accounts or the platform experience.
						</p>
					</div>
				</section>

				<section className='px-6 py-20'>
					<div className='mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr]'>
						<div className='space-y-6'>
							<div className='rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5'>
								<div className='mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eeeaff] text-[#7c6bea]'>
									<Mail className='h-6 w-6' />
								</div>

								<h2 className='text-xl font-bold text-[#15183f]'>Email support</h2>
								<p className='mt-3 text-sm leading-6 text-slate-600'>
									For booking questions, account help or venue support.
								</p>
								<p className='mt-4 font-semibold text-[#252b5c]'>support@tavia.com</p>
							</div>

							<div className='rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5'>
								<div className='mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eeeaff] text-[#7c6bea]'>
									<Phone className='h-6 w-6' />
								</div>

								<h2 className='text-xl font-bold text-[#15183f]'>Phone</h2>
								<p className='mt-3 text-sm leading-6 text-slate-600'>
									Available Monday to Friday during normal business hours.
								</p>
								<p className='mt-4 font-semibold text-[#252b5c]'>+47 22 00 00 00</p>
							</div>

							<div className='rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5'>
								<div className='mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eeeaff] text-[#7c6bea]'>
									<MapPin className='h-6 w-6' />
								</div>

								<h2 className='text-xl font-bold text-[#15183f]'>Location</h2>
								<p className='mt-3 text-sm leading-6 text-slate-600'>
									Tavia is a digital booking platform inspired by Nordic travel experiences.
								</p>
								<p className='mt-4 font-semibold text-[#252b5c]'>Oslo, Norway</p>
							</div>
						</div>

						<div className='rounded-4xl bg-white p-6 shadow-sm ring-1 ring-black/5 md:p-8'>
							<div className='mb-8'>
								<div className='mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eeeaff] text-[#7c6bea]'>
									<MessageCircle className='h-6 w-6' />
								</div>

								<h2 className='text-2xl font-extrabold text-[#15183f]'>Send us a message</h2>
								<p className='mt-3 text-sm leading-6 text-slate-600'>
									This demo contact form confirms the message locally and keeps the user experience complete.
								</p>
							</div>

							<form
								onSubmit={handleSubmit}
								className='space-y-5'>
								<div>
									<label
										htmlFor='name'
										className='mb-2 block text-sm font-semibold text-[#15183f]'>
										Name
									</label>
									<input
										id='name'
										name='name'
										type='text'
										value={formData.name}
										onChange={handleChange}
										required
										className='w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-[#15183f] outline-none transition focus:border-[#7c6bea] focus:ring-4 focus:ring-[#7c6bea]/15'
										placeholder='Your name'
									/>
								</div>

								<div>
									<label
										htmlFor='email'
										className='mb-2 block text-sm font-semibold text-[#15183f]'>
										Email
									</label>
									<input
										id='email'
										name='email'
										type='email'
										value={formData.email}
										onChange={handleChange}
										required
										className='w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-[#15183f] outline-none transition focus:border-[#7c6bea] focus:ring-4 focus:ring-[#7c6bea]/15'
										placeholder='you@example.com'
									/>
								</div>

								<div>
									<label
										htmlFor='message'
										className='mb-2 block text-sm font-semibold text-[#15183f]'>
										Message
									</label>
									<textarea
										id='message'
										name='message'
										value={formData.message}
										onChange={handleChange}
										required
										rows={6}
										className='w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-[#15183f] outline-none transition focus:border-[#7c6bea] focus:ring-4 focus:ring-[#7c6bea]/15'
										placeholder='How can we help?'
									/>
								</div>

								<button
									type='submit'
									className='w-full rounded-2xl bg-[#252b5c] px-6 py-3 font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#1b2048] focus:outline-none focus:ring-4 focus:ring-[#252b5c]/20'>
									Send message
								</button>

								{successMessage && (
									<p className='rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700'>
										{successMessage}
									</p>
								)}
							</form>
						</div>
					</div>
				</section>
			</main>

			<Footer />
		</>
	);
}
