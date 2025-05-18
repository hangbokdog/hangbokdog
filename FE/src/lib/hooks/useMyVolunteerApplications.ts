import { useQuery } from "@tanstack/react-query";
import { getMyVolunteerApplicationsAPI } from "@/api/volunteer";
import type { MyVolunteerApplication } from "@/api/volunteer";

export const useMyVolunteerApplications = (eventId: number, date?: string) => {
	return useQuery<MyVolunteerApplication[]>({
		queryKey: ["my-volunteer-applications", eventId, date],
		queryFn: () => getMyVolunteerApplicationsAPI({ eventId, date }),
	});
};
