/* Deterministic, renderer-independent combat simulation; also loadable by Node. */
(function(root){
'use strict';
const BEASTS=[
{id:'cinderkip',name:'Cinderkip',title:'THE COPPER COMET',color:'#ffac70',dark:'#ae4f51',accent:'#ffe5a7',shape:'fox',speed:260,hp:100,special:'Comet Skip',desc:'Quick feet. A blazing forward burst.',kind:'dash'},
{id:'mossmellow',name:'Mossmellow',title:'THE GARDEN GUARD',color:'#92deba',dark:'#397d81',accent:'#e2ffad',shape:'turtle',speed:190,hp:120,special:'Root Rumble',desc:'Sturdy shell. A close-range ground pulse.',kind:'pulse'},
{id:'orbituft',name:'Orbituft',title:'THE STARRY DAYDREAM',color:'#b9a4ff',dark:'#65559d',accent:'#ffbce4',shape:'moth',speed:235,hp:95,special:'Stardrop',desc:'Floaty leaps. A drifting star Spark.',kind:'orb'},
{id:'ripplefin',name:'Ripplefin',title:'THE TIDAL TRICKSTER',color:'#7ce0f3',dark:'#367eac',accent:'#ffd1ef',shape:'fin',speed:245,hp:105,special:'Bubble Rush',desc:'Balanced reach. A fast bubble Spark.',kind:'bubble'},
{id:'craggle',name:'Craggle',title:'THE CRYSTAL CAPTAIN',color:'#e4a5c8',dark:'#86628c',accent:'#b5f3ff',shape:'ram',speed:180,hp:125,special:'Crystal Clap',desc:'Heavy paws. A wide crystal ground pulse.',kind:'pulse'},
{id:'voltumble',name:'Voltumble',title:'THE SUNSET SPRINTER',color:'#ffe08b',dark:'#bf715f',accent:'#ff8acb',shape:'hare',speed:280,hp:90,special:'Sunvault',desc:'Fast and light. A rising close-range Spark.',kind:'leap'}
];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
class Match{
 constructor(a=0,b=1){this.ids=[a,b];this.wins=[0,0];this.round=0;this.events=[];this.resetRound();}
 resetRound(){this.round++;this.fighters=this.ids.map((id,i)=>({beast:BEASTS[id],x:i?715:245,y:0,vy:0,face:i?-1:1,hp:BEASTS[id].hp,guard:100,blocking:false,stun:0,cooldown:0,attack:null,flash:0,combo:0}));this.shots=[];this.time=60;this.intro=1.8;this.result=null;this.events=[];}
 emit(type,data={}){this.events.push({type,...data});}
 // Short on-hit cancel: light→heavy, or heavy→special, during active + early recovery.
 canCancel(f,into){const a=f.attack;if(!a||!a.hit)return false;const close=a.wind+a.active+.12;if(a.t<a.wind||a.t>close)return false;if(a.type==='light'&&into==='heavy')return true;if(a.type==='heavy'&&into==='special')return true;return false;}
 startAttack(f,type){const special=type==='special';if(f.stun>0||(special&&f.cooldown>0)||f.blocking)return false;
 if(f.attack){if(!this.canCancel(f,type))return false;this.emit('cancel',{from:f.attack.type,to:type,fighter:this.fighters.indexOf(f)});}
 const moves={light:{wind:.10,active:.10,recover:.19,damage:7,range:91,knock:22},heavy:{wind:.33,active:.14,recover:.34,damage:15,range:125,knock:55},special:{wind:.40,active:.20,recover:.36,damage:17,range:110,knock:65}};
 f.attack={...moves[type],type,t:0,hit:false,fired:false};if(special)f.cooldown=3.5;this.emit('wind',{fighter:this.fighters.indexOf(f),move:type});return true;}
 hit(attacker,target,damage,knock,move='light'){if(target.hp<=0)return;const front=(attacker.x-target.x)*target.face>=0;
 const guarded=target.blocking&&front&&target.guard>0;
 if(guarded){target.hp=Math.max(0,target.hp-damage*.13);target.guard=Math.max(0,target.guard-damage*2.4);target.stun=.08;target.x=clamp(target.x+Math.sign(target.x-attacker.x||1)*knock*.2,55,905);this.emit('guard',{x:target.x,y:target.y});if(target.guard===0){target.blocking=false;target.stun=.6;this.emit('break');}}
 else{target.hp=Math.max(0,target.hp-damage);target.stun=.22+(damage>10?.12:0);target.attack=null;target.blocking=false;target.flash=.16;target.x=clamp(target.x+Math.sign(target.x-attacker.x||attacker.face)*knock,55,905);this.emit('hit',{x:target.x,y:target.y,damage,move});}}
 step(dt,inputs=[{},{}]){dt=clamp(dt,0,.04);this.events=[];if(this.result)return;if(this.intro>0){this.intro-=dt;return;}this.time=Math.max(0,this.time-dt);
 this.fighters.forEach((f,i)=>{const input=inputs[i]||{},other=this.fighters[1-i];f.face=other.x>=f.x?1:-1;f.stun=Math.max(0,f.stun-dt);f.cooldown=Math.max(0,f.cooldown-dt);f.flash=Math.max(0,f.flash-dt);
 f.blocking=!!input.block&&f.y===0&&f.stun===0&&!f.attack&&!input.left&&!input.right&&!input.jump&&f.guard>0;
 if(!f.blocking)f.guard=Math.min(100,f.guard+dt*21);
 const wasAir=f.y>0;
 if(f.stun===0){if(!f.attack&&!f.blocking){f.x+=((input.right?1:0)-(input.left?1:0))*f.beast.speed*dt;if(input.jump&&f.y===0){f.vy=f.beast.shape==='moth'?600:555;f.y=.1;this.emit('jump');}}
 if(input.special)this.startAttack(f,'special');else if(input.heavy)this.startAttack(f,'heavy');else if(input.light)this.startAttack(f,'light');}
 f.vy-=1450*dt;f.y=Math.max(0,f.y+f.vy*dt);if(f.y===0){if(wasAir)this.emit('land',{x:f.x,fighter:i});f.vy=0;}f.x=clamp(f.x,55,905);
 if(f.attack){const a=f.attack;a.t+=dt;if(a.type==='special'&&a.t>=a.wind&&!a.fired){a.fired=true;const kind=f.beast.kind;if(kind==='leap'&&f.y===0){f.vy=480;f.y=.1;}if(kind==='orb'||kind==='bubble'){const sx=f.x+f.face*42,sy=f.y+57;this.shots.push({x:sx,y:sy,v:f.face*(kind==='orb'?330:470),owner:i,life:2,damage:a.damage,kind});this.emit('spark',{x:sx,y:sy,owner:i});}}
 if(a.t>=a.wind&&a.t<a.wind+a.active){if(a.type==='special'&&f.beast.kind==='dash')f.x=clamp(f.x+f.face*610*dt,55,905);
 const ranged=a.type==='special'&&['orb','bubble'].includes(f.beast.kind);const range=a.type==='special'&&f.beast.kind==='pulse'?(f.beast.shape==='ram'?220:190):a.range;const vertical=a.type==='special'&&f.beast.kind==='pulse'?other.y<35:Math.abs(other.y-f.y)<(a.type==='special'&&f.beast.kind==='leap'?150:90);
 if(!ranged&&!a.hit&&Math.abs(other.x-f.x)<range&&vertical&&(other.x-f.x)*f.face>=-10){a.hit=true;this.hit(f,other,a.damage,a.knock,a.type);}}
 if(a.t>=a.wind+a.active+a.recover)f.attack=null;}
 });
 // Physical separation keeps guarding direction and silhouettes readable.
 const [a,b]=this.fighters;if(Math.abs(a.x-b.x)<65&&Math.abs(a.y-b.y)<85){const dir=a.x<=b.x?1:-1,shift=(65-Math.abs(a.x-b.x))/2;a.x=clamp(a.x-shift*dir,55,905);b.x=clamp(b.x+shift*dir,55,905);}
 this.shots=this.shots.filter(s=>{s.x+=s.v*dt;s.life-=dt;const target=this.fighters[1-s.owner];if(Math.abs(s.x-target.x)<38&&Math.abs(s.y-(target.y+55))<58){this.hit(this.fighters[s.owner],target,s.damage,45,'special');return false;}return s.life>0&&s.x>0&&s.x<960;});
 if(a.hp<=0||b.hp<=0||this.time===0){const av=a.hp/a.beast.hp,bv=b.hp/b.beast.hp;const winner=Math.abs(av-bv)<.0001?-1:av>bv?0:1;if(winner>=0)this.wins[winner]++;this.result={winner,complete:this.wins.some(w=>w>=2)};this.emit('round',{winner});}
 }
}
function aiInput(match,level='normal',random=Math.random){const me=match.fighters[1],foe=match.fighters[0],d=Math.abs(me.x-foe.x),toward=foe.x>me.x?'right':'left';const input={};if(me.stun||match.intro>0)return input;const aggression={easy:.018,normal:.035,hard:.055}[level]||.035;
 if(foe.attack&&foe.attack.t<foe.attack.wind&&d<175&&random()<(level==='easy'?.2:.72)){input.block=true;return input;}
 if(d>102)input[toward]=true;if(d<74&&random()<.15)input[toward==='left'?'right':'left']=true;
 if(d<120&&random()<aggression*2.7)input[random()<.62?'light':'heavy']=true;
 if(d>110&&d<430&&me.cooldown===0&&random()<aggression)input.special=true;
 if(match.shots.some(s=>s.owner===0&&Math.abs(s.x-me.x)<170)&&random()<.06)input.jump=true;
 return input;
}
const api={BEASTS,Match,aiInput,clamp};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.BeastEngine=api;
})(typeof window!=='undefined'?window:globalThis);
