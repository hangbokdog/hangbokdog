import { useState } from "react";
import PanelTitle from "../common/PanelTitle";
import { cn } from "@/lib/utils";
import VolunteerTabContent from "./tabs/VolunteerTabContent";
import DogsTabContent from "./tabs/DogsTabContent";
import PostsTabContent from "./tabs/PostsTabContent";

type TabType = "volunteer" | "dogs" | "posts";

export default function MyActivitiesPanel() {
	const [activeTab, setActiveTab] = useState<TabType>("volunteer");

	const renderTabContent = () => {
		switch (activeTab) {
			case "volunteer":
				return <VolunteerTabContent />;
			case "dogs":
				return <DogsTabContent />;
			case "posts":
				return <PostsTabContent />;
			default:
				return null;
		}
	};

	return (
		<div className="flex flex-col p-2.5 mx-2.5 rounded-xl bg-white">
			<PanelTitle title="나의 활동" link="/my/activities" />

			{/* Tabs */}
			<div className="flex border-b mb-2.5">
				<button
					type="button"
					className={cn(
						"flex-1 text-sm py-2 font-medium",
						activeTab === "volunteer"
							? "text-male border-b-2 border-male"
							: "text-gray-500",
					)}
					onClick={() => setActiveTab("volunteer")}
				>
					봉사
				</button>
				<button
					type="button"
					className={cn(
						"flex-1 text-sm py-2 font-medium",
						activeTab === "dogs"
							? "text-male border-b-2 border-male"
							: "text-gray-500",
					)}
					onClick={() => setActiveTab("dogs")}
				>
					강아지
				</button>
				<button
					type="button"
					className={cn(
						"flex-1 text-sm py-2 font-medium",
						activeTab === "posts"
							? "text-male border-b-2 border-male"
							: "text-gray-500",
					)}
					onClick={() => setActiveTab("posts")}
				>
					게시글
				</button>
			</div>

			{renderTabContent()}
		</div>
	);
}
