from fastapi import APIRouter, HTTPException, UploadFile, File

router = APIRouter()

@router.post("/dog-info")
async def extract_dog_info_from_image(file: UploadFile = File(...)):
    image = await decode_image(file)
    if image is None:
        raise HTTPException(status_code=400, detail="이미지 처리에 실패했습니다.")
    
    dog_info = extract_dog_info(image)
    if not dog_info:
        raise HTTPException(status_code=404, detail="개 정보를 추출할 수 없습니다.")
    
    return dog_info