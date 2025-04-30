import { FaBirthdayCake, FaUserTie } from "react-icons/fa";
import { FaPhone, FaUserAstronaut } from "react-icons/fa6";
import InputField from "@/components/common/InputField";

export default function SignUpForm() {
	return (
		<div className="flex flex-col gap-2.5 items-center w-full">
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
					className="bg-primary text-white rounded-[8px] px-4 py-2 font-bold cursor-pointer"
				>
					중복확인
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
