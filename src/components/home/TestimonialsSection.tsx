import { TestimonialsColumn } from "@/components/ui/testimonials-columns-1";
import { motion } from "framer-motion";

const testimonials = [
  {
    text: "Toda satisfação é minha, tudo que você fez na minha vida não cabe em um cadernos. Eu só tenho a agredecer irmão. Obrigado e continue amigo assim",
    name: "João P.",
    role: "Membro",
  },
  {
    text: "Eu entrei com 400 e levei pra 7.400 em menos de 1 mês. Só penso em bem estar todos os dias e não perco uma chamada. Já recomendei e vou recomendar mais.",
    name: "Luiz F.",
    role: "Membro",
  },
  {
    text: "O Rezende de longe um dos mentores financeiros mais estratégico que eu conheço. Já aprendi o principal com ele agora fico acompanhando as lives. Um abraço e tamos juntos.",
    name: "Fabrício S.",
    role: "Membro",
  },
  {
    text: "Sou amigo do Rezende e acompanho a mais de 2 anos. Eu estudei e vi várias formas mas sempre que parei de dar atenção para o Rezende não funcionou direito. Hoje o meu dia a dia é com contato com ele sem mudança de planos",
    name: "João F.",
    role: "Membro",
  },
  {
    text: "Tamos juntos Rezende que cada dia fique mais feliz meu camarada.",
    name: "Rogério L.",
    role: "Membro",
  },
];

const firstColumn = [testimonials[0], testimonials[1], testimonials[2]];
const secondColumn = [testimonials[3], testimonials[4], testimonials[0]];
const thirdColumn = [testimonials[1], testimonials[2], testimonials[3]];

const TestimonialsSection = () => {
  return (
    <section className="bg-white py-20 sm:py-28 relative overflow-hidden border-t border-neutral-100">
      <div className="mx-auto z-10 px-6 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-[540px] mx-auto text-center"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.45em] text-neutral-400">
            Depoimentos
          </p>
          <h2 className="mt-3 font-serif text-3xl font-light leading-tight tracking-tight text-neutral-900 sm:text-5xl">
            O que nossos membros dizem
          </h2>
          <p className="mt-4 text-[14px] leading-relaxed text-neutral-500">
            A prova real de quem aplica o método todos os dias.
          </p>
        </motion.div>

        <div className="flex justify-center gap-6 mt-14 [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)] max-h-[700px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={18} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={23} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={19} />
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
