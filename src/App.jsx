import { useState, useEffect } from 'react';
import { Icon } from './components/Icon';
import Dashboard from './screens/Dashboard';
import Workout from './screens/Workout';
import History from './screens/History';
import Progress from './screens/Progress';
import { isoD, num, uid, seed, computeRecords, nextPlanOf, startWorkout } from './lib/utils';

/* ---------- Application ---------- */
const KEY='tracker-masse-v2';
function load(){try{const s=JSON.parse(localStorage.getItem(KEY));if(s&&s.history)return s}catch(e){}return null}

export default function App(){
  const [init]=useState(load);
  const [tab,setTab]=useState('dash');
  const [history,setHistory]=useState(init?init.history:seed());
  const [demo,setDemo]=useState(init?init.demo:true);
  const [active,setActive]=useState(init?init.active:null);
  const [weight,setWeight]=useState(init&&init.weight?init.weight:60);
  const [flash,setFlash]=useState(null);
  useEffect(()=>{try{localStorage.setItem(KEY,JSON.stringify({history,demo,active,weight}))}catch(e){}},[history,demo,active,weight]);
  useEffect(()=>{window.scrollTo(0,0)},[tab]);

  const rec=computeRecords(history);
  const next=nextPlanOf(history);

  const launch=id=>{setActive(startWorkout(id));setTab('work')};
  const finish=()=>{
    const exercises=active.exercises.map(ex=>({exId:ex.exId,name:ex.name,muscle:ex.muscle,
      sets:ex.sets.filter(s=>s.done).map(s=>({w:num(s.w),r:num(s.r)}))})).filter(ex=>ex.sets.length>0);
    const now=new Date();
    const s={id:uid(),planId:active.planId,name:active.name,date:isoD(now),ts:now.getTime(),
      durationMin:Math.max(1,Math.round((now.getTime()-active.startedAt)/60000)),exercises};
    const nh=[...history,s];
    const prs=(computeRecords(nh).flags[s.id]||[]).length;
    setHistory(nh);setActive(null);
    setFlash(prs>0?`Séance enregistrée. ${prs} nouveau${prs>1?'x':''} record${prs>1?'s':''}.`:'Séance enregistrée.');
    setTab('hist');
  };
  const discard=()=>{setActive(null);setTab('dash')};

  const tabs=[['dash','Accueil','home'],['work','Séance','dumbbell'],['hist','Historique','history'],['prog','Progrès','chart']];
  return (
    <div className="min-h-screen" style={{paddingBottom:'calc(88px + env(safe-area-inset-bottom))'}}>
      <main className="max-w-3xl mx-auto px-4">
        {tab==='dash'&&<Dashboard {...{history,rec,active,weight,setWeight,launch,next,demo,clearDemo:()=>{setHistory([]);setDemo(false)},goWork:()=>setTab('work')}}/>}
        {tab==='work'&&<Workout {...{active,setActive,history,launch,next,finish,discard}}/>}
        {tab==='hist'&&<History {...{history,rec,flash,clearFlash:()=>setFlash(null)}}/>}
        {tab==='prog'&&<Progress {...{history,rec}}/>}
      </main>
      <nav className="nav fixed bottom-0 inset-x-0 z-40" style={{background:'rgba(9,12,19,.96)',borderTop:'1px solid var(--line)'}}>
        <div className="max-w-3xl mx-auto grid grid-cols-4">
          {tabs.map(([id,label,ic])=>{
            const on=tab===id;
            return (
              <button key={id} onClick={()=>setTab(id)} aria-current={on?'page':undefined}
                className="relative flex flex-col items-center justify-center gap-1 h-16 cursor-pointer"
                style={{color:on?'var(--blue-hi)':'var(--mute)',background:'transparent',border:0}}>
                {on&&<span className="absolute top-0 h-[3px] w-10" style={{background:'var(--blue)'}}/>}
                <span className="relative"><Icon n={ic} s={22}/>{id==='work'&&active&&<span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full" style={{background:'var(--ok)'}}/>}</span>
                <span className="fd text-[13px] font-semibold">{label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
