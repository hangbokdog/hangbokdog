export const adoptionStatus = {
	APPLIED: "APPLIED",
	UNDER_REVIEW: "UNDER_REVIEW",
	REJECTED: "REJECTED",
	ACCEPTED: "ACCEPTED",
} as const;

export type AdoptionStatus =
	(typeof adoptionStatus)[keyof typeof adoptionStatus];
