export default function PetitionSection() {
  return (
    <div className="appell-petition-container">
      <span className="appell-accent-line"></span>
      <h2 className="appell-section-heading">Petition</h2>

      <p className="appell-paragraph">
        Unterschreiben Sie unseren Appell auf Change.org, um die deutsche Delegation
        des KI-Gipfels zu unterstützen.
      </p>

      <a
        href="https://change.org"
        target="_blank"
        rel="noopener noreferrer"
        className="appell-btn-primary"
      >
        Jetzt unterschreiben
      </a>
    </div>
  );
}
