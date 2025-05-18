import type { AddressBook } from "@/api/center";

export interface ScheduleItem {
	date: string;
	morning: string;
	afternoon: string;
	morningSlotId?: number;
	afternoonSlotId?: number;
	rawDate?: string;
}

export interface Participant {
	id: number;
	nickname: string;
	name: string;
	phone: string;
}

export interface SelectedSchedule {
	date: string;
	time: "morning" | "afternoon";
	capacity: string;
	people: number;
	participants: Participant[];
	slotId?: number;
	rawDate?: string;
}

export interface Volunteer {
	id: number;
	title: string;
	content: string;
	address: string;
	locationType: string;
	startDate: string;
	endDate: string;
	imageUrl: string;
	addressName?: string;
	appliedCount?: number;
}

export interface ClosedVolunteerResponse {
	pageToken: string;
	data: Volunteer[];
	hasNext: boolean;
}

export interface VolunteerApplicant {
	id: number;
	memberId: number;
	volunteerId: number;
	status: "PENDING" | "APPROVED" | "REJECTED";
	createdAt: string;
	name: string;
	nickname: string;
	birth: string;
	phone: string | null;
	age: number;
	grade: string;
	email: string;
	profileImage: string;
}

export interface VolunteerSchedule {
	date: string;
	morning: {
		capacity: number;
		current: number;
		applicants: VolunteerApplicant[];
	};
	afternoon: {
		capacity: number;
		current: number;
		applicants: VolunteerApplicant[];
	};
}

export interface ApplicantItemProps {
	applicant: VolunteerApplicant;
	formatDate: (dateString: string) => string;
	isApproved?: boolean;
}

export interface ApplicantsListProps {
	formatDate: (dateString: string) => string;
	eventId: number;
	refetchVolunteers: () => void;
	refetchAddresses: () => void;
}

export interface VolunteerItemProps {
	volunteer: Volunteer;
	onDelete: (id: number) => void;
	formatDate: (dateString: string) => string;
	refetchVolunteers: () => void;
	refetchAddresses: () => void;
}

export interface VolunteerScheduleManagerProps {
	address: AddressBook;
	refetchAddresses: () => void;
}

export interface APIScheduleItem {
	date: string;
	morning: {
		volunteerSlotId: number;
		appliedCount: number;
		capacity: number;
	};
	afternoon: {
		volunteerSlotId: number;
		appliedCount: number;
		capacity: number;
	};
}

export interface VolunteerApplicantsResponse {
	pageToken: string | null;
	data: VolunteerApplicantThumb[];
	hasNext: boolean;
}

export interface VolunteerApplicantThumb {
	id: number;
	volunteerId: number;
	memberId: number;
	status: "PENDING" | "APPROVED" | "REJECTED";
	createdAt: string;
	name: string;
	nickname: string;
	birth: string;
	phone: string | null;
	age: number;
	grade: string;
	email: string;
	profileImage: string;
}

export interface SlotApplicant {
	id: number;
	memberId: number;
	volunteerId: number;
	status: "PENDING" | "APPROVED" | "REJECTED";
	createdAt: string;
	name: string;
	nickname: string;
	birth: string;
	phone: string;
	age: number;
	grade: string;
	email: string;
	profileImage: string;
}
