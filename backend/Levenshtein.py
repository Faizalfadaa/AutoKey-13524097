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
def get_levenshtein_words(word, data):
    list_words = []
    list_distance = []
    for words in data:
        distance = Levenshtein(word, words)
        if distance <= 2:
            list_words.append(words)
            list_distance.append(distance)

    # Sort by Distance ASC
    n = len(list_words)
    for i in range(n - 1):
        for j in range(n - i - 1):
            if list_distance[j] > list_distance[j + 1]:
                list_distance[j], list_distance[j + 1] = list_distance[j + 1], list_distance[j]
                list_words[j], list_words[j + 1] = list_words[j + 1], list_words[j]

            # Sort by frequency DESC
            elif list_distance[j] == list_distance[j + 1]:
                freq_word1 = data[list_words[j]]
                freq_word2 = data[list_words[j + 1]]

                if freq_word1 < freq_word2:
                    list_words[j], list_words[j + 1] = list_words[j + 1], list_words[j]     
                    list_distance[j], list_distance[j + 1] = list_distance[j + 1], list_distance[j]           

    return list_words