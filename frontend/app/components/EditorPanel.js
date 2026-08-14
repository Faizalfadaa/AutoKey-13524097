"use client";
import { useRef, useState } from "react";

function getMarkedText(text, wrongWords) {
  // Split the text while keeping spaces
  const textPieces = text.split(/(\s+)/);

  // Create the editor HTML with red underline marks
  const markedText = textPieces.map((textPiece) => {
    const word = textPiece.toLowerCase().replace(/[^a-zA-Z]/g, "");
    let displayedText = textPiece;

    // Keep special characters safe when using innerHTML
    displayedText = displayedText.replaceAll("&", "&amp;");
    displayedText = displayedText.replaceAll("<", "&lt;");
    displayedText = displayedText.replaceAll(">", "&gt;");

    // Mark the word if it is in the wrong word list
    if (wrongWords.includes(word)) {
      return `<span class="wrong-word" data-word="${word}">${displayedText}</span>`;
    }

    return displayedText;
  }).join("");

  return markedText;
}

// Main text editor area
export default function EditorPanel({setEditorText}) {
  // Store suggestions from the backend
  const [suggestions, setSuggestions] = useState([]);

  // Store autocomplete request latency
  const [latency, setLatency] = useState(0);

  // Store words that should get red underline
  const [wrongWords, setWrongWords] = useState([]);

  // Store the spell check result
  const [spellResult, setSpellResult] = useState(null);

  // Keep the newest typed word so old responses do not overwrite new suggestions
  const latestWord = useRef("");
  const editorRef = useRef(null);

  return (
    <section className="panel-box editor">
      {/* Editor title and session info */}
      <div className="editor-top">
        <p>Teks Editor</p>
      </div>

      {/* Editable text area */}
      <div ref={editorRef} className="text-area" contentEditable suppressContentEditableWarning spellCheck={false} data-placeholder="Tulis teks disini" onInput={
        (event) => {
          // Get the full editor text
          const text = event.currentTarget.innerText;
          setEditorText(text);
          const typedKey = event.nativeEvent.data;
          setSpellResult(null);

          // Remove old underline when the user edits an underlined word manually
          event.currentTarget.querySelectorAll(".wrong-word").forEach((span) => {
            // Read the current word inside the red underline
            const word = span.innerText.toLowerCase().replace(/[^a-zA-Z]/g, "");

            // Remove underline if the word text has changed
            if (word !== span.dataset.word) {
              span.replaceWith(document.createTextNode(span.innerText));
            }
          });

          // Remove wrong words that no longer exist in the editor text
          setWrongWords((oldWrongWords) => {
            // Get all words currently written in the editor
            const editorWords = text.toLowerCase().split(/\s+/);

            // Keep only wrong words that are still in the editor
            return oldWrongWords.filter((word) => editorWords.includes(word));
          });

          // Get the last typed word
          const words = text.trim().split(/\s+/);
          const lastWord = words[words.length - 1] || "";

          // Check spelling and hide autocomplete after the user finishes a word
          if (typedKey === " " || typedKey === "." || typedKey === "," || typedKey === "!" || typedKey === "?") {
            setSuggestions([]);
            latestWord.current = "";

            const finishedWord = lastWord;
            if (finishedWord.length > 0) {
              // Ask the backend to validate the finished word
              fetch(`http://127.0.0.1:8000/spell_check?word=${finishedWord}`)
                .then((response) => response.json())
                .then((data) => {
                  if (!data.isValid) {
                    setWrongWords((oldWrongWords) => {
                      // Avoid saving the same wrong word twice
                      if (oldWrongWords.includes(data.word)) {
                        return oldWrongWords;
                      }

                      // Add the new wrong word
                      const updatedWrongWords = [...oldWrongWords, data.word];
                      const editorText = editorRef.current.innerText;

                      // Rebuild editor HTML with red underline marks
                      editorRef.current.innerHTML = getMarkedText(editorText, updatedWrongWords);

                      // Put the cursor back at the end after changing innerHTML
                      const range = document.createRange();
                      const selection = window.getSelection();
                      range.selectNodeContents(editorRef.current);
                      range.collapse(false);
                      selection.removeAllRanges();
                      selection.addRange(range);

                      return updatedWrongWords;
                    });

                    setSpellResult(data);
                  }
                });
            }

            return;
          }

          // Save the newest word before calling the backend
          latestWord.current = lastWord;

          // Hide suggestions when there is no active word
          if (lastWord.length === 0) {
            setSuggestions([]);
            return;
          }

          // Ask the backend for autocomplete suggestions
          fetch(`http://127.0.0.1:8000/auto_complete?word=${encodeURIComponent(lastWord)}`)
            .then((response) => response.json())
            .then((data) => {
              // Store backend search time for the dropdown header
              setLatency(data.latency_ms);

              // Only show suggestions if this response is still for the newest word
              if (latestWord.current === lastWord) {
                setSuggestions(data.suggested_words);
              }

            });
        }
      } onKeyDown={
        (event) => {
          if ((event.key === "Tab" || event.key === "Enter") && suggestions.length > 0) {
            event.preventDefault();
            /* Get the current editor text */
            const text = editorRef.current.innerText;

            /* Replace the last words with selected suggestions */
            const words = text.trim().split(/\s+/);
            words[words.length - 1] = suggestions[0];          

            /* Update the editor text */
            editorRef.current.innerText = words.join(" ") + " ";
            setEditorText(editorRef.current.innerText);
            setSuggestions([]);                
          }
        }
      } onClick={
        (event) => {
          // Open correction suggestions when a red word is clicked
          if (event.target.className === "wrong-word") {
            const clickedWord = event.target.dataset.word;

            fetch(`http://127.0.0.1:8000/spell_check?word=${clickedWord}`)
              .then((response) => response.json())
              .then((data) => setSpellResult(data));
          }
        }
      }></div>

      {/* Show simple spell check suggestions */}
      {spellResult && (
        <div className="spell-popup">
          <p>Saran untuk "{spellResult.word}"</p>

          {spellResult.suggested_word.map((suggestedWord, index) => (
            <button key={index} className="spell-option" onClick={
              () => {
                // Get the current editor words
                const text = editorRef.current.innerText;
                const words = text.trim().split(/\s+/);

                // Replace the wrong word with the selected suggestion
                for (let i = 0; i < words.length; i++) {
                  const word = words[i].toLowerCase().replace(/[^a-zA-Z]/g, "");

                  if (word === spellResult.word) {
                    words[i] = suggestedWord;
                  }
                }

                const updatedWrongWords = wrongWords.filter((word) => word !== spellResult.word);
                const updatedText = words.join(" ") + " ";

                // Rebuild the editor without the corrected word underline
                editorRef.current.innerHTML = getMarkedText(updatedText, updatedWrongWords);
                setEditorText(editorRef.current.innerText);
                setWrongWords(updatedWrongWords);
                setSpellResult(null);
              }
            }>
              {suggestedWord}
            </button>
          ))}

          <button className="add-word" onClick={
            () => {
              // Remove the added word from the wrong word list
              const updatedWrongWords = wrongWords.filter((word) => word !== spellResult.word);
              const text = editorRef.current.innerText;

              // Add the word into the backend dictionary
              fetch(`http://127.0.0.1:8000/add_word?word=${spellResult.word}`, {
                method: "POST"
              })
                .then((response) => response.json())
                .then(() => {
                  // Rebuild the editor after the backend accepts the word
                  setWrongWords(updatedWrongWords);
                  editorRef.current.innerHTML = getMarkedText(text, updatedWrongWords);
                  setSpellResult(null);
                });
            }
          }>
            + Tambah ke kamus
          </button>
        </div>
      )}

      {/* Show auto complete suggestions */}
      {suggestions.length > 0 && (
        <div className="suggestion-box">
          <div className="suggestion-top">
            <p>Autocomplete</p>
            <span>{latency}ms</span>
          </div>

          {suggestions.map((suggestedWord) => (
            <button key={suggestedWord} className="suggestion-item" onClick={
              () => {
                /* Get the current editor text */
                const text = editorRef.current.innerText;

                /* Replace the last words with selected suggestions */
                const words = text.trim().split(/\s+/);
                words[words.length - 1] = suggestedWord;          

                /* Update the editor text */
                editorRef.current.innerText = words.join(" ") + " ";
                setEditorText(editorRef.current.innerText);
                setSuggestions([]);      
              }
            }>
              {suggestedWord}
            </button>
          ))}

        </div>
      )}

      {/* Short editor hint */}
      <p className="note">Ketik untuk memicu autocomplete - klik kata bergaris merah untuk saran koreksi</p>
    </section>
  );
}
