import type { AddressBook } from "@/api/center";

export interface ScheduleItem {
	date: string;
	morning: string;
	afternoon: string;
}

export interface Participant {
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
}

export interface ClosedVolunteerResponse {
	pageToken: string;
	data: Volunteer[];
	hasNext: boolean;
}

export interface VolunteerApplicant {
	id: number;
	userId: number;
	nickname: string;
	name: string;
	phoneNumber: string;
	requestDate: string;
	scheduleId: number;
	volunteerDate: string;
	timeSlot: "morning" | "afternoon";
	status: "PENDING" | "APPROVED" | "REJECTED";
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
	onApprove: (id: number) => void;
	onReject: (id: number) => void;
	formatDate: (dateString: string) => string;
	isApproved?: boolean;
}

export interface ApplicantsListProps {
	pendingApplicants: VolunteerApplicant[];
	approvedApplicants: VolunteerApplicant[];
	isLoading: boolean;
	onApprove: (id: number) => void;
	onReject: (id: number) => void;
	formatDate: (dateString: string) => string;
}

export interface VolunteerItemProps {
	volunteer: Volunteer;
	onDelete: (id: number) => void;
	onSelectVolunteer: (volunteer: Volunteer) => void;
	applicants: VolunteerApplicant[];
	pendingApplicants: VolunteerApplicant[];
	approvedApplicants: VolunteerApplicant[];
	isApplicantsLoading: boolean;
	onApproveApplicant: (id: number) => void;
	onRejectApplicant: (id: number) => void;
	formatDate: (dateString: string) => string;
}

export interface VolunteerScheduleManagerProps {
	address: AddressBook;
}
