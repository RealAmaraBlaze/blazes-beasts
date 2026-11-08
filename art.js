/* Original procedural pixel artwork. Draw on a 480×270 stage; no image assets. */
(function(root){'use strict';
const rect=(c,x,y,w,h,color)=>{c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),w,h);};
function poly(c,points,color){c.fillStyle=color;const ys=points.map(p=>p[1]);for(let y=Math.floor(Math.min(...ys));y<Math.ceil(Math.max(...ys));y++){const hits=[];for(let i=0;i<points.length;i++){const a=points[i],b=points[(i+1)%points.length];if((a[1]<=y+.5&&b[1]>y+.5)||(b[1]<=y+.5&&a[1]>y+.5))hits.push(a[0]+(y+.5-a[1])*(b[0]-a[0])/(b[1]-a[1]));}hits.sort((a,b)=>a-b);for(let i=0;i+1<hits.length;i+=2)c.fillRect(Math.floor(hits[i]),y,Math.ceil(hits[i+1])-Math.floor(hits[i]),1);}}
/* Owner-approved original chunky creature style. V2 retained only as review PNG. */
function rawBeast(c,b,x,y,scale=2,face=1,time=0,pose={}){c.save();c.translate(Math.round(x),Math.round(y));c.scale(scale*face,scale);const bob=pose.y>0?0:Math.floor(Math.sin(time*5)*1.1);c.translate(pose.flash>0&&!pose.reduced?-1:0,bob);const main=b.color,shade=b.dark,hi=b.accent,outline='#242139';const attack=pose.attack;const swing=attack&&attack.t>=attack.wind&&attack.t<attack.wind+attack.active;const wind=attack&&attack.t<attack.wind&&attack.type!=='light';const step=pose.walk?Math.round(Math.sin(time*16)*2):0;
 if(wind){rect(c,-21,-37,42,2,hi);rect(c,-24,-33,2,22,hi);rect(c,23,-33,2,22,hi);}
 if(b.shape==='fox'){poly(c,[[-12,-9],[-30,-10],[-36,-23],[-29,-30],[-24,-20],[-10,-19]],outline);poly(c,[[-13,-11],[-29,-12],[-33,-23],[-29,-26],[-23,-18],[-10,-17]],shade);rect(c,-32,-25,5,6,hi);poly(c,[[-15,-18],[-12,-32],[-8,-40],[-1,-31],[9,-35],[13,-24],[17,-14],[12,-5],[-10,-5]],outline);poly(c,[[-12,-18],[-10,-30],[-7,-35],[-2,-27],[8,-31],[10,-22],[14,-14],[10,-7],[-9,-7]],main);rect(c,-6,-30,3,6,hi);rect(c,-7,-17,19,9,hi);}
 if(b.shape==='turtle'){poly(c,[[-24,-10],[-23,-25],[-14,-34],[2,-36],[17,-27],[21,-10]],outline);poly(c,[[-21,-12],[-20,-25],[-12,-31],[2,-33],[14,-26],[18,-12]],shade);poly(c,[[-14,-23],[-8,-30],[1,-28],[5,-20],[-3,-15]],main);rect(c,5,-25,8,9,main);rect(c,-18,-18,8,7,main);rect(c,10,-24,14,18,outline);rect(c,12,-22,11,14,main);rect(c,13,-12,10,5,hi);poly(c,[[-14,-32],[-18,-42],[-9,-39],[-5,-33]],hi);}
 if(b.shape==='moth'){poly(c,[[-6,-20],[-25,-37],[-32,-31],[-29,-13],[-21,-5],[-5,-10]],outline);poly(c,[[-6,-21],[-24,-33],[-28,-29],[-25,-14],[-20,-9],[-5,-12]],shade);poly(c,[[4,-21],[23,-38],[30,-31],[27,-13],[19,-6],[3,-11]],outline);poly(c,[[5,-21],[23,-34],[27,-29],[23,-15],[18,-10],[4,-13]],main);rect(c,-25,-27,7,8,hi);rect(c,18,-29,6,8,hi);rect(c,-9,-30,20,25,outline);rect(c,-7,-28,16,21,main);rect(c,-3,-16,9,9,hi);rect(c,-5,-37,2,9,hi);rect(c,6,-38,2,10,hi);rect(c,-8,-39,6,4,hi);rect(c,5,-40,6,4,hi);}
 if(b.shape==='fin'){poly(c,[[-12,-9],[-29,-7],[-34,-14],[-29,-20],[-19,-19],[-11,-24]],outline);poly(c,[[-12,-11],[-28,-10],[-30,-14],[-27,-17],[-16,-16],[-10,-21]],shade);poly(c,[[-14,-13],[-14,-28],[-8,-34],[10,-34],[17,-27],[17,-12],[9,-5],[-7,-5]],outline);rect(c,-12,-28,26,18,main);rect(c,-8,-32,18,25,main);rect(c,-5,-15,16,8,hi);for(let side of [-1,1]){poly(c,[[side*11,-27],[side*23,-32],[side*20,-25],[side*25,-21],[side*13,-18]],hi);}rect(c,-2,-40,4,8,shade);rect(c,2,-38,5,6,hi);}
 if(b.shape==='ram'){rect(c,-22,-28,36,23,outline);rect(c,-19,-26,31,18,shade);rect(c,-16,-24,25,14,main);rect(c,-4,-33,23,22,outline);rect(c,-2,-31,19,17,main);poly(c,[[-15,-25],[-24,-34],[-20,-44],[-12,-45],[-6,-37],[-11,-31]],outline);poly(c,[[-15,-28],[-21,-34],[-18,-41],[-14,-41],[-10,-37],[-14,-33]],hi);poly(c,[[12,-29],[11,-41],[18,-45],[25,-40],[25,-33],[20,-29]],outline);poly(c,[[15,-30],[14,-39],[18,-41],[22,-38],[22,-34],[19,-31]],hi);rect(c,-13,-32,5,7,hi);rect(c,-20,-17,5,7,hi);}
 if(b.shape==='hare'){poly(c,[[-14,-5],[-18,-16],[-12,-27],[-9,-35],[-14,-51],[-8,-54],[-2,-36],[3,-38],[6,-55],[13,-54],[11,-33],[16,-26],[16,-14],[10,-5]],outline);poly(c,[[-11,-7],[-15,-16],[-10,-25],[-6,-34],[-10,-50],[-8,-50],[-1,-31],[5,-34],[8,-51],[10,-51],[8,-30],[13,-24],[13,-15],[8,-7]],main);rect(c,-10,-19,19,12,hi);poly(c,[[-13,-10],[-27,-13],[-22,-18],[-30,-22],[-17,-22],[-13,-18]],shade);rect(c,7,-48,2,10,'#ff8acb');}
 // Original readable eyes/feet/glove poses, plus a brief idle blink and one-pixel hit recoil.
 const eyey=b.shape==='turtle'?-20:b.shape==='moth'?-24:-26;const blink=!pose.reduced&&!attack&&!(pose.flash>0)&&time%4.8>4.65;
 rect(c,2,eyey,7,blink?1:5,'#fff7ef');rect(c,6,eyey,3,blink?1:5,'#211d38');rect(c,10,eyey+8,4,2,shade);if(pose.flash>0)rect(c,1,eyey-1,9,2,'#ffffff');
 rect(c,-12,-5+step,9,5,outline);rect(c,-10,-5+step,7,3,shade);rect(c,6,-5-step,10,5,outline);rect(c,8,-5-step,7,3,shade);
 const arm=swing?14:pose.blocking?5:0;rect(c,7+arm,-16,9,8,outline);rect(c,8+arm,-15,8,6,main);rect(c,9+arm,-15,6,2,hi);
 if(pose.blocking){rect(c,20,-30,2,25,'#a7fff3');rect(c,17,-33,3,3,'#a7fff3');rect(c,17,-5,3,3,'#a7fff3');}
 if(swing){poly(c,[[24,-28],[34,-22],[36,-16],[31,-10],[27,-10],[30,-18]],hi);rect(c,28,-24,9,2,hi);rect(c,32,-18,7,2,'#fff7ef');if(attack.type!=='light'){rect(c,26,-30,3,3,hi);rect(c,34,-14,3,3,'#fff7ef');rect(c,30,-10,2,2,hi);}}
 c.restore();}
let sprite=null;
function beast(c,b,x,y,scale=2,face=1,time=0,pose={}){if(!sprite){sprite=document.createElement('canvas');sprite.width=96;sprite.height=96;}const sc=sprite.getContext('2d');sc.clearRect(0,0,96,96);rawBeast(sc,b,48,70,1,1,time,pose);c.save();c.imageSmoothingEnabled=false;c.translate(Math.round(x),Math.round(y));c.scale(face,1);c.drawImage(sprite,-48*scale,-70*scale,96*scale,96*scale);c.restore();}
function star(c,x,y,color,size=4){rect(c,x-1,y-size,2,size*2,color);rect(c,x-size,y-1,size*2,2,color);}
function arena(c,time=0,stage=1,reduced=false){const theme=(stage-1)%3;rect(c,0,0,480,270,['#639be3','#142b37','#301c36'][theme]);rect(c,0,125,480,120,['#87b6d7','#23444c','#49304b'][theme]);rect(c,0,183,480,15,'#201e36');
 // Still stars, skyline and a copper moon, no flashing.
 if(theme!==0)for(let i=0;i<34;i++){const x=(i*89+23)%480,y=(i*47+17)%135;rect(c,x,y,1,i%4===0?2:1,'#9484aa');}if(theme===0){rect(c,363,34,26,26,'#fff0b7');rect(c,359,40,34,14,'#fff0b7');for(let x of [55,170,290]){rect(c,x,56+(x%3)*14,40,7,'#d7e8f0');rect(c,x+8,51+(x%3)*14,22,6,'#d7e8f0');}poly(c,[[0,150],[70,90],[132,153],[214,105],[295,157],[376,109],[480,155],[480,188],[0,188]],'#7d9ec0');}else{rect(c,363,34,34,28,'#c17875');rect(c,358,40,44,16,'#c17875');rect(c,363,40,24,4,'#e6a582');}
 for(let i=0;i<12;i++){let x=i*47-20,h=30+(i*19)%55;rect(c,x,185-h,33,h,theme===0?'#446b87':'#1e2035');rect(c,x+4,185-h+8,3,3,'#837ba0');rect(c,x+18,185-h+18,3,3,'#837ba0');}
 // Oversized original musical equalizer banners.
 for(let x of [35,430]){rect(c,x,93,16,80,'#131a2e');rect(c,x-2,92,20,3,'#e798a9');for(let n=0;n<3;n++)rect(c,x+3+n*4,145-(n%2)*10,2,18+(n%2)*10,'#c37a9f');}
 rect(c,0,197,480,73,'#39334b');rect(c,0,197,480,3,'#ff94c5');rect(c,0,202,480,2,'#805778');for(let i=0;i<12;i++)poly(c,[[240,207],[i*70-200,270],[i*70-199,270]],'#57415b');for(let y of [218,239,266])rect(c,0,y,480,1,'#6d4c67');
 rect(c,40,235,400,3,'#b67a9e');rect(c,40,235,3,11,'#b67a9e');rect(c,437,235,3,11,'#b67a9e');
 c.fillStyle='#d3a6bc';c.font='bold 8px monospace';c.textAlign='center';c.fillText('N E O N   R I N G',240,253);
}
function avatar(c,a,x,y,scale=3,time=0,celebration=false,reduced=false){c.save();c.translate(Math.round(x),Math.round(y));c.scale(scale,scale);
 // Celebration contrast: wink=hand-to-cheek, dance=high arm pump+hop, concert=mic lean. Reduced freezes motion.
 const pose=celebration===true?'dance':celebration;const moving=!!pose&&!reduced;const sway=moving&&pose!=='wink'?Math.round(Math.sin(time*5)*1):0;const hop=pose==='dance'?(reduced?-2:Math.round(Math.abs(Math.sin(time*6))*3)*-1):pose==='concert'?(reduced?0:Math.round(Math.sin(time*3)*1)):-0;c.translate(sway,hop);const skin=a.skin||'#d9a078',hair=a.hair||'#a34e2d',outfit=a.outfit||'#e37cac',eyes=a.eyes||'#468260';
 if(a.tail){poly(c,[[7,-15],[15,-19],[18,-15],[14,-10],[7,-8]],hair);}rect(c,-6,-29,13,16,hair);rect(c,-6,-28,13,9,hair);rect(c,-5,-27,11,10,skin);if(a.ears){poly(c,[[-5,-24],[-10,-27],[-7,-21],[-5,-21]],skin);poly(c,[[6,-24],[11,-27],[8,-21],[6,-21]],skin);}
 rect(c,-6,-30,13,4,hair);rect(c,-6,-28,3,13,hair);rect(c,5,-27,3,12,hair);rect(c,-3,-24,2,2,eyes);rect(c,3,-24,2,(pose==='wink'||(pose&&pose!=='concert'&&Math.sin(time*2)>.7))?1:2,eyes);rect(c,0,-19,3,1,'#a65e64');rect(c,-1,-17,4,3,skin);rect(c,-6,-14,14,12,outfit);rect(c,-4,-13,9,10,pose?'#ef97ba':outfit);
 if(pose){rect(c,-6,-14,3,13,'#a64f3c');rect(c,6,-14,3,13,'#a64f3c');rect(c,-6,-22,1,2,'#f3d481');rect(c,7,-22,1,2,'#f3d481');rect(c,-3,-21,1,1,'#b77a57');rect(c,3,-21,1,1,'#b77a57');}
 // Legs / sneakers first so celebration arms can overlap cleanly.
 rect(c,-5,-2,5,11,'#2a334e');rect(c,3,-2,5,11,'#2a334e');rect(c,-6,8,6,3,'#eee6e1');rect(c,3,8,7,3,'#eee6e1');
 if(pose==='wink'){ // Still-readable: closed eye + hand near cheek (not a tiny eye-only change).
  const bob=moving?Math.round(Math.sin(time*3)*1):0;rect(c,-9,-12,3,10,outfit);rect(c,-9,-3,3,3,skin);rect(c,5,-22+bob,3,8,outfit);rect(c,5,-15+bob,4,3,skin);rect(c,4,-13+bob,2,2,skin);rect(c,8,-24+bob,2,2,'#ef97ba');
 }else if(pose==='dance'){ // Big alternating overhead pump — clear even in a still frame.
  const pump=moving?Math.round(Math.sin(time*5)*3):0;const L=-30+pump,R=-30-pump;rect(c,-11,L,3,16,outfit);rect(c,-11,L-3,3,3,skin);rect(c,10,R,3,16,outfit);rect(c,10,R-3,3,3,skin);rect(c,-12,L-5,5,2,'#ef97ba');rect(c,9,R-5,5,2,'#ef97ba');
 }else if(pose==='concert'){ // Mic held forward toward crowd + slight lean; no partner.
  const lean=moving?Math.round(Math.sin(time*2.5)):1;c.translate(lean,0);rect(c,-10,-12,3,10,outfit);rect(c,-10,-3,3,3,skin);rect(c,8,-20,3,12,outfit);rect(c,8,-9,3,3,skin);rect(c,10,-28,2,10,'#37445e');rect(c,8,-31,6,4,'#c9d8ec');rect(c,9,-32,4,2,'#e8f1ff');rect(c,0,-19,3,2,'#884e57');
 }else{const arm=pose?Math.round(Math.sin(time*4)*3):0;rect(c,-9,-13+arm,3,10,outfit);rect(c,-9,-4+arm,3,3,skin);rect(c,8,-13-arm,3,10,outfit);rect(c,8,-4-arm,3,3,skin);}
 c.restore();}
function heart(c,x,y,fill='#ff82b7',scale=1){c.save();c.translate(x,y);c.scale(scale,scale);poly(c,[[0,3],[3,0],[6,0],[8,2],[10,0],[13,0],[16,3],[16,7],[8,15],[0,7]],fill);c.restore();}
root.BeastArt={beast,arena,avatar,heart,star,rect};
})(typeof window!=='undefined'?window:globalThis);
