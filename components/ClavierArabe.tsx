"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Keyboard, { type Legend } from "./Keyboard";
import {
  ARABIC_DIGITS,
  ARABIC_PUNCT,
  HARAKAT,
  KEY_BY_CODE,
  PHONETIC,
  SYMBOLS,
  type KeyDef,
} from "@/lib/layout";

type Settings = {
  legend: Legend;
  phonetic: boolean;
  arabicDigits: boolean;
  arabicPunct: boolean;
  capture: boolean;
  systemKeyboard: boolean;
  theme: "dark" | "light";
  fontSize: number;
};

const DEFAULTS: Settings = {
  legend: "azerty",
  phonetic: false,
  arabicDigits: false,
  arabicPunct: true,
  capture: true,
  systemKeyboard: false,
  theme: "dark",
  fontSize: 26,
};

const STORE_TEXT = "clavier-arabe:text";
const STORE_SETTINGS = "clavier-arabe:settings";

/** Touches de navigation/édition qu'on laisse au navigateur */
const PASSTHROUGH = new Set([
  "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End",
  "PageUp", "PageDown", "Delete", "Escape", "Insert",
]);

export default function ClavierArabe() {
  const [text, setText] = useState("");
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [shift, setShift] = useState(false);
  const [caps, setCaps] = useState(false);
  const [pressed, setPressed] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<string | null>(null);
  const [isTouch, setIsTouch] = useState(false);

  const taRef = useRef<HTMLTextAreaElement>(null);
  const caretRef = useRef<number | null>(null);
  const historyRef = useRef<{ text: string; caret: number }[]>([]);
  const redoRef = useRef<{ text: string; caret: number }[]>([]);

  const set = <K extends keyof Settings>(k: K, v: Settings[K]) =>
    setSettings((s) => ({ ...s, [k]: v }));

  /* ---------- persistance ---------- */
  useEffect(() => {
    try {
      const t = localStorage.getItem(STORE_TEXT);
      if (t) setText(t);
      const s = localStorage.getItem(STORE_SETTINGS);
      if (s) setSettings({ ...DEFAULTS, ...(JSON.parse(s) as Partial<Settings>) });
    } catch {
      /* stockage indisponible : on garde les valeurs par défaut */
    }
    setIsTouch(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORE_TEXT, text);
    } catch {}
  }, [text]);

  useEffect(() => {
    try {
      localStorage.setItem(STORE_SETTINGS, JSON.stringify(settings));
    } catch {}
    document.documentElement.dataset.theme = settings.theme;
  }, [settings]);

  /* ---------- placement du curseur après édition ---------- */
  useLayoutEffect(() => {
    const ta = taRef.current;
    if (ta && caretRef.current !== null) {
      ta.setSelectionRange(caretRef.current, caretRef.current);
      caretRef.current = null;
    }
  }, [text]);

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 1600);
  };

  /** Applique la substitution chiffres/ponctuation choisie par l'utilisateur */
  const render = useCallback(
    (char: string) => {
      let out = char;
      if (settings.arabicDigits) {
        out = out.replace(/[0-9]/g, (d) => ARABIC_DIGITS[d]);
      }
      if (settings.arabicPunct) {
        out = out.replace(/[,;?%]/g, (p) => ARABIC_PUNCT[p] ?? p);
      }
      return out;
    },
    [settings.arabicDigits, settings.arabicPunct],
  );

  /** Édition générique : remplace la sélection courante */
  const edit = useCallback(
    (make: (before: string, selected: string, after: string) => { text: string; caret: number }) => {
      const ta = taRef.current;
      const start = ta ? ta.selectionStart : text.length;
      const end = ta ? ta.selectionEnd : text.length;
      historyRef.current.push({ text, caret: start });
      if (historyRef.current.length > 300) historyRef.current.shift();
      redoRef.current = [];
      const next = make(text.slice(0, start), text.slice(start, end), text.slice(end));
      caretRef.current = next.caret;
      setText(next.text);
      ta?.focus();
    },
    [text],
  );

  const insert = useCallback(
    (raw: string) => {
      const str = render(raw);
      edit((b, _s, a) => ({ text: b + str + a, caret: b.length + str.length }));
    },
    [edit, render],
  );

  const backspace = useCallback(() => {
    edit((b, s, a) =>
      s
        ? { text: b + a, caret: b.length }
        : { text: b.slice(0, -1) + a, caret: Math.max(0, b.length - 1) },
    );
  }, [edit]);

  const undo = useCallback(() => {
    const prev = historyRef.current.pop();
    if (!prev) return;
    const ta = taRef.current;
    redoRef.current.push({ text, caret: ta ? ta.selectionStart : text.length });
    caretRef.current = prev.caret;
    setText(prev.text);
    ta?.focus();
  }, [text]);

  const redo = useCallback(() => {
    const next = redoRef.current.pop();
    if (!next) return;
    const ta = taRef.current;
    historyRef.current.push({ text, caret: ta ? ta.selectionStart : text.length });
    caretRef.current = next.caret;
    setText(next.text);
    ta?.focus();
  }, [text]);

  /** Une touche du clavier virtuel (ou une touche physique mappée) */
  const pressKey = useCallback(
    (k: KeyDef) => {
      switch (k.special) {
        case "backspace":
          return backspace();
        case "enter":
          return insert("\n");
        case "tab":
          return insert("\t");
        case "space":
          return insert(" ");
        case "caps":
          return setCaps((c) => !c);
        case "shift":
          return setShift((s) => !s);
        case "ctrl":
        case "alt":
        case "win":
        case "menu":
          return;
        default: {
          const char = shift || caps ? k.shift : k.base;
          if (!char) return;
          insert(char);
          if (shift) setShift(false); // Maj « one-shot » au clic
        }
      }
    },
    [backspace, caps, insert, shift],
  );

  /* ---------- clavier physique ---------- */
  useEffect(() => {
    const flash = (code: string) => {
      setPressed((p) => new Set(p).add(code));
      window.setTimeout(
        () =>
          setPressed((p) => {
            const n = new Set(p);
            n.delete(code);
            return n;
          }),
        120,
      );
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Shift") setShift(true);
      if (e.getModifierState) setCaps(e.getModifierState("CapsLock"));

      const target = e.target as HTMLElement | null;

      // raccourcis navigateur (copier/coller/sélectionner/annuler) : on ne touche à rien
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (!settings.capture) return;
      if (PASSTHROUGH.has(e.key) || (e.key.startsWith("F") && e.key.length > 1)) return;
      if (target?.tagName === "INPUT" || (target?.isContentEditable && target !== taRef.current)) return;

      // un bouton a le focus : Entrée et Espace doivent l'activer, pas écrire
      const onButton = target?.tagName === "BUTTON";

      if (e.key === "Backspace") {
        e.preventDefault();
        flash("Backspace");
        backspace();
        return;
      }
      if (e.key === "Enter") {
        if (onButton) return;
        e.preventDefault();
        flash("Enter");
        insert("\n");
        return;
      }
      if (e.key === "Tab") return; // on laisse la navigation clavier accessible
      if (e.key === " ") {
        if (onButton) return;
        e.preventDefault();
        flash("Space");
        insert(" ");
        return;
      }
      if (settings.phonetic) {
        // en phonétique on se base sur le caractère réellement produit
        if (e.key.length !== 1) return;
        e.preventDefault();
        insert(PHONETIC[e.key] ?? e.key);
        return;
      }

      // Mode clavier arabe : mappage par POSITION (e.code). On le fait avant
      // tout test sur e.key : les touches mortes (^ ¨ ` sur AZERTY) envoient
      // e.key = "Dead", et une lettre accentuée envoie plusieurs caractères,
      // mais leur position physique reste correcte.
      const k = KEY_BY_CODE[e.code];
      if (!k || k.special) {
        // code inconnu (clavier exotique) ou touche non gérée : comportement natif
        return;
      }
      const upper = e.shiftKey || e.getModifierState?.("CapsLock");
      const char = upper ? k.shift : k.base;
      if (!char) return;
      e.preventDefault();
      flash(e.code);
      insert(char);
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Shift") setShift(false);
      if (e.getModifierState) setCaps(e.getModifierState("CapsLock"));
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [backspace, insert, settings.capture, settings.phonetic]);

  /* ---------- actions barre d'outils ---------- */
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      showToast("Texte copié ✓");
    } catch {
      taRef.current?.select();
      document.execCommand?.("copy");
      showToast("Texte copié ✓");
    }
  };

  const download = () => {
    const blob = new Blob(["﻿" + text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "texte-arabe.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const clear = () => {
    if (!text) return;
    historyRef.current.push({ text, caret: taRef.current?.selectionStart ?? text.length });
    caretRef.current = 0;
    setText("");
    taRef.current?.focus();
  };

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <main className="app">
      <header className="header">
        <div className="brand">
          <h1>Clavier Arabe</h1>
          <span className="ar">لوحة المفاتيح العربية</span>
          <small>disposition réelle « Arabic 101 »</small>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            className="btn ghost"
            onClick={() => set("theme", settings.theme === "dark" ? "light" : "dark")}
            title="Thème clair / sombre"
          >
            {settings.theme === "dark" ? "☀️ Clair" : "🌙 Sombre"}
          </button>
        </div>
      </header>

      <div className="toolbar">
        <div className="seg" role="group" aria-label="Mode de saisie">
          <button className={!settings.phonetic ? "on" : ""} onClick={() => set("phonetic", false)}>
            Clavier arabe
          </button>
          <button className={settings.phonetic ? "on" : ""} onClick={() => set("phonetic", true)}>
            Phonétique (slam → سلام)
          </button>
        </div>

        <div className="seg" role="group" aria-label="Légendes latines">
          <button className={settings.legend === "azerty" ? "on" : ""} onClick={() => set("legend", "azerty")}>
            AZERTY
          </button>
          <button className={settings.legend === "qwerty" ? "on" : ""} onClick={() => set("legend", "qwerty")}>
            QWERTY
          </button>
          <button className={settings.legend === "none" ? "on" : ""} onClick={() => set("legend", "none")}>
            Arabe seul
          </button>
        </div>

        <button
          className={`btn ${settings.arabicDigits ? "on" : ""}`}
          onClick={() => set("arabicDigits", !settings.arabicDigits)}
          title="Écrire les chiffres en indo-arabe"
        >
          ١٢٣ Chiffres arabes
        </button>

        <button
          className={`btn ${settings.arabicPunct ? "on" : ""}`}
          onClick={() => set("arabicPunct", !settings.arabicPunct)}
          title="Remplacer , ; ? par ، ؛ ؟"
        >
          ؟ Ponctuation arabe
        </button>

        <button
          className={`btn ${settings.capture ? "on" : ""}`}
          onClick={() => set("capture", !settings.capture)}
          title="Désactivez si votre système est déjà configuré en arabe"
        >
          ⌨️ Saisie directe
        </button>

        <div className="spacer" />

        <button className="btn" onClick={() => set("fontSize", Math.max(16, settings.fontSize - 2))}>
          A−
        </button>
        <button className="btn" onClick={() => set("fontSize", Math.min(52, settings.fontSize + 2))}>
          A+
        </button>
      </div>

      <div className="editor-wrap">
        <textarea
          ref={taRef}
          className="editor"
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ fontSize: settings.fontSize }}
          placeholder="اكتب هنا… — commencez à taper, ou cliquez sur les touches ci-dessous"
          spellCheck={false}
          autoFocus
          inputMode={isTouch && !settings.systemKeyboard ? "none" : undefined}
          lang="ar"
          dir="rtl"
        />
        <div className="editor-footer">
          <span>
            {text.length} caractère{text.length > 1 ? "s" : ""} · {words} mot{words > 1 ? "s" : ""}
          </span>
          <span style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button className="btn primary" onClick={copy}>
              📋 Copier
            </button>
            <button className="btn" onClick={download}>
              ⬇️ Télécharger .txt
            </button>
            <button className="btn" onClick={undo}>
              ↶ Annuler
            </button>
            <button className="btn" onClick={redo}>
              ↷ Rétablir
            </button>
            <button className="btn danger" onClick={clear}>
              ✕ Effacer
            </button>
          </span>
        </div>
      </div>

      <div className="chips" aria-label="Signes diacritiques (تشكيل)">
        {HARAKAT.map((h) => (
          <button key={h.name} className="chip" onMouseDown={(e) => { e.preventDefault(); insert(h.char); }}>
            ـ{h.char}
            <span className="hint">{h.name}</span>
          </button>
        ))}
        {SYMBOLS.map((s) => (
          <button key={s} className="chip" onMouseDown={(e) => { e.preventDefault(); insert(s); }}>
            {s}
          </button>
        ))}
      </div>

      <Keyboard
        shift={shift}
        caps={caps}
        legend={settings.legend}
        pressed={pressed}
        render={render}
        onKey={pressKey}
      />

      {isTouch && (
        <div className="toolbar" style={{ marginTop: 10 }}>
          <button
            className={`btn ${settings.systemKeyboard ? "on" : ""}`}
            onClick={() => set("systemKeyboard", !settings.systemKeyboard)}
          >
            📱 Autoriser le clavier du téléphone
          </button>
        </div>
      )}

      <section className="help">
        <h2>Comment ça marche</h2>
        <ul>
          <li>
            <strong>Tapez normalement</strong> sur votre clavier physique : les touches sont lues par
            leur <em>position</em>, donc la lettre obtenue est la même que sur un vrai clavier arabe,
            que votre clavier soit AZERTY ou QWERTY. Exemple : la touche <kbd>A</kbd> d&apos;un AZERTY
            (<kbd>Q</kbd> en QWERTY) donne <bdi lang="ar">ض</bdi>.
          </li>
          <li>
            <kbd>Maj</kbd> affiche le second niveau : hamzas <bdi lang="ar">أ إ آ ؤ ئ</bdi>, ligatures{" "}
            <bdi lang="ar">لا لأ لإ لآ</bdi> et voyelles <bdi lang="ar">َ ُ ِ ْ ّ</bdi>. <kbd>Verr. Maj</kbd> le verrouille.
          </li>
          <li>
            Vous ne connaissez pas la disposition arabe ? Passez en <strong>Phonétique</strong> : chaque
            lettre latine devient sa lettre arabe — « slam » donne <bdi lang="ar">سلام</bdi>,
            « 3rby » donne <bdi lang="ar">عربي</bdi>, « 7sn » donne <bdi lang="ar">حسن</bdi>.
          </li>
          <li>
            <kbd>Ctrl</kbd>+<kbd>C</kbd>, <kbd>Ctrl</kbd>+<kbd>V</kbd>, <kbd>Ctrl</kbd>+<kbd>A</kbd> et les
            flèches fonctionnent normalement. Votre texte est conservé automatiquement dans le navigateur.
          </li>
          <li>
            Si votre système est déjà configuré en arabe, désactivez <strong>Saisie directe</strong> pour
            écrire avec la disposition de l&apos;OS.
          </li>
        </ul>
      </section>

      {toast && <div className="toast">{toast}</div>}
    </main>
  );
}
