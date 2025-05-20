export const EmergencyApplicationsStatus = {
	APPLIED: "APPLIED",
	APPROVED: "APPROVED",
	REJECTED: "REJECTED",
};

export type EmergencyApplicationsStatus =
	(typeof EmergencyApplicationsStatus)[keyof typeof EmergencyApplicationsStatus];
