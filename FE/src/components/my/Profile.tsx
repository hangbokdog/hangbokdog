import { FaPencilAlt } from "react-icons/fa";
import { ProfileInfo } from "./ProfileInfo";

interface ProfileProps {
	name: string;
	imageUrl?: string;
	email: string;
	onEdit?: () => void;
}

export default function Profile({
	name,
	imageUrl,
	email,
	onEdit,
}: ProfileProps) {
	return (
		<div className="flex items-center gap-3 p-4 bg-background">
			<div className="flex flex-col flex-1">
				<ProfileInfo name={name} imageUrl={imageUrl} email={email} />
			</div>
			{onEdit && (
				<FaPencilAlt
					className="h-4 w-4 cursor-pointer text-gray-500 hover:text-gray-700"
					onClick={onEdit}
					aria-label="프로필 편집"
				/>
			)}
		</div>
	);
}
