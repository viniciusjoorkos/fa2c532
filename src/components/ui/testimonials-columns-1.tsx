"use client";
import React from "react";
import { motion } from "framer-motion";

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: { text: string; name: string; role?: string }[];
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
              {props.testimonials.map(({ text, name, role }, i) => {
                const initials = name
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase();

                return (
                  <div className="p-8 rounded-3xl border border-neutral-200/60 bg-white shadow-xl shadow-neutral-900/5 max-w-xs w-full" key={i}>
                    <div className="text-[14px] leading-relaxed text-neutral-600">{text}</div>
                    <div className="flex items-center gap-3 mt-6">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-[13px] font-semibold text-neutral-600">
                        {initials}
                      </div>
                      <div className="flex flex-col">
                        <div className="text-[14px] font-semibold tracking-tight leading-5 text-neutral-900">{name}</div>
                        {role && <div className="leading-5 text-[12px] text-neutral-400 tracking-tight">{role}</div>}
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
