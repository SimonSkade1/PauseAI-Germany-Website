export default function ZitateSection() {
  return (
    <div className="appell-zitate-container">
      <span className="appell-accent-line"></span>
      <h2 className="appell-section-heading">Zitate</h2>

      <div className="appell-quotes-list">
        <blockquote className="appell-quote-editorial">
          <span className="appell-quote-accent" aria-hidden="true"></span>
          <p className="appell-quote-text">"Die Minderung des Risikos eines Aussterbens durch KI sollte eine globale Priorität sein, gleichrangig mit anderen Risiken gesamtgesellschaftlichen Ausmaßes wie Pandemien und Atomkrieg."</p>
          <footer className="appell-quote-attribution">
            <cite className="appell-quote-name">Statement on AI Risk</cite>
            <span className="appell-quote-chair">unterzeichnet von den 3 meistzitierten KI-Wissenschaftlern und den CEOs führender KI-Unternehmen</span>
          </footer>
        </blockquote>

        <blockquote className="appell-quote-editorial">
          <span className="appell-quote-accent" aria-hidden="true"></span>
          <p className="appell-quote-text">"Ich habe vier Jahre im Sicherheitsteam von OpenAI gearbeitet und kann Ihnen mit Gewissheit sagen: KI-Unternehmen nehmen ihre Sicherheit nicht ernst genug, und sie sind nicht auf Kurs, kritische Sicherheitsprobleme zu lösen."</p>
          <footer className="appell-quote-attribution">
            <cite className="appell-quote-name">Steven Adler</cite>
            <span className="appell-quote-chair">ehemaliger Leiter der Dangerous Capability Evaluations bei OpenAI</span>
          </footer>
        </blockquote>

        <blockquote className="appell-quote-editorial">
          <span className="appell-quote-accent" aria-hidden="true"></span>
          <p className="appell-quote-text">"Wir betonen: Einige KI-Systeme zeigen bereits heute die Fähigkeit und Neigung, die Sicherheits- und Kontrollbemühungen ihrer Entwickler zu untergraben."</p>
          <footer className="appell-quote-attribution">
            <cite className="appell-quote-name">Konsens führender KI-Sicherheitsforscher</cite>
            <span className="appell-quote-chair">darunter Stuart Russell und Andrew Yao · International Dialogues on AI Safety, Shanghai 2025</span>
          </footer>
        </blockquote>
      </div>
    </div>
  );
}
