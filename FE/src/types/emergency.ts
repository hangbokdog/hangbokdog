export const EmergencyApplicationsStatus = {
	APPLIED: "APPLIED",
	APPROVE: "APPROVED",
	REJECTED: "REJECTED",
};

export type EmergencyApplicationsStatus =
	(typeof EmergencyApplicationsStatus)[keyof typeof EmergencyApplicationsStatus];
