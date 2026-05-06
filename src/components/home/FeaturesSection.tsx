import { motion } from "framer-motion";
import { ShieldCheck, Bell, Activity } from "lucide-react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  delay: number;
}

function FeatureCard({ title, description, icon, gradient, delay }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, ease: "easeOut", delay }}
      className="relative flex w-full max-w-[260px] flex-col items-start justify-start group mx-auto md:max-w-[300px]"
    >
      {/* Glow Background */}
      <div
        className="pointer-events-none absolute w-full h-[260px] rounded-[40px] opacity-60 md:h-[300px]"
        style={{
          background: gradient,
          filter: "blur(45px)",
        }}
      />

      {/* Foreground Card with Gradient Border */}
      <div
        className="relative z-10 h-[260px] self-stretch overflow-hidden rounded-[40px] md:h-[300px]"
        style={{
          border: "8px solid transparent",
          background: `linear-gradient(#0A0A0B, #0A0A0B) padding-box, ${gradient} border-box`,
        }}
      >
        <div className="flex h-full w-full flex-col justify-between p-7">
          <div className="text-white/90">
            {icon}
          </div>
          <div>
            <h3 className="mb-3 text-xl font-medium tracking-tight text-white">
              {title}
            </h3>
            <p className="text-[14px] font-normal leading-[1.6] text-gray-400 selection:bg-white/20">
              {description}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function FeaturesSection() {
  const features = [
    {
      title: "Rotina 5X",
      description: "São sessões premium com objetivo de turbinar a banca com o máximo de segurança possível e totalmente sem gale.",
      icon: <ShieldCheck size={32} strokeWidth={2.5} />,
      gradient: "linear-gradient(137deg, #FF3D77 0%, #FFB1CE 45%, #FF9D3C 100%)",
      delay: 0.1,
    },
    {
      title: "Alerta de oportunidade",
      description: "Vamos avisar quando entrarmos em call num momento de oportunidade clara no mercado.",
      icon: <Bell size={32} strokeWidth={2.5} />,
      gradient: "linear-gradient(137deg, #FFFFFF 0%, #7DD3FC 45%, #06B6D4 100%)",
      delay: 0.2,
    },
    {
      title: "Suporte Dedicado",
      description: "O sistema avisa quando você está indo bem e quando está precisando regular a estratégia.",
      icon: <Activity size={32} strokeWidth={2.5} />,
      gradient: "linear-gradient(137deg, #4361EE 0%, #E0AEFF 45%, #F72585 100%)",
      delay: 0.3,
    },
  ];

  return (
    <section className="relative z-10 w-full overflow-hidden bg-[#0A0A0B] py-20 md:py-32">
      <div className="mx-auto flex w-full max-w-[936px] flex-col items-center justify-center px-6 md:px-12">
        <div className="grid w-full grid-cols-1 gap-10 md:grid-cols-3 md:gap-3 lg:gap-3">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
