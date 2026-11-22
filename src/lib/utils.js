import { MUSCLES, EX, PLAN, planName, WARM, COOL } from '../data/plan';

/* ---------- Utilitaires ---------- */
export const JOURS=['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'];
export const MOIS=['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
export const MOIS_C=['janv.','févr.','mars','avr.','mai','juin','juil.','août','sept.','oct.','nov.','déc.'];
export const cap=s=>s.charAt(0).toUpperCase()+s.slice(1);
export const pad=n=>String(n).padStart(2,'0');
export const isoD=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
export const parseD=s=>{const [y,m,d]=s.split('-').map(Number);return new Date(y,m-1,d)};
export const longDate=d=>cap(`${JOURS[d.getDay()]} ${d.getDate()} ${MOIS[d.getMonth()]}`);
export const shortDate=d=>`${JOURS[d.getDay()].slice(0,3)}. ${d.getDate()} ${MOIS_C[d.getMonth()]}`;
export const dm=d=>`${d.getDate()} ${MOIS_C[d.getMonth()]}`;
export const fmt=n=>String(Math.round(n*100)/100).replace('.',',');
export const num=v=>{const x=parseFloat(String(v).replace(',','.'));return isFinite(x)?x:NaN};
export const uid=()=>Math.random().toString(36).slice(2,9);
export const monday=d=>{const x=new Date(d.getFullYear(),d.getMonth(),d.getDate());x.setDate(x.getDate()-((x.getDay()+6)%7));return x};
export const addDays=(d,n)=>{const x=new Date(d);x.setDate(x.getDate()+n);return x};
export const e1=(w,r)=>w*(1+r/30);
export const bestSet=sets=>{let b=null;sets.forEach(s=>{if(s.r>0&&s.w>=0){const sc=e1(s.w,s.r);if(!b||sc>b.score)b={w:s.w,r:s.r,score:sc}}});return b};
export const byTs=(a,b)=>a.ts-b.ts;

/* Données d'exemple : 10 séances du 2 au 21 novembre */
export function seed(){
  const plan=[['2026-11-02','push1'],['2026-11-04','pull1'],['2026-11-06','legs'],['2026-11-07','push2'],['2026-11-09','pull2'],['2026-11-11','push1'],['2026-11-13','pull1'],['2026-11-16','legs'],['2026-11-18','push2'],['2026-11-20','pull2'],['2026-11-21','push1']];
  const dur=[52,47,55,50,58,49,53,51,56,54,48];
  const lvl={};const out=[];
  plan.forEach(([date,pid],si)=>{
    const p=PLAN.find(x=>x.id===pid);
    const exercises=p.items.map(([id,n,rep],i)=>{
      const e=EX[id];
      lvl[id]=lvl[id]===undefined?0:lvl[id]+(((si+i)%3===2)?0:1);
      const lv=lvl[id];const lo=parseInt(rep);const top=lo+(lv%2);
      const w=e.base+e.inc*Math.floor(lv/2);
      return {exId:id,name:e.name,muscle:e.muscle,sets:Array.from({length:n},(_,j)=>({w,r:j<2?top:top-1}))};
    });
    out.push({id:'s'+si,planId:pid,name:planName(p),date,ts:parseD(date).getTime()+9*36e5,durationMin:dur[si],exercises});
  });
  return out;
}

/* Records et séances avec record */
export function computeRecords(history){
  const best={},flags={};
  [...history].sort(byTs).forEach(s=>{
    s.exercises.forEach(ex=>{
      const t=bestSet(ex.sets);if(!t)return;
      const b=best[ex.exId];
      if(b&&t.score>b.score+1e-9){(flags[s.id]=flags[s.id]||[]).push(ex.exId)}
      if(!b||t.score>b.score)best[ex.exId]={w:t.w,r:t.r,score:t.score,date:s.date,name:ex.name,muscle:ex.muscle};
    });
  });
  return {best,flags};
}
export function weekCounts(history){const c={};history.forEach(s=>{const k=isoD(monday(parseD(s.date)));c[k]=(c[k]||0)+1});return c}
export function streakOf(history){
  const c=weekCounts(history);let w=monday(new Date());let n=0;
  if((c[isoD(w)]||0)>=3)n++;
  w=addDays(w,-7);
  while((c[isoD(w)]||0)>=3){n++;w=addDays(w,-7)}
  return n;
}
export function nextPlanOf(history){
  const last=[...history].sort(byTs).reverse().find(s=>PLAN.some(p=>p.id===s.planId));
  if(!last)return PLAN[0];
  const i=PLAN.findIndex(p=>p.id===last.planId);
  return PLAN[(i+1)%PLAN.length];
}
export function volumeWeek(history,start){
  const end=addDays(start,7);const out={};MUSCLES.forEach(m=>out[m]={vol:0,sets:0,sessions:0});
  history.forEach(s=>{
    const d=parseD(s.date);if(d<start||d>=end)return;
    const seen={};
    s.exercises.forEach(ex=>{
      const o=out[ex.muscle];if(!o)return;
      ex.sets.forEach(t=>{o.vol+=t.w*t.r;o.sets++});
      seen[ex.muscle]=1;
    });
    Object.keys(seen).forEach(m=>out[m].sessions++);
  });
  return out;
}
export function startWorkout(planId){
  const p=PLAN.find(x=>x.id===planId);
  const kind=p?p.kind:'libre';
  const items=p?p.items:[];
  return {
    planId:p?p.id:null,kind,name:p?planName(p):'Séance libre',startedAt:Date.now(),
    cardio:false,warm:WARM[kind].map(()=>false),cool:COOL[kind].map(()=>false),
    exercises:items.map(([id,n,rep])=>({key:uid(),exId:id,name:EX[id].name,muscle:EX[id].muscle,target:`${n} × ${rep}`,
      sets:Array.from({length:n},()=>({w:'',r:'',done:false,err:false}))})),
  };
}
