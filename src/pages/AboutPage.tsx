import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { Link } from 'react-router-dom';
import { CalendarDays, ShieldCheck, Sparkles, Users } from 'lucide-react';

export default function AboutPage() {
	return (
		<>
			<Navbar />

			<main className='min-h-screen bg-[#f7f7fb]'>
				<section className='bg-[#252b5c] px-6 py-24 text-white'>
					<div className='mx-auto max-w-6xl'>
						<p className='mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-[#d8ccff]'>About Tavia</p>

						<h1 className='max-w-3xl text-4xl font-bold tracking-tight md:text-6xl'>
							A modern way to discover and manage unique stays.
						</h1>

						<p className='mt-6 max-w-2xl text-lg leading-8 text-white/75'>
							Tavia is an accommodation booking platform designed for travellers who want simple booking experiences and
							venue managers who need clear tools to manage their venues.
						</p>

						<div className='mt-10 flex flex-col gap-4 sm:flex-row'>
							<Link
								to='/venues'
								className='rounded-2xl bg-[#d8ccff] px-6 py-3 text-center font-bold text-[#171a3f] transition hover:-translate-y-0.5 hover:bg-white'>
								Explore venues
							</Link>

							<Link
								to='/register'
								className='rounded-2xl border border-white/25 px-6 py-3 text-center font-bold text-white transition hover:-translate-y-0.5 hover:bg-white/10'>
								Create account
							</Link>
						</div>
					</div>
				</section>

				<section className='px-6 py-20'>
					<div className='mx-auto grid max-w-6xl gap-6 md:grid-cols-4'>
						<div className='rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5'>
							<Sparkles className='mb-5 h-8 w-8 text-[#7c6bea]' />
							<h2 className='text-xl font-bold text-[#15183f]'>Curated stays</h2>
							<p className='mt-3 text-sm leading-6 text-slate-600'>
								Browse handpicked venues with images, details, amenities and location data.
							</p>
						</div>

						<div className='rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5'>
							<CalendarDays className='mb-5 h-8 w-8 text-[#7c6bea]' />
							<h2 className='text-xl font-bold text-[#15183f]'>Smart booking</h2>
							<p className='mt-3 text-sm leading-6 text-slate-600'>
								View available dates, avoid booked periods and create bookings with a clear checkout flow.
							</p>
						</div>

						<div className='rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5'>
							<Users className='mb-5 h-8 w-8 text-[#7c6bea]' />
							<h2 className='text-xl font-bold text-[#15183f]'>Manager tools</h2>
							<p className='mt-3 text-sm leading-6 text-slate-600'>
								Venue managers can create, edit and delete venues, plus view upcoming bookings for their listings.
							</p>
						</div>

						<div className='rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5'>
							<ShieldCheck className='mb-5 h-8 w-8 text-[#7c6bea]' />
							<h2 className='text-xl font-bold text-[#15183f]'>Reliable UX</h2>
							<p className='mt-3 text-sm leading-6 text-slate-600'>
								The interface is responsive, accessible and designed around clear user roles.
							</p>
						</div>
					</div>
				</section>

				<section className='px-6 pb-24'>
					<div className='mx-auto max-w-6xl rounded-4xl bg-white p-8 shadow-sm ring-1 ring-black/5 md:p-12'>
						<div className='grid gap-10 md:grid-cols-[1fr_1.1fr] md:items-center'>
							<div>
								<p className='text-sm font-semibold uppercase tracking-[0.3em] text-[#7c6bea]'>Project purpose</p>

								<h2 className='mt-4 text-3xl font-extrabold text-[#15183f] md:text-4xl'>
									Built for the Holidaze accommodation brief.
								</h2>
							</div>

							<div className='space-y-4 text-slate-600'>
								<p>
									This project demonstrates front-end development skills using React, TypeScript, routing, API
									communication, authentication, protected routes, form handling and responsive UI design.
								</p>

								<p>
									The application supports both customer-facing booking functionality and admin-facing venue management
									functionality through the official Noroff Holidaze API.
								</p>
							</div>
						</div>
					</div>
				</section>
			</main>

			<Footer />
		</>
	);
}
