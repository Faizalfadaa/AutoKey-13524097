"use client";

import { useState } from "react";

// Bottom panel for extra tools
export default function ToolPanel() {
  // Store the selected tool tab
  const [activeTool, setActiveTool] = useState("auto-space");

  // Store the word typed in the Auto-Space input
  const [word, setWord] = useState("");

  // Store the response from the backend segmentation API
  const [segmentResult, setSegmentResult] = useState(null);

  // Store the word typed in the Levenshtein input
  const [spellWord, setSpellWord] = useState("");

  // Store the response from the backend spell check API
  const [spellResult, setSpellResult] = useState(null);

  // Prepare trace-back steps before showing them in the UI
  let traceSteps = [];

  // Use trace-back data only after the segmentation result exists
  if (segmentResult) {
    traceSteps = segmentResult.traceback;
  }

  return (
    <section className="panel-box tool-panel">
      {/* Tool mode tabs */}
      <div className="tool-tabs">
        <button className={activeTool === "auto-space" ? "tool-tab active" : "tool-tab"} onClick={() => setActiveTool("auto-space")}>Auto-Space</button>
        <button className={activeTool === "levenshtein" ? "tool-tab active" : "tool-tab"} onClick={() => setActiveTool("levenshtein")}>Levenshtein</button>
      </div>

      {activeTool === "auto-space" && (
        <>
      {/* Auto-Space input form */}
      <div className="tool-form">
        <input className="tool-input" value={word} onChange={
          (event) => setWord(event.target.value)
        } placeholder="contoh: programdinamis"/>

        <button className="tool-button" onClick={async () => {
            // Stop the request if the input is empty
            if (word.trim() === "") {
              return;
            }

            // Ask the backend to segment the current input
            const response = await fetch(`http://127.0.0.1:8000/segment?word=${word}`);

            // Convert the backend response into json
            const data = await response.json();

            // Save the segmentation result so it can be displayed
            setSegmentResult(data);
          }}
        >
          Segmentasi
        </button>
      </div>

      {/* Short tool hint */}
      <p className="tool-note"> Masukkan string tanpa spasi</p>

      {/* Show the segmentation result after the button is clicked */}
      {segmentResult && (
        <div className="segment-result">

          {/* Final result from the segmentation process */}
          <div className="segment-section">
            <p>Hasil segmentasi</p>
            <strong>{segmentResult.segmented_text || "Tidak ditemukan"}</strong>
          </div>

          {/* DP table from index 0 until the end of the input */}
          <div className="segment-section">
            <p>DP table</p>
            <div className="dp-list">
              
              {/* Show every value inside the DP array */}
              {segmentResult.dp.map((value, index) => {
                let dpText = "";

                if (value === null) {
                  dpText = "inf";
                } else {
                  dpText = value.toFixed(2);
                }

                return (
                  <span key={index}>
                    dp[{index}] = {dpText}
                  </span>
                );

              })}
            </div>
          </div>

          {/* Backward reconstruction steps from the selected words */}
          <div className="segment-section">
            <p>Trace-back</p>

            {traceSteps.length > 0 && (
              <ol className="trace-list">

                {/* Show each reconstruction step from start to end */}
                {traceSteps.map((step, index) => (
                  <li key={index}>
                    dp[{step[0]}] {"->"} dp[{step[1]}] lewat kata "{step[2]}"
                  </li>
                ))}
              </ol>
            )}

            {/* Show when the word cannot be segmented */}
            {traceSteps.length === 0 && (
              <span className="empty-trace">Tidak ada trace-back</span>
            )}

          </div>
        </div>
      )}
        </>
      )}

      {activeTool === "levenshtein" && (
        <>
          {/* Levenshtein input form */}
          <div className="tool-form">
            <input className="tool-input" value={spellWord} onChange={
              (event) => setSpellWord(event.target.value)
            } placeholder="contoh: produktitas"/>

            <button className="tool-button" onClick={async () => {
                // Stop the request if the input is empty
                if (spellWord.trim() === "") {
                  return;
                }

                // Ask the backend to check the current word
                const response = await fetch(`http://127.0.0.1:8000/spell_check?word=${spellWord}`);

                // Convert the backend response into json
                const data = await response.json();

                // Save the spell check result so it can be displayed
                setSpellResult(data);
              }}
            >
              Cek Kata
            </button>
          </div>

          {/* Short tool hint */}
          <p className="tool-note"> Masukkan satu kata untuk dicek</p>

          {/* Show the spell check result after the button is clicked */}
          {spellResult && (
            <div className="spell-result">
              <p>Kata</p>
              <strong>{spellResult.word}</strong>

              <p>Status</p>
              {spellResult.isValid && (
                <span className="valid-word">Valid</span>
              )}

              {!spellResult.isValid && (
                <span className="invalid-word">Tidak valid</span>
              )}

              <p>Saran</p>
              <div className="spell-suggestions">
                {spellResult.suggested_word.map((suggestion, index) => (
                  <span key={index}>{suggestion}</span>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}
