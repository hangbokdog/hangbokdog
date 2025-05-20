import type { EmergencyApplicationsStatus } from "@/types/emergency";
import localAxios from "./http-commons";

export type EmergencyApplicationCreateResponse = {
	id: number;
};

export const applyEmergencyAPI = async (
	emergencyId: number,
	centerId: number,
) => {
	const response = await localAxios.post(
		`/emergencies/${emergencyId}/apply`,
		null,
		{
			params: { centerId },
		},
	);

	return response.data;
};

export const deleteEmergencyApplicationAPI = async (
	emergencyApplicationId: number,
) => {
	const response = await localAxios.delete(
		`/emergencies/applications/${emergencyApplicationId}`,
	);

	return response.data;
};

export const manageEmergencyApplicationAPI = async (
	emergencyApplicationId: number,
	request: EmergencyApplicationsStatus,
	centerId: number,
) => {
	const response = await localAxios.patch(
		`/emergencies/${emergencyApplicationId}`,
		{
			params: { centerId, request },
		},
	);
	return response.data;
};

export type EmergencyApplicationResponse = {
	emergencyApplicationId: number;
	memberId: number;
	memberName: string;
	memberImage: string;
	phone: string;
	createdAt: string;
	status: EmergencyApplicationsStatus;
};

export const fetchEmergencyApplicationsAPI = async (
	emergencyId: number,
	centerId: number,
): Promise<EmergencyApplicationResponse[]> => {
	const response = await localAxios.get(
		`/emergencies/${emergencyId}/applies`,
		{
			params: { centerId },
		},
	);

	return response.data;
};

export const fetchMyEmergencyApplicationsAPI = async (
	emergencyId: number,
	centerId: number,
): Promise<EmergencyApplicationResponse> => {
	const response = await localAxios.get(
		`/emergencies/${emergencyId}/applications/my`,
		{
			params: { centerId },
		},
	);

	return response.data;
};

export const deleteEmergencyPostAPI = async (
	emergencyApplicationId: number,
) => {
	const response = await localAxios.delete(
		`/emergencies/applications/${emergencyApplicationId}`,
	);

	return response.data;
};

export const deleteEmergencyAPI = async (
	emergencyId: number,
	centerId: number,
) => {
	const response = await localAxios.delete(`/emergencies/${emergencyId}`, {
		params: { centerId },
	});

	return response.data;
};

export interface AllEmergencyApplicationResponse {
	emergencyId: number;
	emergencyName: string;
	emergencyApplicationId: number;
	memberId: number;
	memberName: string;
	memberImage: string;
	phone: string;
	createdAt: string;
	status: EmergencyApplicationsStatus;
}

export const fetchAllEmergencyApplicationsAPI = async (
	centerId: number,
): Promise<AllEmergencyApplicationResponse[]> => {
	const response = await localAxios.get("/emergencies/applications", {
		params: { centerId },
	});

	return response.data;
};
