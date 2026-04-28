import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import VenuesPage from './pages/VenuesPage';
import VenueDetailsPage from './pages/VenueDetailsPage';

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
		</Routes>
	);
}

export default App;
