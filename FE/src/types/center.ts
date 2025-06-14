export const locations = {
	SEOUL: "SEOUL",
	BUSAN: "BUSAN",
	DAEGU: "DAEGU",
	INCHEON: "INCHEON",
	GWANGJU: "GWANGJU",
	DAEJEON: "DAEJEON",
	ULSAN: "ULSAN",
	SEJONG: "SEJONG",
	SUWON: "SUWON",
	SEONGNAM: "SEONGNAM",
	GOYANG: "GOYANG",
	PAJU: "PAJU",
	YONGIN: "YONGIN",
	BUCHEON: "BUCHEON",
	ANYANG: "ANYANG",
	NAMYANGJU: "NAMYANGJU",
	HWASEONG: "HWASEONG",
	UIJEONGBU: "UIJEONGBU",
	SIHEUNG: "SIHEUNG",
	PYEONGTAEK: "PYEONGTAEK",
	GIMPO: "GIMPO",
	GWANGMYEONG: "GWANGMYEONG",
	GURI: "GURI",
	OSAN: "OSAN",
	GUNPO: "GUNPO",
	UIWANG: "UIWANG",
	HANAM: "HANAM",
	ICHON: "ICHON",
	ANSEONG: "ANSEONG",
	POCHEON: "POCHEON",
	YANGJU: "YANGJU",
	DONGDUCHEON: "DONGDUCHEON",
	CHUNCHEON: "CHUNCHEON",
	WONJU: "WONJU",
	GANGNEUNG: "GANGNEUNG",
	DONGHAE: "DONGHAE",
	TAEBAEK: "TAEBAEK",
	SOKCHO: "SOKCHO",
	SAMCHEOK: "SAMCHEOK",
	CHEONGJU: "CHEONGJU",
	CHUNGJU: "CHUNGJU",
	JECHEON: "JECHEON",
	CHEONAN: "CHEONAN",
	GONGJU: "GONGJU",
	ASAN: "ASAN",
	BORYEONG: "BORYEONG",
	SEOSAN: "SEOSAN",
	NONSAN: "NONSAN",
	GYERYONG: "GYERYONG",
	JEONJU: "JEONJU",
	GUNSAN: "GUNSAN",
	IKSAN: "IKSAN",
	NAMWON: "NAMWON",
	GIMJE: "GIMJE",
	MOKPO: "MOKPO",
	YEOSU: "YEOSU",
	SUNCHEON: "SUNCHEON",
	GWANGYANG: "GWANGYANG",
	NAJU: "NAJU",
	POHANG: "POHANG",
	GUMI: "GUMI",
	GYEONGJU: "GYEONGJU",
	ANDONG: "ANDONG",
	YEONGJU: "YEONGJU",
	MUNGYEONG: "MUNGYEONG",
	SANGJU: "SANGJU",
	YEONGCHEON: "YEONGCHEON",
	CHANGWON: "CHANGWON",
	JINJU: "JINJU",
	TONGYEONG: "TONGYEONG",
	SACHEON: "SACHEON",
	GIMHAE: "GIMHAE",
	MIRYANG: "MIRYANG",
	YANGSAN: "YANGSAN",
	JEJU: "JEJU",
	SEOGWIPO: "SEOGWIPO",
} as const;

export type Location = (typeof locations)[keyof typeof locations];

export const LocationLabel: Record<keyof typeof locations, string> = {
	SEOUL: "서울",
	BUSAN: "부산",
	DAEGU: "대구",
	INCHEON: "인천",
	GWANGJU: "광주",
	DAEJEON: "대전",
	ULSAN: "울산",
	SEJONG: "세종",
	SUWON: "수원",
	SEONGNAM: "성남",
	GOYANG: "고양",
	PAJU: "파주",
	YONGIN: "용인",
	BUCHEON: "부천",
	ANYANG: "안양",
	NAMYANGJU: "남양주",
	HWASEONG: "화성",
	UIJEONGBU: "의정부",
	SIHEUNG: "시흥",
	PYEONGTAEK: "평택",
	GIMPO: "김포",
	GWANGMYEONG: "광명",
	GURI: "구리",
	OSAN: "오산",
	GUNPO: "군포",
	UIWANG: "의왕",
	HANAM: "하남",
	ICHON: "이천",
	ANSEONG: "안성",
	POCHEON: "포천",
	YANGJU: "양주",
	DONGDUCHEON: "동두천",
	CHUNCHEON: "춘천",
	WONJU: "원주",
	GANGNEUNG: "강릉",
	DONGHAE: "동해",
	TAEBAEK: "태백",
	SOKCHO: "속초",
	SAMCHEOK: "삼척",
	CHEONGJU: "청주",
	CHUNGJU: "충주",
	JECHEON: "제천",
	CHEONAN: "천안",
	GONGJU: "공주",
	ASAN: "아산",
	BORYEONG: "보령",
	SEOSAN: "서산",
	NONSAN: "논산",
	GYERYONG: "계룡",
	JEONJU: "전주",
	GUNSAN: "군산",
	IKSAN: "익산",
	NAMWON: "남원",
	GIMJE: "김제",
	MOKPO: "목포",
	YEOSU: "여수",
	SUNCHEON: "순천",
	GWANGYANG: "광양",
	NAJU: "나주",
	POHANG: "포항",
	GUMI: "구미",
	GYEONGJU: "경주",
	ANDONG: "안동",
	YEONGJU: "영주",
	MUNGYEONG: "문경",
	SANGJU: "상주",
	YEONGCHEON: "영천",
	CHANGWON: "창원",
	JINJU: "진주",
	TONGYEONG: "통영",
	SACHEON: "사천",
	GIMHAE: "김해",
	MIRYANG: "밀양",
	YANGSAN: "양산",
	JEJU: "제주",
	SEOGWIPO: "서귀포",
};

export interface CenterStatsResponse {
	totalDogCount: number;
	lastMonthDogCount: number;
	fosterCount: number;
	lastMonthFosterCount: number;
	adoptionCount: number;
	monthlyDonationAmount: number;
	hospitalCount: number;
	protectedDog: number;
	centerMileageAmount: number;
	monthlyVolunteerParticipantCount: number;
}

export interface MyCenter {
	centerId: number;
	centerName: string;
	centerGrade: string;
}

export interface CenterMemberThumb {
	id: number;
	name: string;
	nickname: string;
	profileImage: string | null;
	centerGrade: "MANAGER" | "USER";
}

export interface MemberResponses {
	data: CenterMemberThumb[];
	pageToken: string | null;
	hasNext: boolean;
}

export interface CenterMembersResponse {
	memberResponses: MemberResponses;
	count: number;
}

export interface CenterMember {
	id: number;
	profileImage: string | null;
	name: string;
	nickname: string;
	grade: "MANAGER" | "USER";
	email: string;
	phone: string;
	joinedAt: string;
}

export interface CenterStatisticsResponse {
	totalMemberCount: number;
	newMemberCount: number;
	volunteerParticipantCount: number;
	managerMemberCount: number;
	normalMemberCount: number;
}
