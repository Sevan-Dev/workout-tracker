import { useState, useEffect } from 'react';
import { pad, num } from '../lib/utils';

export default function Timer({start}){
  const [n,setN]=useState(Date.now());
  useEffect(()=>{const t=setInterval(()=>setN(Date.now()),1000);return()=>clearInterval(t)},[]);
  const s=Math.max(0,Math.floor((n-start)/1000));
  const h=Math.floor(s/3600),m=Math.floor((s%3600)/60),r=s%60;
  return <span className="num">{h>0?h+':':''}{h>0?pad(m):m}:{pad(r)}</span>;
}
