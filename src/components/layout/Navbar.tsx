export default function Navbar() {
	return (
		<nav
			className='sticky top-0 z-50 flex items-center justify-between px-6 py-4 md:px-10
                    bg-[#16204a]/80 backdrop-blur-md border-b border-white/10'>
			<div className='text-xl font-bold'>Tavia</div>

			<div className='hidden gap-6 text-sm text-white/80 md:flex'>
				<span className='hover:text-white cursor-pointer'>Explore</span>
				<span className='hover:text-white cursor-pointer'>Venues</span>
				<span className='hover:text-white cursor-pointer'>About</span>
			</div>

			<div className='flex gap-3'>
				<button className='rounded-lg border border-white/30 px-4 py-2 text-white hover:bg-white/10'>Log in</button>
				<button className='rounded-lg bg-[#d7c6ff] px-4 py-2 font-semibold text-[#1f2a5a] hover:opacity-90'>
					Register
				</button>
			</div>
		</nav>
	);
}
