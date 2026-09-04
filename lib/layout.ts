export type KeyDef = {
  /** KeyboardEvent.code — position physique, indépendante de l'AZERTY/QWERTY de l'OS */
  code: string;
  /** légende latine gravée sur un clavier QWERTY */
  qwerty: string;
  /** légende latine gravée sur un clavier AZERTY (français) */
  azerty: string;
  /** caractère arabe sans Maj */
  base: string;
  /** caractère arabe avec Maj */
  shift: string;
  /** touche spéciale (largeur + comportement) */
  special?: "backspace" | "tab" | "caps" | "enter" | "shift" | "space" | "ctrl" | "alt" | "win" | "menu";
  /** largeur relative (1 = touche standard) */
  w?: number;
  /** libellé affiché pour les touches spéciales */
  label?: string;
};

/**
 * Disposition arabe standard (Arabic 101 / Windows), telle que gravée
 * sur les vrais claviers arabes du commerce.
 */
export const ROWS: KeyDef[][] = [
  [
    { code: "Backquote", qwerty: "`", azerty: "²", base: "ذ", shift: "ّ" },
    { code: "Digit1", qwerty: "1", azerty: "&", base: "1", shift: "!" },
    { code: "Digit2", qwerty: "2", azerty: "é", base: "2", shift: "@" },
    { code: "Digit3", qwerty: "3", azerty: '"', base: "3", shift: "#" },
    { code: "Digit4", qwerty: "4", azerty: "'", base: "4", shift: "$" },
    { code: "Digit5", qwerty: "5", azerty: "(", base: "5", shift: "%" },
    { code: "Digit6", qwerty: "6", azerty: "-", base: "6", shift: "^" },
    { code: "Digit7", qwerty: "7", azerty: "è", base: "7", shift: "&" },
    { code: "Digit8", qwerty: "8", azerty: "_", base: "8", shift: "*" },
    { code: "Digit9", qwerty: "9", azerty: "ç", base: "9", shift: ")" },
    { code: "Digit0", qwerty: "0", azerty: "à", base: "0", shift: "(" },
    { code: "Minus", qwerty: "-", azerty: ")", base: "-", shift: "_" },
    { code: "Equal", qwerty: "=", azerty: "=", base: "=", shift: "+" },
    { code: "Backspace", qwerty: "", azerty: "", base: "", shift: "", special: "backspace", w: 2, label: "Retour ⌫" },
  ],
  [
    { code: "Tab", qwerty: "", azerty: "", base: "", shift: "", special: "tab", w: 1.5, label: "Tab" },
    { code: "KeyQ", qwerty: "Q", azerty: "A", base: "ض", shift: "َ" },
    { code: "KeyW", qwerty: "W", azerty: "Z", base: "ص", shift: "ً" },
    { code: "KeyE", qwerty: "E", azerty: "E", base: "ث", shift: "ُ" },
    { code: "KeyR", qwerty: "R", azerty: "R", base: "ق", shift: "ٌ" },
    { code: "KeyT", qwerty: "T", azerty: "T", base: "ف", shift: "لإ" },
    { code: "KeyY", qwerty: "Y", azerty: "Y", base: "غ", shift: "إ" },
    { code: "KeyU", qwerty: "U", azerty: "U", base: "ع", shift: "‘" },
    { code: "KeyI", qwerty: "I", azerty: "I", base: "ه", shift: "÷" },
    { code: "KeyO", qwerty: "O", azerty: "O", base: "خ", shift: "×" },
    { code: "KeyP", qwerty: "P", azerty: "P", base: "ح", shift: "؛" },
    { code: "BracketLeft", qwerty: "[", azerty: "^", base: "ج", shift: "<" },
    { code: "BracketRight", qwerty: "]", azerty: "$", base: "د", shift: ">" },
    { code: "Enter", qwerty: "", azerty: "", base: "", shift: "", special: "enter", w: 1.5, label: "Entrée" },
  ],
  [
    { code: "CapsLock", qwerty: "", azerty: "", base: "", shift: "", special: "caps", w: 1.8, label: "Verr. Maj" },
    { code: "KeyA", qwerty: "A", azerty: "Q", base: "ش", shift: "ِ" },
    { code: "KeyS", qwerty: "S", azerty: "S", base: "س", shift: "ٍ" },
    { code: "KeyD", qwerty: "D", azerty: "D", base: "ي", shift: "]" },
    { code: "KeyF", qwerty: "F", azerty: "F", base: "ب", shift: "[" },
    { code: "KeyG", qwerty: "G", azerty: "G", base: "ل", shift: "لأ" },
    { code: "KeyH", qwerty: "H", azerty: "H", base: "ا", shift: "أ" },
    { code: "KeyJ", qwerty: "J", azerty: "J", base: "ت", shift: "ـ" },
    { code: "KeyK", qwerty: "K", azerty: "K", base: "ن", shift: "،" },
    { code: "KeyL", qwerty: "L", azerty: "L", base: "م", shift: "/" },
    { code: "Semicolon", qwerty: ";", azerty: "M", base: "ك", shift: ":" },
    { code: "Quote", qwerty: "'", azerty: "ù", base: "ط", shift: '"' },
    { code: "Backslash", qwerty: "\\", azerty: "*", base: "\\", shift: "|" },
  ],
  [
    { code: "ShiftLeft", qwerty: "", azerty: "", base: "", shift: "", special: "shift", w: 2.3, label: "Maj ⇧" },
    { code: "KeyZ", qwerty: "Z", azerty: "W", base: "ئ", shift: "~" },
    { code: "KeyX", qwerty: "X", azerty: "X", base: "ء", shift: "ْ" },
    { code: "KeyC", qwerty: "C", azerty: "C", base: "ؤ", shift: "}" },
    { code: "KeyV", qwerty: "V", azerty: "V", base: "ر", shift: "{" },
    { code: "KeyB", qwerty: "B", azerty: "B", base: "لا", shift: "لآ" },
    { code: "KeyN", qwerty: "N", azerty: "N", base: "ى", shift: "آ" },
    { code: "KeyM", qwerty: "M", azerty: ",", base: "ة", shift: "’" },
    { code: "Comma", qwerty: ",", azerty: ";", base: "و", shift: "," },
    { code: "Period", qwerty: ".", azerty: ":", base: "ز", shift: "." },
    { code: "Slash", qwerty: "/", azerty: "!", base: "ظ", shift: "؟" },
    { code: "ShiftRight", qwerty: "", azerty: "", base: "", shift: "", special: "shift", w: 2.3, label: "Maj ⇧" },
  ],
  [
    { code: "ControlLeft", qwerty: "", azerty: "", base: "", shift: "", special: "ctrl", w: 1.4, label: "Ctrl" },
    { code: "AltLeft", qwerty: "", azerty: "", base: "", shift: "", special: "alt", w: 1.4, label: "Alt" },
    { code: "Space", qwerty: "", azerty: "", base: " ", shift: " ", special: "space", w: 7, label: "مسافة" },
    { code: "AltRight", qwerty: "", azerty: "", base: "", shift: "", special: "alt", w: 1.4, label: "Alt Gr" },
    { code: "ControlRight", qwerty: "", azerty: "", base: "", shift: "", special: "ctrl", w: 1.4, label: "Ctrl" },
  ],
];

export const KEY_BY_CODE: Record<string, KeyDef> = Object.fromEntries(
  ROWS.flat().map((k) => [k.code, k]),
);

/** Chiffres indo-arabes (٠١٢٣٤٥٦٧٨٩) */
export const ARABIC_DIGITS: Record<string, string> = {
  "0": "٠", "1": "١", "2": "٢", "3": "٣", "4": "٤",
  "5": "٥", "6": "٦", "7": "٧", "8": "٨", "9": "٩",
};

/** Ponctuation arabe substituée automatiquement en mode « ponctuation arabe » */
export const ARABIC_PUNCT: Record<string, string> = {
  ",": "،",
  ";": "؛",
  "?": "؟",
  "%": "٪",
};

/**
 * Mode phonétique : on tape « salam » et on obtient « سلام ».
 * Basé sur le caractère réellement produit par le clavier de l'OS.
 */
export const PHONETIC: Record<string, string> = {
  a: "ا", b: "ب", t: "ت", "t'": "ث", j: "ج", H: "ح", x: "خ",
  d: "د", "d'": "ذ", r: "ر", z: "ز", s: "س", "s'": "ش", S: "ص",
  D: "ض", T: "ط", Z: "ظ", e: "ع", g: "غ", f: "ف", q: "ق",
  k: "ك", l: "ل", m: "م", n: "ن", h: "ه", w: "و", y: "ي",
  "-": "ء", c: "ش", "3": "ع", "4": "ذ", "5": "خ", "6": "ط",
  "7": "ح", "8": "غ", "9": "ق", "2": "ء", i: "ي", o: "و",
  u: "و", E: "ة", A: "أ", I: "إ", O: "ؤ", Y: "ى", C: "ئ",
  G: "غ", J: "ج", K: "ك", X: "خ", B: "ب", M: "م", N: "ن",
  P: "ب", p: "ب", v: "ف", V: "ف", W: "و", Q: "ق", U: "ؤ",
  R: "ر", F: "ف", L: "ل", "'": "ء",
};

/** Signes diacritiques proposés dans la barre « تشكيل » */
export const HARAKAT: { char: string; name: string }[] = [
  { char: "َ", name: "fatha" },
  { char: "ُ", name: "damma" },
  { char: "ِ", name: "kasra" },
  { char: "ْ", name: "soukoun" },
  { char: "ّ", name: "chadda" },
  { char: "ً", name: "tanwin fath" },
  { char: "ٌ", name: "tanwin damm" },
  { char: "ٍ", name: "tanwin kasr" },
  { char: "ـ", name: "tatwil" },
];

/** Symboles utiles (ponctuation arabe + religieux + monnaie) */
export const SYMBOLS: string[] = ["،", "؛", "؟", "«", "»", "٪", "٫", "ﷲ", "ﷺ", "ﷻ", "…", "ـ"];
