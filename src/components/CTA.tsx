import type { ReactNode } from "react";

interface CTAProps {
  children?: ReactNode;
  className?: string;
  value?: ReactNode;
}

export default function CTA({ children, className = "", value }: CTAProps) {
  return (
    <div className={`cta ${className}`}>
      <div className="cta__content">{children}</div>
      {value && <span className="cta__value">{value}</span>}
      <div className="cta__layer cta__layer--one" aria-hidden="true" />
      <div className="cta__layer cta__layer--two" aria-hidden="true" />
      <div className="cta__layer cta__layer--three" aria-hidden="true" />
      <div className="cta__layer cta__layer--four" aria-hidden="true" />
      <div className="cta__layer cta__layer--top" aria-hidden="true" />
    </div>
  );
}