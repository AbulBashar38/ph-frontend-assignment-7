"use client";

import { motion } from "motion/react";
import DrawLine from "@/components/shared/motion/draw-line";

const EASE = [0.22, 1, 0.36, 1] as const;

// Each word keyed by its character offset in the text, which never changes
function splitWords(text: string) {
  let offset = 0;
  return text.split(" ").map((word) => {
    const key = `${offset}-${word}`;
    offset += word.length + 1;
    return { word, key };
  });
}

function Words({ text, start }: { text: string; start: number }) {
  return splitWords(text).map(({ word, key }, index) => (
    <span
      key={key}
      className="inline-block overflow-hidden pb-[0.12em] align-bottom"
    >
      <motion.span
        className="inline-block"
        initial={{ y: "105%" }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, delay: start + index * 0.07, ease: EASE }}
      >
        {word}
        {" "}
      </motion.span>
    </span>
  ));
}

export default function HeroHeadline() {
  return (
    <h1 className="mt-5 font-heading text-[2.6rem] leading-[1.05] font-bold tracking-tight sm:text-6xl lg:text-[4.25rem]">
      <Words text="A room that fits." start={0.1} />{" "}
      <span className="relative inline-block text-primary">
        <Words text="People who fit" start={0.38} />
        <DrawLine className="absolute -bottom-1 left-0 h-3 w-[calc(100%-0.3em)] text-highlight" />
      </span>{" "}
      <Words text="with you." start={0.62} />
    </h1>
  );
}
