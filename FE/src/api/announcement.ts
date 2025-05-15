import localAxios, { type PageInfo } from "./http-commons";

export interface AnnouncementCreateRequest {
	title: string;
	content: string;
}

export interface AnnouncementCreateResponse {
	id: number;
}

export interface AnnouncementResponse {
	id: number;
	authorId: number;
	authorName: string;
	authorImage: string;
	announcementId: number;
	title: string;
	createdAt: string;
}

export interface AnnouncementDetailResponse {
	id: number;
	authorId: number;
	authorName: string;
	authorImage: string;
	title: string;
	content: string;
	imageUrls: string[];
	createdAt: string;
}

export interface AnnouncementUpdateRequest {
	title: string;
	content: string;
}

export const createAnnouncementAPI = async (
	centerId: number,
	request: AnnouncementCreateRequest,
	files?: File[],
): Promise<AnnouncementCreateResponse> => {
	const formData = new FormData();
	formData.append(
		"request",
		new Blob([JSON.stringify(request)], { type: "application/json" }),
	);

	if (files && files.length > 0) {
		for (const file of files) {
			formData.append("files", file);
		}
	}

	const response = await localAxios.post(
		`/announcements?centerId=${centerId}`,
		formData,
		{
			headers: {
				"Content-Type": "multipart/form-data",
			},
		},
	);

	return response.data;
};

export const fetchAnnouncementsAPI = async (
	centerId: number,
	pageToken?: string,
): Promise<PageInfo<AnnouncementResponse>> => {
	const response = await localAxios.get("/announcements", {
		params: {
			centerId,
			pageToken,
		},
	});
	return response.data;
};

export const fetchAnnouncementDetailAPI = async (
	announcementId: number,
	centerId: number,
): Promise<AnnouncementDetailResponse> => {
	const response = await localAxios.get(`/announcements/${announcementId}`, {
		params: { centerId },
	});
	return response.data;
};

export const updateAnnouncementAPI = async (
	announcementId: number,
	request: AnnouncementUpdateRequest,
	files?: File[],
): Promise<void> => {
	const formData = new FormData();
	formData.append(
		"request",
		new Blob([JSON.stringify(request)], { type: "application/json" }),
	);

	if (files && files.length > 0) {
		for (const file of files) {
			formData.append("files", file);
		}
	}

	await localAxios.patch(`/announcements/${announcementId}`, formData, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});
};

export const deleteAnnouncementAPI = async (
	announcementId: number,
): Promise<void> => {
	await localAxios.delete(`/announcements/${announcementId}`);
};
