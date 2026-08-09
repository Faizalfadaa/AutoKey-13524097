from Loader import load_data, get_total_frequency
from Trie import Trie

# Initialize the loaded dataset
DATA = load_data()

# Get the total frequency from all of the words
def get_total_frequency():
    total_frequency = 0
    for word in DATA:
        total_frequency += DATA[word]

    return total_frequency

# Initialize the total words frequency from the dataset
N_WORDS = get_total_frequency()

# Initialize the Trie data
TRIE = Trie()
for data in DATA:
    TRIE.insert(data)


