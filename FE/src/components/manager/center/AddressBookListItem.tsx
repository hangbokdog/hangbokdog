import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogFooter,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	type AddressBookRequest,
	deleteAddressBookAPI,
	updateAddressBookAPI,
} from "@/api/center";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { MdEditNote } from "react-icons/md";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { LocationLabel } from "@/types/center";
import { toast } from "sonner";

interface AddressBookListItemProps {
	id: number;
	centerId: string;
	address: string;
	addressName: string;
	index: number;
	onUpdate: () => void;
}

export default function AddressBookListItem({
	id,
	centerId,
	address,
	addressName,
	index,
	onUpdate,
}: AddressBookListItemProps) {
	const [open, setOpen] = useState(false);
	const [form, setForm] = useState<AddressBookRequest>({
		addressName,
		address,
	});
	const deleteLocation = useMutation({
		mutationFn: (id: string) => deleteAddressBookAPI(centerId, id),
		onSuccess: () => {
			onUpdate();
			toast.success("주소 정보가 삭제되었습니다.");
		},
		onError: () => {
			toast.error("주소 정보 삭제에 실패했습니다.");
		},
	});

	const handleDelete = () => {
		deleteLocation.mutate(id.toString());
	};

	const editLocation = useMutation({
		mutationFn: (request: AddressBookRequest) =>
			updateAddressBookAPI(centerId, id.toString(), request),
		onSuccess: () => {
			setOpen(false);
			onUpdate();
			toast.success("주소 정보가 수정되었습니다.");
		},
		onError: () => {
			toast.error("주소 정보 수정에 실패했습니다.");
		},
	});

	const handleEditSubmit = () => {
		editLocation.mutate(form);
	};

	return (
		<div
			className={`flex items-center justify-between rounded-full py-1.5 px-4 font-medium ${index % 2 === 0 && "bg-superLightBlueGray"} hover:shadow-custom-sm`}
		>
			<div className="flex items-center w-[60%]">
				<span className="flex-1">{addressName}</span>
				<span className="flex-1 text-base font-light">
					{LocationLabel[address as keyof typeof LocationLabel] ||
						"잘못된 주소"}
				</span>
			</div>
			<button
				type="button"
				className="text-blueGray text-lg rounded-full py-0.5 px-4"
				onClick={() => setOpen(true)}
			>
				<MdEditNote />
			</button>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="max-w-sm">
					<DialogHeader>
						<DialogTitle>주소 정보 수정</DialogTitle>
					</DialogHeader>
					<div className="space-y-4 pt-2">
						<Input
							placeholder="지역명"
							defaultValue={addressName}
							value={
								LocationLabel[
									form.addressName as keyof typeof LocationLabel
								]
							}
							onBlur={(e) =>
								setForm((prev) => ({
									...prev,
									addressName: e.target.value,
								}))
							}
						/>
						<Select
							defaultValue={address}
							value={form.address}
							onValueChange={(value) =>
								setForm((prev) => ({
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
										<SelectItem key={key} value={key}>
											{label}
										</SelectItem>
									),
								)}
							</SelectContent>
						</Select>
					</div>
					<DialogFooter className="pt-4">
						<Button variant="destructive" onClick={handleDelete}>
							삭제
						</Button>
						<Button onClick={handleEditSubmit}>수정</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
