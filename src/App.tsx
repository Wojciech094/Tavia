import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import VenuesPage from './pages/VenuesPage';

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
		</Routes>
	);
}

export default App;
