import { useSearchParams } from 'react-router-dom';

export function useVenueSearch() {
	const [params, setParams] = useSearchParams();

	const where = params.get('where') || '';
	const guests = params.get('guests') || '';
	const minPrice = params.get('minPrice') || '';
	const maxPrice = params.get('maxPrice') || '';
	const minRating = params.get('minRating') || '';
	const amenity = params.get('amenity') || '';
	const sort = params.get('sort') || 'recommended';

	function updateParam(key: string, value: string) {
		const newParams = new URLSearchParams(params);

		if (value) {
			newParams.set(key, value);
		} else {
			newParams.delete(key);
		}

		setParams(newParams);
	}

	function resetSearch() {
		setParams({});
	}

	return {
		where,
		guests,
		minPrice,
		maxPrice,
		minRating,
		amenity,
		sort,
		updateParam,
		resetSearch,
	};
}
