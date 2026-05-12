import { Navigate, Outlet } from 'react-router-dom';
import { getUser } from '../../utils/auth';

export default function ManagerRoute() {
	const user = getUser();

	const isVenueManager = user?.venueManager === true;

	if (!isVenueManager) {
		return (
			<Navigate
				to='/profile'
				replace
			/>
		);
	}

	return <Outlet />;
}
