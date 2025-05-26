import faiss
import numpy as np
from torchvision import transforms
from PIL import Image
import torch
import torchvision.models as models
from utils.yolo_utils import crop_dog

# FAISS 인덱스 & ID 매핑 초기화
dimension = 512
index = faiss.IndexFlatL2(dimension)
id_mapping = []

# 이미지 벡터화 (ResNet 사용)
model = models.resnet18(weights=models.ResNet18_Weights.DEFAULT)
model.fc = torch.nn.Identity()
model.eval()

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
])

def extract_vector(image: Image.Image) -> np.ndarray:
    img_tensor = transform(image).unsqueeze(0)
    with torch.no_grad():
        embedding = model(img_tensor).squeeze().numpy()
    return embedding.astype("float32")

def add_image_to_index(image: Image.Image, dog_id: str) -> bool:
    cropped = crop_dog(image)
    if cropped is None:
        return False
    vec = extract_vector(cropped)
    index.add(np.array([vec]))
    id_mapping.append(dog_id)
    return True

def search_similar_image(image: Image.Image, top_k: int = 10, threshold: float = 0.6):
    cropped = crop_dog(image)
    if cropped is None:
        print("No dog detected in the image.")
        return []
    vec = extract_vector(cropped)
    D, I = index.search(np.array([vec]), top_k)
    result_ids = []
    for dist, idx in zip(D[0], I[0]):
        print(f"Distance: {dist}, Index: {idx}")
        if idx < len(id_mapping) and dist < threshold:
            result_ids.append(id_mapping[idx])
    return result_ids
