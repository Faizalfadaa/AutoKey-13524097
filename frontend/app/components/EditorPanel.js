// Main text editor area
export default function EditorPanel() {
  return (
    <section className="panel-box editor">
      {/* Editor title and session info */}
      <div className="editor-top">
        <p>Teks Editor</p>
        <span>0 pasangan</span>
      </div>

      {/* Editable text area */}
      <div className="text-area" contentEditable suppressContentEditableWarning>
        Tulis teks disini
      </div>

      {/* Short editor hint */}
      <p className="note">Ketik untuk memicu autocomplete - klik kata bergaris merah untuk saran koreksi</p>
    </section>
  );
}
