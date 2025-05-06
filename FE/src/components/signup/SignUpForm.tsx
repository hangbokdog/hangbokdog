import { FaBirthdayCake, FaUserTie } from "react-icons/fa";
import { FaPhone, FaUserAstronaut } from "react-icons/fa6";
import InputField from "@/components/common/InputField";
import { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { checkNicknameAPI } from "@/api/auth";
import useAuthStore from "@/lib/store/authStore";
import Spinner from "@/components/ui/spinner";

interface SignUpFormProps {
	nickname: string;
	phoneNumber: string;
	birthDate: string;
	setNickname: (value: string) => void;
	setPhoneNumber: (value: string) => void;
	setBirthDate: (value: string) => void;
	isNicknameValid: boolean;
	setIsNicknameValid: (value: boolean) => void;
	isNicknameUnique: boolean;
	setIsNicknameUnique: (value: boolean) => void;
	isPhoneValid: boolean;
	setIsPhoneValid: (value: boolean) => void;
	isBirthDateValid: boolean;
	setIsBirthDateValid: (value: boolean) => void;
}

export default function SignUpForm({
	nickname,
	phoneNumber,
	birthDate,
	setNickname,
	setPhoneNumber,
	setBirthDate,
	isNicknameValid,
	setIsNicknameValid,
	isNicknameUnique,
	setIsNicknameUnique,
	isPhoneValid,
	setIsPhoneValid,
	isBirthDateValid,
	setIsBirthDateValid,
}: SignUpFormProps) {
	const [isCheckingNickname, setIsCheckingNickname] =
		useState<boolean>(false);
	const name = useAuthStore.getState().name;
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	const validateNickname = (value: string) => {
		return value.length >= 2 && value.length <= 10;
	};

	const validatePhoneNumber = (value: string) => {
		const regex = /^010\d{8}$/;
		return regex.test(value);
	};

	const validateBirthDate = (value: string) => {
		const regex = /^\d{6}$/;
		return regex.test(value);
	};

	const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setNickname(value);
		setIsNicknameValid(validateNickname(value));
		setIsNicknameUnique(false);
	};

	const handlePhoneNumberChange = (
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		const value = e.target.value;
		setPhoneNumber(value);
		setIsPhoneValid(validatePhoneNumber(value));
	};

	const handleBirthDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setBirthDate(value);
		setIsBirthDateValid(validateBirthDate(value));
	};

	const checkNicknameDuplicate = (nickname: string) => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}

		if (!isNicknameValid) return;

		setIsCheckingNickname(true);
		timeoutRef.current = setTimeout(() => {
			checkNicknameMutation.mutate(nickname);
		}, 300);
	};

	const checkNicknameMutation = useMutation({
		mutationFn: checkNicknameAPI,
		onSuccess: (data) => {
			if (!data.isDuplicated) {
				setIsNicknameUnique(true);
				setIsCheckingNickname(false);
			} else {
				setIsNicknameUnique(false);
				setIsCheckingNickname(false);
			}
		},
		onError: () => {
			setIsNicknameUnique(false);
			setIsCheckingNickname(false);
		},
	});

	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	return (
		<div className="flex flex-col gap-4 items-center w-full">
			<InputField
				icon={FaUserTie}
				placeholder="닉네임을 입력해주세요. (2~10자)"
				value={name ?? ""}
				disabled
			/>
			<div className="flex w-full gap-2">
				<InputField
					icon={FaUserAstronaut}
					placeholder="닉네임을 입력해주세요. (2~10자)"
					maxLength={10}
					minLength={2}
					value={nickname}
					onChange={handleNicknameChange}
					disabled={isNicknameUnique}
				/>
				<button
					type="button"
					className={`${
						isNicknameValid &&
						!isNicknameUnique &&
						!isCheckingNickname
							? "bg-primary"
							: "bg-superLightGray cursor-not-allowed"
					} text-white rounded-[8px] px-4 py-2 font-bold flex items-center justify-center min-w-[80px]`}
					onClick={() => checkNicknameDuplicate(nickname)}
					disabled={
						!isNicknameValid ||
						isNicknameUnique ||
						isCheckingNickname
					}
				>
					{isCheckingNickname ? (
						<Spinner size="small" />
					) : isNicknameUnique ? (
						"확인완료"
					) : (
						"중복확인"
					)}
				</button>
			</div>
			<InputField
				icon={FaPhone}
				placeholder="휴대폰번호를 입력해주세요. (- 없이)"
				maxLength={11}
				value={phoneNumber}
				onChange={handlePhoneNumberChange}
			/>
			<InputField
				icon={FaBirthdayCake}
				placeholder="생년월일을 입력해주세요. (주민등록번호 앞자리)"
				maxLength={6}
				value={birthDate}
				onChange={handleBirthDateChange}
			/>
		</div>
	);
}
