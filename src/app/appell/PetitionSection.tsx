export default function PetitionSection() {
  return (
    <div className="appell-petition-container">
      <span className="appell-accent-line"></span>
      <h2 className="appell-section-heading">Petition für Bürger:innen</h2>

      <p className="appell-paragraph">
        Unterschreibe unsere parallele Petition auf Change.org, um der deutschen Delegation zu zeigen, dass du dir mehr Sicherheit beim Thema KI wünschst.
      </p>

      <a
        href="https://www.change.org/p/ki-gipfel-deutschland-muss-f%C3%BCr-sicherheit-eintreten"
        target="_blank"
        rel="noopener noreferrer"
        className="appell-btn-primary"
      >
        Jetzt unterschreiben
      </a>
    </div>
  );
}
