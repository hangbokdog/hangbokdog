import { LuPencil } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import type { UserInfoResponse } from "@/types/auth";

interface ProfileProps {
	data: UserInfoResponse;
}

export default function Profile({ data }: ProfileProps) {
	const navigate = useNavigate();

	const handleEditClick = () => {
		navigate("/my/edit");
	};

	return (
		<div className="flex flex-col items-center p-6 bg-background">
			{/* Image container with hover effect */}
			<div className="relative mb-4 group">
				<img
					src={data.profileImage || "/placeholder.svg"}
					alt={data.name}
					className="w-24 h-24 rounded-full object-cover"
				/>

				{/* Edit icon overlay - visible only on hover */}
				<div className="absolute inset-0 flex items-center justify-center bg-gray-400 bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
					<button
						type="button"
						onClick={handleEditClick}
						className="text-white p-2 rounded-full bg-gray-400 bg-opacity-60 hover:bg-opacity-80"
						aria-label="프로필 편집"
					>
						<LuPencil className="h-5 w-5" />
					</button>
				</div>
			</div>

			{/* Name below image */}
			<h2 className="text-lg font-semibold mt-2">{data.name}</h2>

			{/* Nickname below name */}
			<p className="text-sm text-gray-500 mt-1">{data.nickName}</p>
		</div>
	);
}
