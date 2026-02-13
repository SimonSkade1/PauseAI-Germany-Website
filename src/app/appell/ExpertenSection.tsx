export default function ExpertenSection() {
  return (
    <div className="appell-zitate-container">
      <span className="appell-accent-line"></span>
      <h2 className="appell-section-heading">Internationale Expertise</h2>

      <div className="appell-experten-list">
        <blockquote className="appell-experten-quote">
          <p className="appell-experten-text">"Quote text goes here"</p>
          <footer className="appell-experten-attribution">
            <span className="appell-experten-name">Name</span>
            <span className="appell-experten-separator"> · </span>
            <span className="appell-experten-role">Role</span>
            <span className="appell-experten-separator"> · </span>
            <span className="appell-experten-org">Organization</span>
          </footer>
        </blockquote>
      </div>
    </div>
  );
}
