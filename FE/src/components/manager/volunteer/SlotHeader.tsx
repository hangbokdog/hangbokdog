import { motion } from "framer-motion";
import { Clock, Users, ChevronUp, ChevronDown } from "lucide-react";

interface SlotHeaderProps {
	slotType: string;
	startTime: string;
	endTime: string;
	applicationCount: number;
	capacity: number;
	isOpen: boolean;
	onToggle: () => void;
	getSlotTypeText: (type: string) => string;
	getCapacityColorClass: (count: number, capacity: number) => string;
	formatTime: (time: string) => string;
}

export const SlotHeader = ({
	slotType,
	startTime,
	endTime,
	applicationCount,
	capacity,
	isOpen,
	onToggle,
	getSlotTypeText,
	getCapacityColorClass,
	formatTime,
}: SlotHeaderProps) => {
	return (
		<div className="p-3">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<Clock size={16} className="text-indigo-500" />
					<span className="font-medium">
						{getSlotTypeText(slotType)} {formatTime(startTime)} -{" "}
						{formatTime(endTime)}
					</span>
				</div>
				<div
					className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1
          ${getCapacityColorClass(applicationCount, capacity)}`}
				>
					<Users size={12} />
					{applicationCount}/{capacity}
				</div>
			</div>

			{applicationCount > 0 && (
				<div className="mt-2">
					<button
						className="flex justify-center items-center w-full py-1.5 bg-slate-50 rounded-md cursor-pointer hover:bg-slate-100 transition-colors"
						onClick={onToggle}
						aria-expanded={isOpen}
						type="button"
					>
						<div className="flex items-center gap-1.5 text-slate-500 text-sm">
							{isOpen ? "접기" : "신청자 보기"}
							{isOpen ? (
								<ChevronUp size={16} />
							) : (
								<ChevronDown size={16} />
							)}
						</div>
					</button>
				</div>
			)}
		</div>
	);
};
