import localAxios from "./http-commons";
import type {
	TransportRequest,
	DonationRequest,
	VolunteerRequest,
} from "@/types/emergencyRegister";

/**
 * 🚚 운송 게시글 생성
 * @param centerId 센터 ID
 * @param data 게시글 데이터
 * @returns 생성된 게시글 ID
 */
export const createTransportPostAPI = async (
	centerId: number,
	data: TransportRequest,
): Promise<number> => {
	const response = await localAxios.post("/emergencies/transport", data, {
		params: { centerId },
	});
	return response.data;
};

/**
 * 💰 기부 게시글 생성
 * @param centerId 센터 ID
 * @param data 게시글 데이터
 * @returns 생성된 게시글 ID
 */
export const createDonationPostAPI = async (
	centerId: number,
	data: DonationRequest,
): Promise<number> => {
	const response = await localAxios.post("/emergencies/donation", data, {
		params: { centerId },
	});
	return response.data;
};

/**
 * 🙋 자원봉사 게시글 생성
 * @param centerId 센터 ID
 * @param data 게시글 데이터
 * @returns 생성된 게시글 ID
 */
export const createVolunteerPostAPI = async (
	centerId: number,
	data: VolunteerRequest,
): Promise<number> => {
	const response = await localAxios.post("/emergencies/volunteer", data, {
		params: { centerId },
	});
	return response.data;
};
