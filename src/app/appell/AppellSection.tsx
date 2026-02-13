export default function AppellSection() {
  return (
    <div className="appell-content">
      <h1 className="appell-headline">Appell zum KI-Gipfel 2026</h1>

      <p className="appell-paragraph">
        Wir fordern die deutsche Delegation des bevorstehenden KI-Gipfels auf, sich öffentlich für ein globales Abkommen auszusprechen, das die folgenden Prioritäten verankert:
      </p>

      <div className="appell-priorities">
        <div className="appell-priority">
          <span className="appell-priority-number">1</span>
          <div className="appell-priority-content">
            <h3 className="appell-priority-title">Rote Linien</h3>
            <p className="appell-priority-text">KI birgt das Risiko unvertretbarer globaler Auswirkungen. Es braucht klare Grenzen, die nicht überschritten werden dürfen.</p>
          </div>
        </div>

        <div className="appell-priority">
          <span className="appell-priority-number">2</span>
          <div className="appell-priority-content">
            <h3 className="appell-priority-title">Verbindliche Sicherheitsstandards</h3>
            <p className="appell-priority-text">Der unkontrollierte KI-Wettlauf führt zur Vernachlässigung von Sicherheit. Regulierung mit unabhängiger internationaler Durchsetzung ist erforderlich.</p>
          </div>
        </div>
      </div>

      <p className="appell-conclusion">Sicherheit und Fortschritt gehören zusammen.</p>
    </div>
  );
}
