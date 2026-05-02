import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, Home, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404: rota inexistente:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.12),transparent_60%)]" />
      <div className="relative w-full max-w-md text-center">
        <div className="mx-auto mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-primary/30 bg-primary/5">
          <Crown className="h-5 w-5 text-primary" />
        </div>
        <p className="font-mono text-xs uppercase tracking-[0.32em] text-muted-foreground">Erro 404</p>
        <h1 className="mt-3 font-serif text-5xl font-light tracking-tight">Página não encontrada</h1>
        <p className="mx-auto mt-3 max-w-sm text-sm text-muted-foreground">
          O caminho <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{location.pathname}</code> não existe ou foi movido.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button variant="outline" onClick={() => navigate(-1)} className="h-10 rounded-full">
            <ArrowLeft className="mr-1.5 h-4 w-4" /> Voltar
          </Button>
          <Button asChild className="h-10 rounded-full bg-primary text-primary-foreground hover:opacity-90">
            <Link to="/"><Home className="mr-1.5 h-4 w-4" /> Ir para home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
