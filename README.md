# Clavier Arabe · لوحة المفاتيح العربية

Un **vrai clavier arabe** dans le navigateur : la disposition officielle *Arabic 101*
(celle gravée sur les claviers arabes du commerce), utilisable directement avec votre
clavier physique AZERTY ou QWERTY — sans rien installer sur le système.

## Pourquoi

Les claviers arabes en ligne classiques mappent les lettres sur la valeur *phonétique*
des touches latines (`a` → ا, `b` → ب), ce qui ne correspond à aucun clavier réel.
Ici les touches sont lues par leur **position physique** (`KeyboardEvent.code`) :
la touche <kbd>A</kbd> d'un AZERTY — <kbd>Q</kbd> d'un QWERTY — donne **ض**, exactement
comme sur un clavier arabe acheté dans le commerce. On apprend donc la vraie disposition.

## Fonctionnalités

- **Disposition Arabic 101 complète**, niveau normal et niveau Maj : hamzas (أ إ آ ؤ ئ ة ى),
  ligatures (لا لأ لإ لآ), voyelles (َ ُ ِ ْ ّ ً ٌ ٍ) et ponctuation arabe (، ؛ ؟).
- **Frappe au clavier physique** : les touches s'allument sur le clavier virtuel pendant la frappe.
  <kbd>Maj</kbd> et <kbd>Verr. Maj</kbd> basculent le second niveau.
- **Clavier virtuel cliquable** (souris ou tactile), insertion à la position du curseur.
- **Légendes latines** commutables : AZERTY, QWERTY ou arabe seul (pour s'entraîner).
- **Mode phonétique** pour les débutants : « slam » → سلام, « 3rby » → عربي.
- **Chiffres indo-arabes** (١٢٣) et **ponctuation arabe** automatique, en option.
- Barre de **tachkîl** (voyelles) et de symboles (٪ ﷽ ﷺ ﷻ …).
- Copier, télécharger en `.txt` (UTF-8 avec BOM), annuler / rétablir, effacer.
- Thème clair / sombre, taille de police réglable, texte et réglages **sauvegardés localement**.
- <kbd>Ctrl</kbd>+<kbd>C</kbd> / <kbd>V</kbd> / <kbd>A</kbd> et les flèches restent natifs.
- Responsive : le clavier tient sur l'écran d'un téléphone, et le clavier système est neutralisé
  pour éviter le double clavier (débrayable).

## Développement

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de production
```

## Déploiement sur Vercel

Aucune configuration ni variable d'environnement n'est nécessaire.

1. Poussez le dépôt sur GitHub.
2. Sur [vercel.com](https://vercel.com) → **Add New… → Project** → importez le dépôt.
3. Vercel détecte Next.js tout seul : **Deploy**.

Ou en ligne de commande :

```bash
npx vercel        # préversion
npx vercel --prod # production
```

## Structure

| Fichier | Rôle |
| --- | --- |
| `lib/layout.ts` | Disposition Arabic 101, mappage phonétique, tachkîl, symboles |
| `components/Keyboard.tsx` | Rendu du clavier virtuel |
| `components/ClavierArabe.tsx` | Éditeur, capture clavier, réglages, barre d'outils |
| `app/globals.css` | Thème, aspect « vraies touches », responsive |
