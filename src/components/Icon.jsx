/* ---------- Icônes ---------- */
const ICONS={
  home:'M3 11l9-8 9 8v10H15v-7H9v7H3z',
  dumbbell:'M6 6v12M18 6v12M3 9v6M21 9v6M6 12h12',
  history:'M12 7v5l3 2M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5',
  chart:'M4 20V10M10 20V4M16 20v-7M22 20H2',
  trophy:'M8 21h8M12 16v5M7 3h10v6a5 5 0 0 1-10 0zM7 5H3v2a4 4 0 0 0 4 4M17 5h4v2a4 4 0 0 1-4 4',
  check:'M4 12l5 5L20 6',
  flame:'M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 1-9z',
  plus:'M12 5v14M5 12h14',
  x:'M6 6l12 12M18 6L6 18',
  clock:'M12 7v5l3 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z',
  target:'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
};
export const Icon=({n,s=20,cls=''})=>(
  <svg className={cls} width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" aria-hidden="true"><path d={ICONS[n]}/></svg>
);
