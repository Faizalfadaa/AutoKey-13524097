"use client";

import { useState } from "react";
import Header from "./Header";
import EditorPanel from "./EditorPanel";
import SummaryPanel from "./SummaryPanel";
import ToolPanel from "./ToolPanel";

// Main layout for the AutoKey page
export default function AutoKeyLayout() {
  const [editorText, setEditorText] = useState("");
  const [checkResult, setCheckResult] = useState([]);

  return (
    <main className="page">
      <section className="app-shell">
        {/* Top section */}
        <Header editorText={editorText} setCheckResult={setCheckResult}/>

        {/* Main workspace section */}
        <div className="main-grid">
          <EditorPanel setEditorText={setEditorText}/>
          <SummaryPanel checkResult={checkResult}/>
        </div>

        {/* Bottom tools section */}
        <ToolPanel />
      </section>
    </main>
  );
}
