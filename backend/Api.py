from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from Main import get_trie_statistics, get_auto_complete, get_spell_check, get_check_all

# Create the FastAPI app
app = FastAPI()

# Allow the Next.js frontend to call this backend
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"], allow_methods=["*"], allow_headers=["*"])

# Return Trie statistics for the frontend header
@app.get("/statistics")
def statistics():
    return get_trie_statistics()

# Return autocomplete suggestions for the given prefix
@app.get("/auto_complete")
def auto_complete(word):
    return get_auto_complete(word)

# Return spell check result for one word
@app.get("/spell_check")
def spell_check(word):
    return get_spell_check(word)

# Check the whole text and return all invalid words
@app.post("/check_all")
def check_all(text):
    return get_check_all(text)