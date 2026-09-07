"use client";

import { useId, useState } from "react";

export default function FaqAccordion({ items }) {
  const [openIndex, setOpenIndex] = useState(0);
  const baseId = useId();

  return (
    <div className="border-t border-gold/35">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const number = String(index + 1);
        const buttonId = `${baseId}-button-${index}`;
        const panelId = `${baseId}-panel-${index}`;

        return (
          <div key={item.id ?? item.question} className="border-b border-gold/35">
            <h3 className="m-0">
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full min-h-12 items-center gap-3 py-3.5 text-left sm:gap-4 sm:py-4"
              >
                <span className="w-7 shrink-0 font-serif text-[1.14rem] leading-none text-gold sm:w-8 sm:text-[1.26rem]">
                  {number}
                </span>
                <span className="min-w-0 flex-1 font-serif text-[1.224rem] leading-[1.25] font-medium tracking-tight text-ink sm:text-[1.344rem] lg:text-[1.44rem]">
                  {item.question}
                </span>
                <span
                  className="ml-2 w-5 shrink-0 text-center font-serif text-[1.62rem] leading-none font-light text-gold"
                  aria-hidden="true"
                >
                  {isOpen ? "−" : "+"}
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={`grid transition-[grid-template-rows] duration-200 ease-out ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <p className="max-w-[46rem] pr-8 pb-4 pl-10 text-[1.104rem] leading-6 text-ink-soft sm:pl-12 lg:text-[18px] lg:leading-[1.6]">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
