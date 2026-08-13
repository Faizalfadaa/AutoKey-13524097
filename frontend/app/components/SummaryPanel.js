// Side panel for spell check results
export default function SummaryPanel({checkResult}) {
  let content;

  if (checkResult.length === 0) {
    content = (
      /* Empty state before the text is checked */
      <div className="summary-bottom">
        <div className="summary-icon"> + </div>
        <p> Klik Check All <br></br> untuk memindai seluruh teks </p>
      </div>
    );
    
  } else {
    content = (
      /* Summary result */
      <div className="result">
        {checkResult.map((item, index) => (
          <div className="error" key={index}>
            <p className="error-word">{item.word}</p>

            <div className="suggestions">
              {item.suggested_word.map((suggestion, index) => (
                <span className="suggestion" key={index}>
                  {suggestion}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <section className="panel-box summary-panel">
      {/* Summary title and issue count */}
      <div className="summary-top">
        <p>Ringkasan</p>
        <span>{checkResult.length} isu</span>
      </div>

      {content}
    </section>
  );
}