import { useState } from 'react';
import { Icon } from '../components/Icon';
import { MUSCLES, EX, PLAN } from '../data/plan';
import { parseD, dm, fmt, num, monday, addDays, bestSet, byTs, volumeWeek } from '../lib/utils';

/* ---------- Écran 4 : Progrès ---------- */
function Spark({pts,id}){
  const W=220,H=64,P=6;
  const ws=pts.map(p=>p.w);const mn=Math.min(...ws),mx=Math.max(...ws);
  const X=i=>pts.length===1?W/2:P+i*(W-2*P)/(pts.length-1);
  const Y=v=>mx===mn?H/2:H-P-(v-mn)/(mx-mn)*(H-2*P);
  const line=pts.map((p,i)=>`${X(i)},${Y(p.w)}`).join(' ');
  const area=`${X(0)},${H} ${line} ${X(pts.length-1)},${H}`;
  const lx=X(pts.length-1),ly=Y(pts[pts.length-1].w);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="64" role="img" aria-label="Évolution du poids de la meilleure série">
      <defs><linearGradient id={'g'+id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2D7FFF" stopOpacity=".4"/><stop offset="1" stopColor="#2D7FFF" stopOpacity="0"/></linearGradient></defs>
      {[.25,.5,.75].map(f=><line key={f} x1="0" x2={W} y1={H*f} y2={H*f} stroke="#222B3B" strokeWidth="1"/>)}
      <polygon points={area} fill={`url(#g${id})`}/>
      <polyline points={line} fill="none" stroke="#2D7FFF" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/>
      <circle cx={lx} cy={ly} r="7" fill="#2D7FFF" opacity=".25"/>
      <circle cx={lx} cy={ly} r="3.5" fill="#62A6FF"/>
    </svg>
  );
}
export default function Progress({history,rec}){
  const [off,setOff]=useState(0);
  const cur=addDays(monday(new Date()),-7*off);
  const vol=volumeWeek(history,cur);
  const prev=volumeWeek(history,addDays(cur,-7));
  const max=Math.max(1,...MUSCLES.map(m=>Math.max(vol[m].vol,prev[m].vol)));
  const total=MUSCLES.reduce((a,m)=>a+vol[m].vol,0);
  const rows=[...MUSCLES].sort((a,b)=>vol[b].vol-vol[a].vol);

  /* séries temporelles par exercice : poids de la meilleure série */
  const series={};
  [...history].sort(byTs).forEach(s=>s.exercises.forEach(ex=>{
    const b=bestSet(ex.sets);if(!b)return;
    (series[ex.exId]=series[ex.exId]||{name:ex.name,muscle:ex.muscle,pts:[]}).pts.push({w:b.w,r:b.r,date:s.date});
  }));
  const order=[...PLAN.flatMap(p=>p.items.map(i=>i[0])),...Object.keys(EX)].filter((id,i,a)=>a.indexOf(id)===i&&series[id]);

  return (
    <div className="pt-5 flex flex-col gap-5">
      <header>
        <div className="fd text-[15px] font-semibold" style={{color:'var(--blue-hi)'}}>Volume et charges</div>
        <h1 className="fd text-5xl font-extrabold leading-none mt-1">Progrès</h1>
      </header>

      <section className="card p-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="fd text-2xl font-bold">Volume hebdomadaire</h2>
          <div className="flex items-center gap-1">
            <button onClick={()=>setOff(o=>Math.min(12,o+1))} aria-label="Semaine précédente" className="btn btn-ghost w-9 h-9 text-lg">‹</button>
            <button onClick={()=>setOff(o=>Math.max(0,o-1))} disabled={off===0} aria-label="Semaine suivante" className="btn btn-ghost w-9 h-9 text-lg" style={{opacity:off===0?.35:1}}>›</button>
          </div>
        </div>
        <div className="text-sm num" style={{color:'var(--mute)'}}>{off===0?'Cette semaine':'Semaine du'} · {dm(cur)} au {dm(addDays(cur,6))}</div>
        <div className="fd text-4xl font-extrabold num leading-none mt-3">{Math.round(total).toLocaleString('fr-FR')}<span className="text-lg ml-1" style={{color:'var(--mute)'}}>kg soulevés</span></div>
        <div className="flex flex-col gap-3 mt-4">
          {rows.map(m=>{
            const v=vol[m],pv=prev[m];
            return (
              <div key={m}>
                <div className="flex items-baseline justify-between gap-2">
                  <span className="fd text-lg font-semibold">{m}{v.sessions>0&&<span className="text-xs ml-2 num" style={{color:v.sessions>=2?'var(--ok)':'var(--mute)'}}>{v.sessions}× / sem.</span>}</span>
                  <span className="text-sm num" style={{color:v.vol>0?'var(--text)':'var(--mute)'}}>{Math.round(v.vol).toLocaleString('fr-FR')} kg · {v.sets} séries</span>
                </div>
                <div className="relative h-4 mt-1" style={{background:'#0B0F17'}}>
                  <div className="bar h-4" style={{width:(v.vol/max*100)+'%',background:'linear-gradient(90deg,#1F5FD0,#2D7FFF)'}}/>
                  {pv.vol>0&&<div className="absolute top-[-2px] h-5 w-[3px]" style={{left:`calc(${pv.vol/max*100}% - 1px)`,background:'var(--gold)'}} title={`Semaine précédente : ${Math.round(pv.vol)} kg`}/>}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-4 text-xs mt-4" style={{color:'var(--mute)'}}>
          <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-3" style={{background:'var(--blue)'}}/>Cette semaine</span>
          <span className="flex items-center gap-1.5"><span className="inline-block w-[3px] h-3" style={{background:'var(--gold)'}}/>Semaine précédente</span>
        </div>
      </section>

      <section>
        <h2 className="fd text-2xl font-bold mb-3">Évolution des charges</h2>
        {order.length===0&&<div className="card p-4 text-sm" style={{color:'var(--mute)'}}>Les courbes apparaissent dès ta première séance enregistrée.</div>}
        <div className="grid gap-3 sm:grid-cols-2">
          {order.map(id=>{
            const s=series[id];const r=rec.best[id];const first=s.pts[0],lastP=s.pts[s.pts.length-1];
            const gain=lastP.w-first.w;
            return (
              <div key={id} className="card p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0"><div className="font-semibold leading-tight">{s.name}</div><div className="text-xs" style={{color:'var(--mute)'}}>{s.muscle}</div></div>
                  <div className="text-right shrink-0">
                    <div className="fd text-xs font-semibold flex items-center gap-1 justify-end" style={{color:'var(--gold)'}}><Icon n="trophy" s={13}/>Record</div>
                    <div className="fd text-3xl font-extrabold num leading-none" style={{color:'var(--blue-hi)'}}>{fmt(r.w)}<span className="text-sm ml-1" style={{color:'var(--mute)'}}>kg × {r.r}</span></div>
                  </div>
                </div>
                <div className="mt-2"><Spark pts={s.pts} id={id}/></div>
                <div className="flex justify-between text-xs num mt-1" style={{color:'var(--mute)'}}>
                  <span>{dm(parseD(first.date))} · {fmt(first.w)} kg</span>
                  <span>{dm(parseD(lastP.date))} · {fmt(lastP.w)} kg</span>
                </div>
                <div className="text-sm font-semibold num mt-2" style={{color:gain>0?'var(--ok)':'var(--mute)'}}>{gain>0?`+${fmt(gain)} kg depuis le début`:'Charge stable'} · {s.pts.length} séance{s.pts.length>1?'s':''}</div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
