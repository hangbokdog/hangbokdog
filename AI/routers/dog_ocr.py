from fastapi import APIRouter, File, UploadFile
from PIL import Image
from io import BytesIO
import easyocr
import numpy as np

from utils.ocr_utils import extract_info

router = APIRouter()
reader = easyocr.Reader(['ko', 'en'])

@router.post("/ocr")
async def ocr_image(image: UploadFile = File(...)):
    contents = await image.read()
    pil_img = Image.open(BytesIO(contents)).convert("RGB")
    
    max_width = 1280
    if pil_img.width > max_width:
        ratio = max_width / pil_img.width
        new_size = (int(pil_img.width * ratio), int(pil_img.height * ratio))
        pil_img = pil_img.resize(new_size)

    img = np.array(pil_img)

    result = reader.readtext(img)
    texts = [text for _, text, _ in result]
    parsed = extract_info(texts)
    return {"data": parsed}
