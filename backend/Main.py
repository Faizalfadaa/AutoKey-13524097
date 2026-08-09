import sys

from Loader import load_data
from Trie import Trie, Node
from Levenshtein import get_levenshtein_words

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
TRIE.estimate_memory_usage = sys.getsizeof(Node()) * TRIE.node_count

# Get the Trie Statistics
def get_trie_statistics():
    statistics = {
        "num_words": TRIE.word_count,
        "num_nodes": TRIE.node_count,
        "avg_depth": TRIE.get_avarage_depth(),
        "estimate_memory_usage": TRIE.estimate_memory_usage
    }

    return statistics

# Get the data for auto complete
def auto_complete(word):
    return {
        "word": word,
        "suggested_words": TRIE.get_suggestions(word, 5, DATA)
    }

# Get the data for spellcheck
def spell_check(word):
    if TRIE.search(word) == False:
        return {
            "word": word,
            "isValid": True,
            "suggested_word": get_levenshtein_words(word, 5, DATA)
        }
    else:
        return {
            "word": word,
            "isValid": False,
            "suggested_word": []
        }        

# Check all the words
def check_all(words):
    pass

def segmented_words(word):
    pass