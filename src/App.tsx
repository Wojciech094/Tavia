import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import VenuesPage from './pages/VenuesPage';
import VenueDetailsPage from './pages/VenueDetailsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import MyBookingsPage from './pages/MyBookingsPage';
function App() {
	return (
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
				path='/login'
				element={<LoginPage />}
			/>
			<Route
				path='/register'
				element={<RegisterPage />}
			/>
			<Route
				path='/profile'
				element={<ProfilePage />}
			/>
			<Route path="/my-bookings" element={<MyBookingsPage />}
			 />
		</Routes>
	);
}

export default App;
