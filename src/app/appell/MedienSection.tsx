import "./unterzeichnende.css";

export default function MedienSection() {
  return (
    <div className="appell-medien-container">
      <span className="appell-accent-line"></span>
      <h2 className="appell-section-heading">Pressekontakt</h2>

      <div className="appell-medien-content">
        <div className="unterzeichnende-cta">
          <p className="unterzeichnende-cta-text">
            Für Interviews und Hintergrundgespräche stehen wir gerne zur
            Verfügung. <br/>Schreiben Sie uns bitte eine E-Mail an{" "}
            <a href="mailto:germany@pauseai.info">germany@pauseai.info</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
