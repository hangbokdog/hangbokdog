import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useManagerStore from "@/lib/store/managerStore";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function DogDrugsPage() {
	const [open, setOpen] = useState(false);
	const { addressBook } = useManagerStore();
	const [selectedAddressId, setSelectedAddressId] = useState<
		number | undefined
	>();

	return (
		<div className="flex flex-col gap-4.5 mx-2.5">
			<button
				type="button"
				className="text-base font-bold bg-male hover:bg-blue text-white text-center px-4 py-2 rounded-full shadow-custom-sm"
				onClick={() => setOpen(true)}
			>
				예방 접종 일정 등록
			</button>
			<Link
				to="create"
				className="text-base font-bold bg-male hover:bg-blue text-white text-center px-4 py-2 rounded-full shadow-custom-sm"
			>
				예방 접종 일정
			</Link>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>예방 접종 일정 등록</DialogTitle>
						<DialogDescription>
							예방 접종 일정을 등록해주세요
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="name" className="text-right">
								일정 명
							</Label>
							<Input
								id="name"
								placeholder="일정 명 입력"
								className="col-span-3"
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="addressBook" className="text-right">
								지역
							</Label>
							<div className="col-span-3">
								<Select
									value={selectedAddressId?.toString()}
									onValueChange={(val) =>
										setSelectedAddressId(Number(val))
									}
								>
									<SelectTrigger>
										<SelectValue placeholder="지역 선택" />
									</SelectTrigger>
									<SelectContent>
										{addressBook.map((ab) => (
											<SelectItem
												key={ab.id}
												value={ab.id.toString()}
											>
												{ab.addressName}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="date" className="text-right">
								시행 일
							</Label>
							<Input type="date" className="w-[150px]" />
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="name" className="text-right">
								내용
							</Label>
							<Input
								type="text"
								id="name"
								placeholder="특이 사항이 있으면 입력해주세요"
								className="col-span-3"
							/>
						</div>
					</div>
					<DialogFooter>
						<Button type="submit">등록</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
			{/* <DogDrugsPanel /> */}
		</div>
	);
}
