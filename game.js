// ═══════════════════════════════════════════════════════════
// DRIFT CITY — game.js
// ═══════════════════════════════════════════════════════════

// ── CAR DATA ──────────────────────────────────────────────
const CARS = [
  { name:'BMW M3',     body:'#1855cc', roof:'#0f3a99', accent:'#ffffff', trim:'#5599ff', gears:6, topSpd:220, accel:90,  handling:1.00, driftFactor:0.88 },
  { name:'SUPRA MK4',  body:'#cc4400', roof:'#992e00', accent:'#ffcc00', trim:'#ff8844', gears:6, topSpd:230, accel:95,  handling:0.95, driftFactor:0.91 },
  { name:'MERCEDES',   body:'#b0b0b0', roof:'#888888', accent:'#222222', trim:'#dddddd', gears:7, topSpd:210, accel:85,  handling:1.05, driftFactor:0.82 },
  { name:'BUGATTI',    body:'#111166', roof:'#080844', accent:'#00ddff', trim:'#4444cc', gears:7, topSpd:340, accel:140, handling:0.78, driftFactor:0.72 },
  { name:'NISSAN GT-R',body:'#dddddd', roof:'#aaaaaa', accent:'#ff2222', trim:'#cccccc', gears:6, topSpd:240, accel:105, handling:0.97, driftFactor:0.89 },
  { name:'LAMBO',      body:'#ddaa00', roof:'#bb8800', accent:'#111111', trim:'#ffcc44', gears:7, topSpd:280, accel:120, handling:0.83, driftFactor:0.80 },
];

// ── HELPERS ───────────────────────────────────────────────
function lighten(hex, a) {
  const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);
  return `rgb(${Math.min(255,r+a)},${Math.min(255,g+a)},${Math.min(255,b+a)})`;
}
function darken(hex, a) { return lighten(hex, -a); }

// ── PIXEL CAR RENDERER ────────────────────────────────────
function drawCar(ctx, car, x, y, ang, sc=1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(ang);
  ctx.scale(sc, sc);
  const W=16, H=30;

  // Body
  ctx.fillStyle = car.body;
  ctx.fillRect(-W/2, -H/2, W, H);

  // Hood highlight
  const hoodGrad = ctx.createLinearGradient(0, -H/2, 0, -H/2 + H*0.35);
  hoodGrad.addColorStop(0, lighten(car.body, 28));
  hoodGrad.addColorStop(1, car.body);
  ctx.fillStyle = hoodGrad;
  ctx.fillRect(-W/2, -H/2, W, Math.round(H*0.35));

  // Roof
  ctx.fillStyle = car.roof;
  ctx.fillRect(-W/2+2, -H/2+7, W-4, Math.round(H*0.44));

  // Windshield
  ctx.fillStyle = 'rgba(150,220,255,0.82)';
  ctx.fillRect(-W/2+3, -H/2+8, W-6, 7);
  // windshield glare
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.fillRect(-W/2+4, -H/2+9, 3, 2);

  // Rear window
  ctx.fillStyle = 'rgba(120,200,255,0.58)';
  ctx.fillRect(-W/2+3, H/2-12, W-6, 5);

  // Headlights — glowing
  ctx.fillStyle = '#ffffaa';
  ctx.fillRect(-W/2+1, -H/2+1, 5, 3);
  ctx.fillRect(W/2-6,  -H/2+1, 5, 3);
  ctx.fillStyle = 'rgba(255,255,160,0.35)';
  ctx.fillRect(-W/2,   -H/2,   5, 5);
  ctx.fillRect(W/2-5,  -H/2,   5, 5);

  // Tail lights
  ctx.fillStyle = '#ff1111';
  ctx.fillRect(-W/2+1, H/2-4, 4, 3);
  ctx.fillRect(W/2-5,  H/2-4, 4, 3);
  ctx.fillStyle = 'rgba(255,0,0,0.3)';
  ctx.fillRect(-W/2,   H/2-5, 5, 5);
  ctx.fillRect(W/2-5,  H/2-5, 5, 5);

  // Accent stripe
  ctx.fillStyle = car.accent + '88';
  ctx.fillRect(-W/2, -2, W, 2);

  // Trim detail
  ctx.fillStyle = car.trim + '55';
  ctx.fillRect(-W/2, -H/2+1, 2, H-2);
  ctx.fillRect(W/2-2, -H/2+1, 2, H-2);

  // Body outline
  ctx.strokeStyle = 'rgba(0,0,0,0.7)';
  ctx.lineWidth = 1;
  ctx.strokeRect(-W/2, -H/2, W, H);

  // Wheels — detailed
  const wheelPos = [[-W/2-4,-H/2+2],[W/2+1,-H/2+2],[-W/2-4,H/2-10],[W/2+1,H/2-10]];
  wheelPos.forEach(([wx,wy]) => {
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(wx, wy, 4, 8);
    ctx.fillStyle = '#333';
    ctx.fillRect(wx+1, wy+1, 2, 6);
    ctx.fillStyle = '#555';
    ctx.fillRect(wx+1, wy+3, 2, 1);
  });

  ctx.restore();
}

// ── CAR SELECT SCREEN ────────────────────────────────────
let selIdx = 0;
const carList = document.getElementById('car-list');
CARS.forEach((c, i) => {
  const card = document.createElement('div');
  card.className = 'car-card' + (i===0?' sel':'');
  const cv = document.createElement('canvas');
  cv.width=52; cv.height=86;
  const cx2 = cv.getContext('2d');
  cx2.imageSmoothingEnabled = false;
  drawCar(cx2, c, 26, 43, 0, 1.7);
  card.appendChild(cv);
  const nm = document.createElement('div');
  nm.className = 'cn'; nm.textContent = c.name; card.appendChild(nm);
  [['SPD',c.topSpd/340],['ACC',c.accel/140],['HND',c.handling],['DFT',c.driftFactor]].forEach(([k,v]) => {
    card.innerHTML += `<div class="sbar-row"><span class="sbar-key">${k}</span><div class="sbar-track"><div class="sbar-fill" style="width:${v*100}%"></div></div></div>`;
  });
  card.addEventListener('click', () => {
    selIdx = i;
    document.querySelectorAll('.car-card').forEach(c=>c.classList.remove('sel'));
    card.classList.add('sel');
  });
  carList.appendChild(card);
});

document.getElementById('start-btn').addEventListener('click', () => {
  document.getElementById('car-select').style.display = 'none';
  document.getElementById('mm-wrap').style.display = 'block';
  startGame(selIdx);
});

// ═══════════════════════════════════════════════════════════
// WORLD — 9600×9600px (300×300 tiles @ 32px) — BIG MAP
// ═══════════════════════════════════════════════════════════
const WORLD = 9600, TILE = 32, COLS = WORLD / TILE; // 300 tiles

let wGrid, buildings, trees, lights, roadMarkings;

const ROAD_COLS  = ['#2e2e2e','#2c2c2c','#303030','#2d2d2d'];
const GRASS_COLS = ['#1e4010','#1c4212','#204011','#1d430f'];
const PAVE_COLS  = ['#525252','#505050','#545454'];
const CURB_COLS  = ['#888','#999','#777'];

function genWorld() {
  wGrid = Array.from({length:COLS}, () => new Uint8Array(COLS));
  buildings=[]; trees=[]; lights=[]; roadMarkings=[];

  // ── Road network: more roads for bigger map
  const primary_h=[], primary_v=[];
  for(let i=12; i<COLS-12; i+=18) primary_h.push(i);
  for(let i=12; i<COLS-12; i+=20) primary_v.push(i);

  const sec_h=[], sec_v=[];
  for(let i=0; i<primary_h.length-1; i++) {
    sec_h.push(Math.floor((primary_h[i]+primary_h[i+1])/2));
    // Extra tertiary roads for denser grid
    sec_h.push(Math.floor((primary_h[i]+primary_h[i+1])/2) - 3);
  }
  for(let i=0; i<primary_v.length-1; i++) {
    sec_v.push(Math.floor((primary_v[i]+primary_v[i+1])/2));
    sec_v.push(Math.floor((primary_v[i]+primary_v[i+1])/2) - 3);
  }

  function paintH(row, w, type=1) {
    for(let x=0;x<COLS;x++) for(let r=0;r<w;r++) if(row+r<COLS) wGrid[row+r][x]=type;
  }
  function paintV(col, w, type=1) {
    for(let y=0;y<COLS;y++) for(let c=0;c<w;c++) if(col+c<COLS) wGrid[y][col+c]=type;
  }

  // Primary: 5 tiles wide
  primary_h.forEach(r => paintH(r, 5));
  primary_v.forEach(c => paintV(c, 5));
  // Secondary: 3 tiles wide
  sec_h.forEach(r => paintH(r, 3));
  sec_v.forEach(c => paintV(c, 3));

  // Pavements adjacent to roads
  for(let y=1;y<COLS-1;y++) for(let x=1;x<COLS-1;x++) {
    if(wGrid[y][x]===0) {
      if(wGrid[y-1][x]===1||wGrid[y+1][x]===1||wGrid[y][x-1]===1||wGrid[y][x+1]===1)
        wGrid[y][x]=3;
    }
  }

  // Road markings (store world positions for center lane dashes)
  primary_h.forEach(r => {
    const cy = (r + 2) * TILE;
    for(let x=0; x<COLS; x+=8) roadMarkings.push({x:x*TILE, y:cy, w:TILE*4, h:3, t:'hl'});
  });
  primary_v.forEach(c => {
    const cx = (c + 2) * TILE;
    for(let y=0; y<COLS; y+=8) roadMarkings.push({x:cx, y:y*TILE, w:3, h:TILE*4, t:'vl'});
  });

  // Buildings — denser city feel
  for(let by=0;by<COLS;by++) for(let bx=0;bx<COLS;bx++) {
    if(wGrid[by][bx]!==0) continue;
    if(Math.random()>0.035) continue;
    const bw=2+Math.floor(Math.random()*7);
    const bh=2+Math.floor(Math.random()*7);
    let ok=true;
    for(let dy=0;dy<bh&&ok;dy++) for(let dx=0;dx<bw&&ok;dx++) {
      const ny=by+dy, nx=bx+dx;
      if(ny>=COLS||nx>=COLS||wGrid[ny][nx]!==0) ok=false;
    }
    if(!ok) continue;
    for(let dy=0;dy<bh;dy++) for(let dx=0;dx<bw;dx++) wGrid[by+dy][bx+dx]=2;
    const hue = Math.random()*360;
    const sat  = 5+Math.random()*15;
    const lgt  = 12+Math.random()*14;
    // some taller buildings
    const floors = 1+Math.floor(Math.random()*12);
    buildings.push({
      x:bx*TILE, y:by*TILE, w:bw*TILE, h:bh*TILE,
      color:`hsl(${hue},${sat}%,${lgt}%)`,
      roofC:`hsl(${hue},${sat+10}%,${lgt+14}%)`,
      accentC:`hsl(${hue},${sat+20}%,${lgt+24}%)`,
      floors,
      winPhase:Math.random()*100,
      hasAntenna: floors>8 && Math.random()>0.5
    });
    if(Math.random()<0.6) lights.push({x:bx*TILE-14, y:by*TILE-14, r:Math.random()>0.5});
  }

  // Trees — more variety
  for(let y=0;y<COLS;y++) for(let x=0;x<COLS;x++) {
    if(wGrid[y][x]===0&&Math.random()<0.012) {
      const species = Math.floor(Math.random()*3); // 0=round, 1=tall, 2=small
      trees.push({x:x*TILE+TILE/2, y:y*TILE+TILE/2, s:0.6+Math.random()*0.8, species});
    }
  }
}

// ═══════════════════════════════════════════════════════════
// RENDERING
// ═══════════════════════════════════════════════════════════
function drawWorld(ctx, cX, cY, W, H) {
  const tx0=Math.max(0,Math.floor(cX/TILE)-1);
  const ty0=Math.max(0,Math.floor(cY/TILE)-1);
  const tx1=Math.min(COLS-1, tx0+Math.ceil(W/TILE)+2);
  const ty1=Math.min(COLS-1, ty0+Math.ceil(H/TILE)+2);

  for(let ty=ty0;ty<=ty1;ty++) {
    for(let tx=tx0;tx<=tx1;tx++) {
      const wx=tx*TILE-cX, wy=ty*TILE-cY;
      const cell=wGrid[ty][tx];
      if(cell===1) {
        // Road base
        ctx.fillStyle = ROAD_COLS[(tx+ty)%4];
        ctx.fillRect(wx,wy,TILE,TILE);
        // Road texture grain
        if((tx*7+ty*11)%13===0){ ctx.fillStyle='rgba(0,0,0,0.08)'; ctx.fillRect(wx+4,wy+5,5,5); }
        if((tx*13+ty*5)%17===0){ ctx.fillStyle='rgba(255,255,255,0.02)'; ctx.fillRect(wx+20,wy+18,4,4); }
      } else if(cell===3) {
        // Pavement / sidewalk
        ctx.fillStyle = PAVE_COLS[(tx+ty*2)%3];
        ctx.fillRect(wx,wy,TILE,TILE);
        // Tile pattern
        if((tx+ty)%2===0){ ctx.fillStyle='rgba(0,0,0,0.06)'; ctx.fillRect(wx,wy,TILE/2,TILE/2); }
        if((tx+ty)%4===0){ ctx.fillStyle='rgba(255,255,255,0.02)'; ctx.fillRect(wx+2,wy+2,5,5); }
      } else if(cell===2) {
        // Building floor tile (handled in building loop below)
      } else {
        // Grass
        ctx.fillStyle = GRASS_COLS[(tx*3+ty*7)%4];
        ctx.fillRect(wx,wy,TILE,TILE);
        // Grass texture
        if((tx*5+ty*11)%9===0){ ctx.fillStyle='rgba(0,0,0,0.12)'; ctx.fillRect(wx+6,wy+8,2,2); }
        if((tx*11+ty*5)%13===0){ ctx.fillStyle='rgba(255,255,255,0.04)'; ctx.fillRect(wx+20,wy+22,2,2); }
        if((tx*17+ty*3)%19===0){ ctx.fillStyle='rgba(0,80,0,0.15)'; ctx.fillRect(wx+12,wy+6,4,3); }
      }
    }
  }

  // Road center markings (dashed yellow)
  ctx.fillStyle = 'rgba(255,240,100,0.18)';
  roadMarkings.forEach(m => {
    const mx=m.x-cX, my=m.y-cY;
    if(mx<-TILE*6||my<-TILE*6||mx>W+TILE*6||my>H+TILE*6) return;
    ctx.fillRect(mx, my, m.w, m.h);
  });

  // Curb edges along roads — drawn on pavement tiles near roads
  // (simple colored pixel row at road/pavement boundary)

  // Buildings
  buildings.forEach(b => {
    const bx=b.x-cX, by=b.y-cY;
    if(bx>W+250||by>H+250||bx+b.w<-250||by+b.h<-250) return;

    // Drop shadow
    ctx.fillStyle='rgba(0,0,0,0.55)';
    ctx.fillRect(bx+12,by+12,b.w,b.h);

    // Main body with gradient feel
    ctx.fillStyle = b.color;
    ctx.fillRect(bx,by,b.w,b.h);

    // Facade gradient (lighter top)
    const fg=ctx.createLinearGradient(bx,by,bx,by+b.h);
    fg.addColorStop(0,'rgba(255,255,255,0.07)');
    fg.addColorStop(0.5,'rgba(0,0,0,0)');
    fg.addColorStop(1,'rgba(0,0,0,0.15)');
    ctx.fillStyle=fg;
    ctx.fillRect(bx,by,b.w,b.h);

    // Floor divisions + windows
    const fh=Math.max(8, b.h/b.floors);
    for(let f=0;f<b.floors;f++) {
      const fy=by+f*fh;
      // Floor line
      ctx.fillStyle='rgba(0,0,0,0.14)';
      ctx.fillRect(bx, fy+fh-1, b.w, 1);
      // Windows
      const wcols=Math.max(1,Math.floor(b.w/13));
      for(let wc=0;wc<wcols;wc++) {
        const lit=((f*13+wc*7+Math.floor(b.winPhase))%5!==0);
        if(lit) {
          ctx.fillStyle='rgba(255,235,150,0.80)';
          ctx.fillRect(bx+4+wc*13, fy+6, 6, 5);
          // window glow
          ctx.fillStyle='rgba(255,235,100,0.12)';
          ctx.fillRect(bx+3+wc*13, fy+5, 8, 7);
        } else {
          ctx.fillStyle='rgba(10,10,20,0.8)';
          ctx.fillRect(bx+4+wc*13, fy+6, 6, 5);
        }
      }
    }

    // Roof
    ctx.fillStyle=b.roofC;
    ctx.fillRect(bx,by,b.w,6);

    // Accent stripe at mid-height (taller buildings)
    if(b.floors>4) {
      ctx.fillStyle=b.accentC+'40';
      ctx.fillRect(bx, by+b.h*0.5-1, b.w, 2);
    }

    // Edge highlights (3D feel)
    ctx.fillStyle='rgba(255,255,255,0.07)';
    ctx.fillRect(bx,by,2,b.h);
    ctx.fillRect(bx,by,b.w,2);
    ctx.fillStyle='rgba(0,0,0,0.25)';
    ctx.fillRect(bx+b.w-2,by+2,2,b.h-2);
    ctx.fillRect(bx+2,by+b.h-2,b.w-2,2);

    // Outline
    ctx.strokeStyle='rgba(0,0,0,0.7)';
    ctx.lineWidth=1;
    ctx.strokeRect(bx,by,b.w,b.h);

    // Antenna on tall buildings
    if(b.hasAntenna) {
      const ax=bx+b.w/2, ay=by;
      ctx.strokeStyle='#555'; ctx.lineWidth=1;
      ctx.beginPath(); ctx.moveTo(ax,ay); ctx.lineTo(ax,ay-18); ctx.stroke();
      ctx.fillStyle='#ff2222';
      ctx.beginPath(); ctx.arc(ax, ay-18, 2.5, 0, Math.PI*2); ctx.fill();
    }
  });

  // Trees — species-aware
  trees.forEach(t => {
    const tx=t.x-cX, ty2=t.y-cY;
    if(tx<-32||ty2<-32||tx>W+32||ty2>H+32) return;
    const s=t.s;
    // Shadow
    ctx.fillStyle='rgba(0,0,0,0.2)';
    ctx.beginPath(); ctx.ellipse(tx+4*s,ty2+14*s, 8*s,4*s, 0,0,Math.PI*2); ctx.fill();
    // Trunk
    ctx.fillStyle='#3a2210';
    ctx.fillRect(tx+5*s, ty2+8*s, 4*s, 12*s);

    if(t.species===0) {
      // Round tree
      ctx.fillStyle='#194918'; ctx.fillRect(tx, ty2+4*s, 16*s, 10*s);
      ctx.fillStyle='#1d5519'; ctx.fillRect(tx+2*s, ty2, 12*s, 8*s);
      ctx.fillStyle='#226020'; ctx.fillRect(tx+4*s, ty2-4*s, 8*s, 7*s);
      ctx.fillStyle='rgba(50,180,50,0.15)'; ctx.fillRect(tx+3*s, ty2-2*s, 5*s, 5*s);
    } else if(t.species===1) {
      // Tall pine
      ctx.fillStyle='#162e16'; ctx.fillRect(tx+2*s, ty2+6*s, 10*s, 10*s);
      ctx.fillStyle='#1a3a18'; ctx.fillRect(tx+3*s, ty2+1*s, 8*s, 8*s);
      ctx.fillStyle='#1e4420'; ctx.fillRect(tx+4*s, ty2-5*s, 6*s, 8*s);
      ctx.fillStyle='#225024'; ctx.fillRect(tx+5*s, ty2-10*s, 4*s, 7*s);
    } else {
      // Small bush
      ctx.fillStyle='#1a4012'; ctx.fillRect(tx+1*s, ty2+6*s, 12*s, 7*s);
      ctx.fillStyle='#1e4c16'; ctx.fillRect(tx+3*s, ty2+2*s, 8*s, 7*s);
    }
  });

  // Lamp posts — improved glow
  lights.forEach(l => {
    const lx=l.x-cX, ly=l.y-cY;
    if(lx<-24||ly<-24||lx>W+24||ly>H+24) return;
    // Post
    ctx.fillStyle='#3a3a4a';
    ctx.fillRect(lx+6,ly+10,2,24);
    // Arm
    ctx.fillStyle='#3a3a4a';
    ctx.fillRect(lx+3, ly+8, 8, 2);
    // Bulb
    ctx.fillStyle= l.r ? '#ffee88' : '#88ddff';
    ctx.fillRect(lx+1,ly+4, 9, 5);
    // Glow
    ctx.fillStyle = l.r ? 'rgba(255,238,136,0.18)' : 'rgba(136,221,255,0.18)';
    ctx.beginPath(); ctx.arc(lx+5.5, ly+6, 14, 0, Math.PI*2); ctx.fill();
  });
}

// ═══════════════════════════════════════════════════════════
// PARTICLES + SKIDS
// ═══════════════════════════════════════════════════════════
let particles=[], skids=[];

function smoke(x,y,vx,vy,rgb='160,150,140',sz=6) {
  for(let i=0;i<3;i++) particles.push({
    x, y,
    vx:vx+(Math.random()-.5)*2.5,
    vy:vy+(Math.random()-.5)*2.5,
    life:1, sz:sz+Math.random()*6, rgb, type:'s'
  });
}
function nitroFX(x,y,ang) {
  for(let i=0;i<8;i++){
    const sp=3+Math.random()*6;
    particles.push({
      x, y,
      vx:-Math.sin(ang)*sp+(Math.random()-.5)*2.5,
      vy: Math.cos(ang)*sp+(Math.random()-.5)*2.5,
      life:1, sz:5+Math.random()*12,
      rgb:Math.random()>.5?'0,207,255':'100,210,255', type:'n'
    });
  }
  // Extra white core burst
  particles.push({x,y,vx:-Math.sin(ang)*8,vy:Math.cos(ang)*8,life:0.8,sz:14,rgb:'200,240,255',type:'n'});
}
function sparks(x,y) {
  for(let i=0;i<6;i++) particles.push({
    x,y,
    vx:(Math.random()-.5)*10, vy:(Math.random()-.5)*10,
    life:1, sz:2+Math.random()*2, rgb:'255,210,60', type:'k'
  });
}
function driftSmoke(x,y,vx,vy) {
  for(let i=0;i<2;i++) particles.push({
    x, y,
    vx:vx+(Math.random()-.5)*3,
    vy:vy+(Math.random()-.5)*3,
    life:1, sz:8+Math.random()*10, rgb:'200,180,155', type:'s'
  });
}

function tickParticles(ctx,cX,cY) {
  particles=particles.filter(p=>p.life>0);
  particles.forEach(p=>{
    p.x+=p.vx; p.y+=p.vy;
    p.vx*=0.91; p.vy*=0.91;
    const decay=p.type==='k'?0.09:0.028;
    p.life-=decay; p.sz*=p.type==='k'?0.86:0.972;
    ctx.beginPath();
    ctx.arc(p.x-cX, p.y-cY, Math.max(0.2,p.sz), 0, Math.PI*2);
    ctx.fillStyle=`rgba(${p.rgb},${Math.max(0,p.life)})`;
    ctx.fill();
  });
}

function addSkid(x,y,w=5) {
  skids.push({x,y,w,life:1});
  if(skids.length>2000) skids.shift();
}
function drawSkids(ctx,cX,cY) {
  skids.forEach(s=>{
    ctx.fillStyle=`rgba(14,8,4,${s.life*0.75})`;
    ctx.fillRect(s.x-cX-s.w/2, s.y-cY-s.w/2, s.w, s.w);
    s.life-=0.0002;
  });
  skids=skids.filter(s=>s.life>0);
}

// ═══════════════════════════════════════════════════════════
// GAME STATE
// ═══════════════════════════════════════════════════════════
let canvas,ctx,mmC,mmX;
let cX=0,cY=0;
let gameRunning=false, lastT=0;
let score=0, driftAcc=0, combo=1, driftTimer=0, drifting=false, flashOp=0;
let nitro=1;
let settings={steer:'wheel',gbox:'manual'};
let totalDist=0;

const car={
  x:WORLD/2, y:WORLD/2,
  vx:0, vy:0,
  angle:0,
  speed:0,
  gear:1,
  rpm:0,
  def:null,
  nitroActive:false
};

const inp={gas:false,brake:false,hbrake:false,nitro:false,left:false,right:false};

let swDragging=false, swStartX=0, swStartAng=0, swVisAng=0;
let steerVal=0;

// ═══════════════════════════════════════════════════════════
// SETTINGS / OPTIONS
// ═══════════════════════════════════════════════════════════
document.getElementById('opts-btn').addEventListener('click',()=>{
  document.getElementById('opts-panel').style.display='block';
});
document.getElementById('opts-close').addEventListener('click',()=>{
  document.getElementById('opts-panel').style.display='none';
  applySettings();
});
document.querySelectorAll('.seg-b').forEach(b=>{
  b.addEventListener('click',()=>{
    const g=b.dataset.g;
    document.querySelectorAll(`.seg-b[data-g="${g}"]`).forEach(x=>x.classList.remove('on'));
    b.classList.add('on');
    settings[g]=b.dataset.v;
    applySettings();
  });
});
function applySettings(){
  const swMode=settings.steer==='wheel';
  document.getElementById('sw-outer').style.display=swMode?'flex':'none';
  document.getElementById('btn-steer').style.display=swMode?'none':'flex';
}

// ═══════════════════════════════════════════════════════════
// MINIMAP (bigger: 140×114)
// ═══════════════════════════════════════════════════════════
const MM_W=140, MM_H=114;
const MM_SC_X=MM_W/WORLD, MM_SC_Y=MM_H/WORLD;
let mmBg=null;

function buildMinimapBg(){
  const oc=document.createElement('canvas');
  oc.width=MM_W; oc.height=MM_H;
  const ox=oc.getContext('2d');
  ox.fillStyle='#06060e';
  ox.fillRect(0,0,MM_W,MM_H);
  // Roads
  for(let ty=0;ty<COLS;ty++) for(let tx=0;tx<COLS;tx++){
    if(wGrid[ty][tx]===1){
      ox.fillStyle='#3a3a3a';
      ox.fillRect(tx*TILE*MM_SC_X, ty*TILE*MM_SC_Y, TILE*MM_SC_X+0.5, TILE*MM_SC_Y+0.5);
    } else if(wGrid[ty][tx]===3){
      ox.fillStyle='#252525';
      ox.fillRect(tx*TILE*MM_SC_X, ty*TILE*MM_SC_Y, TILE*MM_SC_X+0.5, TILE*MM_SC_Y+0.5);
    }
  }
  // Buildings
  buildings.forEach(b=>{
    ox.fillStyle='#555';
    ox.fillRect(b.x*MM_SC_X, b.y*MM_SC_Y, b.w*MM_SC_X+0.5, b.h*MM_SC_Y+0.5);
  });
  mmBg=oc;
  // Update canvas size
  const el=document.getElementById('minimap');
  el.width=MM_W; el.height=MM_H;
}

function drawMinimap(){
  if(!mmBg) return;
  mmX.drawImage(mmBg,0,0);
  // Viewport rect
  const vx=cX*MM_SC_X, vy=cY*MM_SC_Y;
  const vw=canvas.width*MM_SC_X, vh=canvas.height*MM_SC_Y;
  mmX.strokeStyle='rgba(240,180,41,0.4)'; mmX.lineWidth=1;
  mmX.strokeRect(vx,vy,vw,vh);
  // Car dot with glow
  const cx2=car.x*MM_SC_X, cy2=car.y*MM_SC_Y;
  mmX.fillStyle='rgba(240,180,41,0.25)';
  mmX.beginPath(); mmX.arc(cx2,cy2,4,0,Math.PI*2); mmX.fill();
  mmX.fillStyle='#f0b429';
  mmX.beginPath(); mmX.arc(cx2,cy2,2,0,Math.PI*2); mmX.fill();
}

// ═══════════════════════════════════════════════════════════
// HUD UPDATE
// ═══════════════════════════════════════════════════════════
let scorePopupTimer=0;

function updateHUD(){
  const spd=Math.round(car.speed*0.5);
  document.getElementById('spd').textContent=spd;
  // Speed color
  const spdEl=document.getElementById('spd');
  if(spd>200) spdEl.style.color='#ff2d2d';
  else if(spd>120) spdEl.style.color='#f0b429';
  else spdEl.style.color='#fff';

  document.getElementById('gear-num').textContent=car.gear;
  document.getElementById('score-val').textContent=score.toLocaleString();
  document.getElementById('combo-val').textContent=combo>1?`×${combo} COMBO`:'';

  const rf=document.getElementById('rpm-fill');
  const rpmPct=car.rpm*100;
  rf.style.width=rpmPct+'%';
  const rpmColor=car.rpm>.85?'#ff2d2d':car.rpm>.68?'#ff8800':car.rpm>.4?'#f0b429':'#22aa44';
  rf.style.background=rpmColor;
  document.getElementById('rpm-val').textContent=Math.round(car.rpm*8500)+' RPM';

  const nitroPct=Math.round(nitro*100);
  document.getElementById('nitro-fill').style.width=nitroPct+'%';
  document.getElementById('nitro-pct').textContent=nitroPct+'%';

  const dl=document.getElementById('drift-label');
  dl.style.opacity=flashOp;
  if(flashOp>.1){
    dl.textContent=combo>2?`×${combo} DRIFT!`:combo>1?'MEGA DRIFT!':'DRIFT!';
    dl.style.color=combo>3?'#ff8800':combo>1?'#f0b429':'#ff2d2d';
  }
}

// ═══════════════════════════════════════════════════════════
// MAIN LOOP
// ═══════════════════════════════════════════════════════════
function loop(ts){
  if(!gameRunning) return;
  const dt=Math.min((ts-lastT)/1000, 0.05);
  lastT=ts;
  const W=canvas.width, H=canvas.height;

  updatePhysics(dt);

  // Smooth camera follow
  const tcX=car.x-W/2, tcY=car.y-H/2;
  cX+=(tcX-cX)*0.10; cY+=(tcY-cY)*0.10;
  cX=Math.max(0,Math.min(WORLD-W,cX));
  cY=Math.max(0,Math.min(WORLD-H,cY));

  // ── Draw world
  ctx.fillStyle='#0c0c1a'; ctx.fillRect(0,0,W,H);
  drawWorld(ctx,cX,cY,W,H);
  drawSkids(ctx,cX,cY);
  tickParticles(ctx,cX,cY);

  // Car shadow
  ctx.save();
  ctx.translate(car.x-cX+8,car.y-cY+10);
  ctx.rotate(car.angle);
  ctx.fillStyle='rgba(0,0,0,0.35)';
  ctx.beginPath(); ctx.ellipse(0,0,10,16,0,0,Math.PI*2); ctx.fill();
  ctx.restore();

  // Draw car
  drawCar(ctx, car.def, car.x-cX, car.y-cY, car.angle, 1.7);

  // Headlight cone
  if(car.speed>8||inp.gas){
    ctx.save();
    ctx.translate(car.x-cX,car.y-cY);
    ctx.rotate(car.angle);
    const g=ctx.createRadialGradient(0,-30,3,0,-40,100);
    g.addColorStop(0,'rgba(255,255,200,0.28)');
    g.addColorStop(0.5,'rgba(255,255,150,0.07)');
    g.addColorStop(1,'rgba(255,255,150,0)');
    ctx.fillStyle=g;
    ctx.beginPath();
    ctx.moveTo(0,-18);ctx.lineTo(-44,-110);ctx.lineTo(44,-110);
    ctx.closePath();ctx.fill();
    ctx.restore();
  }

  // Taillights glow
  if(inp.brake||car.speed>10){
    ctx.save();
    ctx.translate(car.x-cX,car.y-cY);
    ctx.rotate(car.angle);
    const tg=ctx.createRadialGradient(0,20,1,0,22,18);
    tg.addColorStop(0, inp.brake?'rgba(255,30,30,0.55)':'rgba(255,30,30,0.2)');
    tg.addColorStop(1,'rgba(255,0,0,0)');
    ctx.fillStyle=tg;
    ctx.beginPath();ctx.arc(0,18,18,0,Math.PI*2);ctx.fill();
    ctx.restore();
  }

  // Motion blur at high speed
  if(car.speed>160){
    const alpha=Math.min(0.18,(car.speed-160)/120*0.18);
    ctx.fillStyle=`rgba(0,0,10,${alpha})`;
    ctx.fillRect(0,0,W,H);
    // Speed lines
    if(car.speed>200){
      ctx.save();
      ctx.globalAlpha=Math.min(0.1,(car.speed-200)/100*0.1);
      ctx.strokeStyle='#ffffff';
      ctx.lineWidth=1;
      for(let i=0;i<12;i++){
        const lx=(Math.random()*W)|0, ly=(Math.random()*H)|0;
        ctx.beginPath(); ctx.moveTo(lx,ly); ctx.lineTo(lx+(-Math.sin(car.angle)*24)|0, ly+(Math.cos(car.angle)*24)|0);
        ctx.stroke();
      }
      ctx.restore();
    }
  }

  // Nitro blue overlay
  if(car.nitroActive){
    ctx.fillStyle='rgba(0,180,255,0.05)';
    ctx.fillRect(0,0,W,H);
    // Edge glow
    const ng=ctx.createRadialGradient(W/2,H/2,H*.4,W/2,H/2,H*.9);
    ng.addColorStop(0,'rgba(0,0,0,0)');
    ng.addColorStop(1,'rgba(0,150,255,0.12)');
    ctx.fillStyle=ng; ctx.fillRect(0,0,W,H);
  }

  // CRT scanlines
  ctx.fillStyle='rgba(0,0,0,0.03)';
  for(let y=0;y<H;y+=2) ctx.fillRect(0,y,W,1);

  // Vignette
  const vig=ctx.createRadialGradient(W/2,H/2,H*.2,W/2,H/2,H*.85);
  vig.addColorStop(0,'rgba(0,0,0,0)');
  vig.addColorStop(1,'rgba(0,0,0,0.55)');
  ctx.fillStyle=vig; ctx.fillRect(0,0,W,H);

  updateHUD();
  drawMinimap();
  requestAnimationFrame(loop);
}

// ═══════════════════════════════════════════════════════════
// PHYSICS
// ═══════════════════════════════════════════════════════════
function gearSpeedBand(gear, def){
  const perGear=def.topSpd/def.gears;
  return { lo:perGear*(gear-1)*0.55, hi:perGear*gear };
}

function updatePhysics(dt){
  const def=car.def;

  // ── Steer input
  let si=0;
  if(settings.steer==='wheel'){
    if(!swDragging){
      swVisAng*=0.80;
      document.getElementById('sw-outer').style.transform=`rotate(${swVisAng}deg)`;
      steerVal=swVisAng/150;
    }
    si=steerVal;
  } else {
    if(inp.left)  si=-1;
    if(inp.right) si= 1;
  }
  si=Math.max(-1,Math.min(1,si));

  // ── Auto gearbox
  if(settings.gbox==='auto'){
    const band=gearSpeedBand(car.gear,def);
    if(car.speed>band.hi*0.90 && car.gear<def.gears) car.gear++;
    if(car.speed<band.lo*0.5  && car.gear>1)         car.gear--;
  }

  // ── RPM
  const band=gearSpeedBand(car.gear,def);
  const targetRpm=inp.gas
    ? Math.max(0.2,(car.speed-band.lo)/Math.max(1,band.hi-band.lo))
    : car.speed/Math.max(1,def.topSpd)*0.5;
  car.rpm+=(Math.min(1,targetRpm)-car.rpm)*dt*5;
  car.rpm=Math.max(0,Math.min(1,car.rpm));

  // ── Engine force
  const rpmInBand=(car.speed-band.lo)/Math.max(1,band.hi-band.lo);
  const torqueCurve=Math.max(0.18, 1.0-rpmInBand*0.52);
  const baseForce=def.accel*torqueCurve;

  if(inp.gas){
    car.vx+=Math.sin(car.angle)*baseForce*dt;
    car.vy-=Math.cos(car.angle)*baseForce*dt;
  }

  // ── Brake / Reverse
  if(inp.brake){
    if(car.speed<5){
      car.vx-=Math.sin(car.angle)*38*dt;
      car.vy+=Math.cos(car.angle)*38*dt;
    } else {
      car.vx*=Math.pow(0.10,dt);
      car.vy*=Math.pow(0.10,dt);
      if(car.speed>18) sparks(car.x,car.y);
    }
  }

  // ── Nitro
  car.nitroActive=false;
  if(inp.nitro && nitro>0){
    const nF=200;
    car.vx+=Math.sin(car.angle)*nF*dt;
    car.vy-=Math.cos(car.angle)*nF*dt;
    nitro=Math.max(0, nitro-dt*0.30);
    car.nitroActive=true;
    nitroFX(car.x,car.y,car.angle);
  } else {
    nitro=Math.min(1, nitro+dt*0.10);
  }

  car.speed=Math.hypot(car.vx,car.vy);

  // ── Steering
  if(car.speed>5){
    const steerRate=2.9*def.handling*(1-Math.min(0.65,car.speed/def.topSpd*0.75));
    car.angle+=si*steerRate*dt;
  }

  // ── Drift physics
  const fwX=Math.sin(car.angle), fwY=-Math.cos(car.angle);
  const dotFw=car.vx*fwX+car.vy*fwY;
  const latX=car.vx-dotFw*fwX;
  const latY=car.vy-dotFw*fwY;
  const latSpd=Math.hypot(latX,latY);

  let grip=def.driftFactor;
  if(inp.hbrake) grip=0.06;
  if(inp.brake)  grip*=0.42;

  const lerpRate=Math.min(1,dt*9);
  car.vx-=latX*grip*lerpRate;
  car.vy-=latY*grip*lerpRate;

  // ── Rolling friction
  const rolling=inp.gas?0.989:0.974;
  car.vx*=Math.pow(rolling,dt*60);
  car.vy*=Math.pow(rolling,dt*60);

  // ── Top speed cap
  const topCap=def.topSpd+(car.nitroActive?80:0);
  if(car.speed>topCap){
    car.vx=car.vx/car.speed*topCap;
    car.vy=car.vy/car.speed*topCap;
  }

  car.speed=Math.hypot(car.vx,car.vy);

  // ── Move + world border
  let nx=car.x+car.vx*dt;
  let ny=car.y+car.vy*dt;
  nx=Math.max(80,Math.min(WORLD-80,nx));
  ny=Math.max(80,Math.min(WORLD-80,ny));

  // Building collision (AABB)
  const CR=15;
  let hit=false;
  for(const b of buildings){
    if(nx+CR>b.x && nx-CR<b.x+b.w && ny+CR>b.y && ny-CR<b.y+b.h){
      car.vx*=-0.30; car.vy*=-0.30;
      sparks(car.x,car.y);
      hit=true; break;
    }
  }
  if(!hit){ car.x=nx; car.y=ny; }

  // ── Drift detection + scoring
  drifting=latSpd>22 && car.speed>28;
  if(drifting){
    driftAcc+=latSpd*dt*0.60;
    combo=1+Math.floor(driftAcc/55);
    driftTimer=0.90;
    const sw2=4+Math.min(10,latSpd*0.07);
    addSkid(car.x+(Math.random()-.5)*10, car.y+(Math.random()-.5)*10, sw2);
    if(Math.random()<0.55) driftSmoke(car.x,car.y,-car.vx*.06,-car.vy*.06);
    flashOp=Math.min(1,flashOp+dt*7);
  } else {
    driftTimer-=dt;
    flashOp=Math.max(0,flashOp-dt*4);
    if(driftTimer<=0 && driftAcc>0){
      const earned=Math.round(driftAcc*combo*12);
      score+=earned;
      showScorePopup('+'+earned.toLocaleString());
      driftAcc=0; combo=1;
    }
  }

  // Handbrake smoke
  if(inp.hbrake && car.speed>15 && Math.random()<0.7)
    driftSmoke(car.x,car.y,-car.vx*.12,-car.vy*.12);

  // Exhaust
  if(inp.gas && Math.random()<0.18){
    const ec=car.nitroActive?'0,180,255':'110,105,100';
    smoke(car.x-Math.sin(car.angle)*20, car.y+Math.cos(car.angle)*20,
      -car.vx*.05, -car.vy*.05, ec, car.nitroActive?6:3);
  }

  // Distance tracking
  totalDist+=car.speed*dt;
}

// ── Score popup
function showScorePopup(text){
  const el=document.getElementById('score-popup');
  el.textContent=text;
  el.style.opacity='1';
  el.style.transform='translateX(-50%) translateY(0)';
  clearTimeout(el._t);
  el._t=setTimeout(()=>{
    el.style.opacity='0';
    el.style.transform='translateX(-50%) translateY(-20px)';
  }, 900);
}

// ═══════════════════════════════════════════════════════════
// CONTROLS
// ═══════════════════════════════════════════════════════════
function bindControls(){
  const sw=document.getElementById('sw-outer');

  function swDown(ex){ swDragging=true; swStartX=ex; swStartAng=swVisAng; }
  function swMove(ex){
    if(!swDragging) return;
    const d=ex-swStartX;
    swVisAng=Math.max(-150,Math.min(150,swStartAng+d*0.80));
    sw.style.transform=`rotate(${swVisAng}deg)`;
    steerVal=swVisAng/150;
  }
  function swUp(){ swDragging=false; }

  sw.addEventListener('touchstart', e=>{ e.preventDefault(); swDown(e.touches[0].clientX); },{passive:false});
  sw.addEventListener('touchmove',  e=>{ e.preventDefault(); swMove(e.touches[0].clientX); },{passive:false});
  sw.addEventListener('touchend',   e=>{ e.preventDefault(); swUp(); },{passive:false});
  sw.addEventListener('mousedown',  e=>{ swDown(e.clientX); });
  window.addEventListener('mousemove', e=>{ swMove(e.clientX); });
  window.addEventListener('mouseup',   ()=>{ swUp(); });

  bindBtn('btn-left',   ()=>inp.left=true,   ()=>inp.left=false);
  bindBtn('btn-right',  ()=>inp.right=true,  ()=>inp.right=false);
  bindBtn('btn-gas',    ()=>inp.gas=true,    ()=>inp.gas=false);
  bindBtn('btn-brake',  ()=>inp.brake=true,  ()=>inp.brake=false);
  bindBtn('btn-hbrake', ()=>inp.hbrake=true, ()=>inp.hbrake=false);
  bindBtn('btn-nitro',  ()=>inp.nitro=true,  ()=>inp.nitro=false);

  let guLock=false, gdLock=false;
  const guEl=document.getElementById('gs-up');
  const gdEl=document.getElementById('gs-dn');
  function gearUp(){ if(!guLock){ guLock=true; shiftGear(1); guEl.classList.add('pressed'); setTimeout(()=>{ guLock=false; guEl.classList.remove('pressed'); },150); } }
  function gearDn(){ if(!gdLock){ gdLock=true; shiftGear(-1); gdEl.classList.add('pressed'); setTimeout(()=>{ gdLock=false; gdEl.classList.remove('pressed'); },150); } }
  guEl.addEventListener('touchstart',e=>{ e.preventDefault(); gearUp(); },{passive:false});
  gdEl.addEventListener('touchstart',e=>{ e.preventDefault(); gearDn(); },{passive:false});
  guEl.addEventListener('mousedown', ()=>gearUp());
  gdEl.addEventListener('mousedown', ()=>gearDn());

  window.addEventListener('keydown',e=>{
    if(e.key==='ArrowUp'   ||e.key==='w') inp.gas=true;
    if(e.key==='ArrowDown' ||e.key==='s') inp.brake=true;
    if(e.key==='ArrowLeft' ||e.key==='a'){ inp.left=true;  steerVal=-1; }
    if(e.key==='ArrowRight'||e.key==='d'){ inp.right=true; steerVal=1; }
    if(e.key===' ')     inp.hbrake=true;
    if(e.key==='Shift') inp.nitro=true;
    if(e.key==='e') shiftGear(1);
    if(e.key==='q') shiftGear(-1);
  });
  window.addEventListener('keyup',e=>{
    if(e.key==='ArrowUp'   ||e.key==='w') inp.gas=false;
    if(e.key==='ArrowDown' ||e.key==='s') inp.brake=false;
    if(e.key==='ArrowLeft' ||e.key==='a'){ inp.left=false;  if(!inp.right) steerVal=0; }
    if(e.key==='ArrowRight'||e.key==='d'){ inp.right=false; if(!inp.left)  steerVal=0; }
    if(e.key===' ')     inp.hbrake=false;
    if(e.key==='Shift') inp.nitro=false;
  });
}

function bindBtn(id,dn,up){
  const el=document.getElementById(id);
  if(!el) return;
  el.addEventListener('touchstart',e=>{ e.preventDefault(); dn(); el.classList.add('pressed'); },{passive:false});
  el.addEventListener('touchend',  e=>{ e.preventDefault(); up(); el.classList.remove('pressed'); },{passive:false});
  el.addEventListener('mousedown', ()=>{ dn(); el.classList.add('pressed'); });
  el.addEventListener('mouseup',   ()=>{ up(); el.classList.remove('pressed'); });
  el.addEventListener('mouseleave',()=>{ up(); el.classList.remove('pressed'); });
}

function shiftGear(dir){
  const maxG=car.def?car.def.gears:6;
  car.gear=Math.max(1,Math.min(maxG,car.gear+dir));
}

// ═══════════════════════════════════════════════════════════
// GAME INIT
// ═══════════════════════════════════════════════════════════
function startGame(idx){
  car.def=CARS[idx];
  document.getElementById('carname').textContent=car.def.name;
  car.x=WORLD/2; car.y=WORLD/2;
  car.vx=0; car.vy=0; car.angle=0; car.gear=1;
  score=0; driftAcc=0; combo=1; nitro=1; totalDist=0;

  genWorld();

  canvas=document.getElementById('game');
  canvas.width=window.innerWidth;
  canvas.height=window.innerHeight;
  ctx=canvas.getContext('2d');
  ctx.imageSmoothingEnabled=false;

  mmC=document.getElementById('minimap');
  mmX=mmC.getContext('2d');
  mmX.imageSmoothingEnabled=false;

  buildMinimapBg();
  applySettings();
  bindControls();
  gameRunning=true;
  lastT=performance.now();
  requestAnimationFrame(loop);
}

window.addEventListener('resize',()=>{
  if(!canvas) return;
  canvas.width=window.innerWidth;
  canvas.height=window.innerHeight;
});
