from fastapi import APIRouter, File, UploadFile
from PIL import Image
from io import BytesIO
import easyocr

from utils.ocr_utils import extract_info

router = APIRouter()
reader = easyocr.Reader(['ko', 'en'])

@router.post("/ocr")
async def ocr_image(image: UploadFile = File(...)):
    contents = await image.read()
    img = Image.open(BytesIO(contents))
    result = reader.readtext(img)
    texts = [text for _, text, _ in result]
    parsed = extract_info(texts)
    return {"data": parsed}
