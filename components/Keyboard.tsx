"use client";

import { ROWS, type KeyDef } from "@/lib/layout";

export type Legend = "azerty" | "qwerty" | "none";

type Props = {
  shift: boolean;
  caps: boolean;
  legend: Legend;
  pressed: Set<string>;
  /** rendu du caractère (chiffres arabes, ponctuation arabe…) */
  render: (char: string) => string;
  onKey: (key: KeyDef) => void;
};

export default function Keyboard({ shift, caps, legend, pressed, render, onKey }: Props) {
  const upper = shift || caps;

  return (
    <div className="keyboard" aria-label="Clavier arabe virtuel">
      {ROWS.map((row, i) => (
        <div className="krow" key={i}>
          {row.map((k) => {
            const isSpecial = Boolean(k.special);
            const main = upper ? k.shift : k.base;
            const secondary = upper ? k.base : k.shift;
            const latin = legend === "none" ? "" : legend === "azerty" ? k.azerty : k.qwerty;
            const locked = (k.special === "caps" && caps) || (k.special === "shift" && shift);

            return (
              <button
                type="button"
                key={k.code}
                className={[
                  "key",
                  isSpecial ? "special" : "",
                  k.special === "space" ? "space" : "",
                  pressed.has(k.code) ? "pressed" : "",
                  locked ? "locked" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                style={k.w ? ({ ["--w" as string]: k.w, flexGrow: k.w } as React.CSSProperties) : undefined}
                onMouseDown={(e) => {
                  e.preventDefault(); // garde le curseur dans la zone de texte
                  onKey(k);
                }}
                aria-label={isSpecial ? k.label : `${main} (${k.qwerty})`}
                title={isSpecial ? k.label : undefined}
              >
                {isSpecial ? (
                  <span className="lbl">{k.label}</span>
                ) : (
                  <>
                    {latin && <span className="lat">{latin}</span>}
                    {secondary && secondary !== main && (
                      <span className="sh">{render(secondary)}</span>
                    )}
                    <span className="ar">{render(main)}</span>
                  </>
                )}
                {locked && <span className="dot" />}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
