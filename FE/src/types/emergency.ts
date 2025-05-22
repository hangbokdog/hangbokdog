export const EmergencyApplicationsStatus = {
	APPLIED: "APPLIED",
	APPROVED: "APPROVED",
	REJECTED: "REJECTED",
};

export type EmergencyApplicationsStatus =
	(typeof EmergencyApplicationsStatus)[keyof typeof EmergencyApplicationsStatus];

export const EmergencyStatus = {
	RECRUITING: "RECRUITING",
	RECRUITED: "RECRUITED",
	COMPLETED: "COMPLETED",
};

export type EmergencyStatus =
	(typeof EmergencyStatus)[keyof typeof EmergencyStatus];
