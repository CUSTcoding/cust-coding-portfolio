/** Ícones locais em /public/icons (si = Simple Icons, lu = Lucide, tb = Tabler). */
export function iconUrl(icon: string): string {
  const [set, name] = icon.split(":");
  return `/icons/${set}/${name}.svg`;
}

/** Estilo para ícones desenhados com mask-image (a cor vem do currentColor). */
export const iconStyle = (icon: string) => ({ ["--icon" as string]: `url('${iconUrl(icon)}')` });
