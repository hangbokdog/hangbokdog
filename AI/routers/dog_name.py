import random
import requests
from fastapi import APIRouter, Query
from typing import List

router = APIRouter()

SPRING_API_URL = "https://k12a103.p.ssafy.io/api/v1/dogs/dogNames"

# 실제 이름에 자주 쓰이는 한글 자모 조합으로 제한
FIRST_SYLLABLE_CANDIDATES = [
    "초", "콩", "별", "밤", "보", "복", "봉", "설", "솜", "송",
    "순", "슬", "아", "안", "애", "양", "얌", "연", "영", "예",
    "오", "옥", "온", "요", "용", "우", "운", "율", "은", "이",
    "잎", "자", "잠", "장", "재", "전", "정", "조", "준", "지",
    "진", "초", "춘", "청", "치", "하", "한", "해", "현", "혜",
    "호", "홍", "화", "희", "라", "루", "리", "로", "레", "나",
    "누", "다", "디", "두", "라", "마", "미", "민", "베", "비"
]

SECOND_SYLLABLE_CANDIDATES = [
    "이", "니", "순", "슬", "비", "미", "민", "자", "정", "진",
    "수", "숙", "선", "연", "영", "옥", "용", "우", "운", "율",
    "은", "인", "재", "지", "찬", "채", "하", "훈", "흠", "호",
    "희", "현", "혜", "봄", "별", "달", "솔", "강", "결", "콩",
    "쭈", "쫑", "봉", "루", "피", "모", "나", "리", "라", "몽",
    "뭉", "순", "쏘", "요", "뿌", "빠", "삐", "코", "쿠", "뽀"
]


def generate_korean_name():
    return random.choice(FIRST_SYLLABLE_CANDIDATES) + random.choice(SECOND_SYLLABLE_CANDIDATES)

@router.get("/name-suggestion")
def suggest_dog_names(center_id: int = Query(...)) -> List[str]:
    try:
        response = requests.get(SPRING_API_URL, params={"centerId": center_id})
        response.raise_for_status()
        existing_names = set(response.json().get("names", []))

        suggestions = set()
        attempts = 0
        while len(suggestions) < 3 and attempts < 100:
            name = generate_korean_name()
            if name not in existing_names and name not in suggestions:
                suggestions.add(name)
            attempts += 1

        return list(suggestions)

    except Exception as e:
        return {"error": str(e)}
