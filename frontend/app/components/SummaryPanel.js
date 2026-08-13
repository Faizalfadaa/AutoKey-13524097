// Side panel for spell check results
export default function SummaryPanel() {
  return (
    <section className="panel-box summary-panel">
      {/* Summary title and issue count */}
      <div className="summary-top">
        <p>Ringkasan</p>
        <span>0 isu</span>
      </div>

      {/* Empty state before the text is checked */}
      <div className="summary-bottom">
        <div className="summary-icon"> + </div>
        <p> Klik Check All <br></br> untuk memindai seluruh teks </p>
      </div>
    </section>
  );
}
