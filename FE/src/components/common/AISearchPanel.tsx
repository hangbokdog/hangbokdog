import { useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { CiImageOn } from "react-icons/ci";
import AISearch from "@/assets/images/AISearch.svg";

interface AISearchPanelProps {
	onClose: () => void;
	onFileSelect?: (file: File) => void;
	title?: string;
}

export default function AISearchPanel({
	onClose,
	onFileSelect,
	title = "이미지로 강아지 검색",
}: AISearchPanelProps) {
	const [isDragging, setIsDragging] = useState(false);

	const handleDragEnter = () => {
		setIsDragging(true);
	};

	const handleDragLeave = () => {
		setIsDragging(false);
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files && files.length > 0 && onFileSelect) {
			onFileSelect(files[0]);
		}
	};

	const handleDrop = (e: React.DragEvent<HTMLButtonElement>) => {
		e.preventDefault();
		setIsDragging(false);

		if (
			e.dataTransfer.files &&
			e.dataTransfer.files.length > 0 &&
			onFileSelect
		) {
			onFileSelect(e.dataTransfer.files[0]);
		}
	};

	return (
		<div className="flex flex-col gap-3 bg-white rounded-3xl shadow-custom-sm p-2.5 transition-all duration-200 hover:shadow-md">
			<div className="relative flex items-center justify-center">
				<div className="flex items-center gap-1">
					<img
						src={AISearch}
						alt="AISearch"
						className="size-5 animate-pulse"
					/>
					<span className="text-primary font-semibold">{title}</span>
				</div>
				<button
					onClick={onClose}
					type="button"
					className="absolute right-0 flex items-center justify-center text-grayText size-6 cursor-pointer rounded-full hover:bg-background transition-colors p-1 active:scale-95"
				>
					<IoCloseOutline className="size-5" />
				</button>
			</div>
			<button
				type="button"
				className={`flex flex-col items-center justify-center bg-background rounded-xl p-10 cursor-pointer transition-all duration-200 w-full border-0 ${isDragging ? "bg-blue-50 border-2 border-dashed border-primary" : ""}`}
				onDragEnter={handleDragEnter}
				onDragOver={(e) => e.preventDefault()}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
				onClick={() =>
					document.getElementById("aiSearchFileInput")?.click()
				}
				aria-label="이미지 파일 업로드"
			>
				<input
					type="file"
					id="aiSearchFileInput"
					className="hidden"
					accept="image/*"
					onChange={handleFileChange}
				/>
				<CiImageOn
					className={`size-16 text-grayText mb-2 ${isDragging ? "text-primary animate-bounce" : ""}`}
				/>
				<span className="text-center text-grayText">
					클릭하여 이미지 선택
				</span>
				<span className="text-center text-grayText text-xs mt-2">
					또는 여기에 이미지 파일을 끌어다 놓으세요
				</span>
			</button>
		</div>
	);
}
