"use client";

import { motion, type Variants } from "motion/react";

interface Step {
  title: string;
  text: string;
}

const list: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
};

const step: Variants = {
  hidden: { opacity: 0, x: -16 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

// Numbered steps; the connecting line draws downward as the list scrolls into view
export default function JourneySteps({ steps }: { steps: Step[] }) {
  return (
    <motion.ol
      className="relative mt-8 flex-1"
      variants={list}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      <motion.span
        aria-hidden="true"
        className="absolute top-4 bottom-[4.5rem] left-[1.05rem] w-px origin-top bg-primary/30"
        variants={{
          hidden: { scaleY: 0 },
          show: {
            scaleY: 1,
            transition: { duration: 1.2, ease: [0.65, 0, 0.35, 1] },
          },
        }}
      />
      {steps.map((item, index) => (
        <motion.li
          key={item.title}
          variants={step}
          className="relative flex gap-4 pb-7"
        >
          <span className="relative flex size-[2.1rem] shrink-0 items-center justify-center rounded-full border-2 border-primary/30 bg-background font-heading text-sm font-bold text-primary">
            {index + 1}
          </span>
          <div className="pt-1">
            <p className="font-semibold">{item.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {item.text}
            </p>
          </div>
        </motion.li>
      ))}
    </motion.ol>
  );
}
