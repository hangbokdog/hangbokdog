from typing import Dict, List

def extract_info(texts: List[str]) -> Dict[str, str]:
    joined = " ".join(texts)

    animalType = ""
    subType = ""
    gender = ""
    neutered = ""
    color = ""
    birthYear = ""
    weight = ""

    for t in texts:
        if t.startswith("[개]"):
            animalType = "개"
            subType = t.replace("[개]", "").strip()
            break
        elif t.startswith("[고양이]"):
            animalType = "고양이"
            subType = t.replace("[고양이]", "").strip()
            break

    if subType in ["믹스견", "막스견", "믹스", "막스"]:
        subType = "믹스"

    info_line = next((t for t in texts if any(x in t for x in ["수컷", "암컷"])), "")
    parts = [p.strip() for p in info_line.split("/")]

    color_mapping = {
        "검정색": "검",
        "흰색": "흰",
        "갈색": "갈",
        "검": "검",
        "흰": "흰",
        "갈": "갈"
    }

    for part in parts:
        if "수컷" in part:
            gender = "수컷"
            if "중성화 0" in part or "중성화 O" in part:
                neutered = "O"
            elif "중성화 X" in part:
                neutered = "X"
        elif "암컷" in part:
            gender = "암컷"
            if "중성화 0" in part or "중성화 O" in part:
                neutered = "O"
            elif "중성화 X" in part:
                neutered = "X"

        for color_key, color_value in color_mapping.items():
            if color_key in part:
                color = color_value
                break

        if "년생" in part:
            birthYear = part.replace("(년생)", "").strip()

        if "Kg" in part or "kg" in part:
            weight = part.replace("(Kg)", "").replace("kg", "").strip()

    features = ""
    if "특이사항" in texts:
        idx = texts.index("특이사항")
        features = " ".join(texts[idx + 1:]).strip()

    return {
        "animalType": animalType,
        "subType": subType,
        "gender": gender,
        "neutered": neutered,
        "color": color,
        "birthYear": birthYear,
        "weight": weight,
        "features": features
    }
