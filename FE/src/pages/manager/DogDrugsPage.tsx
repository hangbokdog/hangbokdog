import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { MdArrowForwardIos } from "react-icons/md";
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
import useCenterStore from "@/lib/store/centerStore";

export default function DogDrugsPage() {
	const [open, setOpen] = useState(false);
	const { addressBook } = useManagerStore();
	const [selectedAddressIds, setSelectedAddressIds] = useState<number[]>([]);
	const { selectedCenter } = useCenterStore();
	const observerRef = useRef<HTMLDivElement | null>(null);
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
						document.querySelector(".overflow-y-auto");
					if (listContainer) {
						listContainer.scrollTo({ top: 0, behavior: "smooth" });
					}
				});
		},
	});

	const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
		useInfiniteQuery({
			queryKey: ["vaccinationSummaries", selectedCenter?.centerId],
			queryFn: ({ pageParam }: { pageParam?: string }) =>
				fetchVaccinationSummariesAPI(
					Number(selectedCenter?.centerId),
					pageParam,
				),
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

	useEffect(() => {
		if (!observerRef.current || !hasNextPage) return;
		const observer = new IntersectionObserver(
			(entries) => {
				if (
					entries[0].isIntersecting &&
					hasNextPage &&
					!isFetchingNextPage
				) {
					fetchNextPage();
				}
			},
			{ threshold: 1.0 },
		);

		observer.observe(observerRef.current);
		return () => {
			if (observerRef.current) {
				observer.unobserve(observerRef.current);
			}
		};
	}, [hasNextPage, isFetchingNextPage, fetchNextPage]);

	return (
		<div className="flex flex-col gap-4.5 mx-2.5 text-grayText">
			<div className="flex flex-col gap-4.5 w-full bg-white rounded-lg shadow-custom-sm pt-4">
				<span className="flex justify-between items-center mx-4">
					<span className="font-bold text-lg">예방 접종 일정</span>
					<button
						type="button"
						className="flex gap-2 items-center text-sm font-semibold bg-male hover:bg-blue text-white text-center pl-4 pr-2 py-2 rounded-full shadow-custom-sm"
						onClick={() => setOpen(true)}
					>
						일정 등록
						<MdArrowForwardIos />
					</button>
				</span>
				<div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto scrollbar-hide px-4 py-4">
					{data?.pages
						.flatMap((page) => page.data)
						.map((item, index) => (
							<Link
								to={`/manager/dog-management/vaccination/${item.vaccinationId}`}
								key={`${item.vaccinationId}-${index}`}
								className="w-full flex flex-col bg-white rounded-lg shadow-sm hover:shadow-[0_4px_12px_rgba(59,130,246,0.2)] transition-all duration-300 border border-gray-100 hover:-translate-y-0.5 hover:border-blue-100"
							>
								<div className="flex items-center justify-between p-4">
									<div className="flex flex-col gap-1 flex-1 min-w-0">
										<div className="flex items-center gap-2">
											<span className="font-semibold text-gray-800 truncate">
												{item.title}
											</span>
											<span className="text-xs text-white bg-male px-2 py-0.5 rounded-full whitespace-nowrap">
												{item.operatedDate?.split(
													"T",
												)[0] || ""}
											</span>
										</div>
										{item.content && (
											<p className="text-sm text-gray-600 truncate">
												{item.content}
											</p>
										)}
										<div className="flex flex-wrap gap-1 mt-1">
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
									<MdArrowForwardIos className="text-gray-400 hover:text-male ml-2 flex-shrink-0 transition-colors duration-300" />
								</div>
							</Link>
						))}
					{(!data || data.pages[0]?.data?.length === 0) && (
						<div className="flex justify-center items-center h-full text-gray-500">
							예방 접종 일정이 없습니다.
						</div>
					)}
				</div>
				{hasNextPage && (
					<div
						ref={observerRef}
						className="py-4 text-center text-sm text-gray-400"
					>
						{isFetchingNextPage
							? "불러오는 중..."
							: "스크롤하여 더 보기"}
					</div>
				)}
			</div>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="sm:max-w-[425px] rounded-2xl px-6 py-4">
					<DialogHeader>
						<DialogTitle className="text-center text-xl font-bold text-male">
							예방 접종 일정 등록
						</DialogTitle>
						<DialogDescription className="text-center text-gray-500">
							필요한 정보를 입력해주세요 💉
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-5 py-4">
						<div className="grid grid-cols-5 items-center gap-4">
							<Label
								htmlFor="title"
								className="col-span-1 text-right text-[15px] text-male font-semibold"
							>
								일정 명
							</Label>
							<Input
								id="title"
								placeholder="예: 봄 예방접종"
								className="col-span-4 rounded-lg shadow-sm focus:ring-male"
								value={form.title}
								onChange={(e) =>
									setForm({ ...form, title: e.target.value })
								}
							/>
						</div>
						<div className="grid grid-cols-5 items-start gap-4">
							<Label className="col-span-1 text-right text-[15px] text-male font-semibold">
								지역
							</Label>
							<div className="col-span-4 flex flex-col gap-2">
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
												className={`px-3 py-1 rounded-full text-sm font-medium border ${
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
						<div className="grid grid-cols-5 items-center gap-4">
							<Label
								htmlFor="date"
								className="col-span-1 text-right text-[15px] text-male font-semibold"
							>
								시행 일
							</Label>
							<Input
								type="date"
								className="col-span-4 rounded-lg shadow-sm focus:ring-male"
								value={form.operatedDate}
								onChange={(e) =>
									setForm({
										...form,
										operatedDate: e.target.value,
									})
								}
							/>
						</div>
						<div className="grid grid-cols-5 items-center gap-4">
							<Label
								htmlFor="content"
								className="col-span-1 text-right text-[15px] text-male font-semibold"
							>
								내용
							</Label>
							<Input
								type="text"
								id="content"
								placeholder="특이사항을 입력해주세요"
								className="col-span-4 rounded-lg shadow-sm focus:ring-male"
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
					<DialogFooter>
						<Button
							onClick={handleSubmit}
							className="bg-male hover:bg-blue text-white text-sm rounded-full px-6 py-2 shadow-md"
						>
							등록하기
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
