import { useState } from 'react';
import { Icon } from '../components/Icon';
import Timer from '../components/Timer';
import { MUSCLES, EX, PLAN, WARM, COOL } from '../data/plan';
import { longDate, fmt, num, uid, byTs } from '../lib/utils';

/* ---------- Écran 2 : Séance ---------- */
export default function Workout({active,setActive,history,launch,next,finish,discard}){
  const [sheet,setSheet]=useState(false);
  const [q,setQ]=useState('');
  const [mf,setMf]=useState('Tous');
  const [confirm,setConfirm]=useState(false);
  const [msg,setMsg]=useState('');

  if(!active){
    return (
      <div className="pt-5 flex flex-col gap-5">
        <header>
          <div className="fd text-[15px] font-semibold" style={{color:'var(--blue-hi)'}}>{longDate(new Date())}</div>
          <h1 className="fd text-5xl font-extrabold leading-none mt-1">Séance</h1>
        </header>
        <div className="card p-5">
          <div className="fd text-2xl font-bold">Aucune séance en cours</div>
          <p className="text-sm mt-1" style={{color:'var(--mute)'}}>Choisis ta séance. La prochaine de la rotation est mise en avant.</p>
        </div>
        <div className="grid gap-3">
          {PLAN.map(p=>(
            <button key={p.id} onClick={()=>launch(p.id)} className={`card text-left p-4 cursor-pointer flex items-center justify-between ${p.id===next.id?'card-hi':''}`} style={{color:'var(--text)'}}>
              <span><span className="fd text-sm font-semibold block" style={{color:'var(--blue-hi)'}}>Jour {p.day}{p.id===next.id?' · prochaine':''}</span><span className="fd text-2xl font-bold">{p.title}</span></span>
              <Icon n="plus" s={24} cls="text-[color:var(--blue-hi)]"/>
            </button>
          ))}
          <button onClick={()=>launch(null)} className="btn btn-ghost h-12 text-lg">Séance libre</button>
        </div>
      </div>
    );
  }

  /* référence : dernière séance contenant l'exercice */
  const last={};
  [...history].sort(byTs).forEach(s=>s.exercises.forEach(ex=>{last[ex.exId]=ex.sets}));
  const prevFor=(exId,j)=>{const s=last[exId];if(!s||!s.length)return null;return s[j]||s[s.length-1]};

  const setEx=(k,fn)=>setActive(a=>({...a,exercises:a.exercises.map(e=>e.key===k?fn(e):e)}));
  const setSet=(k,j,patch)=>setEx(k,e=>({...e,sets:e.sets.map((s,i)=>i===j?{...s,...patch}:s)}));
  const toggle=(ex,j)=>{
    const s=ex.sets[j];
    if(s.done){setSet(ex.key,j,{done:false});return}
    const p=prevFor(ex.exId,j);
    const w=s.w!==''?num(s.w):(p?p.w:NaN);
    const r=s.r!==''?num(s.r):(p?p.r:NaN);
    if(!(w>=0)||!(r>0)){setSet(ex.key,j,{err:true});return}
    setMsg('');
    setSet(ex.key,j,{w:fmt(w),r:String(r),done:true,err:false});
  };
  const addSet=k=>setEx(k,e=>({...e,sets:[...e.sets,{w:'',r:'',done:false,err:false}]}));
  const removeEx=k=>setActive(a=>({...a,exercises:a.exercises.filter(e=>e.key!==k)}));
  const addEx=id=>{
    setActive(a=>({...a,exercises:[...a.exercises,{key:uid(),exId:id,name:EX[id].name,muscle:EX[id].muscle,target:'3 séries',
      sets:Array.from({length:3},()=>({w:'',r:'',done:false,err:false}))}]}));
    setSheet(false);setQ('');setMf('Tous');
  };
  const doneCount=active.exercises.reduce((a,e)=>a+e.sets.filter(s=>s.done).length,0);
  const totalCount=active.exercises.reduce((a,e)=>a+e.sets.length,0);
  const tryFinish=()=>{if(doneCount===0){setMsg('Valide au moins une série avant de terminer.');return}finish()};
  const flip=(field,i)=>setActive(a=>({...a,[field]:a[field].map((v,x)=>x===i?!v:v)}));

  const list=Object.entries(EX).filter(([id,e])=>(mf==='Tous'||e.muscle===mf)&&e.name.toLowerCase().includes(q.trim().toLowerCase()));

  return (
    <div>
      {/* En-tête collant : date, minuteur, actions */}
      <div className="sticky top-0 z-20 -mx-4 px-4 pt-4 pb-3" style={{background:'rgba(9,12,19,.96)',borderBottom:'1px solid var(--line)'}}>
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            <div className="fd text-[15px] font-semibold" style={{color:'var(--blue-hi)'}}>{longDate(new Date())}</div>
            <div className="fd text-2xl font-bold leading-tight truncate">{active.name}</div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-[11px]" style={{color:'var(--mute)'}}>Durée</div>
            <div className="fd text-4xl font-extrabold leading-none" style={{color:'var(--blue-hi)'}}><Timer start={active.startedAt}/></div>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-3">
          <div className="text-xs num flex-1" style={{color:'var(--mute)'}}>{doneCount} / {totalCount} séries validées</div>
          {!confirm?(
            <>
              <button onClick={()=>setConfirm(true)} className="btn btn-ghost px-4 h-10 text-base">Abandonner</button>
              <button onClick={tryFinish} className="btn btn-blue px-5 h-10 text-base">Terminer</button>
            </>
          ):(
            <>
              <span className="text-xs" style={{color:'var(--bad)'}}>Tout perdre ?</span>
              <button onClick={()=>setConfirm(false)} className="btn btn-ghost px-3 h-10 text-base">Non</button>
              <button onClick={discard} className="btn px-3 h-10 text-base" style={{background:'var(--bad)',color:'#fff'}}>Oui, abandonner</button>
            </>
          )}
        </div>
        {msg&&<div className="text-xs mt-2" role="alert" style={{color:'var(--bad)'}}>{msg}</div>}
      </div>

      <div className="pt-5 flex flex-col gap-4">
        {/* Échauffement */}
        <CheckCard title="Échauffement" sub="Environ 5 min"
          items={[{label:'5 min de cardio léger (vélo ou tapis)',on:active.cardio,flip:()=>setActive(a=>({...a,cardio:!a.cardio}))},
            ...WARM[active.kind].map((l,i)=>({label:l,on:active.warm[i],flip:()=>flip('warm',i)}))]}/>

        {/* Exercices */}
        {active.exercises.map(ex=>{
          const allDone=ex.sets.length>0&&ex.sets.every(s=>s.done);
          return (
            <section key={ex.key} className="card p-4" style={allDone?{borderColor:'rgba(34,197,94,.5)'}:null}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="fd text-2xl font-bold leading-tight">{ex.name}</div>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="fd text-xs font-bold px-2 py-0.5" style={{background:'rgba(45,127,255,.16)',color:'var(--blue-hi)'}}>{ex.muscle}</span>
                    <span className="text-xs num" style={{color:'var(--mute)'}}>Objectif {ex.target}</span>
                  </div>
                </div>
                <button onClick={()=>removeEx(ex.key)} aria-label={`Retirer ${ex.name}`} className="p-2 cursor-pointer" style={{color:'var(--mute)',background:'transparent',border:0}}><Icon n="x" s={18}/></button>
              </div>
              <div className="mt-3">
                <div className="row fd text-xs font-semibold" style={{color:'var(--mute)',paddingTop:0,paddingBottom:2}}>
                  <span className="text-center">Série</span><span>Précédent</span><span className="text-center">Kg</span><span className="text-center">Reps</span><span className="text-center">OK</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  {ex.sets.map((s,j)=>{
                    const p=prevFor(ex.exId,j);
                    return (
                      <div key={j} className={`row ${s.done?'done':''} ${s.err?'err':''}`}>
                        <span className="fd text-xl font-bold text-center" style={{color:s.done?'var(--ok)':'var(--blue-hi)'}}>{j+1}</span>
                        <span className="text-sm num" style={{color:'var(--mute)'}}>{p?`${fmt(p.w)} × ${p.r}`:'—'}</span>
                        <input id={`w-${ex.key}-${j}`} className="inp" inputMode="decimal" aria-label={`Poids série ${j+1}`} placeholder={p?fmt(p.w):'kg'} value={s.w} onChange={e=>setSet(ex.key,j,{w:e.target.value,err:false})}/>
                        <input id={`r-${ex.key}-${j}`} className="inp" inputMode="numeric" aria-label={`Répétitions série ${j+1}`} placeholder={p?String(p.r):'reps'} value={s.r} onChange={e=>setSet(ex.key,j,{r:e.target.value,err:false})}/>
                        <button className={`chk ${s.done?'on':''}`} onClick={()=>toggle(ex,j)} aria-pressed={s.done} aria-label={`Valider la série ${j+1}`}><Icon n="check" s={22}/></button>
                      </div>
                    );
                  })}
                </div>
                {ex.sets.some(s=>s.err)&&<div className="text-xs mt-2" style={{color:'var(--bad)'}}>Saisis le poids et les répétitions avant de valider.</div>}
              </div>
              <button onClick={()=>addSet(ex.key)} className="btn btn-ghost w-full h-10 mt-3 text-base flex items-center justify-center gap-2"><Icon n="plus" s={16}/>Ajouter une série</button>
            </section>
          );
        })}

        <button onClick={()=>setSheet(true)} className="btn w-full h-14 text-xl flex items-center justify-center gap-2" style={{border:'1px dashed var(--blue)',color:'var(--blue-hi)',background:'transparent'}}>
          <Icon n="plus" s={20}/>Ajouter un exercice
        </button>

        {/* Retour au calme */}
        <CheckCard title="Retour au calme" sub="Étirements"
          items={COOL[active.kind].map((l,i)=>({label:l,on:active.cool[i],flip:()=>flip('cool',i)}))}/>
      </div>

      {/* Sélecteur en feuille du bas */}
      {sheet&&(
        <div className="sheet fixed inset-x-0 z-30" style={{bottom:'calc(64px + env(safe-area-inset-bottom))'}}>
          <div className="max-w-3xl mx-auto" style={{background:'var(--card2)',borderTop:'3px solid var(--blue)',boxShadow:'0 -12px 32px rgba(0,0,0,.55)'}}>
            <div className="p-4 flex flex-col gap-3" style={{maxHeight:'58vh'}}>
              <div className="flex items-center justify-between">
                <div className="fd text-2xl font-bold">Ajouter un exercice</div>
                <button onClick={()=>setSheet(false)} aria-label="Fermer" className="p-2 cursor-pointer" style={{color:'var(--mute)',background:'transparent',border:0}}><Icon n="x" s={22}/></button>
              </div>
              <input id="exq" className="inp" style={{textAlign:'left',paddingLeft:12,fontWeight:500,fontSize:15}} placeholder="Rechercher un exercice" aria-label="Rechercher un exercice" value={q} onChange={e=>setQ(e.target.value)}/>
              <div className="scrollx flex gap-2">
                {['Tous',...MUSCLES].map(m=>(
                  <button key={m} onClick={()=>setMf(m)} className="btn px-3 h-8 text-sm shrink-0" style={{background:mf===m?'var(--blue)':'transparent',color:mf===m?'#fff':'var(--mute)',border:'1px solid '+(mf===m?'var(--blue)':'var(--line)')}}>{m}</button>
                ))}
              </div>
              <div className="overflow-y-auto flex flex-col" style={{minHeight:0}}>
                {list.length===0&&<div className="text-sm py-4" style={{color:'var(--mute)'}}>Aucun exercice ne correspond.</div>}
                {list.map(([id,e])=>(
                  <button key={id} onClick={()=>addEx(id)} className="flex items-center justify-between text-left py-3 px-1 cursor-pointer" style={{background:'transparent',border:0,borderBottom:'1px solid var(--line)',color:'var(--text)'}}>
                    <span><span className="font-semibold block">{e.name}</span><span className="text-xs" style={{color:'var(--mute)'}}>{e.muscle}</span></span>
                    <Icon n="plus" s={20} cls="text-[color:var(--blue-hi)]"/>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
function CheckCard({title,sub,items}){
  const all=items.every(i=>i.on);
  return (
    <section className="card p-4" style={all?{borderColor:'rgba(34,197,94,.5)'}:null}>
      <div className="flex items-baseline justify-between">
        <div className="fd text-2xl font-bold">{title}</div>
        <div className="text-xs" style={{color:'var(--mute)'}}>{sub}</div>
      </div>
      <div className="flex flex-col gap-1.5 mt-3">
        {items.map((it,i)=>(
          <button key={i} onClick={it.flip} aria-pressed={it.on} className={`row text-left cursor-pointer ${it.on?'done':''}`} style={{gridTemplateColumns:'1fr 44px',background:it.on?undefined:'var(--card2)',color:'var(--text)'}}>
            <span className="text-sm" style={{textDecoration:it.on?'line-through':'none',opacity:it.on?.8:1}}>{it.label}</span>
            <span className={`chk ${it.on?'on':''}`}><Icon n="check" s={20}/></span>
          </button>
        ))}
      </div>
    </section>
  );
}
