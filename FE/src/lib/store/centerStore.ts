import { create } from "zustand";

interface Center {
	centerId: string;
	centerName: string;
	status: string;
	centerJoinRequestId?: string;
	myMainCenterId?: string;
}

interface CenterState {
	selectedCenter: Center | null;
	isCenterMember: boolean;
	myMainCenterId: string;
	setSelectedCenter: (center: Center) => void;
	setIsCenterMember: (isMember: boolean) => void;
	clearSelectedCenter: () => void;
	setMyMainCenterId: (myMainCenterId: string) => void;
}

const getStoredCenter = (): Center | null => {
	const stored = sessionStorage.getItem("selectedCenter");
	return stored ? JSON.parse(stored) : null;
};

const getStoredCenterMember = (): boolean => {
	const stored = sessionStorage.getItem("isCenterMember");
	return stored === "true";
};

const getStoredMyMainCenterId = (): string | null => {
	const stored = sessionStorage.getItem("myMainCenterId");
	return stored ? JSON.parse(stored) : null;
};

const useCenterStore = create<CenterState>()((set) => ({
	selectedCenter: getStoredCenter(),
	isCenterMember: getStoredCenterMember(),
	myMainCenterId: getStoredMyMainCenterId() || "",
	setSelectedCenter: (center: Center) => {
		sessionStorage.setItem("selectedCenter", JSON.stringify(center));
		set({ selectedCenter: center });
	},
	setIsCenterMember: (isMember: boolean) => {
		sessionStorage.setItem("isCenterMember", isMember.toString());
		set({ isCenterMember: isMember });
	},
	clearSelectedCenter: () => {
		sessionStorage.removeItem("selectedCenter");
		sessionStorage.removeItem("isCenterMember");
		sessionStorage.removeItem("myMainCenterId");
		set({
			selectedCenter: null,
			isCenterMember: false,
			myMainCenterId: "",
		});
	},
	setMyMainCenterId: (myMainCenterId: string) => {
		sessionStorage.setItem(
			"myMainCenterId",
			JSON.stringify(myMainCenterId),
		);
		set({ myMainCenterId });
	},
}));

export default useCenterStore;
