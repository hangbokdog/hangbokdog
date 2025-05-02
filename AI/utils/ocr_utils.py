from fastapi import UploadFile
import numpy as np
from PIL import Image
import io
import logging
import torch
import easyocr
from typing import Dict, Optional
import re

logger = logging.getLogger("logger")

gpu_available = torch.cuda.is_available()
reader = easyocr.Reader(["ko"], gpu=gpu_available)

async def decode_image(file: UploadFile) -> np.ndarray:
    """이미지를 OCR에 사용할 수 있도록 변환"""
    try:
        file_bytes = await file.read()
        image = Image.open(io.BytesIO(file_bytes)).convert("RGB")
        image_np = np.array(image)
        return image_np
    except Exception as e:
        logger.error(f"이미지 디코딩 오류: {e}")
        return None

def extract_dog_info(image: np.ndarray) -> Optional[Dict[str, str]]:
    """OCR을 통해 개의 정보를 추출"""
    ocr_results = reader.readtext(image)
    full_text = " ".join([result[1] for result in ocr_results])
    
    # 개 종류 추출
    breed_match = re.search(r'\[개\]\s*(\S+)', full_text)
    breed = breed_match.group(1) if breed_match else None
    
    # 성별, 색상, 생년, 체중 추출
    info_match = re.search(r'(\S+)\s*/\s*([^/]+)\s*/\s*(\d{4}).*?/\s*([\d.]+)', full_text)
    if info_match:
        gender = info_match.group(1)
        color = info_match.group(2).strip()
        birth_year = info_match.group(3)
        weight = info_match.group(4)
    else:
        gender = color = birth_year = weight = None
    
    # 공고번호 추출
    notice_match = re.search(r'공고번호\s*([^\s]+)', full_text)
    notice_number = notice_match.group(1) if notice_match else None
    
    # 공고기간 추출
    period_match = re.search(r'공고기간\s*(\d{4}-\d{2}-\d{2})\s*~\s*(\d{4}-\d{2}-\d{2})', full_text)
    if period_match:
        notice_start = period_match.group(1)
        notice_end = period_match.group(2)
    else:
        notice_start = notice_end = None
    
    # 발견장소 추출
    location_match = re.search(r'발견장소\s*([^\n]+)', full_text)
    location = location_match.group(1).strip() if location_match else None
    
    # 특이사항 추출
    remarks_match = re.search(r'특이사항\s*([^\n]+)', full_text)
    remarks = remarks_match.group(1).strip() if remarks_match else None
    
    # 모든 필수 정보가 있는지 확인
    if not all([breed, gender, color, birth_year, weight, notice_number]):
        return None
    
    return {
        "breed": breed,
        "gender": gender,
        "color": color,
        "birth_year": birth_year,
        "weight": weight,
        "notice_number": notice_number,
        "notice_start": notice_start,
        "notice_end": notice_end,
        "location": location,
        "remarks": remarks
    }