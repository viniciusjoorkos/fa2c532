"use client";
import React from "react";
import { motion } from "framer-motion";

export type TestimonialItem = 
  | { type: 'image'; src: string }
  | { type: 'text'; text: string; name: string; role?: string };

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: TestimonialItem[];
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map((item, i) => {
                if (item.type === 'image') {
                  return (
                    <div className="rounded-[1.25rem] overflow-hidden border border-neutral-200/60 shadow-xl shadow-neutral-900/5 max-w-[260px] sm:max-w-xs w-full shrink-0" key={i}>
                      <img 
                        src={item.src} 
                        alt={`Depoimento ${i + 1}`} 
                        className="w-full h-auto object-cover select-none" 
                        loading="lazy" 
                      />
                    </div>
                  );
                }

                const initials = item.name
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase();

                return (
                  <div className="p-8 rounded-[1.25rem] border border-neutral-200/60 bg-white shadow-xl shadow-neutral-900/5 max-w-[260px] sm:max-w-xs w-full shrink-0" key={i}>
                    <div className="text-[14px] leading-relaxed text-neutral-600">{item.text}</div>
                    <div className="flex items-center gap-3 mt-6">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-[13px] font-semibold text-neutral-600">
                        {initials}
                      </div>
                      <div className="flex flex-col">
                        <div className="text-[14px] font-semibold tracking-tight leading-5 text-neutral-900">{item.name}</div>
                        {item.role && <div className="leading-5 text-[12px] text-neutral-400 tracking-tight">{item.role}</div>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </React.Fragment>
          )),
        ]}
      </motion.div>
    </div>
  );
};
