import { ArrowRight, Calendar, Info, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { VolunteerItemProps } from "@/types/volunteer";
import { ApplicantsList } from "./ApplicantsList";
import { Link } from "react-router-dom";

export const VolunteerItem = ({
	volunteer,
	onDelete,
	formatDate,
}: VolunteerItemProps) => {
	return (
		<div key={volunteer.id} className="border rounded-md p-3 bg-gray-50">
			<div className="flex justify-between">
				<div className="flex-1">
					<div className="flex items-center justify-between">
						<h4 className="font-medium">{volunteer.title}</h4>
						<div className="flex items-center gap-2">
							<Sheet>
								<SheetTrigger asChild>
									<Button
										variant="ghost"
										size="icon"
										className="rounded-full hover:bg-gray-200 h-8 w-8"
									>
										<Users className="w-4 h-4 text-blue-500" />
									</Button>
								</SheetTrigger>
								<SheetContent
									side="right"
									className="overflow-y-auto w-full sm:max-w-sm md:w-[440px] py-5 px-2.5 bg-background flex flex-col h-full"
								>
									<SheetHeader className="p-0">
										<SheetTitle className="flex items-center text-xl">
											<Users className="w-5 h-5 mr-2 text-male" />
											봉사 신청자 관리
										</SheetTitle>
										<SheetDescription>
											<span className="text-lg font-medium text-primary">
												{volunteer.title}
											</span>
											<br />
											<span className="text-base text-grayText">
												{formatDate(
													volunteer.startDate,
												)}{" "}
												~{" "}
												{formatDate(volunteer.endDate)}
											</span>
										</SheetDescription>
									</SheetHeader>

									<div className="flex-1 overflow-y-auto">
										<ApplicantsList
											formatDate={formatDate}
											eventId={volunteer.id}
										/>
									</div>

									<SheetFooter className="mt-auto pt-4 pb-2 sticky bottom-0 bg-background p-0">
										<SheetClose asChild>
											<Button
												variant="outline"
												className="bg-superLightBlueGray w-full sm:w-auto"
											>
												닫기
											</Button>
										</SheetClose>
									</SheetFooter>
								</SheetContent>
							</Sheet>

							<AlertDialog>
								<AlertDialogTrigger asChild>
									<Button
										variant="ghost"
										size="icon"
										className="rounded-full hover:bg-gray-200 h-8 w-8"
									>
										<Trash2 className="w-4 h-4 text-red-500" />
									</Button>
								</AlertDialogTrigger>
								<AlertDialogContent>
									<AlertDialogHeader>
										<AlertDialogTitle>
											봉사활동 일정 삭제
										</AlertDialogTitle>
										<AlertDialogDescription>
											"{volunteer.title}" 일정을
											삭제하시겠습니까? 이 작업은 되돌릴
											수 없습니다.
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel>
											취소
										</AlertDialogCancel>
										<AlertDialogAction
											className="bg-red-500 hover:bg-red-600"
											onClick={() =>
												onDelete(volunteer.id)
											}
										>
											삭제하기
										</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						</div>
					</div>
					<p className="text-sm text-gray-600 flex items-center mt-1">
						<Calendar className="w-4 h-4 mr-1 text-gray-400" />
						{formatDate(volunteer.startDate)} ~{" "}
						{formatDate(volunteer.endDate)}
					</p>
					<div className="flex items-center justify-between">
						<p className="text-sm text-gray-600 flex items-center mt-1 truncate">
							<Info className="w-4 h-4 mr-1 text-gray-400 flex-shrink-0" />
							{volunteer.content}
						</p>
						<Link to={`/volunteer/${volunteer.id}`}>
							<Button
								className="rounded-full bg-white hover:bg-gray-200 h-8 w-8"
								size="icon"
							>
								<ArrowRight className="w-4 h-4 text-primary" />
							</Button>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};
