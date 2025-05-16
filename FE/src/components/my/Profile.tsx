import { useQuery } from "@tanstack/react-query";
import { getUserInfoAPI } from "@/api/auth";
import { ProfileInfo } from "./ProfileInfo";
import { LuPencil } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

interface ProfileProps {
	onEdit?: () => void;
}

export default function Profile({ onEdit }: ProfileProps) {
	const navigate = useNavigate();

	const handleEditClick = () => {
		if (onEdit) onEdit();
		navigate("/my/edit");
	};

	const { data, isLoading, error } = useQuery({
		queryKey: ["userInfo"],
		queryFn: getUserInfoAPI,
	});

	if (isLoading) return <div className="p-4">불러오는 중...</div>;
	if (error || !data)
		return <div className="p-4">사용자 정보를 불러올 수 없습니다.</div>;

	return (
		<div className="flex items-center gap-3 p-4 bg-background">
			<div className="flex flex-col flex-1">
				<ProfileInfo
					name={data.name}
					imageUrl={data.profileImage}
					nickname={data.nickName} // nickname을 email 자리에 사용
				/>
			</div>
			<LuPencil
				className="h-4 w-4 cursor-pointer text-gray-500 hover:text-gray-700"
				onClick={handleEditClick}
				aria-label="프로필 편집"
			/>
		</div>
	);
}
