import "./unterzeichnende.css";

export type Signatory = {
  name: string;
  chair: string;
};

type UnterzeichnendeSectionProps = {
  signatories: Signatory[];
};

export default function UnterzeichnendeSection({
  signatories,
}: UnterzeichnendeSectionProps) {
  return (
    <>
      <span className="appell-accent-line" />
      <h2 className="appell-section-heading">Unterzeichnende</h2>

      <ul className="unterzeichnende-list">
        {signatories.map((signatory, index) => (
          <li key={index} className="unterzeichnende-item">
            <span className="unterzeichnende-name">{signatory.name}</span>
            <span className="unterzeichnende-chair">{signatory.chair}</span>
          </li>
        ))}
      </ul>

      <div className="unterzeichnende-cta">
        <p className="unterzeichnende-cta-text">
          Wenn Sie Professor:in sind und unterzeichnen möchten, schreiben Sie
          uns bitte eine E-Mail an{" "}
          <a href="mailto:germany@pauseai.info">germany@pauseai.info</a>.
        </p>
      </div>
    </>
  );
}
