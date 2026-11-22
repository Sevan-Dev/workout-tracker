/* ---------- Données du plan : rotation Haut / Bas / Full body ---------- */
export const MUSCLES=['Pectoraux','Dos','Épaules','Biceps','Triceps','Quadriceps','Ischios','Mollets','Abdos'];
export const EX={
  dc:{name:'Développé couché barre',muscle:'Pectoraux',base:35,inc:2.5},
  tv:{name:'Tirage vertical poitrine',muscle:'Dos',base:35,inc:2.5},
  dm:{name:'Développé épaules machine',muscle:'Épaules',base:20,inc:2.5},
  rb:{name:'Rowing buste soutenu',muscle:'Dos',base:30,inc:2.5},
  el:{name:'Élévations latérales poulie',muscle:'Épaules',base:5,inc:1.25},
  tr:{name:'Extension triceps poulie',muscle:'Triceps',base:15,inc:2.5},
  sq:{name:'Squat barre',muscle:'Quadriceps',base:40,inc:2.5},
  rdl:{name:'Soulevé de terre roumain',muscle:'Ischios',base:40,inc:2.5},
  pc:{name:'Presse à cuisses',muscle:'Quadriceps',base:80,inc:5},
  lc:{name:'Leg curl assis',muscle:'Ischios',base:25,inc:2.5},
  mo:{name:'Mollets debout machine',muscle:'Mollets',base:40,inc:5},
  ca:{name:'Crunch poulie',muscle:'Abdos',base:20,inc:2.5},
  di:{name:'Développé incliné haltères',muscle:'Pectoraux',base:12,inc:2},
  tvn:{name:'Tirage vertical prise neutre',muscle:'Dos',base:35,inc:2.5},
  cb:{name:'Curl biceps poulie',muscle:'Biceps',base:15,inc:2.5},
  /* exercices supplémentaires pour le sélecteur */
  ta:{name:'Tractions avec sangles',muscle:'Dos'},
  th:{name:'Tirage horizontal poulie',muscle:'Dos',base:30,inc:2.5},
  ec:{name:'Écartés poulie',muscle:'Pectoraux',base:10,inc:1.25},
  ch:{name:'Curl marteau haltères',muscle:'Biceps',base:8,inc:2},
  dip:{name:'Dips machine',muscle:'Triceps',base:30,inc:2.5},
  fm:{name:'Fentes marchées',muscle:'Quadriceps'},
  le:{name:'Leg extension',muscle:'Quadriceps'},
  ob:{name:'Oiseau machine',muscle:'Épaules',base:15,inc:2.5},
};
/* Rotation PPL + PP : Push A, Pull A, Legs, Push B, Pull B */
export const PLAN=[
  {id:'push1',kind:'push',day:1,title:'Push A',items:[['dc',4,'6-8'],['di',3,'8-10'],['dm',3,'8-10'],['el',3,'12-15'],['tr',3,'10-12']]},
  {id:'pull1',kind:'pull',day:2,title:'Pull A',items:[['tv',4,'8-10'],['rb',3,'8-10'],['ob',3,'12-15'],['cb',3,'10-12']]},
  {id:'legs',kind:'legs',day:3,title:'Legs',items:[['sq',4,'6-8'],['rdl',3,'8-10'],['pc',3,'10-12'],['lc',3,'10-12'],['mo',4,'12-15'],['ca',3,'12-15']]},
  {id:'push2',kind:'push',day:4,title:'Push B',items:[['dm',4,'6-8'],['di',3,'8-10'],['ec',3,'12-15'],['el',4,'12-15'],['dip',3,'10-12']]},
  {id:'pull2',kind:'pull',day:5,title:'Pull B',items:[['tvn',4,'8-10'],['th',3,'10-12'],['ob',3,'12-15'],['ch',3,'10-12']]},
];
export const planName=p=>`Jour ${p.day} : ${p.title}`;
export const WARM={
  push:['Cercles de bras, 2 × 10','Rotations de tronc, 2 × 10','Pompes lentes, 8 répétitions'],
  pull:['Cercles de bras, 2 × 10','Chat-vache, 8 répétitions','Suspension à la barre, 20 s'],
  legs:['Balancés de jambes, 10 par côté','Squats au poids du corps, 10','Fentes dynamiques, 8 par côté'],
  libre:['Cercles de bras, 2 × 10','Balancés de jambes, 10 par côté','Rotations de tronc, 2 × 10'],
};
export const COOL={
  push:['Pectoraux au mur, 30 s par côté','Épaules bras croisé, 30 s par côté','Triceps derrière la nuque, 30 s par côté'],
  pull:['Dorsaux, suspendu ou penché, 30 s','Biceps au mur, 30 s par côté','Haut du dos en position de l\'enfant, 30 s'],
  legs:['Quadriceps debout, 30 s par côté','Ischios jambe tendue, 30 s par côté','Mollets au mur, 30 s par côté'],
  libre:['Pectoraux au mur, 30 s par côté','Quadriceps debout, 30 s par côté','Dorsaux, suspendu ou penché, 30 s'],
};
