import sys
from Loader import get_word_frequency
# Node Class
class Node:
    def __init__(self):
        self.children = dict()
        self.is_end_word = False
        self.memory = 0

# Trie Data structure
class Trie:
    def __init__(self):
        self.root = Node()
        self.node_count = 1
        self.word_count = 0
        self.estimate_memory_usage = 0

    # Insert into Trie
    def insert(self, word):
        current_node = self.root
        
        for char in word:
            if char not in current_node.children:
                current_node.children[char] = Node()
                current_node.memory = sys.getsizeof(current_node)
                self.node_count += 1

            current_node = current_node.children[char]

        if current_node.is_end_word == False:
            self.word_count += 1

        current_node.is_end_word = True
        self.estimate_memory_usage = self.get_estimated_memory_usage()

    # Search word in trie
    def search(self, word):
        current_node = self.root
        for char in word:
            if char not in current_node.children:
                return False
            current_node = current_node.children[char]

        return current_node.is_end_word

    # Check if there is a word that starts with a specific prefix
    def has_prefix(self, word):
        current_node = self.root
        for char in word:
            if char not in current_node.children:
                return False
            current_node = current_node.children[char]

        return True

    # Return top N of words with specific prefix
    def get_suggestions(self, word, n):
        suggested_words = []
        current_node = self.root
        for char in word:
            if char not in current_node.children:
                return suggested_words
            current_node = current_node.children[char]
        
        # Get the words using DFS
        def dfs(current_node, word):
            if current_node.is_end_word == True:
                suggested_words.append(word)

            if current_node.children is None:
                return

            for char in current_node.children:
                dfs(current_node.children[char], word + char)

        dfs(current_node, word)

        # Sort the suggested word by frequency
        num_sugg_words = len(suggested_words)
        for i in range(num_sugg_words - 1):
            for j in range(num_sugg_words - i - 1):
                freq_word1 = get_word_frequency(suggested_words[j])
                freq_word2 = get_word_frequency(suggested_words[j + 1])

                if freq_word1 < freq_word2:
                    suggested_words[j], suggested_words[j + 1] = suggested_words[j + 1], suggested_words[j]

        top_n_words = suggested_words[:n]
        return top_n_words

    # Get the sum of all node depths in the Trie
    def get_total_depth(self, current_node, depth):
        total_depth = depth
        if len(current_node.children) == 0:
            total_depth += 0

        for char in current_node.children:
            total_depth += self.get_total_depth(current_node.children[char], depth + 1)

        return total_depth

    # Get the avarage depth in the Trie
    def get_avarage_depth(self):
        return self.get_total_depth(self.root, 0) / self.node_count

    # Get the total memory usage of each node
    def get_total_memory_usage(self, current_node, memory):
        total_memory = memory
        if len(current_node.children) == 0:
            total_memory += 0

        for char in current_node.children:
            total_memory += self.get_total_memory_usage(current_node.children[char], memory + current_node.memory)

        return total_memory

    # Get estimated memory usage of the Trie
    def get_estimated_memory_usage(self):
        return self.get_total_memory_usage(self.root, 0) / self.node_count