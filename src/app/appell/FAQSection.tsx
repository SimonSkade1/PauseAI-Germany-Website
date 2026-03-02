export default function FAQSection() {
  return (
    <div className="appell-zitate-container">
      <span className="appell-accent-line"></span>
      <h2 className="appell-section-heading">FAQ</h2>

      <div className="appell-faq-list">
        <details className="appell-faq-item">
          <summary className="appell-faq-question">Was sind rote Linien für KI?</summary>
          <div className="appell-faq-answer">
            <p>Rote Linien verbieten KI-Systeme, die ein unannehmbares Risiko für uns alle bedeuten würden.</p>
            <p>Darunter fallen etwa Systeme, die:</p>
            <ul>
              <li>sich unkontrolliert selbst verbessern,</li>
              <li>Menschen systematisch täuschen,</li>
              <li>oder katastrophalen Missbrauch wie die Entwicklung von Biowaffen zulassen.</li>
            </ul>
          </div>
        </details>

        <details className="appell-faq-item">
          <summary className="appell-faq-question">Wie könnte ein internationales Abkommen durchgesetzt werden?</summary>
          <div className="appell-faq-answer">
            <p>Das Training der größten allgemeinen KI-Modelle erfordert heute riesige Rechenzentren mit spezialisierten Computerchips. Diese Konzentration macht eine Regulierung gut umsetzbar.</p>
            <p>Ein internationales Abkommen könnte auf drei Säulen basieren:</p>
            <ol>
              <li>
                <strong>Internationale Aufsicht:</strong> Eine neue internationale Behörde überprüft die Einhaltung von Sicherheitsstandards in Zusammenarbeit mit nationalen Behörden. Whistleblower werden geschützt.
              </li>
              <li>
                <strong>Rechenleistung sichtbar machen:</strong> Große Trainingsläufe werden registriert und beaufsichtigt. KI-Chips können technisch so gestaltet werden, dass ihre Nutzung nachvollziehbar wird.
              </li>
              <li>
                <strong>Konsequenzen bei Verstößen:</strong> Staaten beschließen gemeinsame Sanktionen gegen Akteure, die rote Linien überschreiten, und entwickeln Strategien für den Umgang mit Krisen.
              </li>
            </ol>
          </div>
        </details>
      </div>

      <div className="appell-faq-print-list">
        <article className="appell-faq-print-item">
          <h3 className="appell-faq-question">Was sind rote Linien für KI?</h3>
          <div className="appell-faq-answer">
            <p>Rote Linien verbieten KI-Systeme, die ein unannehmbares Risiko für uns alle bedeuten würden.</p>
            <p>Darunter fallen etwa Systeme, die:</p>
            <ul>
              <li>sich unkontrolliert selbst verbessern,</li>
              <li>Menschen systematisch täuschen,</li>
              <li>oder katastrophalen Missbrauch wie die Entwicklung von Biowaffen zulassen.</li>
            </ul>
          </div>
        </article>

        <article className="appell-faq-print-item">
          <h3 className="appell-faq-question">Wie könnte ein internationales Abkommen durchgesetzt werden?</h3>
          <div className="appell-faq-answer">
            <p>Das Training der größten allgemeinen KI-Modelle erfordert heute riesige Rechenzentren mit spezialisierten Computerchips. Diese Konzentration macht eine Regulierung gut umsetzbar.</p>
            <p>Ein internationales Abkommen könnte auf drei Säulen basieren:</p>
            <ol>
              <li>
                <strong>Internationale Aufsicht:</strong> Eine neue internationale Behörde überprüft die Einhaltung von Sicherheitsstandards in Zusammenarbeit mit nationalen Behörden. Whistleblower werden geschützt.
              </li>
              <li>
                <strong>Rechenleistung sichtbar machen:</strong> Große Trainingsläufe werden registriert und beaufsichtigt. KI-Chips können technisch so gestaltet werden, dass ihre Nutzung nachvollziehbar wird.
              </li>
              <li>
                <strong>Konsequenzen bei Verstößen:</strong> Staaten beschließen gemeinsame Sanktionen gegen Akteure, die rote Linien überschreiten, und entwickeln Strategien für den Umgang mit Krisen.
              </li>
            </ol>
          </div>
        </article>
      </div>
    </div>
  );
}
