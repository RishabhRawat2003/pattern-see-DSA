"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { spring } from "@/components/viz/motion";

const values = [1, 2, 4, 7, 11, 15];
const target = 13;

const steps = [
  { lo: 0, hi: 5 },
  { lo: 0, hi: 4 },
  { lo: 1, hi: 4 },
];

function line(lo: number, hi: number) {
  const sum = values[lo] + values[hi];
  if (sum === target) return `${values[lo]} + ${values[hi]} = ${target} · pair found`;
  if (sum > target) return `${values[lo]} + ${values[hi]} = ${sum} · too big, R←`;
  return `${values[lo]} + ${values[hi]} = ${sum} · too small, L→`;
}

export function HeroSketch() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(reduce ? steps.length - 1 : 0);
  const step = steps[i];
  const found = values[step.lo] + values[step.hi] === target;

  useEffect(() => {
    if (reduce) return;
    const hold = found ? 2200 : 1350;
    const t = window.setTimeout(() => {
      setI((x) => (x + 1) % steps.length);
    }, hold);
    return () => window.clearTimeout(t);
  }, [i, found, reduce]);

  return (
    <div className="board surface rounded-2xl p-4 sm:p-8">
      <p className="kicker">Live sketch · two pointers</p>
      <p className="display mt-3 text-xl italic text-paper/90 sm:text-2xl">
        target = {target}
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-1.5 sm:mt-8 sm:gap-2">
        {values.map((v, idx) => {
          const isL = idx === step.lo;
          const isR = idx === step.hi;
          const tone = found && (isL || isR) ? "match" : isL ? "lo" : isR ? "hi" : "idle";
          return (
            <div key={idx} className="relative flex flex-col items-center gap-1 pt-5">
              {isL ? (
                <motion.span
                  layoutId="hero-L"
                  className="absolute left-1/2 top-0 -translate-x-1/2 font-mono text-[10px] font-bold text-saffron"
                  transition={spring}
                >
                  L ▾
                </motion.span>
              ) : null}
              {isR ? (
                <motion.span
                  layoutId="hero-R"
                  className="absolute left-1/2 top-0 -translate-x-1/2 font-mono text-[10px] font-bold text-saffron"
                  transition={spring}
                >
                  R ▾
                </motion.span>
              ) : null}
              <motion.div
                animate={{
                  scale: isL || isR ? 1.08 : 1,
                  y: isL || isR ? -3 : 0,
                }}
                transition={spring}
                className={`grid h-11 w-11 place-items-center rounded-lg border font-mono text-base sm:h-14 sm:w-14 sm:text-lg ${
                  tone === "match"
                    ? "border-lime-300 bg-lime-400/20 text-lime-100 shadow-[0_0_22px_rgba(163,230,53,0.28)]"
                    : tone === "lo"
                      ? "border-jade/70 bg-jade/20 text-jade"
                      : tone === "hi"
                        ? "border-rose-300/70 bg-rose-400/15 text-rose-200"
                        : "border-paper/15 bg-paper/5 text-paper"
                }`}
              >
                {v}
              </motion.div>
              <span className="font-mono text-[10px] text-muted/70">{idx}</span>
            </div>
          );
        })}
      </div>
      <AnimatePresence mode="wait">
        <motion.p
          key={line(step.lo, step.hi)}
          initial={reduce ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.22 }}
          className={`mt-6 text-center font-mono text-xs ${found ? "text-jade" : "text-muted"}`}
        >
          {line(step.lo, step.hi)}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
