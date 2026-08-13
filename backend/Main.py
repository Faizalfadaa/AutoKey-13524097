import math
import re
import sys
import time

from Loader import load_data
from Trie import Trie, Node
from Levenshtein import get_levenshtein_words
from Segmentation import word_segmentation

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
def get_auto_complete(word):
    word = word.lower().strip()

    start_time = time.perf_counter()
    suggested_words = TRIE.get_suggestions(word, 5, DATA)
    end_time = time.perf_counter()

    return {
        "word": word,
        "suggested_words": suggested_words,
        "latency_ms": round((end_time - start_time) * 1000, 2)
    }

# Get the data for spellcheck
def get_spell_check(word):
    word = word.lower().strip()
    word = re.sub(r"[^a-zA-Z]", "", word)

    if word == "":
        return {
            "word": word,
            "isValid": True,
            "suggested_word": []
        }

    if TRIE.search(word) == False:
        return {
            "word": word,
            "isValid": False,
            "suggested_word": get_levenshtein_words(word, 5, DATA)
        }
    else:
        return {
            "word": word,
            "isValid": True,
            "suggested_word": []
        }        

# Add a custom word into the current backend data
def add_custom_word(word):
    word = word.lower().strip()
    word = re.sub(r"[^a-zA-Z]", "", word)

    if word == "":
        return {
            "success": False,
            "word": word
        }

    if TRIE.search(word) == False:
        DATA[word] = 1
        TRIE.insert(word)
        TRIE.estimate_memory_usage = sys.getsizeof(Node()) * TRIE.node_count

    return {
        "success": True,
        "word": word
    }

# Check all the words
def get_check_all(text):
    words = re.findall(r"[a-zA-Z]+", text)

    result = []
    error_words = set()
    for word in words:
        lower_word = word.lower()

        # Continue if there are duplicate words
        if lower_word in error_words:
            continue

        if TRIE.search(lower_word) == False:
            suggested_word = get_levenshtein_words(lower_word, 5, DATA)
            error_words.add(lower_word)
            result.append({
                "word": word,
                "suggested_word": suggested_word
            })

    return {
        "text": text,
        "result": result
    }

# Return the segmented words data              
def get_segmented_words(word):
    segmented_words, dp, traceback_process = word_segmentation(word, DATA, N_WORDS)

    # Change infinity values so the API can safely return the DP table as JSON
    for i in range(len(dp)):
        if dp[i] == math.inf:
            dp[i] = None

    return {
        "input": word,
        "segmented_words": segmented_words,
        "segmented_text": " ".join(segmented_words),
        "dp": dp,
        "traceback": traceback_process
    }
