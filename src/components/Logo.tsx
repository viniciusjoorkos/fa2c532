import logoSrc from "@/assets/logo-rztraderstudio.png";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  invert?: boolean; // logo é preto sobre branco; em fundos escuros, inverter
}

/**
 * Wordmark "RZ TRADER STUDIO" — minimalista, sem ícone.
 * Por padrão é renderizado com `invert` em fundos escuros.
 */
export default function Logo({ className, invert = true }: LogoProps) {
  return (
    <img
      src={logoSrc}
      alt="RZ Trader Studio"
      width={1536}
      height={1024}
      loading="lazy"
      decoding="async"
      className={cn(
        "h-5 w-auto select-none object-contain sm:h-6",
        invert && "invert",
        className,
      )}
    />
  );
}
