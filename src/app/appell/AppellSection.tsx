import { appell, universities } from "./content";

export default function AppellSection() {
  // Compute total signatories count
  const totalSignatories = universities.reduce(
    (sum, uni) => sum + uni.signatories.length,
    0
  );

  return (
    <div className="appell-content">
      <h1 className="appell-headline">{appell.headline}</h1>

      <p className="appell-paragraph">{appell.paragraph}</p>

      <div className="appell-priorities">
        {appell.priorities.map((priority) => (
          <div key={priority.number} className="appell-priority">
            <span className="appell-priority-number">{priority.number}</span>
            <div className="appell-priority-content">
              <h3 className="appell-priority-title">{priority.title}</h3>
              <p className="appell-priority-text">{priority.text}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="appell-conclusion">{appell.conclusion}</p>

      <p className="appell-credibility">
        Unterzeichnet von {totalSignatories} Professorinnen und Professoren
      </p>
    </div>
  );
}
