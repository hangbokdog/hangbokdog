import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { MdArrowForwardIos, MdLocalHospital } from "react-icons/md";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useManagerStore from "@/lib/store/managerStore";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
	useInfiniteQuery,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import {
	createVaccinationAPI,
	fetchVaccinationSummariesAPI,
	type VaccinationCreateRequest,
} from "@/api/vaccine";
import { fetchHospitalDogsAPI, type HospitalDogResponse } from "@/api/dog";
import useCenterStore from "@/lib/store/centerStore";

// Helper function to format age
const formatAge = (ageInMonths: number): string => {
	const years = Math.floor(ageInMonths / 12);
	const months = ageInMonths % 12;

	if (years > 0) {
		return `${years}살 ${months > 0 ? `${months}개월` : ""}`;
	}
	return `${months}개월`;
};

export default function DogDrugsPage() {
	const [open, setOpen] = useState(false);
	const { addressBook } = useManagerStore();
	const [selectedAddressIds, setSelectedAddressIds] = useState<number[]>([]);
	const { selectedCenter } = useCenterStore();
	const vaccinationObserverRef = useRef<HTMLDivElement | null>(null);
	const hospitalObserverRef = useRef<HTMLDivElement | null>(null);
	const queryClient = useQueryClient();

	const [form, setForm] = useState<VaccinationCreateRequest>({
		title: "",
		content: "",
		operatedDate: "",
		locationIds: [],
	});

	const mutation = useMutation({
		mutationFn: (data: VaccinationCreateRequest) =>
			createVaccinationAPI(data, Number(selectedCenter?.centerId) || -1),
		onSuccess: () => {
			setOpen(false);
			setForm({
				title: "",
				content: "",
				operatedDate: "",
				locationIds: [],
			});
			setSelectedAddressIds([]);

			// 캐시 무효화 및 리페치
			queryClient
				.invalidateQueries({
					queryKey: [
						"vaccinationSummaries",
						selectedCenter?.centerId,
					],
				})
				.then(() => {
					// 스크롤 최상단으로 이동
					const listContainer =
						document.querySelector(".vaccination-list");
					if (listContainer) {
						listContainer.scrollTo({ top: 0, behavior: "smooth" });
					}
				});
		},
	});

	// Vaccination schedules query
	const {
		data: vaccinationData,
		fetchNextPage: fetchNextVaccinationPage,
		hasNextPage: hasNextVaccinationPage,
		isFetchingNextPage: isFetchingNextVaccinationPage,
	} = useInfiniteQuery({
		queryKey: ["vaccinationSummaries", selectedCenter?.centerId],
		queryFn: ({ pageParam }: { pageParam?: string }) =>
			fetchVaccinationSummariesAPI(
				Number(selectedCenter?.centerId),
				pageParam,
			),
		initialPageParam: undefined,
		getNextPageParam: (lastPage) => lastPage.pageToken,
	});

	// Hospital dogs query
	const {
		data: hospitalData,
		fetchNextPage: fetchNextHospitalPage,
		hasNextPage: hasNextHospitalPage,
		isFetchingNextPage: isFetchingNextHospitalPage,
		isLoading: isLoadingHospital,
	} = useInfiniteQuery({
		queryKey: ["hospitalDogs", selectedCenter?.centerId],
		queryFn: ({ pageParam }: { pageParam?: string }) =>
			fetchHospitalDogsAPI(Number(selectedCenter?.centerId), pageParam),
		initialPageParam: undefined,
		getNextPageParam: (lastPage) => lastPage.pageToken,
	});

	const handleSubmit = () => {
		if (
			!form.title ||
			!form.operatedDate ||
			selectedAddressIds.length === 0
		) {
			alert("모든 필드를 입력해주세요.");
			return;
		}

		const operatedDateWithTime = `${form.operatedDate}T00:00:00`;

		mutation.mutate({
			...form,
			operatedDate: operatedDateWithTime,
			locationIds: selectedAddressIds,
		});
	};

	// Intersection observer for vaccination list
	useEffect(() => {
		if (!vaccinationObserverRef.current || !hasNextVaccinationPage) return;
		const observer = new IntersectionObserver(
			(entries) => {
				if (
					entries[0].isIntersecting &&
					hasNextVaccinationPage &&
					!isFetchingNextVaccinationPage
				) {
					fetchNextVaccinationPage();
				}
			},
			{ threshold: 1.0 },
		);

		observer.observe(vaccinationObserverRef.current);
		return () => {
			if (vaccinationObserverRef.current) {
				observer.unobserve(vaccinationObserverRef.current);
			}
		};
	}, [
		hasNextVaccinationPage,
		isFetchingNextVaccinationPage,
		fetchNextVaccinationPage,
	]);

	// Intersection observer for hospital dogs list
	useEffect(() => {
		if (!hospitalObserverRef.current || !hasNextHospitalPage) return;
		const observer = new IntersectionObserver(
			(entries) => {
				if (
					entries[0].isIntersecting &&
					hasNextHospitalPage &&
					!isFetchingNextHospitalPage
				) {
					fetchNextHospitalPage();
				}
			},
			{ threshold: 1.0 },
		);

		observer.observe(hospitalObserverRef.current);
		return () => {
			if (hospitalObserverRef.current) {
				observer.unobserve(hospitalObserverRef.current);
			}
		};
	}, [
		hasNextHospitalPage,
		isFetchingNextHospitalPage,
		fetchNextHospitalPage,
	]);

	// Flatten hospital dogs data
	const hospitalDogs =
		hospitalData?.pages.flatMap((page) => page.data).flat() || [];

	return (
		<div className="flex flex-col gap-5 mx-auto px-3 md:px-4 max-w-md md:max-w-3xl w-full text-grayText pb-6">
			{/* Vaccination Schedule Card */}
			<div className="flex flex-col gap-4 w-full bg-white rounded-2xl shadow-custom-sm pt-4 pb-4 border border-gray-100">
				<span className="flex justify-between items-center mx-4">
					<span className="font-bold text-lg flex items-center gap-2">
						<div className="w-1 h-5 bg-male rounded-full" />
						예방 접종 일정
					</span>
					<button
						type="button"
						className="flex gap-1.5 items-center text-sm font-semibold bg-male hover:bg-blue text-white text-center pl-4 pr-2.5 py-2 rounded-full shadow-custom-sm transition-all duration-300 active:scale-95"
						onClick={() => setOpen(true)}
					>
						일정 등록
						<MdArrowForwardIos size={14} />
					</button>
				</span>
				<div className="vaccination-list flex flex-col gap-3 max-h-[300px] overflow-y-auto scrollbar-hide px-4 py-2">
					{vaccinationData?.pages
						.flatMap((page) => page.data)
						.map((item, index) => (
							<Link
								to={`/manager/dog-management/vaccination/${item.vaccinationId}`}
								key={`${item.vaccinationId}-${index}`}
								className="w-full flex flex-col bg-white rounded-xl shadow-sm hover:shadow-[0_4px_12px_rgba(59,130,246,0.2)] transition-all duration-300 border border-gray-100 hover:-translate-y-0.5 hover:border-blue-100"
							>
								<div className="flex items-center justify-between p-3.5">
									<div className="flex flex-col gap-1.5 flex-1 min-w-0">
										<div className="flex items-center gap-2">
											<span className="font-semibold text-gray-800 truncate">
												{item.title}
											</span>
											<span className="text-xs text-white bg-gradient-to-r from-blue-500 to-male px-2.5 py-0.5 rounded-full whitespace-nowrap">
												{item.operatedDate?.split(
													"T",
												)[0] || ""}
											</span>
											<span
												className={`text-xs text-white px-2.5 py-0.5 rounded-full whitespace-nowrap shadow-sm ${
													String(item.status) ===
													"COMPLETED"
														? "bg-gradient-to-r from-green-500 to-green-600"
														: "bg-gradient-to-r from-yellow-500 to-amber-500"
												}`}
											>
												{String(item.status) ===
												"COMPLETED"
													? "완료"
													: "진행중"}
											</span>
										</div>
										{item.content && (
											<p className="text-sm text-gray-600 truncate">
												{item.content}
											</p>
										)}
										<div className="flex flex-wrap gap-1.5 mt-1">
											{item.locationInfos?.map(
												(location) => (
													<span
														key={
															location.locationId
														}
														className="text-xs bg-gray-100 hover:bg-blue-50 text-gray-700 px-2 py-0.5 rounded-full truncate max-w-[120px] transition-colors duration-200"
														title={
															location.locationName
														}
													>
														{location.locationName}
													</span>
												),
											)}
										</div>
									</div>
									<div className="bg-gray-50 w-8 h-8 rounded-full flex items-center justify-center ml-2 flex-shrink-0 transition-colors duration-300">
										<MdArrowForwardIos className="text-gray-400 hover:text-male" />
									</div>
								</div>
							</Link>
						))}
					{(!vaccinationData ||
						vaccinationData.pages[0]?.data?.length === 0) && (
						<div className="flex justify-center items-center h-[120px] text-gray-500 flex-col">
							<div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-2">
								💉
							</div>
							예방 접종 일정이 없습니다.
						</div>
					)}
				</div>
				{hasNextVaccinationPage && (
					<div
						ref={vaccinationObserverRef}
						className="py-3 text-center text-sm text-gray-400"
					>
						{isFetchingNextVaccinationPage
							? "불러오는 중..."
							: "스크롤하여 더 보기"}
					</div>
				)}
			</div>

			{/* Hospital Dogs Section */}
			<div className="flex flex-col gap-4 w-full bg-white rounded-2xl shadow-custom-sm pt-4 pb-4 border border-gray-100">
				<span className="flex justify-between items-center mx-4">
					<span className="font-bold text-lg text-red-600 flex items-center gap-2">
						<div className="w-1 h-5 bg-red-500 rounded-full" />
						<MdLocalHospital className="text-red-500" />
						병원 입원 강아지
					</span>
				</span>
				<div className="hospital-list flex flex-col gap-3 max-h-[300px] overflow-y-auto scrollbar-hide px-4 py-2">
					{isLoadingHospital ? (
						// Loading skeletons
						Array.from({ length: 3 }).map((_, i) => (
							<div
								key={`skeleton-${
									// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
									i
								}`}
								className="animate-pulse bg-white rounded-xl shadow-sm p-3.5 border border-gray-100"
							>
								<div className="flex items-center gap-3">
									<div className="bg-gray-200 h-12 w-12 rounded-full" />
									<div className="flex-1">
										<div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
										<div className="h-3 bg-gray-200 rounded w-1/4" />
									</div>
								</div>
							</div>
						))
					) : hospitalDogs.length === 0 ? (
						// Empty state
						<div className="flex justify-center items-center h-[120px] text-gray-500 flex-col">
							<div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-2">
								🏥
							</div>
							현재 병원에 입원한 강아지가 없습니다.
						</div>
					) : (
						// Hospital dogs list
						hospitalDogs.map((dog) => (
							<Link
								to={`/dogs/${dog.dogId}`}
								key={dog.dogId}
								className="w-full flex flex-col bg-white rounded-xl shadow-sm hover:shadow-[0_4px_12px_rgba(239,68,68,0.2)] transition-all duration-300 border border-gray-100 hover:-translate-y-0.5 hover:border-red-100"
							>
								<div className="flex items-center justify-between p-3.5">
									<div className="flex items-center gap-3 flex-1">
										<div className="bg-gradient-to-br from-red-50 to-red-100 rounded-full overflow-hidden h-12 w-12 flex-shrink-0 border border-red-200 p-0.5">
											{dog.imageUrl ? (
												<img
													src={dog.imageUrl}
													alt={dog.name}
													className="w-full h-full object-cover rounded-full"
												/>
											) : (
												<div className="w-full h-full flex items-center justify-center text-gray-400 rounded-full">
													🐶
												</div>
											)}
										</div>
										<div className="min-w-0">
											<div className="flex items-center gap-2">
												<span className="font-semibold text-gray-800 truncate">
													{dog.name}
												</span>
												<span className="text-xs bg-gradient-to-r from-red-500 to-red-600 text-white px-2.5 py-0.5 rounded-full whitespace-nowrap shadow-sm">
													입원중
												</span>
											</div>
											<p className="text-sm text-gray-500 mt-0.5">
												{formatAge(dog.ageMonth)}
											</p>
										</div>
									</div>
									<div className="bg-red-50 w-8 h-8 rounded-full flex items-center justify-center ml-2 flex-shrink-0 transition-colors duration-300">
										<MdArrowForwardIos className="text-red-400 hover:text-red-500" />
									</div>
								</div>
							</Link>
						))
					)}
				</div>
				{hasNextHospitalPage && (
					<div
						ref={hospitalObserverRef}
						className="py-3 text-center text-sm text-gray-400"
					>
						{isFetchingNextHospitalPage
							? "불러오는 중..."
							: "스크롤하여 더 보기"}
					</div>
				)}
			</div>

			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="sm:max-w-[425px] max-w-[90vw] rounded-2xl px-4 py-4 mx-auto bg-white shadow-xl border-0">
					<DialogHeader className="pb-2">
						<DialogTitle className="text-center text-xl font-bold text-male">
							예방 접종 일정 등록
						</DialogTitle>
						<DialogDescription className="text-center text-gray-500">
							필요한 정보를 입력해주세요 💉
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-5 py-4">
						<div className="grid sm:grid-cols-5 grid-cols-1 items-start gap-2 sm:gap-4">
							<Label
								htmlFor="title"
								className="sm:text-right text-[15px] text-male font-semibold sm:col-span-1"
							>
								일정 명
							</Label>
							<Input
								id="title"
								placeholder="예: 봄 예방접종"
								className="sm:col-span-4 rounded-lg shadow-sm focus:ring-male"
								value={form.title}
								onChange={(e) =>
									setForm({ ...form, title: e.target.value })
								}
							/>
						</div>
						<div className="grid sm:grid-cols-5 grid-cols-1 items-start gap-2 sm:gap-4">
							<Label className="sm:text-right text-[15px] text-male font-semibold sm:col-span-1">
								지역
							</Label>
							<div className="sm:col-span-4 flex flex-col gap-2">
								<div className="flex flex-wrap gap-2">
									{addressBook.map((ab) => {
										const isSelected =
											selectedAddressIds.includes(ab.id);
										return (
											<button
												type="button"
												key={ab.id}
												onClick={() => {
													const updated = isSelected
														? selectedAddressIds.filter(
																(id) =>
																	id !==
																	ab.id,
															)
														: [
																...selectedAddressIds,
																ab.id,
															];
													setSelectedAddressIds(
														updated,
													);
													setForm((prev) => ({
														...prev,
														locationIds: updated,
													}));
												}}
												className={`px-3 py-1 rounded-full text-sm font-medium border transition-all duration-200 ${
													isSelected
														? "bg-male text-white border-male"
														: "bg-gray-100 text-gray-700 border-gray-300"
												}`}
											>
												{ab.addressName}
											</button>
										);
									})}
								</div>
								{selectedAddressIds.length === 0 && (
									<span className="text-xs text-gray-400 mt-1">
										한 개 이상 선택해주세요
									</span>
								)}
							</div>
						</div>
						<div className="grid sm:grid-cols-5 grid-cols-1 items-start gap-2 sm:gap-4">
							<Label
								htmlFor="date"
								className="sm:text-right text-[15px] text-male font-semibold sm:col-span-1"
							>
								시행 일
							</Label>
							<Input
								type="date"
								className="sm:col-span-4 rounded-lg shadow-sm focus:ring-male"
								value={form.operatedDate}
								onChange={(e) =>
									setForm({
										...form,
										operatedDate: e.target.value,
									})
								}
							/>
						</div>
						<div className="grid sm:grid-cols-5 grid-cols-1 items-start gap-2 sm:gap-4">
							<Label
								htmlFor="content"
								className="sm:text-right text-[15px] text-male font-semibold sm:col-span-1"
							>
								내용
							</Label>
							<Input
								type="text"
								id="content"
								placeholder="특이사항을 입력해주세요"
								className="sm:col-span-4 rounded-lg shadow-sm focus:ring-male"
								value={form.content}
								onChange={(e) =>
									setForm({
										...form,
										content: e.target.value,
									})
								}
							/>
						</div>
					</div>
					<DialogFooter className="sm:justify-center pt-2">
						<Button
							onClick={handleSubmit}
							className="bg-gradient-to-r from-blue-500 to-male hover:from-blue-600 hover:to-blue transition-all duration-300 text-white text-sm rounded-full px-6 py-2 shadow-custom-sm w-full sm:w-auto active:scale-95"
						>
							등록하기
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
