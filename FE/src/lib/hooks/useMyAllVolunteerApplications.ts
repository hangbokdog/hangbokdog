import { useQuery } from "@tanstack/react-query";
import { getMyVolunteerApplicationsListAPI } from "@/api/volunteer";
import type {
	MyVolunteerApplicationListResponse,
	MyVolunteerListApplication,
} from "@/api/volunteer";

export const useAllVolunteerApplications = () => {
	return useQuery({
		queryKey: ["my-volunteer-applications", "ALL"],
		queryFn: async () => {
			const statuses: MyVolunteerListApplication["status"][] = [
				"PENDING",
				"APPROVED",
				"REJECTED",
				"NONE",
				"COMPLETED",
			];

			const responses = await Promise.all(
				statuses.map((status) =>
					getMyVolunteerApplicationsListAPI({ status }).then(
						(res) => ({
							status,
							data: res.memberApplicationInfo,
						}),
					),
				),
			);

			return responses; // [{ status: "PENDING", data: [...] }, ...]
		},
		staleTime: 1000 * 60 * 5,
	});
};
