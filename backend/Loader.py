import json
from pathlib import Path

# Load each word and frequency into a map
def load_data():
    DIR = Path(__file__).resolve().parent
    DATA_PATH = DIR / "data" / "kamus.json"
    with open(DATA_PATH, "r", encoding = "utf-8") as file:
        data = json.load(file)

    return data