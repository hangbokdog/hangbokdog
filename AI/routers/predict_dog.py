from fastapi import APIRouter, File, UploadFile, Form, HTTPException
from PIL import Image
import io
from utils import faiss_utils

router = APIRouter()

@router.post("/register")
async def register_image(image: UploadFile = File(...), dog_id: str = Form(...)):
    contents = await image.read()
    pil_img = Image.open(io.BytesIO(contents)).convert("RGB")

    success = faiss_utils.add_image_to_index(pil_img, dog_id)
    if not success:
        raise HTTPException(status_code=400, detail="강아지를 찾지 못했습니다. 다른 이미지를 사용해주세요.")
    return {"message": f"{dog_id} 등록 완료"}

@router.post("/search")
async def search_image(image: UploadFile = File(...)):
    contents = await image.read()
    pil_img = Image.open(io.BytesIO(contents)).convert("RGB")

    similar_ids = faiss_utils.search_similar_image(pil_img)
    return {"similar_ids": similar_ids}
