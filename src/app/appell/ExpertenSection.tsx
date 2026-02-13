export default function ExpertenSection() {
  return (
    <div className="appell-zitate-container">
      <span className="appell-accent-line"></span>
      <h2 className="appell-section-heading">Internationale Experten</h2>

      <div className="appell-experten-list">
        <blockquote className="appell-experten-quote">
          <p className="appell-experten-text">"Die Minderung des Risikos eines Aussterbens durch KI sollte eine globale Priorität sein, gleichrangig mit anderen Risiken gesamtgesellschaftlichen Ausmaßes wie Pandemien und Atomkrieg."</p>
          <footer className="appell-experten-attribution">
            <span className="appell-experten-name">Statement on AI Risk</span>
            <span className="appell-experten-separator"> · </span>
            <span className="appell-experten-role">unterzeichnet von den 2 meistzitierten KI-Wissenschaftlern und den CEOs führender KI-Unternehmen</span>
          </footer>
        </blockquote>

        <blockquote className="appell-experten-quote">
          <p className="appell-experten-text">"Ich habe vier Jahre im Sicherheitsteam von OpenAI gearbeitet und kann Ihnen mit Gewissheit sagen: KI-Unternehmen nehmen ihre Sicherheit nicht ernst genug, und sie sind nicht auf Kurs, kritische Sicherheitsprobleme zu lösen."</p>
          <footer className="appell-experten-attribution">
            <span className="appell-experten-name">Steven Adler</span>
            <span className="appell-experten-separator"> · </span>
            <span className="appell-experten-role">ehemaliger Leiter der Dangerous Capability Evaluations bei OpenAI</span>
          </footer>
        </blockquote>

        <blockquote className="appell-experten-quote">
          <p className="appell-experten-text">"Wir betonen: Einige KI-Systeme zeigen bereits heute die Fähigkeit und Neigung, die Sicherheits- und Kontrollbemühungen ihrer Entwickler zu untergraben."</p>
          <footer className="appell-experten-attribution">
            <span className="appell-experten-name">Konsens führender KI-Sicherheitsforscher</span>
            <span className="appell-experten-separator"> · </span>
            <span className="appell-experten-role">darunter Stuart Russell und Andrew Yao</span>
            <span className="appell-experten-separator"> · </span>
            <span className="appell-experten-org">International Dialogues on AI Safety, Shanghai 2025</span>
          </footer>
        </blockquote>
      </div>
    </div>
  );
}
