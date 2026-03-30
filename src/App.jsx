import { useState, useEffect, useRef, useCallback } from "react";

// ── palette ──────────────────────────────────────────────────────────────────
const VARIANTS = [
  { wool: "#ffffff", body: "#e8d8c0" },
  { wool: "#f5f0e8", body: "#ddd0bc" },
  { wool: "#fffaf2", body: "#e4d4be" },
  { wool: "#f0ebe0", body: "#d8c8b0" },
];

// ── helpers ───────────────────────────────────────────────────────────────────
function makeSheep(uidRef, numRef) {
  const goRight = Math.random() > 0.5;
  const wi = window.innerWidth;
  const wh = window.innerHeight;
  const v = VARIANTS[Math.floor(Math.random() * VARIANTS.length)];
  const scale = 0.75 + Math.random() * 0.55;       // size variety
  const speed = (0.6 + Math.random() * 1.2) * scale; // bigger = slightly faster
  const id  = ++uidRef.current;
  const num = ++numRef.current;
  return {
    id, num,
    x: goRight ? -130 : wi + 20,
    y: wh * 0.28 + Math.random() * (wh * 0.36),
    speed, goRight, scale,
    wool: v.wool, body: v.body,
  };
}

// ── Sheep component ───────────────────────────────────────────────────────────
function Sheep({ s, onClick }) {
  const w = Math.round(110 * s.scale);
  const h = Math.round(82 * s.scale);
  return (
    <div
      onClick={() => onClick(s.id, s.x + w / 2, s.y + h / 2)}
      style={{
        position: "absolute",
        left: s.x,
        top: s.y,
        width: w,
        height: h,
        transform: s.goRight ? "scaleX(1)" : "scaleX(-1)",
        cursor: "crosshair",
        userSelect: "none",
        filter: "drop-shadow(0 6px 16px rgba(0,0,0,0.55))",
        zIndex: 20,
      }}
    >
      <svg width={w} height={h} viewBox="0 0 110 82">
        {/* ── body wool ── */}
        <ellipse cx="52" cy="46" rx="37" ry="24" fill={s.wool} />
        <circle cx="20" cy="37" r="14" fill={s.wool} />
        <circle cx="34" cy="27" r="15" fill={s.wool} />
        <circle cx="52" cy="23" r="17" fill={s.wool} />
        <circle cx="70" cy="27" r="15" fill={s.wool} />
        <circle cx="83" cy="37" r="13" fill={s.wool} />
        {/* inner wool texture */}
        <ellipse cx="52" cy="40" rx="28" ry="16" fill="rgba(255,255,255,0.35)" />

        {/* ── head ── */}
        <ellipse cx="92" cy="50" rx="15" ry="13" fill={s.body} />
        {/* ear */}
        <ellipse cx="83" cy="41" rx="5" ry="9" fill={s.body} transform="rotate(-28 83 41)" />
        <ellipse cx="83" cy="41" rx="3" ry="6" fill="#e8a0a0" transform="rotate(-28 83 41)" />
        {/* sleepy eye — two curved lines */}
        <path d="M87 48 Q91 44 95 48" stroke="#5a3a3a" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <path d="M88 49 Q91 46 94 49" stroke="#5a3a3a" strokeWidth="1.2" fill="rgba(0,0,0,0.12)" strokeLinecap="round" />
        {/* nose */}
        <ellipse cx="101" cy="53" rx="4.5" ry="3.5" fill="#c49090" />
        <circle cx="99.5" cy="52" r="1.3" fill="#8a4444" />
        <circle cx="102" cy="52" r="1.3" fill="#8a4444" />
        {/* mouth */}
        <path d="M99 55 Q101 57 103 55" stroke="#8a5555" strokeWidth="1.2" fill="none" strokeLinecap="round" />

        {/* ── legs ── */}
        <rect x="26" y="65" width="10" height="17" rx="5" fill={s.body} />
        <rect x="40" y="67" width="10" height="15" rx="5" fill={s.body} />
        <rect x="57" y="67" width="10" height="15" rx="5" fill={s.body} />
        <rect x="71" y="65" width="10" height="17" rx="5" fill={s.body} />
        {/* hooves */}
        <rect x="26" y="79" width="10" height="4" rx="2" fill="#3a3a3a" />
        <rect x="40" y="79" width="10" height="4" rx="2" fill="#3a3a3a" />
        <rect x="57" y="79" width="10" height="4" rx="2" fill="#3a3a3a" />
        <rect x="71" y="79" width="10" height="4" rx="2" fill="#3a3a3a" />

        {/* ── tail ── */}
        <circle cx="12" cy="45" r="8" fill={s.wool} />
        <circle cx="7"  cy="42" r="5" fill={s.wool} />
      </svg>

      {/* ── number badge ── */}
      <div style={{
        position: "absolute",
        top: Math.round(4 * s.scale),
        left: "50%",
        transform: "translateX(-50%)",
        background: "linear-gradient(135deg,#ff5252,#ff9800)",
        color: "#fff",
        fontFamily: "'Fredoka One',cursive",
        fontSize: Math.max(12, Math.round(16 * s.scale)),
        width:  Math.round(30 * s.scale),
        height: Math.round(30 * s.scale),
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 2px 10px rgba(0,0,0,0.5)",
        border: "2px solid rgba(255,255,255,0.85)",
        pointerEvents: "none",
        zIndex: 30,
        lineHeight: 1,
      }}>
        {s.num}
      </div>

      {/* ── floating zzz ── */}
      <div style={{
        position: "absolute",
        top: -24,
        left: "65%",
        fontSize: Math.round(14 * s.scale),
        pointerEvents: "none",
        animation: `zFloat ${1.8 + s.id % 3 * 0.4}s ease-in-out infinite`,
        color: "#a8d8ea",
        textShadow: "0 0 8px #a8d8ea99",
        zIndex: 25,
      }}>💤</div>
    </div>
  );
}

// ── Puff ──────────────────────────────────────────────────────────────────────
function Puff({ x, y, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 700); return () => clearTimeout(t); }, []);
  return (
    <div style={{
      position: "absolute", left: x - 40, top: y - 40,
      fontSize: 44, pointerEvents: "none", zIndex: 110,
      animation: "poof 0.7s forwards",
    }}>💨✨</div>
  );
}

// ── FloatScore ────────────────────────────────────────────────────────────────
function FloatScore({ x, y, pts, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 900); return () => clearTimeout(t); }, []);
  return (
    <div style={{
      position: "absolute", left: x - 20, top: y - 20,
      color: "#ffd700", fontFamily: "'Fredoka One',cursive",
      fontSize: pts > 1 ? 32 : 22, pointerEvents: "none", zIndex: 120,
      textShadow: "0 0 14px #ff9800, 0 2px 4px rgba(0,0,0,0.5)",
      animation: "floatScore 0.9s forwards",
      whiteSpace: "nowrap",
    }}>
      {pts > 1 ? `×${pts} COMBO!` : `+1`}
    </div>
  );
}

// ── Stars (memoised) ──────────────────────────────────────────────────────────
const STARS = Array.from({ length: 90 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 58,
  r: 0.8 + Math.random() * 2.8,
  o: 0.35 + Math.random() * 0.65,
  d: 1.2 + (i % 5) * 0.5,
}));

// ── MAIN GAME ─────────────────────────────────────────────────────────────────
export default function Game() {
  // refs — avoid stale closures in RAF
  const sheepRef   = useRef([]);
  const uidRef     = useRef(0);
  const numRef     = useRef(0);
  const shotsRef   = useRef(30);
  const overRef    = useRef(false);
  const comboRef   = useRef(0);
  const comboTimer = useRef(null);
  const rafRef     = useRef(null);
  const spawnRef   = useRef(null);
  const speedMul   = useRef(1);
  const elapsed    = useRef(0);

  // state — drives render
  const [, forceRender] = useState(0);
  const [puffs,  setPuffs]  = useState([]);
  const [floats, setFloats] = useState([]);
  const [score,  setScore]  = useState(0);
  const [shots,  setShots]  = useState(30);
  const [combo,  setCombo]  = useState(0);
  const [over,   setOver]   = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const tick = useCallback(() => forceRender(n => n + 1), []);

  // ── stop everything ────────────────────────────────────────────────────────
  const stopAll = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    clearInterval(spawnRef.current);
    clearTimeout(comboTimer.current);
  }, []);

  // ── start / restart ────────────────────────────────────────────────────────
  const startGame = useCallback(() => {
    stopAll();
    sheepRef.current = [];
    uidRef.current   = 0;
    numRef.current   = 0;
    shotsRef.current = 30;
    overRef.current  = false;
    comboRef.current = 0;
    speedMul.current = 1;
    elapsed.current  = 0;
    setPuffs([]);
    setFloats([]);
    setScore(0);
    setShots(30);
    setCombo(0);
    setOver(false);
    tick();
  }, [stopAll, tick]);

  // ── RAF movement ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (over) return;
    let last = performance.now();
    const loop = (now) => {
      if (overRef.current) return;
      const dt = Math.min(now - last, 50);
      last = now;
      elapsed.current += dt;
      // ramp speed every 15 s, capped at 2.5×
      speedMul.current = Math.min(2.5, 1 + Math.floor(elapsed.current / 15000) * 0.18);
      const wi = window.innerWidth;
      sheepRef.current = sheepRef.current
        .map(s => ({ ...s, x: s.x + (s.goRight ? 1 : -1) * s.speed * speedMul.current }))
        .filter(s => s.x > -200 && s.x < wi + 200);
      tick();
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [over, tick]);

  // ── Spawn ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (over) return;
    const spawn = () => {
      if (overRef.current) return;
      sheepRef.current = [...sheepRef.current, makeSheep(uidRef, numRef)];
    };
    spawn(); // immediate first
    spawnRef.current = setInterval(spawn, 1800);
    return () => clearInterval(spawnRef.current);
  }, [over]);

  // ── Shoot ──────────────────────────────────────────────────────────────────
  const shoot = useCallback((id, px, py) => {
    if (overRef.current) return;
    sheepRef.current = sheepRef.current.filter(s => s.id !== id);

    // combo logic — reset timer each hit
    clearTimeout(comboTimer.current);
    comboRef.current += 1;
    const c = comboRef.current;
    setCombo(c);
    comboTimer.current = setTimeout(() => { comboRef.current = 0; setCombo(0); }, 1200);

    const pts = c;
    setScore(prev => {
      const next = prev + pts;
      return next;
    });

    setPuffs(p  => [...p,  { id: Date.now() + Math.random(), x: px, y: py }]);
    setFloats(f => [...f,  { id: Date.now() + Math.random() + 1, x: px, y: py - 20, pts: c }]);

    shotsRef.current -= 1;
    setShots(shotsRef.current);

    if (shotsRef.current <= 0) {
      overRef.current = true;
      stopAll();
      setOver(true);
      setFinalScore(prev => prev); // will read from score state
    }
  }, [stopAll]);

  // capture final score separately
  useEffect(() => { if (over) setFinalScore(s => s); }, [over]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@700;800&display=swap');
        *{margin:0;padding:0;box-sizing:border-box}
        body{overflow:hidden;background:#04091e}

        @keyframes zFloat{
          0%,100%{transform:translateY(0) rotate(-6deg);opacity:.9}
          50%{transform:translateY(-12px) rotate(6deg);opacity:.6}
        }
        @keyframes poof{
          0%{transform:scale(.4) rotate(0deg);opacity:1}
          60%{transform:scale(1.8) rotate(15deg);opacity:.75}
          100%{transform:scale(2.6) rotate(25deg);opacity:0}
        }
        @keyframes floatScore{
          0%{transform:translateY(0) scale(1);opacity:1}
          60%{transform:translateY(-45px) scale(1.25);opacity:1}
          100%{transform:translateY(-80px) scale(.9);opacity:0}
        }
        @keyframes moonGlow{
          0%,100%{box-shadow:0 0 45px 22px rgba(255,240,150,.28)}
          50%{box-shadow:0 0 80px 40px rgba(255,240,150,.48)}
        }
        @keyframes twinkle{
          0%{opacity:.12;transform:scale(.7)}
          100%{opacity:1;transform:scale(1.2)}
        }
        @keyframes fadeUp{
          from{opacity:0;transform:translateY(28px) scale(.96)}
          to{opacity:1;transform:translateY(0) scale(1)}
        }
        @keyframes popBounce{
          0%,100%{transform:scale(1) rotate(-3deg)}
          50%{transform:scale(1.12) rotate(3deg)}
        }
        @keyframes shimmer{
          0%,100%{opacity:.7}50%{opacity:1}
        }
        @keyframes comboFlash{
          0%{transform:scale(1)}
          50%{transform:scale(1.3)}
          100%{transform:scale(1)}
        }
        @keyframes grassSway{
          0%,100%{transform:rotate(0deg) scaleY(1)}
          50%{transform:rotate(2deg) scaleY(1.04)}
        }
      `}</style>

      <div style={{
        width:"100vw", height:"100vh", position:"relative", overflow:"hidden",
        background:"linear-gradient(180deg,#04091e 0%,#080e2e 22%,#0d1b4b 44%,#1a2f5a 60%,#253f55 74%,#2e5440 88%,#3a6840 100%)",
        cursor:"crosshair", fontFamily:"'Nunito',sans-serif",
      }}>

        {/* ── stars ── */}
        {STARS.map(s => (
          <div key={s.id} style={{
            position:"absolute", left:s.x+"%", top:s.y+"%",
            width:s.r*2, height:s.r*2, borderRadius:"50%",
            background:`rgba(255,255,255,${s.o})`,
            animation:`twinkle ${s.d}s ease-in-out infinite alternate`,
            pointerEvents:"none",
          }}/>
        ))}

        {/* ── moon ── */}
        <div style={{
          position:"absolute", right:"10%", top:"5%",
          width:100, height:100, borderRadius:"50%",
          background:"radial-gradient(circle at 36% 36%,#fffde8,#ffd740 55%,#e6b800)",
          animation:"moonGlow 3.5s ease-in-out infinite",
          pointerEvents:"none", zIndex:2,
        }}>
          {/* moon craters */}
          <div style={{position:"absolute",top:"22%",left:"55%",width:14,height:14,borderRadius:"50%",background:"rgba(0,0,0,0.06)"}}/>
          <div style={{position:"absolute",top:"55%",left:"30%",width:9,height:9,borderRadius:"50%",background:"rgba(0,0,0,0.07)"}}/>
        </div>

        {/* ── distant hills ── */}
        <svg style={{position:"absolute",bottom:"18%",width:"100%",pointerEvents:"none",zIndex:2}}
          viewBox="0 0 1200 120" preserveAspectRatio="none" height="120">
          <path d="M0,120 C120,40 240,90 360,60 C480,30 600,80 720,50 C840,20 960,70 1080,45 C1140,30 1180,60 1200,55 L1200,120 Z" fill="#1e3d2a" opacity=".85"/>
          <path d="M0,120 C80,70 200,100 320,80 C440,60 560,95 680,72 C800,50 920,85 1040,65 C1120,50 1170,80 1200,72 L1200,120 Z" fill="#254d32" opacity=".9"/>
        </svg>

        {/* ── fence ── */}
        <div style={{position:"absolute",bottom:"19%",width:"100%",pointerEvents:"none",zIndex:6}}>
          <svg width="100%" height="64" viewBox="0 0 1200 64" preserveAspectRatio="none">
            <rect y="12" width="1200" height="10" rx="5" fill="#9b7520"/>
            <rect y="30" width="1200" height="10" rx="5" fill="#8a6418"/>
            {Array.from({length:50},(_,i)=>(
              <g key={i}>
                <rect x={i*24+3} y="0" width="12" height="60" rx="3" fill="#b08428"/>
                <polygon points={`${i*24+9},0 ${i*24+3},8 ${i*24+15},8`} fill="#c99030"/>
              </g>
            ))}
          </svg>
        </div>

        {/* ── ground ── */}
        <div style={{
          position:"absolute", bottom:0, width:"100%", height:"19%",
          background:"linear-gradient(180deg,#3e8050 0%,#2e6038 45%,#1e4628 100%)",
          pointerEvents:"none", zIndex:4,
        }}>
          {/* grass blades */}
          <svg width="100%" height="38" viewBox="0 0 1200 38" preserveAspectRatio="none"
            style={{position:"absolute",top:-20}}>
            {Array.from({length:80},(_,i)=>(
              <ellipse key={i} cx={i*15+7} cy="30" rx="9" ry="16" fill="#3e8050"
                style={{animation:`grassSway ${2+(i%4)*0.3}s ease-in-out infinite`,animationDelay:(i*0.08)+"s",transformOrigin:`${i*15+7}px 38px`}}/>
            ))}
          </svg>
        </div>

        {/* ── fireflies ── */}
        {Array.from({length:12},(_,i)=>(
          <div key={i} style={{
            position:"absolute",
            left:`${10+i*7}%`, top:`${45+Math.sin(i)*15}%`,
            width:5, height:5, borderRadius:"50%",
            background:"#ccff66",
            boxShadow:"0 0 8px 4px rgba(200,255,100,0.7)",
            pointerEvents:"none", zIndex:8,
            animation:`shimmer ${1+i*0.3}s ease-in-out infinite`,
            animationDelay:`${i*0.25}s`,
          }}/>
        ))}

        {/* ── sheep ── */}
        {sheepRef.current.map(s => (
          <Sheep key={s.id} s={s} onClick={shoot}/>
        ))}

        {/* ── puffs ── */}
        {puffs.map(p => (
          <Puff key={p.id} x={p.x} y={p.y} onDone={()=>setPuffs(a=>a.filter(x=>x.id!==p.id))}/>
        ))}

        {/* ── float scores ── */}
        {floats.map(f => (
          <FloatScore key={f.id} x={f.x} y={f.y} pts={f.pts}
            onDone={()=>setFloats(a=>a.filter(x=>x.id!==f.id))}/>
        ))}

        {/* ── HUD top-left ── */}
        <div style={{position:"absolute",top:16,left:16,display:"flex",gap:12,zIndex:60}}>
          {/* score */}
          <div style={{
            background:"rgba(0,0,0,.6)", backdropFilter:"blur(10px)",
            border:"2px solid rgba(255,200,80,.45)", borderRadius:16,
            padding:"8px 20px", textAlign:"center", minWidth:90,
          }}>
            <div style={{fontSize:9,letterSpacing:2.5,color:"#ffd700",textTransform:"uppercase",fontWeight:800}}>Score</div>
            <div style={{fontSize:36,fontFamily:"'Fredoka One',cursive",color:"#ffd700",lineHeight:1.05}}>{score}</div>
          </div>
          {/* shots */}
          <div style={{
            background:"rgba(0,0,0,.6)", backdropFilter:"blur(10px)",
            border:`2px solid ${shots<=5?"rgba(255,60,60,.8)":"rgba(255,200,80,.45)"}`,
            borderRadius:16, padding:"8px 20px", textAlign:"center", minWidth:90,
            transition:"border-color .3s",
          }}>
            <div style={{fontSize:9,letterSpacing:2.5,color:shots<=5?"#ff5252":"#ffd700",textTransform:"uppercase",fontWeight:800}}>Shots</div>
            <div style={{fontSize:36,fontFamily:"'Fredoka One',cursive",color:shots<=5?"#ff5252":"#ffd700",lineHeight:1.05}}>{shots}</div>
          </div>
          {/* combo */}
          {combo>1&&(
            <div style={{
              background:"rgba(255,120,0,.18)", backdropFilter:"blur(10px)",
              border:"2px solid rgba(255,160,0,.7)", borderRadius:16,
              padding:"8px 20px", textAlign:"center", minWidth:90,
              animation:"comboFlash .25s ease",
            }}>
              <div style={{fontSize:9,letterSpacing:2.5,color:"#ff9800",textTransform:"uppercase",fontWeight:800}}>Combo</div>
              <div style={{fontSize:36,fontFamily:"'Fredoka One',cursive",color:"#ff9800",lineHeight:1.05}}>×{combo}</div>
            </div>
          )}
        </div>

        {/* ── title ── */}
        <div style={{
          position:"absolute",top:20,left:"50%",transform:"translateX(-50%)",
          fontFamily:"'Fredoka One',cursive",fontSize:28,
          color:"rgba(255,255,255,.94)",
          textShadow:"0 0 20px rgba(255,200,80,.7), 0 2px 8px rgba(0,0,0,.6)",
          letterSpacing:2, zIndex:60, whiteSpace:"nowrap",
        }}>🐑 Sleepy Sheep Shooter 🌙</div>

        {/* ── speed badge ── */}
        {speedMul.current > 1 && (
          <div style={{
            position:"absolute",top:16,right:16,zIndex:60,
            background:"rgba(255,80,80,.18)",backdropFilter:"blur(8px)",
            border:"2px solid rgba(255,80,80,.5)",borderRadius:12,
            padding:"6px 14px",color:"#ff6b6b",
            fontFamily:"'Fredoka One',cursive",fontSize:16,
            textShadow:"0 0 10px rgba(255,80,80,.7)",
          }}>
            ⚡ {speedMul.current.toFixed(1)}× speed
          </div>
        )}

        {/* ── ammo bar ── */}
        <div style={{
          position:"absolute",bottom:14,left:"50%",transform:"translateX(-50%)",
          display:"flex",gap:5,zIndex:60,flexWrap:"wrap",justifyContent:"center",maxWidth:440,
        }}>
          {Array.from({length:30},(_,i)=>(
            <div key={i} style={{
              width:12,height:12,borderRadius:"50%",
              background: i<shots
                ? (i<5?"#ff5252":"#ffd700")
                : "rgba(255,255,255,.1)",
              boxShadow: i<shots
                ? (i<5?"0 0 8px #ff5252":"0 0 6px #ffd700")
                : "none",
              transition:"all .2s",
            }}/>
          ))}
        </div>

        {/* ── game over overlay ── */}
        {over&&(
          <div style={{
            position:"absolute",inset:0,
            background:"rgba(4,9,30,.9)",backdropFilter:"blur(14px)",
            display:"flex",alignItems:"center",justifyContent:"center",
            zIndex:200,animation:"fadeUp .55s ease",
          }}>
            <div style={{
              textAlign:"center",padding:"50px 70px",
              background:"rgba(255,255,255,.04)",
              border:"2px solid rgba(255,215,0,.35)",
              borderRadius:28,maxWidth:440,
            }}>
              <div style={{fontSize:68,marginBottom:6,animation:"popBounce 1.2s ease-in-out infinite"}}>🌙</div>
              <div style={{
                fontFamily:"'Fredoka One',cursive",fontSize:48,
                color:"#ffd700",
                textShadow:"0 0 24px rgba(255,215,0,.55)",
                marginBottom:4,
              }}>Night's Over!</div>
              <div style={{color:"rgba(255,255,255,.6)",fontSize:15,marginBottom:22}}>
                The meadow is dreaming... 🐑💤
              </div>
              <div style={{
                fontFamily:"'Fredoka One',cursive",fontSize:22,
                color:"rgba(255,255,255,.75)",marginBottom:6,
              }}>Sheep caught</div>
              <div style={{
                fontFamily:"'Fredoka One',cursive",fontSize:72,
                color:"#ffd700",lineHeight:1,
                textShadow:"0 0 30px rgba(255,215,0,.6)",
                marginBottom:28,
              }}>{score}</div>
              <button
                onClick={startGame}
                style={{
                  fontFamily:"'Fredoka One',cursive",fontSize:24,
                  padding:"15px 50px",borderRadius:50,border:"none",
                  background:"linear-gradient(135deg,#ffd700,#ff8c00)",
                  color:"#1a1a2e",cursor:"pointer",
                  boxShadow:"0 6px 24px rgba(255,215,0,.5)",letterSpacing:1,
                  transition:"transform .12s,box-shadow .12s",
                }}
                onMouseEnter={e=>{e.target.style.transform="scale(1.05)";e.target.style.boxShadow="0 8px 30px rgba(255,215,0,.65)";}}
                onMouseLeave={e=>{e.target.style.transform="scale(1)";e.target.style.boxShadow="0 6px 24px rgba(255,215,0,.5)";}}
              >🔁 Play Again</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
