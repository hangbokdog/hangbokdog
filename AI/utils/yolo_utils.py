from ultralytics import YOLO
from PIL import Image
import numpy as np

model = YOLO("yolov8n.pt")
model.to("cpu")

def crop_dog(image: Image.Image) -> Image.Image | None:
    np_image = np.array(image)

    results = model.predict(
        source=np_image,
        conf=0.4,
        classes=[16],  # dog class
        verbose=False
    )

    boxes = results[0].boxes.xyxy.cpu().numpy()
    if len(boxes) == 0:
        return None

    biggest = max(boxes, key=lambda box: (box[2] - box[0]) * (box[3] - box[1]))
    x1, y1, x2, y2 = map(int, biggest)

    return image.crop((x1, y1, x2, y2))
