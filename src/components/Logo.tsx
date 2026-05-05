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
    <span
      className={cn(
        "text-lg sm:text-xl font-bold tracking-tight whitespace-nowrap",
        className,
      )}
    >
      RZ STUDIO
    </span>
  );
}
