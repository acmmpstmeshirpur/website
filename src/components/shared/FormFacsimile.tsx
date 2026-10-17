import { site } from '../../data/site';

interface FormFacsimileProps {
  code: string;
  title: string;
  subject: string;
  /** The email body; lines ending in ":" become blank form fields. */
  body: string;
  className?: string;
}

/**
 * A printed-form preview of the email draft a button opens, so visitors
 * can see what they will be asked for before their mail app starts.
 */
export default function FormFacsimile({ code, title, subject, body, className = '' }: FormFacsimileProps) {
  const fields = body
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.endsWith(':'))
    .map((l) => l.slice(0, -1));

  return (
    <figure className={`form-fax ${className}`} aria-label={`Preview of the ${title.toLowerCase()} email`}>
      <div className="form-fax__head">
        <p className="meta">Form {code}</p>
        <p className="form-fax__title">{title}</p>
      </div>
      <dl className="form-fax__envelope">
        <div>
          <dt className="meta">To</dt>
          <dd>{site.email}</dd>
        </div>
        <div>
          <dt className="meta">Subject</dt>
          <dd>{subject}</dd>
        </div>
      </dl>
      <ul className="form-fax__fields">
        {fields.map((f) => (
          <li key={f}>
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <figcaption className="form-fax__note">The draft opens in your mail app. Edit anything before you send.</figcaption>
    </figure>
  );
}
