import { useState } from 'react';
import { Icon } from '../components/Icon';
import { PLAN } from '../data/plan';
import { isoD, parseD, longDate, dm, fmt, num, monday, weekCounts, streakOf } from '../lib/utils';

/* ---------- Écran 1 : Accueil ---------- */
export default function Dashboard({history,rec,active,weight,setWeight,launch,next,demo,clearDemo,goWork}){
  const [wIn,setWIn]=useState('');
  const [wErr,setWErr]=useState(false);
  const today=new Date();
  const wk=monday(today);
  const wc=weekCounts(history);
  const thisWeek=wc[isoD(wk)]||0;
  const streak=streakOf(history);
  const weekNo=Math.min(52,Math.max(1,Math.floor((today-new Date(2026,10,1))/(7*864e5))+1));
  const START=60,GOAL=67;
  const pw=Math.max(0,Math.min(100,(weight-START)/(GOAL-START)*100));
  const top=Object.entries(rec.best).sort((a,b)=>b[1].score-a[1].score).slice(0,3);
  const saveW=()=>{const v=num(wIn);if(!(v>=40&&v<=150)){setWErr(true);return}setWeight(v);setWIn('');setWErr(false)};

  return (
    <div className="pt-5 flex flex-col gap-5">
      <header>
        <div className="fd text-[15px] font-semibold" style={{color:'var(--blue-hi)'}}>{longDate(today)}</div>
        <h1 className="fd text-5xl font-extrabold leading-none mt-1">Prise de masse</h1>
      </header>

      {/* Objectif */}
      <section className="card p-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 fd text-lg font-bold"><Icon n="target" s={20} cls="text-[color:var(--blue-hi)]"/>Objectif 12 mois</div>
          <div className="fd text-lg font-semibold num" style={{color:'var(--mute)'}}>Nov. 2026 → Nov. 2027</div>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div><div className="text-xs" style={{color:'var(--mute)'}}>Départ</div><div className="fd text-3xl font-bold num">{fmt(START)}<span className="text-base ml-1" style={{color:'var(--mute)'}}>kg</span></div></div>
          <div><div className="text-xs" style={{color:'var(--mute)'}}>Actuel</div><div className="fd text-3xl font-bold num" style={{color:'var(--blue-hi)'}}>{fmt(weight)}<span className="text-base ml-1" style={{color:'var(--mute)'}}>kg</span></div></div>
          <div><div className="text-xs" style={{color:'var(--mute)'}}>Objectif</div><div className="fd text-3xl font-bold num">66-68<span className="text-base ml-1" style={{color:'var(--mute)'}}>kg</span></div></div>
        </div>
        <div className="mt-4 h-2" style={{background:'#0B0F17'}} role="progressbar" aria-valuenow={Math.round(pw)} aria-valuemin="0" aria-valuemax="100" aria-label="Progression vers le poids cible">
          <div className="h-2 bar" style={{width:pw+'%',background:'var(--blue)'}}/>
        </div>
        <div className="flex justify-between text-xs mt-2 num" style={{color:'var(--mute)'}}>
          <span>{weight>=START?'+':''}{fmt(weight-START)} kg depuis le départ</span><span>Semaine {weekNo} sur 52</span>
        </div>
        <form className="flex gap-2 mt-4" onSubmit={e=>{e.preventDefault();saveW()}}>
          <input id="weighin" className="inp" style={{textAlign:'left',paddingLeft:12}} inputMode="decimal" placeholder="Pesée du dimanche, en kg" aria-label="Pesée en kilos" value={wIn} onChange={e=>{setWIn(e.target.value);setWErr(false)}} aria-invalid={wErr}/>
          <button type="submit" className="btn btn-ghost px-4 text-base h-10 shrink-0">Enregistrer</button>
        </form>
        {wErr&&<div className="text-xs mt-2" style={{color:'var(--bad)'}}>Entre un poids entre 40 et 150 kg, par exemple 60,4.</div>}
      </section>

      {/* Stats */}
      <section className="grid grid-cols-3 gap-3">
        <Stat icon="flame" label="Série" value={streak} unit="sem." hint="3 séances ou plus"/>
        <Stat icon="clock" label="Cette semaine" value={thisWeek} unit="/ 3 min." hint={thisWeek>=3?'Noyau atteint':`Encore ${3-thisWeek} pour le noyau`} good={thisWeek>=3}/>
        <Stat icon="dumbbell" label="Total" value={history.length} unit="séances" hint="depuis le début"/>
      </section>

      {/* Lancement rapide */}
      <section>
        <h2 className="fd text-2xl font-bold mb-3">Lancer une séance</h2>
        {active&&(
          <button onClick={goWork} className="btn btn-blue w-full h-14 text-xl mb-3 flex items-center justify-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full" style={{background:'#B8F7CC'}}/>Reprendre : {active.name}
          </button>
        )}
        <div className="grid gap-3 sm:grid-cols-3">
          {PLAN.map(p=>{
            const isNext=p.id===next.id;
            return (
              <button key={p.id} disabled={!!active} onClick={()=>launch(p.id)}
                className={`card text-left p-4 cursor-pointer ${isNext?'card-hi':''}`}
                style={{opacity:active?.45:1,color:'var(--text)'}}>
                <div className="flex items-center justify-between">
                  <span className="fd text-sm font-semibold" style={{color:'var(--blue-hi)'}}>Jour {p.day}</span>
                  {isNext&&<span className="fd text-xs font-bold px-2 py-0.5" style={{background:'var(--blue)'}}>Prochaine</span>}
                </div>
                <div className="fd text-2xl font-bold leading-tight mt-1">{p.title}</div>
                <div className="text-xs mt-2" style={{color:'var(--mute)'}}>{p.items.length} exercices · {p.items.reduce((a,i)=>a+i[1],0)} séries</div>
              </button>
            );
          })}
        </div>
        <p className="text-xs mt-3" style={{color:'var(--mute)'}}>La rotation Push, Pull, Legs, Push, Pull continue d'une séance à l'autre, sans jour fixe. Les jambes passent une fois par cycle de 5 séances.</p>
      </section>

      {/* Records */}
      <section>
        <h2 className="fd text-2xl font-bold mb-3">Mes 3 meilleurs records</h2>
        {top.length===0?(
          <div className="card p-4 text-sm" style={{color:'var(--mute)'}}>Pas encore de record. Termine une séance pour en créer.</div>
        ):(
          <div className="grid gap-3">
            {top.map(([id,r],i)=>(
              <div key={id} className="card p-4 flex items-center gap-4">
                <div className="fd text-5xl font-extrabold w-9 text-center" style={{color:i===0?'var(--gold)':'var(--blue-hi)'}}>{i+1}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{r.name}</div>
                  <div className="text-xs" style={{color:'var(--mute)'}}>{r.muscle} · {dm(parseD(r.date))}</div>
                </div>
                <div className="text-right">
                  <div className="fd text-3xl font-bold num leading-none">{fmt(r.w)}<span className="text-base ml-1" style={{color:'var(--mute)'}}>kg</span></div>
                  <div className="text-sm num" style={{color:'var(--blue-hi)'}}>× {r.r} reps</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {demo&&(
        <section className="card p-4 flex items-center justify-between gap-3 flex-wrap" style={{borderStyle:'dashed'}}>
          <p className="text-sm flex-1 min-w-[200px]" style={{color:'var(--mute)'}}>Les séances affichées sont des données d'exemple. Efface-les pour repartir avec tes vraies charges.</p>
          <button onClick={clearDemo} className="btn btn-ghost px-4 h-10 text-base">Effacer l'exemple</button>
        </section>
      )}
    </div>
  );
}
function Stat({icon,label,value,unit,hint,good}){
  return (
    <div className="card p-3 sm:p-4">
      <div className="flex items-center gap-1.5 fd text-[13px] font-semibold" style={{color:'var(--mute)'}}><Icon n={icon} s={15}/>{label}</div>
      <div className="fd text-5xl font-extrabold leading-none mt-2 num" style={{color:good?'var(--ok)':'var(--text)'}}>{value}</div>
      <div className="fd text-sm font-semibold" style={{color:'var(--blue-hi)'}}>{unit}</div>
      <div className="text-[11px] mt-1 leading-tight" style={{color:'var(--mute)'}}>{hint}</div>
    </div>
  );
}
