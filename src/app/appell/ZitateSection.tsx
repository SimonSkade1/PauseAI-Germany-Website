export default function ZitateSection() {
  return (
    <div className="appell-zitate-container">
      <span className="appell-accent-line"></span>
      <h2 className="appell-section-heading">Zitate</h2>

      <div className="appell-quotes-list">
        <blockquote className="appell-quote-editorial">
          <span className="appell-quote-accent" aria-hidden="true"></span>
          <p className="appell-quote-text">"Bereits jetzt halte ich den Einfluss von KI für stark negativ: Auf die Menschheit, auf die Demokratie, auf den Planeten."</p>
          <footer className="appell-quote-attribution">
            <cite className="appell-quote-name">Peter Scholze</cite>
            <span className="appell-quote-chair">Fields-Medaillen-Träger (2018), Direktor am Max-Planck-Institut für Mathematik in Bonn</span>
          </footer>
        </blockquote>

        <blockquote className="appell-quote-editorial">
          <span className="appell-quote-accent" aria-hidden="true"></span>
          <p className="appell-quote-text">"Mit KI erschaffen wir eine neue intelligente Spezies, und wir tun dies häufig nicht mit der nötigen Sorgfalt, sondern in einem Wettlauf darum, wer es am schnellsten schafft. KI bietet viele Möglichkeiten, aber ohne internationale Sicherheitsstandards riskieren wir, von intellektuell überlegenen KIs verdrängt zu werden."</p>
          <footer className="appell-quote-attribution">
            <cite className="appell-quote-name">Andrzej J. Buras</cite>
            <span className="appell-quote-chair">Max-Planck-Medaillen-Träger (2020), Professor emeritus für Theoretische Physik an der TU München</span>
          </footer>
        </blockquote>

      </div>
    </div>
  );
}
