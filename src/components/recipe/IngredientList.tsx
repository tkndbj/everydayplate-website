"use client";

import { Check } from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Item {
  content: ReactNode;
  /** Shown before the text for numbered ingredients, e.g. "1." */
  number?: string;
  indent?: number;
}

/** Ingredients the cook can tick off while shopping or cooking. */
export function IngredientList({ sections }: { sections: { title?: ReactNode; items: Item[] }[] }) {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const toggle = (key: string) =>
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  return (
    <div className="space-y-7">
      {sections.map((section, s) => (
        <div key={s}>
          {section.title && (
            <h3 className="mb-3 font-sans text-xs font-semibold uppercase tracking-[0.16em] text-olive">
              {section.title}
            </h3>
          )}
          <ul className="space-y-1">
            {section.items.map((item, i) => {
              const key = `${s}-${i}`;
              const done = checked.has(key);
              return (
                <li key={key} style={item.indent ? { paddingLeft: `${item.indent * 1.5}rem` } : undefined}>
                  <button
                    type="button"
                    onClick={() => toggle(key)}
                    aria-pressed={done}
                    className="group flex w-full items-start gap-3 rounded-lg py-2 text-left"
                  >
                    <span
                      className={cn(
                        "mt-0.5 grid size-5 shrink-0 place-items-center rounded-md ring-1 transition",
                        done ? "bg-olive text-paper ring-olive" : "bg-paper ring-sand-deep group-hover:ring-olive",
                      )}
                    >
                      {done && <Check className="size-3.5" strokeWidth={3} />}
                    </span>
                    <span className={cn("leading-snug transition", done ? "text-muted line-through" : "text-ink-soft")}>
                      {item.number && <span className="mr-1.5 font-semibold text-terracotta">{item.number}</span>}
                      {item.content}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
