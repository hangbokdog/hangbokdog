import { motion } from "framer-motion";
import { format } from "date-fns";
import {
	User,
	Phone,
	Mail,
	CheckCircle,
	XCircle,
	BadgeCheck,
	BadgeX,
	Loader2,
} from "lucide-react";
import type { SlotApplicant } from "@/types/volunteer";

interface ApplicantCardProps {
	applicant: SlotApplicant;
	processingApplicants: Record<number, boolean>;
	recentAction: { id: number; action: "approve" | "reject" } | null;
	onApprove: (id: number) => void;
	onReject: (id: number) => void;
	index: number;
}

export const ApplicantCard = ({
	applicant,
	processingApplicants,
	recentAction,
	onApprove,
	onReject,
	index,
}: ApplicantCardProps) => {
	return (
		<motion.div
			key={applicant.id}
			className="bg-white rounded-lg p-4 shadow-sm border border-slate-100 hover:border-indigo-200 transition-colors"
			initial={{ opacity: 0, y: 20 }}
			animate={{
				opacity: 1,
				y: 0,
				scale: recentAction?.id === applicant.id ? [1, 1.03, 1] : 1,
			}}
			transition={{
				duration: 0.3,
				delay: index * 0.05,
				scale: {
					duration: 0.5,
				},
			}}
			layout
		>
			<div className="flex justify-between items-start">
				<div className="flex items-center gap-3">
					<motion.div
						className="relative"
						whileHover={{ scale: 1.1 }}
						transition={{ duration: 0.2 }}
					>
						{applicant.profileImage ? (
							<img
								src={applicant.profileImage}
								alt={applicant.name}
								className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm"
							/>
						) : (
							<div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-100 to-violet-50 flex items-center justify-center border-2 border-white shadow-sm">
								<User size={18} className="text-indigo-500" />
							</div>
						)}
						{applicant.status !== "PENDING" && (
							<motion.div
								className={`absolute -bottom-1 -right-1 rounded-full p-1 ${
									applicant.status === "APPROVED"
										? "bg-emerald-500"
										: "bg-rose-500"
								}`}
								initial={{ scale: 0 }}
								animate={{ scale: 1 }}
								transition={{ delay: 0.2 }}
							>
								{applicant.status === "APPROVED" ? (
									<BadgeCheck
										size={12}
										className="text-white"
									/>
								) : (
									<BadgeX size={12} className="text-white" />
								)}
							</motion.div>
						)}
					</motion.div>
					<div>
						<div className="font-medium flex items-center gap-1.5">
							{applicant.name}
							<span className="text-sm text-slate-500">
								({applicant.nickname})
							</span>
						</div>
						<div className="text-sm text-slate-500">
							{applicant.age}세 | {applicant.grade}
						</div>
					</div>
				</div>

				<div className="flex items-center gap-2">
					{applicant.status === "PENDING" ? (
						<>
							{processingApplicants[applicant.id] ? (
								<motion.div
									animate={{
										rotate: 360,
										transition: {
											duration: 1,
											repeat: Number.POSITIVE_INFINITY,
											ease: "linear",
										},
									}}
								>
									<Loader2
										size={18}
										className="text-indigo-600 mr-2"
									/>
								</motion.div>
							) : (
								<>
									<motion.button
										className="rounded-full p-1.5 text-emerald-500 hover:bg-emerald-50 transition-colors"
										aria-label="승인"
										title="승인"
										type="button"
										onClick={() => onApprove(applicant.id)}
										disabled={
											processingApplicants[applicant.id]
										}
										whileHover={{
											scale: 1.15,
											backgroundColor: "rgb(240 253 244)",
										}}
										whileTap={{ scale: 0.9 }}
									>
										<CheckCircle size={20} />
									</motion.button>
									<motion.button
										className="rounded-full p-1.5 text-rose-500 hover:bg-rose-50 transition-colors"
										aria-label="거절"
										title="거절"
										type="button"
										onClick={() => onReject(applicant.id)}
										disabled={
											processingApplicants[applicant.id]
										}
										whileHover={{
											scale: 1.15,
											backgroundColor: "rgb(254 242 242)",
										}}
										whileTap={{ scale: 0.9 }}
									>
										<XCircle size={20} />
									</motion.button>
								</>
							)}
						</>
					) : (
						<motion.span
							className={`px-2.5 py-1 rounded-full text-xs font-medium ${
								applicant.status === "APPROVED"
									? "bg-emerald-100 text-emerald-800"
									: "bg-rose-100 text-rose-800"
							}`}
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.3 }}
						>
							{applicant.status === "APPROVED"
								? "승인됨"
								: "거절됨"}
						</motion.span>
					)}
				</div>
			</div>

			<motion.div
				className="mt-3 grid grid-cols-1 gap-2 text-sm bg-slate-50 p-2.5 rounded-lg"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.2 }}
			>
				<div className="flex items-center gap-2">
					<Phone size={14} className="text-indigo-400" />
					<span className="font-medium">
						{applicant.phone || "-"}
					</span>
				</div>
				<div className="flex items-center gap-2">
					<Mail size={14} className="text-indigo-400" />
					<span>{applicant.email || "-"}</span>
				</div>
				<div className="text-xs text-slate-400 mt-1">
					신청일:{" "}
					{format(new Date(applicant.createdAt), "yyyy.MM.dd HH:mm")}
				</div>
			</motion.div>
		</motion.div>
	);
};
