"use strict";
const HS_KEY="stellarwarp_v2",HS_MAX=10;
function loadHS(){try{return JSON.parse(localStorage.getItem(HS_KEY))||[];}catch{return[];}}
function saveHS(name,score){
  const list=loadHS();
  const date=new Date().toLocaleDateString("es-MX",{day:"2-digit",month:"2-digit",year:"numeric"});
  list.push({name:name.toUpperCase().slice(0,12),score,date});
  list.sort((a,b)=>b.score-a.score);
  const t=list.slice(0,HS_MAX);
  localStorage.setItem(HS_KEY,JSON.stringify(t));
  return t;
}
function isHS(score){const l=loadHS();return l.length<HS_MAX||score>(l[l.length-1]?.score||0);}
function renderHS(id){
  const el=document.getElementById(id);if(!el)return;
  const list=loadHS();
  if(!list.length){el.innerHTML='<div class="hs-empty">— SIN RÉCORDS AÚN —</div>';return;}
  const M=["🥇","🥈","🥉"];
  el.innerHTML=list.map((e,i)=>`<div class="hs-row${i<3?" top":""}"><span class="hs-rank">${M[i]||"#"+(i+1)}</span><span class="hs-name">${e.name}</span><span class="hs-pts">${fmt(e.score)}</span><span class="hs-date">${e.date}</span></div>`).join("");
}

const canvas=document.getElementById("gameCanvas");
const ctx=canvas.getContext("2d");
ctx.imageSmoothingEnabled=false;
const W=480,H=640;
canvas.width=W;canvas.height=H;
function resize(){const sc=Math.min(innerWidth/W,innerHeight/H);canvas.style.width=(W*sc)+"px";canvas.style.height=(H*sc)+"px";}
resize();addEventListener("resize",resize);

const rnd=(a,b)=>Math.random()*(b-a)+a;
const ri=(a,b)=>Math.floor(rnd(a,b+1));
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const fmt=n=>String(n).padStart(6,"0");

const SP={
  ship(ctx,x,y,s,col="#00f5ff",frame=0){
    const p=s/12;ctx.save();ctx.translate(x,y);
    ctx.save();ctx.globalAlpha=0.15;ctx.fillStyle=col;ctx.fillRect(-p*8,-p*10,p*16,p*20);ctx.restore();
    const fl=frame%6<3;
    ctx.fillStyle=fl?"#ff6a00":"#ffb300";ctx.fillRect(-p*1.5,p*6,p*3,p*3);
    ctx.fillStyle=fl?"#ffee00":"#fff";ctx.fillRect(-p*.8,p*7.5,p*1.6,p*2);
    ctx.fillStyle=fl?"#ff2d78":"#ff6a00";ctx.fillRect(-p*5.2,p*5,p*1.6,p*2.2);ctx.fillRect(p*3.6,p*5,p*1.6,p*2.2);
    ctx.fillStyle=fl?"#ff9f00":"#ffee00";ctx.fillRect(-p*4.9,p*6.2,p,p*1.6);ctx.fillRect(p*3.9,p*6.2,p,p*1.6);
    ctx.fillStyle="#1a2a3a";ctx.fillRect(-p*9,p*1,p*3.5,p*5);ctx.fillRect(p*5.5,p*1,p*3.5,p*5);
    ctx.fillStyle=col;ctx.fillRect(-p*9,p*1,p*.7,p*5);ctx.fillRect(p*8.3,p*1,p*.7,p*5);ctx.fillRect(-p*9,p*5.3,p*3.5,p*.6);ctx.fillRect(p*5.5,p*5.3,p*3.5,p*.6);
    ctx.fillStyle="#0d1f2d";ctx.fillRect(-p*6.5,-p*1,p*2.2,p*5);ctx.fillRect(p*4.3,-p*1,p*2.2,p*5);
    ctx.fillStyle=col;ctx.fillRect(-p*6.5,p*3,p*2.2,p*.6);ctx.fillRect(p*4.3,p*3,p*2.2,p*.6);
    ctx.fillStyle="#223344";ctx.fillRect(-p*5,-p*4,p*1.4,p*4);ctx.fillRect(p*3.6,-p*4,p*1.4,p*4);
    ctx.fillStyle=col;ctx.fillRect(-p*5,-p*4.6,p*1.4,p*.7);ctx.fillRect(p*3.6,-p*4.6,p*1.4,p*.7);
    ctx.fillStyle="#0d1f2d";ctx.fillRect(-p*3,-p*6,p*6,p*13);
    ctx.fillStyle="#152535";ctx.fillRect(-p*4,-p*3,p*1.3,p*7);ctx.fillRect(p*2.7,-p*3,p*1.3,p*7);
    ctx.fillStyle="#0a4060";ctx.fillRect(-p*.35,-p*5,p*.7,p*10);
    ctx.fillStyle=col;ctx.fillRect(-p*3,p*.5,p*6,p*.5);ctx.fillRect(-p*3,p*3,p*6,p*.5);
    ctx.fillStyle=col;ctx.fillRect(-p*2.2,-p*6.5,p*4.4,p*.7);ctx.fillRect(-p*2.2,-p*6.5,p*.7,p*3.5);ctx.fillRect(p*1.5,-p*6.5,p*.7,p*3.5);
    ctx.fillStyle="#001a2e";ctx.fillRect(-p*1.5,-p*5.8,p*3,p*2.8);
    ctx.fillStyle="rgba(0,245,255,0.5)";ctx.fillRect(-p*1.2,-p*5.5,p*.8,p*1.8);
    ctx.fillStyle="rgba(255,255,255,0.25)";ctx.fillRect(-p*.2,-p*5.4,p*.5,p);
    ctx.fillStyle="#00f5ff22";ctx.fillRect(-p*.6,-p*4.8,p*1.2,p*1.4);
    ctx.fillStyle=col;ctx.fillRect(-p*2,-p*8,p*4,p*2.5);ctx.fillRect(-p*1.3,-p*10,p*2.6,p*2);ctx.fillRect(-p*.6,-p*11.5,p*1.2,p*1.5);ctx.fillRect(-p*.25,-p*12.5,p*.5,p);
    ctx.fillStyle="#fff";ctx.fillRect(-p*.25,-p*12.5,p*.25,p*.3);
    ctx.fillStyle=frame%10<5?"#ff2d78":"#ff9f00";ctx.fillRect(-p*2.2,-p*1.2,p*.7,p*.7);ctx.fillRect(p*1.5,-p*1.2,p*.7,p*.7);
    ctx.restore();
  },
  bullet(ctx,x,y,s,col="#00f5ff"){const p=s/12;ctx.save();ctx.translate(x,y);ctx.fillStyle=col;ctx.fillRect(-p*.5,-p*3,p,p*6);ctx.fillStyle="#fff";ctx.fillRect(-p*.5,-p*3,p,p);ctx.restore();},
  eBullet(ctx,x,y,s){const p=s/12;ctx.save();ctx.translate(x,y);ctx.fillStyle="#ff2d78";ctx.fillRect(-p,-p*3,p*2,p*6);ctx.fillStyle="#ff9f00";ctx.fillRect(-p*.5,p*2,p,p);ctx.restore();},
  asteroid(ctx,x,y,s,fr){
    const r=s/2;ctx.save();ctx.translate(x,y);ctx.rotate(fr*.02);
    const pts=[[0,-r],[r*.6,-r*.7],[r,-r*.2],[r*.8,r*.5],[r*.3,r],[-r*.4,r],[-r,r*.4],[-r*.8,-r*.3]];
    ctx.fillStyle="#8b7355";ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);pts.forEach(p=>ctx.lineTo(p[0],p[1]));ctx.closePath();ctx.fill();
    ctx.fillStyle="#5c4d2e";ctx.fillRect(-r*.3,-r*.2,r*.2,r*.2);ctx.fillRect(r*.2,r*.1,r*.15,r*.15);ctx.restore();
  },
  enemy1(ctx,x,y,s,fr){const p=s/12;ctx.save();ctx.translate(x,y);ctx.fillStyle="#bf5fff";ctx.fillRect(-p*3,-p*2,p*6,p*4);ctx.fillStyle="#7a00cc";ctx.fillRect(-p*5,0,p*2,p*3);ctx.fillRect(p*3,0,p*2,p*3);ctx.fillStyle="#ff2d78";ctx.fillRect(-p,-p,p*2,p*2);ctx.fillStyle=fr%20<10?"#ff9f00":"#ffee00";ctx.fillRect(-p*2,p*3,p*1.5,p*1.5);ctx.fillRect(p*.5,p*3,p*1.5,p*1.5);ctx.restore();},
  enemy2(ctx,x,y,s,fr){const p=s/12;ctx.save();ctx.translate(x,y);ctx.fillStyle="#cc3300";ctx.fillRect(-p*4,-p*3,p*8,p*6);ctx.fillStyle="#ff6633";ctx.fillRect(-p*2,-p*2,p*4,p*4);ctx.fillStyle="#ff2d78";ctx.fillRect(-p*4,-p*3,p*2,p*2);ctx.fillRect(p*2,-p*3,p*2,p*2);ctx.fillStyle=fr%16<8?"#ff6a00":"#fff";ctx.fillRect(-p*3,p*3,p*6,p);ctx.restore();},
  enemy3(ctx,x,y,s,fr){const p=s/12;ctx.save();ctx.translate(x,y);ctx.fillStyle="#00ccaa";ctx.fillRect(-p*3,-p*3,p*6,p*6);ctx.fillStyle="#00ffcc";ctx.fillRect(-p,-p,p*2,p*2);ctx.fillStyle="#005544";ctx.fillRect(-p*3,-p*3,p,p);ctx.fillRect(p*2,-p*3,p,p);ctx.fillRect(-p*3,p*2,p,p);ctx.fillRect(p*2,p*2,p,p);ctx.restore();},
  boss(ctx,x,y,s,fr,ph){
    const p=s/12,t=fr;ctx.save();ctx.translate(x,y);
    const bc=ph===2?"#ff2d78":ph===1?"#bf5fff":"#cc0000";
    const bc2=ph===2?"#ff9f00":ph===1?"#7a00cc":"#880000";
    ctx.fillStyle=bc;ctx.fillRect(-p*8,-p*6,p*16,p*12);ctx.fillStyle=bc2;ctx.fillRect(-p*6,-p*4,p*12,p*8);
    ctx.fillStyle="#fff";ctx.fillRect(-p*2,-p*2,p*4,p*4);ctx.fillStyle=t%30<15?"#f00":"#ff9f00";ctx.fillRect(-p,-p,p*2,p*2);
    ctx.fillStyle=bc2;ctx.fillRect(-p*11,-p*2,p*3,p*4);ctx.fillRect(p*8,-p*2,p*3,p*4);
    for(let i=-2;i<=2;i++){ctx.fillStyle=t%10<5?"#ff6a00":"#ffee00";ctx.fillRect(i*p*2.5-p,p*6,p*2,p*2);}
    if(ph===0){ctx.strokeStyle=`rgba(0,245,255,${.3+.2*Math.sin(t*.1)})`;ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,p*14,0,Math.PI*2);ctx.stroke();}
    ctx.restore();
  },
  heart(ctx,x,y,s){const p=s/12;ctx.save();ctx.translate(x,y);ctx.fillStyle="#ff2d78";ctx.fillRect(-p*2,-p,p*2,p*2);ctx.fillRect(0,-p,p*2,p*2);ctx.fillRect(-p*2,p,p*5,p);ctx.fillRect(-p,p*2,p*3,p);ctx.fillRect(0,p*3,p,p);ctx.restore();},
  speed(ctx,x,y,s){const p=s/12;ctx.save();ctx.translate(x,y);ctx.fillStyle="#00ff7f";ctx.fillRect(p,-p*4,p*2,p*4);ctx.fillRect(-p*2,0,p*4,p);ctx.fillRect(-p*3,p,p*3,p*3);ctx.restore();},
  fire(ctx,x,y,s){const p=s/12;ctx.save();ctx.translate(x,y);ctx.fillStyle="#ff9f00";ctx.fillRect(-p,-p*3,p*2,p*3);ctx.fillStyle="#ff2d78";ctx.fillRect(-p*2,0,p*4,p*3);ctx.fillStyle="#ffee00";ctx.fillRect(-p,p,p*2,p);ctx.restore();},
  shield(ctx,x,y,s){const p=s/12;ctx.save();ctx.translate(x,y);ctx.fillStyle="#00f5ff";ctx.fillRect(-p*3,-p*3,p*6,p);ctx.fillRect(-p*3,-p*2,p,p*4);ctx.fillRect(p*2,-p*2,p,p*4);ctx.fillRect(-p*2,p*2,p*4,p);ctx.fillRect(-p,p*3,p*2,p);ctx.restore();}
};

const BASE_SPD=3.5,BASE_FIRE=280,E_SPD=3.5,ITEM_SPD=1.6;
const WAVES=[
  {asteroids:6,enemy1:3,enemy2:0,enemy3:0,interval:1500},
  {asteroids:5,enemy1:4,enemy2:2,enemy3:0,interval:1200},
  {asteroids:4,enemy1:5,enemy2:3,enemy3:4,interval:1000},
  {boss:true}
];

let G={};
function initG(){
  G={
    screen:"start",paused:false,frame:0,score:0,wave:0,waveClearing:false,bossActive:false,
    p:{x:W/2,y:H-70,w:10,h:10,speed:BASE_SPD,lives:3,invincible:0,shield:false,shieldTimer:0,fireRate:BASE_FIRE,lastShot:0,lastSpecial:0,specialCd:5000,speedTimer:0,fireTimer:0},
    bullets:[],eBullets:[],enemies:[],asteroids:[],items:[],particles:[],
    boss:null,spawner:{todo:[],timer:0,interval:1500},stars:genStars()
  };
}
function genStars(){const a=[];for(let i=0;i<120;i++)a.push({x:rnd(0,W),y:rnd(0,H),r:rnd(.5,2),speed:rnd(.2,1.2),bright:rnd(.3,1),col:Math.random()<.15?"#aaf":"#fff"});return a;}

const keys={};
document.addEventListener("keydown",e=>{keys[e.code]=true;if(e.code==="Space")e.preventDefault();if(e.code==="KeyP"&&G.screen==="game")togglePause();if(e.code==="KeyZ"&&G.screen==="game"&&!G.paused)trySpecial();});
document.addEventListener("keyup",e=>{keys[e.code]=false;});

function show(id){document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));document.getElementById(id).classList.add("active");}
function startGame(){initG();show("s-game");G.screen="game";document.getElementById("boss-bar").classList.add("hidden");startWave(0);requestAnimationFrame(loop);}
function goMenu(){renderHS("hs-start");show("s-start");G.screen="start";}
function doGameOver(){
  G.screen="over";
  document.getElementById("fin-sc").textContent=fmt(G.score);
  const msgs=["Buen intento, piloto…","El universo no perdona.","¡Inténtalo de nuevo!","El cosmos te recuerda.","Caíste con honor."];
  document.getElementById("over-msg").textContent=msgs[ri(0,msgs.length-1)];
  if(isHS(G.score)){showNameEntry(G.score,false);}else{renderHS("hs-over");show("s-over");}
}
function doVictory(){
  G.screen="win";document.getElementById("win-sc").textContent=fmt(G.score);
  if(isHS(G.score)){showNameEntry(G.score,true);}else{renderHS("hs-win");show("s-win");}
}
function showNameEntry(score,isWin){
  document.getElementById("ne-sc").textContent=fmt(score);
  document.getElementById("ne-input").value="";
  document.getElementById("s-name").dataset.win=isWin?"1":"0";
  show("s-name");setTimeout(()=>document.getElementById("ne-input").focus(),100);
}
function confirmName(){
  const name=document.getElementById("ne-input").value.trim()||"PILOTO";
  const isWin=document.getElementById("s-name").dataset.win==="1";
  saveHS(name,G.score);
  if(isWin){renderHS("hs-win");show("s-win");}else{renderHS("hs-over");show("s-over");}
}

function startWave(idx){
  const def=WAVES[idx];G.wave=idx+1;updateHUD();
  if(def.boss){spawnBoss();return;}
  const todo=[];
  for(let i=0;i<(def.asteroids||0);i++)todo.push("asteroid");
  for(let i=0;i<(def.enemy1||0);i++)todo.push("enemy1");
  for(let i=0;i<(def.enemy2||0);i++)todo.push("enemy2");
  for(let i=0;i<(def.enemy3||0);i++)todo.push("enemy3");
  shuffle(todo);G.spawner={todo,timer:0,interval:def.interval||1200};G.waveClearing=false;announce("OLEADA "+G.wave);
}
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=ri(0,i);[a[i],a[j]]=[a[j],a[i]];}}
function announce(txt){const el=document.getElementById("wave-msg");el.textContent=txt;el.classList.remove("hidden");setTimeout(()=>el.classList.add("hidden"),2200);}

function spawnAsteroid(){const sz=rnd(24,44);G.asteroids.push({x:rnd(sz,W-sz),y:-sz,size:sz,speed:rnd(1.2,2.8),hp:Math.ceil(sz/12),maxHp:Math.ceil(sz/12),frame:ri(0,360),rotSpeed:rnd(-2,2)});}
function spawnEnemy(type){
  const C={enemy1:{w:28,h:28,hp:2,speed:1.5,fc:.004,score:100,pat:"sine"},enemy2:{w:36,h:36,hp:5,speed:1.0,fc:.008,score:250,pat:"down"},enemy3:{w:26,h:26,hp:3,speed:2.2,fc:.003,score:150,pat:"zigzag"}}[type];
  G.enemies.push({type,x:rnd(C.w,W-C.w),y:-C.h,w:C.w,h:C.h,hp:C.hp,maxHp:C.hp,speed:C.speed,fc:C.fc,score:C.score,pat:C.pat,frame:0,baseX:rnd(C.w,W-C.w),zigDir:1});
}
function spawnBoss(){G.bossActive=true;G.boss={x:W/2,y:-90,targetY:110,w:96,h:72,hp:300,maxHp:300,frame:0,phase:0,shootTimer:0,shootInterval:60,moveDir:1,speed:1,shieldHp:60,shieldMaxHp:60};document.getElementById("boss-bar").classList.remove("hidden");announce("⚠ OMEGA TITAN ⚠");}
function spawnItem(x,y){if(Math.random()>.35)return;G.items.push({x,y,type:["heart","speed","fire","shield"][ri(0,3)],size:20,vy:ITEM_SPD,frame:0});}

function tryShoot(){const now=performance.now(),p=G.p;if(now-p.lastShot<p.fireRate)return;p.lastShot=now;G.bullets.push({x:p.x,y:p.y-p.h/2-4,speed:9,w:4,h:12});if(p.fireRate<BASE_FIRE*.65){G.bullets.push({x:p.x-10,y:p.y-p.h/2,speed:9,w:4,h:12,dx:-.5});G.bullets.push({x:p.x+10,y:p.y-p.h/2,speed:9,w:4,h:12,dx:.5});}}
function trySpecial(){const now=performance.now(),p=G.p;if(now-p.lastSpecial<p.specialCd)return;p.lastSpecial=now;for(let i=-2;i<=2;i++)G.bullets.push({x:p.x,y:p.y-p.h/2,speed:10,w:5,h:14,dx:i*1.3,special:true});addPart(p.x,p.y,12,"#00f5ff");}
function eShoot(e){const dx=G.p.x-e.x,dy=G.p.y-e.y,d=Math.hypot(dx,dy);G.eBullets.push({x:e.x,y:e.y+e.h/2,vx:(dx/d)*E_SPD,vy:(dy/d)*E_SPD,w:6,h:10});}
function bossShoot(){const b=G.boss;const pats=[()=>{for(let i=-2;i<=2;i++)G.eBullets.push({x:b.x+i*14,y:b.y+b.h/2,vx:i*.8,vy:4,w:7,h:12});},()=>{for(let i=0;i<8;i++){const a=(i/8)*Math.PI*2+b.frame*.05;G.eBullets.push({x:b.x,y:b.y,vx:Math.cos(a)*3.5,vy:Math.sin(a)*3.5,w:7,h:7});}},()=>{for(let i=0;i<6;i++)G.eBullets.push({x:rnd(20,W-20),y:b.y+20,vx:0,vy:5,w:6,h:12});}];pats[b.phase===2?ri(0,2):b.phase===1?ri(0,1):0]();}

function applyItem(type){const p=G.p;if(type==="heart")p.lives=Math.min(p.lives+1,5);else if(type==="speed"){p.speed=BASE_SPD*1.65;p.speedTimer=8000;}else if(type==="fire"){p.fireRate=BASE_FIRE*.4;p.fireTimer=8000;}else if(type==="shield"){p.shield=true;p.shieldTimer=6000;}addPart(p.x,p.y,10,iCol(type));updateHUD();}
const iCol=t=>({heart:"#ff2d78",speed:"#00ff7f",fire:"#ff9f00",shield:"#00f5ff"}[t]||"#fff");

function hit(ax,ay,aw,ah,bx,by,bw,bh){return ax-aw/2<bx+bw/2&&ax+aw/2>bx-bw/2&&ay-ah/2<by+bh/2&&ay+ah/2>by-bh/2;}
function checkCol(){
  const p=G.p;
  G.bullets=G.bullets.filter(b=>{let h=false;G.asteroids.forEach(a=>{if(!h&&hit(b.x,b.y,b.w||4,b.h||12,a.x,a.y,a.size,a.size)){h=true;a.hp-=b.special?3:1;if(a.hp<=0){addPart(a.x,a.y,10,"#8b7355");spawnItem(a.x,a.y);G.score+=50;G.asteroids.splice(G.asteroids.indexOf(a),1);}}});return !h;});
  G.bullets=G.bullets.filter(b=>{let h=false;G.enemies.forEach(e=>{if(!h&&hit(b.x,b.y,b.w||4,b.h||12,e.x,e.y,e.w,e.h)){h=true;e.hp-=b.special?4:1;if(e.hp<=0){addPart(e.x,e.y,12,"#bf5fff");spawnItem(e.x,e.y);G.score+=e.score;G.enemies.splice(G.enemies.indexOf(e),1);}}});return !h;});
  if(G.bossActive&&G.boss){const b2=G.boss;G.bullets=G.bullets.filter(bul=>{if(hit(bul.x,bul.y,bul.w||4,bul.h||12,b2.x,b2.y,b2.w,b2.h)){const dmg=bul.special?8:2;if(b2.phase===0){b2.shieldHp-=dmg;addPart(bul.x,bul.y,4,"#00f5ff");if(b2.shieldHp<=0){b2.phase=1;b2.shootInterval=45;announce("¡ESCUDO ROTO!");addPart(b2.x,b2.y,20,"#00f5ff");}}else{b2.hp-=dmg;addPart(bul.x,bul.y,3,"#ff2d78");if(b2.hp/b2.maxHp<.5&&b2.phase<2){b2.phase=2;b2.speed=2;b2.shootInterval=28;announce("⚠ OMEGA FURIOSO ⚠");}if(b2.hp<=0)bossDown();}updateBossHP();return false;}return true;});}
  if(p.invincible<=0){G.eBullets=G.eBullets.filter(b=>{if(hit(b.x,b.y,b.w,b.h,p.x,p.y,p.w,p.h)){hitP();return false;}return true;});}
  if(p.invincible<=0){G.asteroids.forEach(a=>{if(hit(a.x,a.y,a.size,a.size,p.x,p.y,p.w,p.h)){hitP();a.hp=0;addPart(a.x,a.y,8,"#8b7355");}});G.asteroids=G.asteroids.filter(a=>a.hp>0);}
  if(p.invincible<=0){G.enemies.forEach(e=>{if(hit(e.x,e.y,e.w,e.h,p.x,p.y,p.w,p.h)){hitP();e.hp=0;}});G.enemies=G.enemies.filter(e=>e.hp>0);}
  G.items=G.items.filter(it=>{if(hit(it.x,it.y,it.size,it.size,p.x,p.y,p.w,p.h)){applyItem(it.type);return false;}return true;});
}
function hitP(){const p=G.p;if(p.shield){p.shield=false;p.shieldTimer=0;addPart(p.x,p.y,14,"#00f5ff");updateHUD();return;}p.lives--;p.invincible=120;addPart(p.x,p.y,16,"#ff2d78");updateHUD();if(p.lives<=0){setTimeout(doGameOver,500);G.screen="dying";}}
function bossDown(){const b=G.boss;G.score+=5000;for(let i=0;i<30;i++)addPart(b.x+rnd(-40,40),b.y+rnd(-30,30),12,["#ff2d78","#ff9f00","#ffee00","#00f5ff"][ri(0,3)]);G.boss=null;G.bossActive=false;document.getElementById("boss-bar").classList.add("hidden");setTimeout(doVictory,1200);}
function addPart(x,y,n,col){for(let i=0;i<n;i++){const a=rnd(0,Math.PI*2),s=rnd(1,5);G.particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,r:rnd(2,6),life:1,decay:rnd(.03,.07),col});}}

function update(){
  if(G.screen!=="game"||G.paused)return;
  G.frame++;const p=G.p;
  G.stars.forEach(s=>{s.y+=s.speed;if(s.y>H){s.y=0;s.x=rnd(0,W);}});
  if(keys["ArrowLeft"]||keys["KeyA"])p.x-=p.speed;if(keys["ArrowRight"]||keys["KeyD"])p.x+=p.speed;if(keys["ArrowUp"]||keys["KeyW"])p.y-=p.speed;if(keys["ArrowDown"]||keys["KeyS"])p.y+=p.speed;
  p.x=clamp(p.x,p.w/2,W-p.w/2);p.y=clamp(p.y,50+p.h/2,H-p.h/2);
  if(keys["Space"])tryShoot();
  if(p.speedTimer>0){p.speedTimer-=16;if(p.speedTimer<=0)p.speed=BASE_SPD;}
  if(p.fireTimer>0){p.fireTimer-=16;if(p.fireTimer<=0)p.fireRate=BASE_FIRE;}
  if(p.shieldTimer>0){p.shieldTimer-=16;if(p.shieldTimer<=0)p.shield=false;}
  if(p.invincible>0)p.invincible--;
  updateHUD();
  if(!G.bossActive&&G.spawner.todo.length>0){G.spawner.timer+=16;if(G.spawner.timer>=G.spawner.interval){G.spawner.timer=0;const type=G.spawner.todo.pop();type==="asteroid"?spawnAsteroid():spawnEnemy(type);}}
  if(!G.bossActive&&G.spawner.todo.length===0&&G.enemies.length===0&&G.asteroids.length===0&&!G.waveClearing){G.waveClearing=true;const next=G.wave;if(next<WAVES.length)setTimeout(()=>startWave(next),2000);}
  G.asteroids.forEach(a=>{a.y+=a.speed;a.frame+=a.rotSpeed||1;});G.asteroids=G.asteroids.filter(a=>a.y<H+60);
  G.enemies.forEach(e=>{e.frame++;e.y+=e.speed;if(e.pat==="sine")e.x=e.baseX+Math.sin(e.frame*.04)*60;if(e.pat==="zigzag"){e.x+=e.speed*e.zigDir*1.5;if(e.x>W-e.w||e.x<e.w)e.zigDir*=-1;}e.x=clamp(e.x,e.w/2,W-e.w/2);if(Math.random()<e.fc)eShoot(e);});G.enemies=G.enemies.filter(e=>e.y<H+60);
  if(G.bossActive&&G.boss){const b=G.boss;b.frame++;if(b.y<b.targetY)b.y+=1.5;b.x+=b.speed*b.moveDir;if(b.x>W-b.w/2-10||b.x<b.w/2+10)b.moveDir*=-1;if(++b.shootTimer>=b.shootInterval){b.shootTimer=0;bossShoot();}}
  G.bullets.forEach(b=>{b.y-=b.speed;if(b.dx)b.x+=b.dx;});G.bullets=G.bullets.filter(b=>b.y>-20&&b.x>-10&&b.x<W+10);
  G.eBullets.forEach(b=>{b.x+=b.vx;b.y+=b.vy;});G.eBullets=G.eBullets.filter(b=>b.y<H+20&&b.x>-20&&b.x<W+20);
  G.items.forEach(it=>{it.y+=it.vy;it.frame++;});G.items=G.items.filter(it=>it.y<H+30);
  G.particles.forEach(pt=>{pt.x+=pt.vx;pt.y+=pt.vy;pt.vy+=.08;pt.life-=pt.decay;});G.particles=G.particles.filter(pt=>pt.life>0);
  if(G.screen==="game")checkCol();
}

function render(){
  ctx.clearRect(0,0,W,H);ctx.fillStyle="#0a0a1a";ctx.fillRect(0,0,W,H);
  const gr=ctx.createRadialGradient(W*.3,H*.2,0,W*.3,H*.2,200);gr.addColorStop(0,"rgba(50,0,80,.18)");gr.addColorStop(1,"rgba(0,0,0,0)");ctx.fillStyle=gr;ctx.fillRect(0,0,W,H);
  G.stars.forEach(s=>{ctx.globalAlpha=s.bright;ctx.fillStyle=s.col;ctx.fillRect(Math.floor(s.x),Math.floor(s.y),Math.ceil(s.r),Math.ceil(s.r));});ctx.globalAlpha=1;
  G.asteroids.forEach(a=>SP.asteroid(ctx,a.x,a.y,a.size*2,a.frame));
  G.enemies.forEach(e=>{const fn=SP[e.type];if(fn)fn(ctx,e.x,e.y,e.w*2,e.frame);if(e.hp<e.maxHp){const bw=e.w;ctx.fillStyle="#330000";ctx.fillRect(e.x-bw/2,e.y-e.h/2-6,bw,3);ctx.fillStyle="#ff2d78";ctx.fillRect(e.x-bw/2,e.y-e.h/2-6,bw*(e.hp/e.maxHp),3);}});
  if(G.bossActive&&G.boss){const b=G.boss;SP.boss(ctx,b.x,b.y,b.w,b.frame,b.phase);}
  G.items.forEach(it=>{const fn={heart:SP.heart,speed:SP.speed,fire:SP.fire,shield:SP.shield}[it.type];if(fn){ctx.save();ctx.globalAlpha=.5+.3*Math.sin(it.frame*.15);ctx.shadowColor=iCol(it.type);ctx.shadowBlur=10;fn(ctx,it.x,it.y,it.size*2);ctx.restore();}});
  G.bullets.forEach(b=>SP.bullet(ctx,b.x,b.y,16,b.special?"#ffe600":"#00f5ff"));
  G.eBullets.forEach(b=>SP.eBullet(ctx,b.x,b.y,14));
  const p=G.p;
  if(p.lives>0){
    const blink=p.invincible>0&&Math.floor(G.frame/5)%2===0;
    if(!blink){
      if(p.shield){ctx.save();ctx.globalAlpha=.4+.2*Math.sin(G.frame*.15);ctx.strokeStyle="#00f5ff";ctx.lineWidth=3;ctx.beginPath();ctx.arc(p.x,p.y,p.w,0,Math.PI*2);ctx.stroke();ctx.restore();}
      SP.ship(ctx,p.x,p.y,p.w*2,p.speedTimer>0?"#00ff7f":p.fireTimer>0?"#ff9f00":"#00f5ff",G.frame);
    }
  }
  G.particles.forEach(pt=>{ctx.globalAlpha=pt.life;ctx.fillStyle=pt.col;ctx.fillRect(pt.x-pt.r/2,pt.y-pt.r/2,pt.r,pt.r);});ctx.globalAlpha=1;
}

function updateHUD(){const p=G.p;document.getElementById("hud-score").textContent=fmt(G.score);document.getElementById("hud-wave").textContent=G.wave;document.getElementById("hud-lives").textContent="❤️".repeat(Math.max(0,p.lives));const sp=document.getElementById("pu-sp");const fi=document.getElementById("pu-fi");const sh=document.getElementById("pu-sh");sp.textContent=p.speedTimer>0?"SPEED":"—";sp.className="pu"+(p.speedTimer>0?" sp":"");fi.textContent=p.fireTimer>0?"FIRE":"—";fi.className="pu"+(p.fireTimer>0?" fi":"");sh.textContent=p.shield?"SHIELD":"—";sh.className="pu"+(p.shield?" sh":"");}
function updateBossHP(){const b=G.boss;if(!b)return;document.getElementById("boss-fill").style.width=clamp(b.hp/b.maxHp*100,0,100)+"%";}
function togglePause(){G.paused=!G.paused;document.getElementById("pause-ov").classList.toggle("hidden",!G.paused);if(!G.paused)requestAnimationFrame(loop);}

let lastT=0;
function loop(ts){if(G.screen!=="game"&&G.screen!=="dying")return;if(G.paused)return;lastT=ts;update();render();requestAnimationFrame(loop);}

document.getElementById("btn-start").onclick=startGame;
document.getElementById("btn-retry").onclick=startGame;
document.getElementById("btn-again").onclick=startGame;
document.getElementById("btn-menu-over").onclick=goMenu;
document.getElementById("btn-menu-win").onclick=goMenu;
document.getElementById("btn-resume").onclick=()=>togglePause();
document.getElementById("btn-ne-ok").onclick=confirmName;
document.getElementById("btn-scores").onclick=()=>{renderHS("hs-main");show("s-scores");};
document.getElementById("btn-sc-back").onclick=()=>show("s-start");
document.getElementById("ne-input").addEventListener("keydown",e=>{if(e.key==="Enter")confirmName();});

show("s-start");
renderHS("hs-start"); 
    