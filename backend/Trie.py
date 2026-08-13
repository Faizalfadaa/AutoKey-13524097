# Node Class
class Node:
    def __init__(self):
        self.children = dict()
        self.is_end_word = False

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
                self.node_count += 1

            current_node = current_node.children[char]

        if current_node.is_end_word == False:
            self.word_count += 1

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
    def has_prefix(self, word):
        current_node = self.root
        for char in word:
            if char not in current_node.children:
                return False
            current_node = current_node.children[char]

        return True

    # Return top N of words with specific prefix
    def get_suggestions(self, word, n, data):
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
        suggested_words.sort(key=lambda suggested_word: data[suggested_word], reverse=True)
        return suggested_words[:n]

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