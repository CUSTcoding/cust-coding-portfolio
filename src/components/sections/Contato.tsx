"use client";

import { memo, type FormEvent } from "react";
import { texts } from "@/config/texts";
import { iconStyle } from "@/lib/icons";
import { Socials } from "../Socials";

function ContatoBase() {
  const { contato, hero } = texts;
  const { form } = contato;

  // Sem backend: abre o app de email do visitante com a mensagem preenchida
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const get = (k: string) => String(d.get(k) || "").trim();
    const subject = get("subject") || get("service") || "Contacto pelo portfólio";
    const body = [
      `Nome: ${get("name")}`,
      `Email: ${get("email")}`,
      get("phone") ? `Telefone: ${get("phone")}` : "",
      get("service") ? `Serviço: ${get("service")}` : "",
      "",
      get("message"),
    ]
      .join("\n");
    window.location.href = `mailto:${form.mailTo}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <section className="panel" id="contato" aria-label="Contato">
      <div className="container">
        <div className="contact-band">
          <div className="contact-intro">
            <span className="contact-intro__icon" aria-hidden="true"></span>
            <h2 className="anaglyph cyberpunk" id="contato-title">
              {contato.title}
            </h2>
            <p className="contact-intro__text" id="contato-intro">
              {contato.intro}
            </p>
          </div>
          <div className="cards" id="contato-cards">
            {/* Formulário */}
            <div className="card contact-form-card" id="contato-form-card">
              <h3 className="contact-form__title">{form.title}</h3>
              <p className="contact-form__text">{form.text}</p>
              <form className="contact-form" onSubmit={onSubmit}>
                <div className="contact-form__row">
                  <input name="name" type="text" placeholder={form.fields.name} aria-label={form.fields.name} required />
                  <input name="email" type="email" placeholder={form.fields.email} aria-label={form.fields.email} required />
                </div>
                <div className="contact-form__row">
                  <input name="phone" type="tel" placeholder={form.fields.phone} aria-label={form.fields.phone} />
                  <input name="subject" type="text" placeholder={form.fields.subject} aria-label={form.fields.subject} />
                </div>
                <select name="service" defaultValue="" aria-label={form.servicePlaceholder}>
                  <option value="" disabled>
                    {form.servicePlaceholder}
                  </option>
                  {form.services.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <textarea name="message" placeholder={form.fields.message} aria-label={form.fields.message} rows={5} required />
                <button type="submit" id="form-submit">
                  {form.submit}
                </button>
              </form>
            </div>

            {/* Informação de contacto */}
            <div className="card contact-info-card" id="contato-info-card">
              {contato.info.map((item) => (
                <div className="contact-info" key={item.label}>
                  <span className="contact-info__icon" aria-hidden="true">
                    <span style={iconStyle(item.icon)}></span>
                  </span>
                  <span className="contact-info__text">
                    <small>{item.label}</small>
                    <strong>{item.value}</strong>
                  </span>
                </div>
              ))}
              <Socials socials={hero.socials} className="contact-links" />
            </div>

            {/* Tweaks visuais (botões ligados pelo motor em controls.ts) */}
            <div className="card card-cyberpunk" data-text="TUNE" id="contato-tweaks-card">
              <span aria-hidden="true" className="card-cyberpunk__glitch">
                TUNE
              </span>
              <h3 className="cyberpunk" id="tweaks-title">
                {contato.tweaks.title}
              </h3>
              <div style={{ display: "flex", gap: 12, marginBottom: 15, flexWrap: "wrap" }}>
                <button id="toggle-controls" className="controls-btn controls-btn--notch" suppressHydrationWarning>
                  {contato.tweaks.buttons.skillTree}
                </button>
                <button
                  id="toggle-model-controls"
                  className="model-controls-btn model-controls-btn--notch"
                  suppressHydrationWarning
                >
                  {contato.tweaks.buttons.model3D}
                </button>
              </div>
              <label id="anaglyph-label">
                {contato.tweaks.anaglyphLabel}{" "}
                <input id="anaRange" type="range" min="0" max="1" step="0.01" defaultValue="0.6" />
              </label>
              <p className="muted" id="anaglyph-description">
                {contato.tweaks.anaglyphDescription}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export const Contato = memo(ContatoBase);
