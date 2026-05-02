import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Logo from "@/components/Logo";

export default function Terms() {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <header className="border-b border-neutral-200/70">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-6">
          <Link to="/" className="flex items-center" aria-label="RZ Trader Studio">
            <Logo className="h-5" invert={false} />
          </Link>
          <Link to="/" className="inline-flex items-center gap-1 text-[12px] text-neutral-500 hover:text-neutral-900">
            <ArrowLeft className="h-3.5 w-3.5" /> Início
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-16">
        <p className="font-mono text-[10px] uppercase tracking-[0.45em] text-amber-700/80">Documento legal</p>
        <h1 className="mt-3 font-serif text-4xl font-light tracking-tight">Política de Uso</h1>
        <p className="mt-2 text-[12px] text-neutral-500">Última atualização: {new Date().toLocaleDateString("pt-BR")}</p>

        <div className="prose prose-neutral mt-10 max-w-none text-[14px] leading-relaxed text-neutral-700">
          <h2 className="mt-8 font-serif text-xl font-medium">1. Aceitação dos termos</h2>
          <p>
            Ao acessar ou utilizar este site, você concorda com os termos descritos abaixo. Se não concordar com
            qualquer item, recomendamos não utilizar o serviço.
          </p>

          <h2 className="mt-8 font-serif text-xl font-medium">2. Natureza do serviço</h2>
          <p>
            O conteúdo aqui apresentado é educacional e informativo, voltado a pessoas maiores de 18 anos com
            interesse em opções binárias e mercado financeiro. Não constitui recomendação de investimento,
            consultoria financeira ou oferta de valores mobiliários.
          </p>

          <h2 className="mt-8 font-serif text-xl font-medium">3. Risco e ausência de garantias</h2>
          <p>
            Operações em opções binárias envolvem alto risco e podem resultar na perda total do capital investido.{" "}
            <strong>Não garantimos resultados.</strong> Aplicamos um método de forma diária, e qualquer pessoa que
            decida aplicá-lo o faz por sua conta e risco, sendo os resultados unitários e dependentes de
            disciplina, contexto de mercado e gestão própria.
          </p>

          <h2 className="mt-8 font-serif text-xl font-medium">4. Conduta do usuário</h2>
          <ul className="ml-5 list-disc space-y-1">
            <li>É proibido reproduzir, redistribuir ou comercializar conteúdos sem autorização escrita;</li>
            <li>É proibido o uso de robôs, scrapers ou qualquer mecanismo automatizado;</li>
            <li>É proibido acessar áreas restritas com credenciais de terceiros.</li>
          </ul>

          <h2 className="mt-8 font-serif text-xl font-medium">5. Propriedade intelectual</h2>
          <p>
            Todo o material — textos, vídeos, logotipos, marcas, layouts — é de titularidade exclusiva do site e
            protegido pela legislação de direitos autorais.
          </p>

          <h2 className="mt-8 font-serif text-xl font-medium">6. Limitação de responsabilidade</h2>
          <p>
            Em nenhuma hipótese o site, seus criadores ou colaboradores serão responsáveis por danos diretos,
            indiretos, lucros cessantes ou perdas financeiras decorrentes do uso ou impossibilidade de uso do
            serviço.
          </p>

          <h2 className="mt-8 font-serif text-xl font-medium">7. Isenção de vínculo com plataformas</h2>
          <p>
            Este site não é afiliado, endossado, patrocinado ou administrado pela Meta Platforms, Inc. (Facebook /
            Instagram), Google LLC, TikTok ou demais plataformas de anúncios. Toda informação aqui veiculada é de
            responsabilidade exclusiva do site.
          </p>

          <h2 className="mt-8 font-serif text-xl font-medium">8. Alterações</h2>
          <p>
            Estes termos podem ser atualizados a qualquer momento. A versão vigente será sempre a publicada nesta
            página.
          </p>

          <h2 className="mt-8 font-serif text-xl font-medium">9. Contato</h2>
          <p>
            Dúvidas: <strong>contato@falhaéfalha.online</strong>.
          </p>
        </div>
      </main>

      <footer className="border-t border-neutral-200/70 bg-neutral-50">
        <div className="mx-auto max-w-3xl px-6 py-6 text-center text-[11px] text-neutral-500">
          © {new Date().getFullYear()} RZ Trader Studio · contato@falhaéfalha.online
        </div>
      </footer>
    </div>
  );
}
