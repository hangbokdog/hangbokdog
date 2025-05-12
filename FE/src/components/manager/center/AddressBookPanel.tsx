import {
	type AddressBookRequest,
	createAddressBookAPI,
	fetchAddressBooks,
} from "@/api/center";
import useCenterStore from "@/lib/store/centerStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import AddressBookListItem from "./AddressBookListItem";
import { useState } from "react";
import { FaPlusCircle } from "react-icons/fa";
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { LocationLabel } from "@/types/center";
import { toast } from "sonner";

export default function AddressBookPanel() {
	const { selectedCenter } = useCenterStore();
	const [formData, setFormData] = useState<AddressBookRequest>({
		address: "",
		addressName: "",
	});
	const [open, setOpen] = useState(false);

	const { refetch, data } = useQuery({
		queryKey: ["addressBooks", selectedCenter?.centerId],
		queryFn: () => fetchAddressBooks(selectedCenter?.centerId as string),
	});

	const handleCreateButtonClick = () => {
		setOpen(true);
	};

	const handleInputCancel = () => {
		setOpen(false);
		setFormData({
			address: "",
			addressName: "",
		});
	};

	const { mutate: registerCenter } = useMutation({
		mutationFn: () =>
			createAddressBookAPI(selectedCenter?.centerId || "", formData),
		onSuccess: () => {
			refetch();
			setFormData((prev) => ({
				...prev,
				addressName: "",
			}));
			setOpen(false);
		},
		onError: (e) => {
			console.error(e);
			toast.error("생성에 실패했습니다.");
		},
	});

	const handleSubmit = () => {
		if (formData.addressName === "" || formData.address === "") {
			toast.error("주소와 지역명을 입력해주세요.");
			return;
		}

		registerCenter();
	};

	return (
		<div className="flex flex-col bg-white rounded-lg shadow-custom-sm p-4 text-grayText font-semibold gap-2">
			<span className="text-lg font-bold">지역</span>

			<div className="flex flex-col">
				<button
					type="button"
					onClick={handleCreateButtonClick}
					className="flex items-center justify-center rounded-full px-4 py-2.5 font-medium bg-superLightBlueGray hover:shadow-[inset_0_0_8px_rgba(194,209,252,1)] transition-shadow duration-300 cursor-pointer"
				>
					<FaPlusCircle />
				</button>

				<Drawer open={open} onOpenChange={setOpen} autoFocus={open}>
					<DrawerContent>
						<div className="mx-auto w-full max-w-sm">
							<DrawerHeader>
								<DrawerTitle>새 주소 추가</DrawerTitle>
							</DrawerHeader>
							<div className="p-4 pb-0 space-y-4">
								<Input
									placeholder="지역명"
									defaultValue={formData.addressName}
									onBlur={(e) => {
										setFormData((prev) => ({
											...prev,
											addressName: e.target.value,
										}));
									}}
								/>

								<Select
									value={formData.address}
									onValueChange={(value) =>
										setFormData((prev) => ({
											...prev,
											address: value,
										}))
									}
								>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="지역을 선택하세요" />
									</SelectTrigger>
									<SelectContent aria-modal={false}>
										{Object.entries(LocationLabel).map(
											([key, label]) => (
												<SelectItem
													key={key}
													value={key}
												>
													{label}
												</SelectItem>
											),
										)}
									</SelectContent>
								</Select>
							</div>
							<DrawerFooter>
								<Button onClick={handleSubmit}>추가</Button>
								<Button
									variant="outline"
									onClick={handleInputCancel}
								>
									취소
								</Button>
							</DrawerFooter>
						</div>
					</DrawerContent>
				</Drawer>

				{data?.map((center, index) => (
					<AddressBookListItem
						key={center.id}
						id={center.id}
						centerId={selectedCenter?.centerId as string}
						address={center.address}
						addressName={center.addressName}
						index={index + 1}
						onUpdate={() => {
							refetch();
						}}
					/>
				))}
			</div>
		</div>
	);
}
