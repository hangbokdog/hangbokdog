import { getUserInfoAPI, updateUserInfoAPI } from "@/api/auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function ProfileEdit() {
  const queryClient = useQueryClient();

  // GET: 사용자 정보 가져오기
  const { data, isLoading, error } = useQuery({
    queryKey: ["userInfo"],
    queryFn: getUserInfoAPI,
  });

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [userNickname, setUserNickname] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // PATCH: 사용자 정보 수정
  const mutation = useMutation({
    mutationFn: updateUserInfoAPI,
    onSuccess: () => {
      alert("프로필이 저장되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["userInfo"] });
    },
    onError: () => {
      alert("프로필 저장에 실패했습니다.");
    },
  });

  // API로 받아온 데이터로 초기값 설정
  useEffect(() => {
    if (data) {
      setUserNickname(data.nickName);
      setProfileImage(data.profileImage || null);
    }
  }, [data]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUsernameClick = () => {
    setIsEditingNickname(true);
    setTimeout(() => {
      nameInputRef.current?.focus();
      nameInputRef.current?.select();
    }, 0);
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserNickname(e.target.value);
  };

  const handleUsernameBlur = () => {
    setIsEditingNickname(false);
  };

  const handleUsernameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsEditingNickname(false);
    }
  };

  const handleSave = () => {
    if (!userNickname) {
      alert("닉네임을 입력해주세요.");
      return;
    }

    mutation.mutate({
      nickname: userNickname,
      profileImageFile: imageFile,
    });
  };

  if (isLoading) return <div className="p-4">불러오는 중...</div>;
  if (error || !data) return <div className="p-4">사용자 정보를 불러오지 못했습니다.</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
      <div className="w-full max-w-md flex flex-col items-center">
        {/* 프로필 이미지 */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer overflow-hidden mb-6"
          onClick={handleImageClick}
        >
          {profileImage ? (
            <img src={profileImage} alt="프로필 이미지" className="w-full h-full object-cover" />
          ) : (
            <div className="text-gray-300 text-2xl">^ᴗ^</div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
            aria-label="프로필 이미지 업로드"
          />
        </motion.div>

        {/* 사용자 이름 */}
        <div className="mb-2">
          {isEditingNickname ? (
            <input
              ref={nameInputRef}
              type="text"
              value={userNickname}
              onChange={handleUsernameChange}
              onBlur={handleUsernameBlur}
              onKeyDown={handleUsernameKeyDown}
              className="text-center text-base font-medium focus:outline-none border-b border-gray-300 pb-1"
              aria-label="사용자 이름 편집"
            />
          ) : (
            <motion.p
              whileHover={{ scale: 1.05 }}
              className="text-base font-medium cursor-pointer"
              onClick={handleUsernameClick}
            >
              {userNickname}
            </motion.p>
          )}
        </div>

        {/* 설명 텍스트 */}
        <p className="text-sm text-gray-400 text-center mb-8">
          누구인지 한줄로 작성해 보세요. 다시 한번 수정할 수 있어요.
        </p>

        {/* 저장 버튼 */}
        <Button
          onClick={handleSave}
          className="w-full bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-full py-2"
          variant="ghost"
        >
          저장
        </Button>
      </div>
    </div>
  );
}
