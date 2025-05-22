import axios from "axios";

export const fetchNameSuggestionsAPI = async (
	centerId: number,
): Promise<string[]> => {
	const res = await axios.get(
		`${import.meta.env.VITE_AI_URL_PRODUCT}/name-suggestion`,
		{ params: { center_id: centerId } },
	);
	return res.data;
};
