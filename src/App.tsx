import { Route, Routes } from 'react-router-dom';

import ProtectedRoute from './components/auth/ProtectedRoute';
import ManagerRoute from './components/auth/ManagerRoute';
import ScrollToTop from './components/layout/ScrollToTop';

import HomePage from './pages/HomePage';
import VenuesPage from './pages/VenuesPage';
import VenueDetailsPage from './pages/VenueDetailsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import MyBookingsPage from './pages/MyBookingsPage';
import ManagerDashboardPage from './pages/ManagerDashboardPage';
import CreateVenuePage from './pages/CreateVenuePage';
import EditVenuePage from './pages/EditVenuePage';
import CheckoutPage from './pages/CheckoutPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

export default function App() {
	return (
		<>
			<ScrollToTop />

			<Routes>
				<Route
					path='/'
					element={<HomePage />}
				/>

				<Route
					path='/venues'
					element={<VenuesPage />}
				/>

				<Route
					path='/venues/:id'
					element={<VenueDetailsPage />}
				/>

				<Route
					path='/about'
					element={<AboutPage />}
				/>

				<Route
					path='/contact'
					element={<ContactPage />}
				/>

				<Route
					path='/login'
					element={<LoginPage />}
				/>

				<Route
					path='/register'
					element={<RegisterPage />}
				/>

				<Route element={<ProtectedRoute />}>
					<Route
						path='/profile'
						element={<ProfilePage />}
					/>

					<Route
						path='/my-bookings'
						element={<MyBookingsPage />}
					/>

					<Route
						path='/checkout/:venueId'
						element={<CheckoutPage />}
					/>

					<Route element={<ManagerRoute />}>
						<Route
							path='/manager'
							element={<ManagerDashboardPage />}
						/>

						<Route
							path='/manager/create'
							element={<CreateVenuePage />}
						/>

						<Route
							path='/manager/edit/:id'
							element={<EditVenuePage />}
						/>
					</Route>
				</Route>
			</Routes>
		</>
	);
}
