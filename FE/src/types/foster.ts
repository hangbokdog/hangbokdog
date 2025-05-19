export const FosterStatus = {
	APPLYING: "APPLYING",
	COMPLETED: "COMPLETED",
	ACCEPTED: "ACCEPTED",
	REJECTED: "REJECTED",
	CANCELLED: "CANCELLED",
	FOSTERING: "FOSTERING",
	STOPPED: "STOPPED",
};

export type FosterStatus = (typeof FosterStatus)[keyof typeof FosterStatus];
