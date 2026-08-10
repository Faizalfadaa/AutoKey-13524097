// Top area for the app title, stats, and actions
export default function Header() {
  return (
    <header className="header-panel">
      <div className="title">
        <div className="logo">A</div>

        <div className="title-text">
          <h1>AutoKey</h1>
        </div>
      </div>

      <button className="check-button">Check All</button>
    </header>
  );
}
