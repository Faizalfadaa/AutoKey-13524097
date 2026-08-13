"use client";
import { useRef, useState } from "react";

// Main text editor area
export default function EditorPanel({setEditorText}) {
  // Store suggestions from the backend
  const [suggestions, setSuggestions] = useState([]);

  // Keep the newest typed word so old responses do not overwrite new suggestions
  const latestWord = useRef("");
  const editorRef = useRef(null);

  return (
    <section className="panel-box editor">
      {/* Editor title and session info */}
      <div className="editor-top">
        <p>Teks Editor</p>
        <span>0 pasangan</span>
      </div>

      {/* Editable text area */}
      <div ref={editorRef} className="text-area" contentEditable suppressContentEditableWarning onInput={
        (event) => {
          // Get the full editor text
          const text = event.currentTarget.innerText;
          setEditorText(text);

          // Get the last typed word
          const words = text.trim().split(/\s+/);
          const lastWord = words[words.length - 1] || "";

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
      }>
        Tulis teks disini
      </div>

      {/* Show auto complete suggestions */}
      {suggestions.length > 0 && (
        <div className="suggestion-box">
          {suggestions.map((word) => (
            <button key={word} className="suggestion-item" onClick={
              () => {
                /* Get the current editor text */
                const text = editorRef.current.innerText;

                /* Replace the last words with selected suggestions */
                const words = text.trim().split(/\s+/);
                words[words.length - 1] = word;          

                /* Update the editor text */
                editorRef.current.innerText = words.join(" ") + " ";
                setEditorText(editorRef.current.innerText);
                setSuggestions([]);      
              }
            }>
              {word}
            </button>
          ))}

        </div>
      )}

      {/* Short editor hint */}
      <p className="note">Ketik untuk memicu autocomplete - klik kata bergaris merah untuk saran koreksi</p>
    </section>
  );
}
