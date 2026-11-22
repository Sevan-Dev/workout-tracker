import { Icon } from '../components/Icon';
import { cap, parseD, shortDate, num, byTs } from '../lib/utils';

/* ---------- Écran 3 : Historique ---------- */
export default function History({history,rec,flash,clearFlash}){
  const list=[...history].sort(byTs).reverse();
  return (
    <div className="pt-5 flex flex-col gap-4">
      <header>
        <div className="fd text-[15px] font-semibold" style={{color:'var(--blue-hi)'}}>{history.length} séance{history.length>1?'s':''}</div>
        <h1 className="fd text-5xl font-extrabold leading-none mt-1">Historique</h1>
      </header>
      {flash&&(
        <div className="card flex items-center justify-between gap-3 p-3" style={{borderColor:'var(--ok)',background:'rgba(34,197,94,.1)'}}>
          <span className="font-semibold text-sm">{flash}</span>
          <button onClick={clearFlash} aria-label="Fermer le message" className="cursor-pointer" style={{background:'transparent',border:0,color:'var(--mute)'}}><Icon n="x" s={18}/></button>
        </div>
      )}
      {list.length===0&&<div className="card p-5 text-sm" style={{color:'var(--mute)'}}>Aucune séance pour l'instant. Lance ta première depuis l'accueil.</div>}
      {list.map(s=>{
        const sets=s.exercises.reduce((a,e)=>a+e.sets.length,0);
        const prs=rec.flags[s.id]||[];
        return (
          <article key={s.id} className="card p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="fd text-2xl font-bold leading-tight">{s.name}</div>
                <div className="text-sm" style={{color:'var(--mute)'}}>{cap(shortDate(parseD(s.date)))}</div>
              </div>
              {prs.length>0&&(
                <span className="fd text-sm font-bold px-2 py-1 flex items-center gap-1.5 shrink-0" style={{background:'rgba(245,184,61,.12)',color:'var(--gold)',border:'1px solid rgba(245,184,61,.5)'}}>
                  <Icon n="trophy" s={16}/>{prs.length} record{prs.length>1?'s':''}
                </span>
              )}
            </div>
            <div className="flex gap-6 mt-3">
              <div><div className="fd text-3xl font-bold num leading-none">{s.durationMin}<span className="text-sm ml-1" style={{color:'var(--mute)'}}>min</span></div><div className="text-[11px]" style={{color:'var(--mute)'}}>Durée</div></div>
              <div><div className="fd text-3xl font-bold num leading-none">{sets}</div><div className="text-[11px]" style={{color:'var(--mute)'}}>Séries</div></div>
              <div><div className="fd text-3xl font-bold num leading-none">{s.exercises.length}</div><div className="text-[11px]" style={{color:'var(--mute)'}}>Exercices</div></div>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {s.exercises.map(ex=>{
                const pr=prs.includes(ex.exId);
                return <span key={ex.exId} className={`pill ${pr?'pr':''}`}>{pr&&<Icon n="trophy" s={13}/>}{ex.name}</span>;
              })}
            </div>
          </article>
        );
      })}
    </div>
  );
}
