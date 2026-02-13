import { quotesDE } from "./content";

export default function ZitateSection() {
  return (
    <div className="appell-zitate-container">
      <span className="appell-accent-line"></span>
      <h2 className="appell-section-heading">Zitate</h2>

      <div className="appell-quotes-list">
        {quotesDE.map((quote, index) => (
          <blockquote key={index} className="appell-quote-editorial">
            <span className="appell-quote-accent" aria-hidden="true"></span>
            <p className="appell-quote-text">"{quote.quote}"</p>
            <footer className="appell-quote-attribution">
              <cite className="appell-quote-name">{quote.name}</cite>
              <span className="appell-quote-chair">{quote.chair}</span>
            </footer>
          </blockquote>
        ))}
      </div>
    </div>
  );
}
