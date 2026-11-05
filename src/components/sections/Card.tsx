import { html } from "@/lib/html";

type CardProps = {
  dataText: string;
  title: string;
  description?: string;
  phone?: string;
};

/** Card cyberpunk padrão (Sobre / Serviços). */
export function Card({ dataText, title, description, phone }: CardProps) {
  return (
    <div className="card card-cyberpunk" data-text={dataText}>
      <span aria-hidden="true" className="card-cyberpunk__glitch" dangerouslySetInnerHTML={html(dataText || title)} />
      <h3 className="cyberpunk" dangerouslySetInnerHTML={html(title)} />
      {description !== undefined && <p dangerouslySetInnerHTML={html(description)} />}
      {phone && (
        <p>
          <a href={`tel:${phone}`}>{phone}</a>
        </p>
      )}
    </div>
  );
}
