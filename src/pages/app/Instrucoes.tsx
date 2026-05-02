import { Wallet, Radio, PlusCircle, Trophy, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const steps = [
  {
    num: "01",
    icon: Wallet,
    title: "Acesse sua Carteira",
    desc: "No menu, clique em Carteira. No computador fica no menu lateral, no celular fica na barra de baixo.",
    action: "Adicione o valor que está na sua conta atual na corretora.",
    link: "/app/carteira",
    linkLabel: "Ir para Carteira",
  },
  {
    num: "02",
    icon: Radio,
    title: "Veja as Lives",
    desc: "Clique em Lives no menu e veja qual a próxima live agendada ou ao vivo.",
    action: "Se estiver ao vivo, aparecerá o botão ENTRAR NA LIVE. Se estiver agendada, um cronômetro mostra o tempo que falta. O link é liberado 10 minutos antes do horário.",
    link: "/app/agenda",
    linkLabel: "Ver Lives",
  },
  {
    num: "03",
    icon: PlusCircle,
    title: "Registre sua Sessão",
    desc: "Quando a live iniciar, volte na seção Carteira e clique em NOVA SESSÃO.",
    action: "Registre: quantas entradas foram, duração média, ganhos e perdas, banca da sessão. Esse registro é verificado por nosso algoritmo e, se confirmado, você recebe pontuação no RZ Studio.",
    link: "/app/carteira",
    linkLabel: "Nova Sessão",
  },
  {
    num: "04",
    icon: Trophy,
    title: "Conquiste o Top",
    desc: "Registre todas as sessões e receba bônus da RZ Trade.",
    action: "Atingindo o Top 2 quinzenal dentro do RZ Studio, você recebe acesso à LIVE GOLD permanente. Você só pode entrar em lives do seu plano.",
    link: "/app",
    linkLabel: "Ver Ranking",
  },
];

export default function Instrucoes() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Instruções Técnicas</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Siga os passos abaixo para começar a operar no RZ Studio.
        </p>
      </div>

      <div className="grid gap-4 sm:gap-5">
        {steps.map((step) => (
          <div
            key={step.num}
            className="glass-card flex flex-col gap-4 rounded-xl p-5 sm:flex-row sm:items-start sm:gap-5"
          >
            {/* Step number + icon */}
            <div className="flex items-center gap-3 sm:flex-col sm:items-center sm:gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-mono text-sm font-bold text-primary sm:h-12 sm:w-12 sm:text-base">
                {step.num}
              </span>
              <step.icon className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
            </div>

            {/* Content */}
            <div className="flex-1">
              <h3 className="text-base font-semibold sm:text-lg">{step.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
              <p className="mt-2 text-sm leading-relaxed text-foreground">{step.action}</p>

              <Link
                to={step.link}
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
              >
                {step.linkLabel}
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>


      {/* Levels and Plans Section */}
      <div className="glass-card rounded-xl p-5 sm:p-6">
        <h3 className="text-lg font-bold">Planos vs. Níveis</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          No RZ Studio, sua conta possui um <strong>Plano</strong> e um <strong>Nível</strong>.
        </p>
        <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-muted-foreground">
          <li><strong>Planos (Free, Premium, PRO, GOLD):</strong> Determinam seu acesso às funcionalidades e salas ao vivo.</li>
          <li><strong>Níveis:</strong> Representam seu mérito e evolução dentro da plataforma. São baseados no seu histórico de sessões e lucro total.</li>
        </ul>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[
            { n: "Novato", c: "bg-muted/50 text-muted-foreground border-border", r: "Conta recém-criada" },
            { n: "Aprendiz", c: "bg-blue-400/10 text-blue-400 border-blue-400/40", r: "3+ sessões registradas" },
            { n: "Trader", c: "bg-emerald-400/10 text-emerald-400 border-emerald-400/40", r: "10+ sessões & lucro > R$500" },
            { n: "Consistente", c: "bg-teal-400/10 text-teal-400 border-teal-400/40", r: "25+ sessões & lucro > R$2k" },
            { n: "Expert", c: "bg-purple-400/10 text-purple-400 border-purple-400/40", r: "50+ sessões & lucro > R$5k" },
            { n: "Elite", c: "bg-amber-500/10 text-amber-500 border-amber-500/40", r: "100+ sessões & lucro > R$10k" },
            { n: "Lenda", c: "bg-gradient-to-r from-amber-500/20 to-yellow-300/20 text-amber-300 border-amber-300/50", r: "200+ sessões & lucro > R$25k" },
          ].map((lvl) => (
            <div key={lvl.n} className="flex flex-col gap-1.5 rounded-lg border border-border/50 bg-background/50 p-3">
              <span className={`inline-flex w-fit items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${lvl.c}`}>
                {lvl.n}
              </span>
              <span className="text-[11px] text-muted-foreground">{lvl.r}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Additional note */}
      <div className="glass-card rounded-xl p-5">
        <p className="text-xs leading-relaxed text-muted-foreground">
          <strong className="text-foreground">Importante:</strong> O cronômetro das lives utiliza o horário de Brasília.
          O link para entrar na live é liberado automaticamente 10 minutos antes do horário agendado.
          Se o link ainda não estiver disponível, aguarde e volte quando estiver perto do horário.
        </p>
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          Estamos trabalhando para criar mais funções na Dashboard. Fique atento às notificações para novidades.
        </p>
      </div>
    </div>
  );
}
