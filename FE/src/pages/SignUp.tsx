import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import SignUpHeader from "@/components/signup/SignUpHeader";
import SignUpForm from "@/components/signup/SignUpForm";
import SignUpTerms from "@/components/signup/SignUpTerms";
import SignUpButton from "@/components/signup/SignUpButton";
import { useMutation } from "@tanstack/react-query";
import { getUserInfoAPI, signUpAPI } from "@/api/auth";
import { toast } from "sonner";
import useAuthStore from "@/lib/store/authStore";
import { useFormatDate } from "@/lib/hooks/useFormatDate";
import { registerFCMToken } from "@/api/notification";
import { requestFCMToken } from "@/config/firebase";
import type { UserInfoResponse } from "@/types/auth";
import { useNotification } from "@/lib/hooks/useNotification";

export default function SignUp() {
	const navigate = useNavigate();
	const { user, setToken, setTempToken, setUserInfo } = useAuthStore();
	const { requestNotificationPermission } = useNotification();
	const [nickname, setNickname] = useState<string>("");
	const [phoneNumber, setPhoneNumber] = useState<string>("");
	const [birthDate, setBirthDate] = useState<string>("");
	const [isNicknameValid, setIsNicknameValid] = useState<boolean>(false);
	const [isNicknameUnique, setIsNicknameUnique] = useState<boolean>(false);
	const [isPhoneValid, setIsPhoneValid] = useState<boolean>(false);
	const [isBirthDateValid, setIsBirthDateValid] = useState<boolean>(false);
	const [isTermsChecked, setIsTermsChecked] = useState<boolean>(false);
	const [isEmergencyAlertChecked, setIsEmergencyAlertChecked] =
		useState<boolean>(false);
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const signupTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const { formatBirthDate } = useFormatDate();

	const isFormValid =
		isNicknameValid &&
		isNicknameUnique &&
		isPhoneValid &&
		isBirthDateValid &&
		isTermsChecked;

	// FCM 토큰을 요청하고 백엔드에 저장하는 함수
	const handleFCMTokenSetup = useCallback(async () => {
		try {
			// 알림 권한 먼저 요청
			const permissionResult = await requestNotificationPermission();
			console.log("알림 권한 요청 결과:", permissionResult);

			// 권한이 부여되지 않았다면 토큰 요청 중단
			if (permissionResult !== "granted") {
				console.warn(
					"알림 권한이 거부되었습니다. FCM 토큰을 등록할 수 없습니다.",
				);

				// 사용자에게 권한이 거부되었음을 알림
				if (permissionResult === "denied") {
					toast.warning(
						"알림 권한이 거부되었습니다. 알림을 받으려면 브라우저 설정에서 권한을 허용해주세요.",
					);
				}
				return;
			}

			// 알림 권한이 부여되었다면 FCM 토큰 요청
			const fcmToken = await requestFCMToken();

			if (fcmToken) {
				console.log("FCM 토큰 등록 시작:", fcmToken);

				// 토큰을 백엔드에 저장
				await registerFCMToken(fcmToken);
				console.log("FCM 토큰 등록 성공");
				toast.success("알림 설정이 완료되었습니다.");
			} else {
				console.warn("FCM 토큰을 가져올 수 없어 등록할 수 없습니다.");
				toast.error(
					"알림 설정에 실패했습니다. 나중에 마이페이지에서 다시 시도해주세요.",
				);
			}
		} catch (error) {
			console.error("FCM 토큰 처리 중 오류 발생:", error);
			toast.error(
				"알림 설정에 실패했습니다. 나중에 마이페이지에서 다시 시도해주세요.",
			);
		}
	}, [requestNotificationPermission]);

	const signUpMutation = useMutation({
		mutationFn: signUpAPI,
		onSuccess: async () => {
			if (user.tempToken) {
				setToken(user.tempToken);
				setTempToken("");
			}

			const userInfo: UserInfoResponse = await getUserInfoAPI();
			setUserInfo(
				userInfo.memberId,
				userInfo.nickName,
				userInfo.profileImage,
				// isEmergencyAlertChecked, // 응급 알림 동의 상태에 따라 notification 값 설정
			);

			// 회원가입 성공 토스트
			toast.success("회원가입에 성공했습니다!");

			// 사용자가 알림을 허용했다면 FCM 토큰 설정 시도
			if (isEmergencyAlertChecked) {
				await handleFCMTokenSetup();
			}

			// 다음 페이지로 이동
			navigate("/center-decision");
		},
		onError: () => {
			toast.error("회원가입에 실패했습니다. 다시 시도해주세요.");
			setIsSubmitting(false);
		},
	});

	const handleSubmit = () => {
		if (!isFormValid) {
			toast.error("모든 항목을 올바르게 입력해주세요.");
			return;
		}

		setIsSubmitting(true);

		if (signupTimeoutRef.current) {
			clearTimeout(signupTimeoutRef.current);
		}

		signupTimeoutRef.current = setTimeout(() => {
			const formattedBirthDate = formatBirthDate(birthDate);

			signUpMutation.mutate({
				name: user.name || "",
				nickname,
				phoneNumber,
				birthDate: formattedBirthDate,
				emergencyNotification: isEmergencyAlertChecked,
			});
		}, 300);
	};

	useEffect(() => {
		return () => {
			if (signupTimeoutRef.current) {
				clearTimeout(signupTimeoutRef.current);
			}
		};
	}, []);

	return (
		<div className="p-2.5 mt-2.5 py-10 flex flex-col items-center gap-5 rounded-[8px] bg-white shadow-custom-xs mx-2.5">
			<SignUpHeader />
			<SignUpForm
				nickname={nickname}
				phoneNumber={phoneNumber}
				birthDate={birthDate}
				setNickname={setNickname}
				setPhoneNumber={setPhoneNumber}
				setBirthDate={setBirthDate}
				isNicknameValid={isNicknameValid}
				setIsNicknameValid={setIsNicknameValid}
				isNicknameUnique={isNicknameUnique}
				setIsNicknameUnique={setIsNicknameUnique}
				isPhoneValid={isPhoneValid}
				setIsPhoneValid={setIsPhoneValid}
				isBirthDateValid={isBirthDateValid}
				setIsBirthDateValid={setIsBirthDateValid}
			/>
			<SignUpTerms
				isChecked={isTermsChecked}
				onChange={setIsTermsChecked}
				isEmergencyAlertChecked={isEmergencyAlertChecked}
				onEmergencyAlertChange={setIsEmergencyAlertChecked}
			/>
			<SignUpButton
				isEnabled={isFormValid && !isSubmitting}
				onClick={handleSubmit}
				isSubmitting={isSubmitting}
			/>
		</div>
	);
}
