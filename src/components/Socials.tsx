import { iconStyle } from "@/lib/icons";

export type SocialLink = {
  name: string;
  href: string;
  icon: string;
};

export function Socials({ socials, className = "" }: { socials: SocialLink[]; className?: string }) {
  if (socials.length === 0) return null;

  return (
    <div className={`socials ${className}`}>
      {socials.map((social) => (
        <a
          href={social.href}
          key={social.name}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={social.name}
          title={social.name}
          className="social-link"
        >
          <span className="social-link__corners" aria-hidden="true" />
          <span className="social-link__grid" aria-hidden="true" />
          <span className="social-link__icon" style={iconStyle(social.icon)} aria-hidden="true" />
        </a>
      ))}
    </div>
  );
}