import Search from "@/components/common/filter/Search";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { debounce } from "lodash";
import CenterDecisionListItem from "@/components/common/CenterDecisionListItem";
import Header from "@/components/common/Header";
import {
	fetchCenters,
	fetchMyCenters,
	fetchMyJoinRequestCenters,
} from "@/api/center";
import useCenterStore from "@/lib/store/centerStore";
import { createCenter } from "@/api/center";
import { locations } from "@/types/center";

interface centerResponseData {
	centerId: string;
	centerName: string;
	status: string;
	centerJoinRequestId?: string;
}

interface myCenterResponseData {
	centerId: string;
	centerName: string;
	centerGrade: string;
}

interface myJoinRequestCenterResponseData {
	centerId: string;
	centerName: string;
	centerJoinRequestId: string;
}

const debouncedSearch = debounce((val: string, setter: (s: string) => void) => {
	setter(val);
}, 300);

export default function CenterDecisionPage() {
	const [query, setQuery] = useState("");
	const { selectedCenter, clearSelectedCenter } = useCenterStore();
	const queryClient = useQueryClient();

	const { data: searchResults, isLoading } = useQuery({
		queryKey: ["centerSearch", query],
		queryFn: () => fetchCenters(query),
		enabled: query.length > 0,
		staleTime: 0,
	});

	const { data: myCenters } = useQuery({
		queryKey: ["myCenters", selectedCenter],
		queryFn: () => fetchMyCenters(),
		staleTime: 0,
	});

	const { data: myJoinRequestCenters } = useQuery({
		queryKey: ["myJoinRequestCenters"],
		queryFn: () => fetchMyJoinRequestCenters(),
		staleTime: 0,
	});

	const { mutate: createCenterMutate } = useMutation({
		mutationKey: ["createCenter"],
		mutationFn: createCenter,
		onSuccess: (data) => {
			console.log(data);
			queryClient.invalidateQueries({ queryKey: ["myCenters"] });
		},
		onError: (error) => {
			console.error("Error creating center:", error);
		},
	});

	const handleDummyCenterCreate = () => {
		createCenterMutate({
			name: "신청 확인용",
			sponsorAmount: 25000,
			centerCity: locations.SEOUL,
		});
	};

	const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		debouncedSearch(e.target.value, setQuery);
	};

	useEffect(() => {
		clearSelectedCenter();
	}, [clearSelectedCenter]);

	return (
		<div className="flex flex-col gap-4.5 text-grayText mx-2.5">
			<Header />
			<div className="flex flex-col p-4 gap-4 bg-white rounded-lg shadow-custom-sm w-full">
				<div className="rounded-full w-full py-1 bg-superLightGray text-center font-medium">
					보호소 검색
				</div>
				<div>
					<Search
						placeholder="보호소를 검색해주세요"
						filter={false}
						ai={false}
						onChange={handleInput}
					/>
				</div>
				<div>
					{isLoading && <p>검색 중...</p>}
					{searchResults?.map(
						(center: centerResponseData, index: number) => (
							<CenterDecisionListItem
								key={center.centerId}
								centerJoinRequestId={center.centerJoinRequestId}
								centerId={center.centerId}
								centerName={center.centerName}
								status={center.status}
								index={index}
								query={query}
							/>
						),
					)}
					{searchResults?.length === 0 && (
						<p>검색 결과가 없습니다.</p>
					)}
				</div>
			</div>
			<div className="flex flex-col p-4 gap-4 bg-white rounded-lg shadow-custom-sm w-full">
				<div className="rounded-full w-full py-1 bg-superLightGray text-center font-medium">
					가입한 보호소
				</div>
				<div>
					{myCenters?.map(
						(center: myCenterResponseData, index: number) => (
							<CenterDecisionListItem
								key={`my-center-${center.centerId}-${index}`}
								centerId={center.centerId}
								centerName={center.centerName}
								status={center.centerGrade}
								index={index}
							/>
						),
					)}
					{myCenters?.length === 0 && (
						<p>가입한 보호소가 없습니다.</p>
					)}
				</div>
			</div>

			<div className="flex flex-col p-4 gap-4 bg-white rounded-lg shadow-custom-sm w-full">
				<div className="rounded-full w-full py-1 bg-superLightGray text-center font-medium">
					가입 신청중인 보호소
				</div>
				<div>
					{myJoinRequestCenters?.map(
						(
							center: myJoinRequestCenterResponseData,
							index: number,
						) => (
							<CenterDecisionListItem
								key={`my-join-request-center-${center.centerId}-${index}`}
								centerJoinRequestId={center.centerJoinRequestId}
								centerId={center.centerId}
								centerName={center.centerName}
								status="APPLIED"
								index={index}
								query={query}
							/>
						),
					)}
					{myJoinRequestCenters?.length === 0 && (
						<p>가입 신청중인 보호소가 없습니다.</p>
					)}
				</div>
			</div>
			<div className="flex flex-col p-4 gap-4 bg-white rounded-lg shadow-custom-sm w-full">
				<button
					onClick={handleDummyCenterCreate}
					type="button"
					className="rounded-full w-full py-1 bg-male text-white text-center font-medium"
				>
					더미 보호소 생성
				</button>
			</div>
		</div>
	);
}
