import localAxios from "./http-commons";

export enum Status {
	APPLYING = "APPLYING",
	ACCEPTED = "ACCEPTED",
	COMPLETED = "COMPLETED",
	REJECTED = "REJECTED",
	CANCELLED = "CANCELLED",
	FOSTERING = "FOSTERING",
	STOPPED = "STOPPED",
}

export interface MyFosterDog {
	dogId: number;
	dogName: string;
	profileImage: string;
	startDate: string;
	status: Status;
}

export const fetchMyFosterDogsAPI = async () => {
	const response = await localAxios.get("/fosters/applications/my");
	return response.data;
};
