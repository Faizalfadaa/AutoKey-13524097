"use client";
import { useEffect, useState } from "react";

// Format count for UI
function formatCount(value) {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}k`;
  }

  return value;
}

// Format memory for UI
function formatMemory(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

// Top area for the app title, stats, and actions
export default function Header({editorText, setCheckResult}) {
  // Store Trie statistics from the backend
  const [statistics, setStatistics] = useState(null);

  // Load statistics when the header is first shown
  useEffect(() => {
    fetch("http://127.0.0.1:8000/statistics")
      .then((response) => response.json())
      .then((data) => setStatistics(data));
  }, []);

  return (
    <header className="header-panel">

      {/* App logo and title */}
      <div className="title">
        <div className="logo">A</div>
        <div className="title-text">
          <h1>AutoKey</h1>

          {/* Show the Trie statistics after the backend responds */}
          <p>
            {statistics
              ? `${formatCount(statistics.num_words)} kata - ${formatCount(statistics.num_nodes)} node trie - ${statistics.avg_depth.toFixed(1)} depth - ${formatMemory(statistics.estimate_memory_usage)}`
              : "Loading statistics"}
          </p>
        </div>
      </div>

      {/* Main action button for scanning all text later */}
      <button className="check-button" onClick={
        () => {
          fetch(`http://127.0.0.1:8000/check_all?text=${encodeURIComponent(editorText)}`, {
            method: "POST"
          }).then((response) => response.json()).then((data) => setCheckResult(data.result));          
        }
      }>Check All</button>
    </header>
  );
}