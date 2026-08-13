// Bottom panel for extra tools
export default function ToolPanel() {
  return (
    <section className="panel-box tool-panel">
      {/* Tool mode tabs */}
      <div className="tool-tabs">
        <button className="tool-tab active">Auto-Space</button>
        <button className="tool-tab">Smart Trim</button>
        <button className="tool-tab">Levenshtein</button>
      </div>

      {/* Auto-Space input form */}
      <div className="tool-form">
        <input className="tool-input" placeholder="contoh: programdinamis" />
        <button className="tool-button">Segmentasi</button>
      </div>

      {/* Short tool hint */}
      <p className="tool-note"> Masukkan string tanpa spasi</p>
    </section>
  );
}
