export default function SectionTitle({ text }: { text: string }) {
  return (
    <div className="section-title-wrapper">
      <span className="section-title-text">
        {text}
      </span>
      <div className="section-title-spacer" />
      <hr className="section-title-hr" />
      <div className="section-title-spacer" />
    </div>
  );
}
