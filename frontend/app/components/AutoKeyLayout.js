import Header from "./Header";
import EditorPanel from "./EditorPanel";
import SummaryPanel from "./SummaryPanel";
import ToolPanel from "./ToolPanel";

// Main layout for the AutoKey page
export default function AutoKeyLayout() {
  return (
    <main className="page">
      <section className="app-shell">
        <Header />

        <div className="main-grid">
          <EditorPanel />
          <SummaryPanel />
        </div>

        <ToolPanel />
      </section>
    </main>
  );
}
