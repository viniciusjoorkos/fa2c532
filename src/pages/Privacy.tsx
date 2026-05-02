import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Logo from "@/components/Logo";

export default function Privacy() {
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
        <h1 className="mt-3 font-serif text-4xl font-light tracking-tight">Política de Privacidade</h1>
        <p className="mt-2 text-[12px] text-neutral-500">Última atualização: {new Date().toLocaleDateString("pt-BR")}</p>

        <div className="prose prose-neutral mt-10 max-w-none text-[14px] leading-relaxed text-neutral-700">
          <h2 className="mt-8 font-serif text-xl font-medium">1. Quem somos</h2>
          <p>
            Esta política descreve como o site falhaéfalha.online ("nós", "site") coleta, utiliza e protege as
            informações dos usuários ("você") que acessam nossas páginas e serviços. Somos responsáveis exclusivos
            pelo conteúdo aqui publicado e operamos de forma independente, sem qualquer vínculo institucional com
            Meta Platforms, Google, TikTok ou demais plataformas de anúncios.
          </p>

          <h2 className="mt-8 font-serif text-xl font-medium">2. Dados que coletamos</h2>
          <p>Podemos coletar, mediante seu consentimento ou interação direta:</p>
          <ul className="ml-5 list-disc space-y-1">
            <li>Dados de cadastro: nome, e-mail, telefone (quando informados);</li>
            <li>Dados de navegação: endereço IP, tipo de dispositivo, páginas visitadas, tempo de sessão;</li>
            <li>Cookies e identificadores anônimos para fins analíticos e de remarketing.</li>
          </ul>

          <h2 className="mt-8 font-serif text-xl font-medium">3. Como usamos seus dados</h2>
          <ul className="ml-5 list-disc space-y-1">
            <li>Para responder solicitações e prestar atendimento;</li>
            <li>Para enviar comunicações relacionadas ao serviço, quando autorizado;</li>
            <li>Para melhorar a experiência de navegação e segurança da plataforma;</li>
            <li>Para cumprir obrigações legais e regulatórias.</li>
          </ul>

          <h2 className="mt-8 font-serif text-xl font-medium">4. Compartilhamento</h2>
          <p>
            Não vendemos seus dados. Podemos compartilhar informações com prestadores de serviço (hospedagem,
            analytics, processamento de pagamentos) estritamente para viabilizar a operação, todos sob obrigação
            de confidencialidade.
          </p>

          <h2 className="mt-8 font-serif text-xl font-medium">5. Seus direitos (LGPD)</h2>
          <p>
            Você pode, a qualquer momento, solicitar acesso, correção, portabilidade, anonimização ou exclusão dos
            seus dados pessoais escrevendo para <strong>contato@falhaéfalha.online</strong>.
          </p>

          <h2 className="mt-8 font-serif text-xl font-medium">6. Cookies</h2>
          <p>
            Utilizamos cookies essenciais e analíticos. Você pode desativá-los nas configurações do seu navegador,
            ciente de que isso pode afetar a experiência de uso.
          </p>

          <h2 className="mt-8 font-serif text-xl font-medium">7. Isenção de vínculo com plataformas</h2>
          <p>
            Este site não é afiliado, endossado, patrocinado ou administrado pela Meta Platforms, Inc. (Facebook /
            Instagram), Google LLC, TikTok ou qualquer outra rede de anúncios. Todo o conteúdo, ofertas e
            comunicações são de responsabilidade exclusiva deste site.
          </p>

          <h2 className="mt-8 font-serif text-xl font-medium">8. Contato</h2>
          <p>
            Dúvidas sobre privacidade: <strong>contato@falhaéfalha.online</strong>.
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
