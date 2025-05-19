import { useQuery } from "@tanstack/react-query";
import { getMyVolunteerApplicationsListAPI } from "@/api/volunteer";
import type {
	MyVolunteerListApplication,
	MyVolunteerApplicationListResponse,
} from "@/api/volunteer";

/**
 * 내 봉사 신청 내역을 status별로 가져오는 훅
 */
export const useMyAllVolunteerApplications = (
	status: MyVolunteerListApplication["status"],
) => {
	return useQuery<MyVolunteerApplicationListResponse>({
		queryKey: ["my-volunteer-applications", status],
		queryFn: () => getMyVolunteerApplicationsListAPI({ status }),
		staleTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		retry: false,
	});
};
