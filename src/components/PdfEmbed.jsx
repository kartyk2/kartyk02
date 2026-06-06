import "./PdfEmbed.css";

export default function PdfEmbed({
  title,
  src,
  description,
}) {
  return (
    <div className="pdf-card">
      <div className="pdf-header">
        <h3>{title}</h3>

        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className="pdf-open"
        >
          Open PDF ↗
        </a>
      </div>

      {description && (
        <p className="pdf-description">
          {description}
        </p>
      )}

      <div className="pdf-frame">
        <iframe
          src={src}
          title={title}
        />
      </div>
    </div>
  );
}