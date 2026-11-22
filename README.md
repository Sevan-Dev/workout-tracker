# Tracker Prise de Masse

Suivi d'entraînement PPL + PP (Push A, Pull A, Legs, Push B, Pull B) : accueil, séance en cours, historique, progrès.
React 18 + Vite + Tailwind 3. Aucune dépendance runtime en dehors de React.

## Lancer en local

    npm install
    npm run dev

## Déployer sur Vercel

Importe le dépôt GitHub dans Vercel : le preset Vite est détecté automatiquement
(build `npm run build`, dossier de sortie `dist`). Ou en CLI : `npx vercel`.

## Structure

    src/data/plan.js        plan PPL, exercices, échauffements et étirements
    src/lib/utils.js        dates, records (PR), série, volume, données d'exemple
    src/components/         Icon, Timer
    src/screens/            Dashboard, Workout, History, Progress
    src/App.jsx             état global, persistance localStorage, navigation

## Notes

- Les données sont enregistrées dans le `localStorage` (clé `tracker-masse-v2`), donc par navigateur et par appareil.
- L'historique est rempli de données d'exemple au premier lancement (bouton pour les effacer sur l'accueil).
- Pour modifier le programme, édite `PLAN` dans `src/data/plan.js`.
