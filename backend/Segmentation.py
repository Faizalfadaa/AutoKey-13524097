import math

# Cost for word_segmentation
def cost(freq_word, total_words):
    return math.log(total_words / freq_word) 

# Return words that is already segmented
def word_segmentation(word, data):
    segmented_word = []

    m = len(word)
    dp = [math.inf] * (m + 1)
    dp[0] = 0

    segmented_idx = {}
    for i in range(1, m + 1):
        for j in range(i):
            current_word = word[j:i]
            if current_word in data:
                current_cost = dp[j] + cost(data[current_word])

                if current_cost < dp[i]:
                    dp[i] = current_cost
                    segmented_idx[i] = j

    # Construct the segmented words (trace back)
    traceback_process = []
    if len(segmented_idx) == 0:
        return segmented_word, dp, traceback_process

    i = m
    for _ in range(m):
        if i == 0:
            break

        first_idx = segmented_idx[i]
        last_idx = i

        traceback_process.append((first_idx, last_idx, word[first_idx:last_idx]))
        segmented_word.append(word[first_idx:last_idx])

        i = segmented_idx[i]

    return segmented_word[::-1], dp, traceback_process