import sys

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
        self.node_count = 0
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

        current_node.is_end_word = True
        self.word_count += 1
        self.estimate_memory_usage = self.get_estimated_memory_usage(self.root)

    # Search word in trie
    def search(self, word):
        current_node = self.root
        for char in word:
            if char not in current_node.children:
                return False
            current_node = current_node.children[char]

        return current_node.is_end_word

    # Check if there is a word that starts with a specific prefix
    def has_prefix(self, word: str):
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
        return suggested_words[:n - 1]

    # Get the sum of all node depths in the Trie
    def get_total_depth(self):
        if self.root.children is None:
            return 0

        for char in self.root.children:
            return 1 + self.get_total_depth(self.root.children[char])

    # Get the avarage depth in the Trie
    def get_avarage_depth(self):
        return self.get_avarage_depth(self.root) / self.node_count

    # Get the total memory usage of each node
    def get_total_memory_usage(self):
        if self.root.children is None:
            return 0

        for char in self.root.children:
            return self.root.memory + self.get_total_depth(self.root.children[char])

    # Get estimated memory usage of the Trie
    def get_estimated_memory_usage(self):
        return self.get_total_memory_usage(self.root) / self.node_count