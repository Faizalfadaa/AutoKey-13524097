# Levenshtein Edit Distance
def Levenshtein(word1, word2):
    m = len(word1)
    n = len(word2)

    # Initialize table
    dp = []
    for i in range(m + 1):
        row = []
        for j in range(n + 1):
            row.append(0)
        dp.append(row)

    for i in range(m + 1):
        dp[i][0] = i
    for j in range(n + 1):
        dp[0][j] = j

    # Recursion
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if word1[i - 1] == word2[j - 1]:
                cost = 0
            else:
                cost = 1

            dp[i][j] = min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost)

    return dp[m][n]

# Return list of words with lenvenshtein distance <= 2
# Sorted by distance ASC, by frequency DESC
# Can pick top N words
def get_levenshtein_words(word, top_n, data):
    list_words = []

    for words in data:
        # Skip every word more than 2 different character with the current word
        if abs(len(words) - len(word)) > 2:
            continue

        distance = Levenshtein(word, words)
        if distance <= 2:
            list_words.append((words, distance, data[words]))

    # Sort by Distance ASC and by frequency DESC
    list_words.sort(key=lambda item: (item[1], -item[2]))

    result = []
    for word, _, _ in list_words[:top_n]:
        result.append(word)
        
    return result