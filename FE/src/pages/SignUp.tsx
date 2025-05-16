import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import SignUpHeader from "@/components/signup/SignUpHeader";
import SignUpForm from "@/components/signup/SignUpForm";
import SignUpTerms from "@/components/signup/SignUpTerms";
import SignUpButton from "@/components/signup/SignUpButton";
import { useMutation } from "@tanstack/react-query";
import { signUpAPI } from "@/api/auth";
import { toast } from "sonner";
import useAuthStore from "@/lib/store/authStore";
import { useFormatDate } from "@/lib/hooks/useFormatDate";
import { registerFCMToken } from "@/api/notification";
import { requestFCMToken } from "@/config/firebase";

export default function SignUp() {
	const navigate = useNavigate();
	const { user, setToken, setTempToken } = useAuthStore();
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
			// FCM 토큰 요청
			const fcmToken = await requestFCMToken();

			if (fcmToken) {
				console.log("FCM 토큰 등록 시작:", fcmToken);

				// 토큰을 백엔드에 저장
				await registerFCMToken(fcmToken);
				console.log("FCM 토큰 등록 성공");
			} else {
				console.warn("FCM 토큰을 가져올 수 없어 등록할 수 없습니다.");
			}
		} catch (error) {
			console.error("FCM 토큰 처리 중 오류 발생:", error);
			// FCM 토큰 등록 실패는 사용자 경험에 영향을 주지 않도록 처리
		}
	}, []);

	const signUpMutation = useMutation({
		mutationFn: signUpAPI,
		onSuccess: () => {
			if (user.tempToken) {
				setToken(user.tempToken);
				setTempToken("");
			}

			if (isEmergencyAlertChecked) {
				handleFCMTokenSetup();
			}

			toast.success("회원가입에 성공했습니다!");
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
