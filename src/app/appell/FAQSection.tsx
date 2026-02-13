export default function FAQSection() {
  return (
    <div className="appell-zitate-container">
      <span className="appell-accent-line"></span>
      <h2 className="appell-section-heading">FAQ</h2>

      <div className="appell-faq-list">
        <details className="appell-faq-item">
          <summary className="appell-faq-question">Frage</summary>
          <p className="appell-faq-answer">Antwort text</p>
        </details>
      </div>
    </div>
  );
}
