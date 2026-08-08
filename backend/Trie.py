# Node Class
class Node:
    def __init__(self):
        self.children = dict()
        self.is_end_word = False

# Trie Data structure
class Trie:
    def __init__(self):
        self.root = Node()

    # Insert into Trie
    def insert(self, word):
        current_node = self.root
        for char in word:
            if char not in current_node.children:
                current_node.children[char] = Node()
            current_node = current_node.children[char]
        current_node.is_end_word = True

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