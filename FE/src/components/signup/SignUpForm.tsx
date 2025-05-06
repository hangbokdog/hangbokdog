import { FaBirthdayCake, FaUserTie } from "react-icons/fa";
import { FaPhone, FaUserAstronaut } from "react-icons/fa6";
import InputField from "@/components/common/InputField";
import { checkNicknameAPI } from "@/api/auth";

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
	return (
		<div className="flex flex-col gap-4 items-center w-full">
			<InputField
				icon={FaUserTie}
				placeholder="닉네임을 입력해주세요. (2~10자)"
				value="홍길동"
				disabled
			/>
			<div className="flex w-full gap-2">
				<InputField
					icon={FaUserAstronaut}
					placeholder="닉네임을 입력해주세요. (2~10자)"
					maxLength={10}
					minLength={2}
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
			/>
			<InputField
				icon={FaBirthdayCake}
				placeholder="생년월일을 입력해주세요. (주민등록번호 앞자리)"
				maxLength={6}
			/>
		</div>
	);
}
