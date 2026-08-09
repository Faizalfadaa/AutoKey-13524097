import json
from pathlib import Path

# Load each word and frequency into a map
def load_data():
    DIR = Path(__file__).resolve().parent
    DATA_PATH = DIR / "data" / "kamus.json"
    with open(DATA_PATH, "r", encoding = "utf-8") as file:
        data = json.load(file)

    return data

# Initialize the loaded dataset
DATA = load_data()

# Return frequency of a specific word
def get_word_frequency(word):
    return DATA[word]

# Get the total frequency from all of the words
def get_total_frequency():
    total_frequency = 0
    for word in DATA:
        total_frequency += DATA[word]

    return total_frequency

# Initialize the total words frequency from the dataset
N_WORDS = get_total_frequency()