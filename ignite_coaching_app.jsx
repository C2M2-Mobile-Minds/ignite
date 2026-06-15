import { useState, useEffect, useRef } from "react";

/* ── Fonts ── */
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@300;400;500;600&family=Barlow+Condensed:wght@300;400;500;700&display=swap";
document.head.appendChild(fontLink);

const css = document.createElement("style");
css.textContent = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
  html, body { background: #000; overflow-x: hidden; }
  ::-webkit-scrollbar { width: 0; }

  @keyframes fadeUp   { from { opacity:0; transform:translateY(22px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
  @keyframes scaleIn  { from { opacity:0; transform:scale(0.93); } to { opacity:1; transform:scale(1); } }
  @keyframes smokeIn  { from { opacity:0; transform:scale(1.08) translateY(10px); } to { opacity:1; transform:scale(1) translateY(0); } }
  @keyframes pulse    { 0%,100%{opacity:.35} 50%{opacity:.7} }
  @keyframes slideUp  { from{transform:translateY(100%);opacity:0} to{transform:translateY(0);opacity:1} }

  .fu  { animation: fadeUp  0.55s cubic-bezier(0.22,1,0.36,1) both; }
  .fi  { animation: fadeIn  0.45s ease both; }
  .si  { animation: scaleIn 0.4s  cubic-bezier(0.22,1,0.36,1) both; }
  .smu { animation: smokeIn 0.7s  cubic-bezier(0.22,1,0.36,1) both; }
  .su  { animation: slideUp 0.45s cubic-bezier(0.22,1,0.36,1) both; }

  input, textarea, button { font-family:'Barlow',sans-serif; }
  input::placeholder, textarea::placeholder { color:#333; }
  input:focus, textarea:focus { outline:none; }

  .ig-btn-primary { transition: background 0.2s, transform 0.1s, box-shadow 0.2s; }
  .ig-btn-primary:hover:not(:disabled) { background: #5a8a4a !important; box-shadow: 0 0 24px rgba(74,120,58,0.4) !important; }
  .ig-btn-primary:active:not(:disabled) { transform: scale(0.98); }
  .ig-btn-primary:disabled { opacity: 0.3; cursor: not-allowed; }

  .ig-option { transition: all 0.18s; }
  .ig-option:hover { border-color: rgba(74,120,58,0.5) !important; background: rgba(74,120,58,0.04) !important; }
  .ig-option:active { transform: scale(0.985); }

  .ig-input { transition: border-color 0.2s, box-shadow 0.2s; }
  .ig-input:focus { border-color: #4a783a !important; box-shadow: 0 0 0 1px rgba(74,120,58,0.2) !important; }

  .ig-tab-active { color:#fff !important; border-bottom-color:#4a783a !important; }
  .numpad-key:hover { background: #111 !important; }
  .numpad-key:active { transform: scale(0.94); }

  /* Smoke texture overlay via SVG filter */
  .smoke-bg::after {
    content:'';
    position:absolute; inset:0;
    background: radial-gradient(ellipse 80% 60% at 50% 55%, rgba(74,120,58,0.18) 0%, rgba(40,70,30,0.08) 45%, transparent 75%);
    pointer-events:none;
  }
`;
document.head.appendChild(css);

/* ── Brand tokens ── */
const BLACK   = "#000000";
const DARK    = "#080808";
const GREEN   = "#4a783a";
const GREEN_L = "#6aaa55";
const GREEN_D = "#2d4e22";
const SMOKE   = "rgba(74,120,58,0.12)";
const BORDER  = "rgba(255,255,255,0.07)";
const BORDER_G= "rgba(74,120,58,0.35)";
const TEXT    = "#f2f2f0";
const MUTED   = "#555";
const MUTED2  = "#888";

/* ── Storage ── */
const S_CLIENTS = "ignite_clients_v1";
const S_TRAINER = "ignite_trainer_v1";
const S_PIN     = "ignite_pin_v1";

const DEFAULT_TRAINER = {
  name: "Ignite Coaching",
  tagline: "Individual Coaching",
  bio: "Transformamos o teu potencial em resultados reais. Programa personalizado, acompanhamento contínuo, evolução garantida.",
  instagram: "@_ignitecoaching_",
  phone: "",
};

function gc()  { try { return JSON.parse(localStorage.getItem(S_CLIENTS)||"[]"); } catch { return []; } }
function sc(v) { localStorage.setItem(S_CLIENTS, JSON.stringify(v)); }
function gt()  { try { return { ...DEFAULT_TRAINER, ...JSON.parse(localStorage.getItem(S_TRAINER)||"{}") }; } catch { return DEFAULT_TRAINER; } }
function st(v) { localStorage.setItem(S_TRAINER, JSON.stringify(v)); }
function gp()  { return localStorage.getItem(S_PIN)||"1234"; }
function sp(v) { localStorage.setItem(S_PIN, v); }

/* ── GOALS ── */
const GOALS = [
  { id:"a", label:"Tonificar e ganhar força" },
  { id:"b", label:"Melhorar a confiança" },
  { id:"c", label:"Perder peso / eliminar gordura" },
  { id:"d", label:"Melhorar saúde e bem-estar" },
  { id:"e", label:"Criar consistência no treino" },
  { id:"f", label:"Aumentar massa muscular" },
];

/* ── Shared UI pieces ── */
function IgniteLogo({ size = 48, style={} }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", ...style }}>
      <div style={{
        fontFamily:"'Bebas Neue',sans-serif",
        fontSize: size,
        color: "#fff",
        letterSpacing:"0.08em",
        lineHeight:1,
        textShadow: `0 0 40px rgba(74,120,58,0.5)`,
      }}>IGNITE</div>
      <div style={{
        fontFamily:"'Barlow Condensed',sans-serif",
        fontSize: size * 0.19,
        fontWeight:300,
        color: GREEN_L,
        letterSpacing:"0.35em",
        textTransform:"uppercase",
        marginTop:3,
      }}>Individual Coaching</div>
    </div>
  );
}

function GreenLine({ style={} }) {
  return <div style={{ height:1, background:`linear-gradient(90deg,transparent,${GREEN},transparent)`, ...style }} />;
}

function Tag({ children }) {
  return (
    <span style={{
      padding:"5px 12px",
      border:`1px solid ${BORDER_G}`,
      color: GREEN_L,
      fontSize:11,
      fontFamily:"'Barlow Condensed',sans-serif",
      letterSpacing:"0.12em",
      textTransform:"uppercase",
    }}>{children}</span>
  );
}

function SectionLabel({ children, style={} }) {
  return (
    <div style={{
      fontFamily:"'Barlow Condensed',sans-serif",
      fontSize:10,
      fontWeight:500,
      letterSpacing:"0.25em",
      textTransform:"uppercase",
      color: GREEN_L,
      ...style,
    }}>{children}</div>
  );
}

function IGInput({ style={}, ...props }) {
  return (
    <input
      className="ig-input"
      style={{
        width:"100%",
        background:"#0d0d0d",
        border:`1px solid ${BORDER}`,
        padding:"15px 16px",
        fontSize:15,
        color: TEXT,
        borderRadius:0,
        fontFamily:"'Barlow',sans-serif",
        fontWeight:300,
        ...style,
      }}
      {...props}
    />
  );
}

function IGTextarea({ style={}, ...props }) {
  return (
    <textarea
      className="ig-input"
      style={{
        width:"100%",
        background:"#0d0d0d",
        border:`1px solid ${BORDER}`,
        padding:"15px 16px",
        fontSize:15,
        color: TEXT,
        borderRadius:0,
        resize:"none",
        lineHeight:1.7,
        fontFamily:"'Barlow',sans-serif",
        fontWeight:300,
        ...style,
      }}
      {...props}
    />
  );
}

function PrimaryBtn({ children, onClick, disabled, style={} }) {
  return (
    <button
      className="ig-btn-primary"
      onClick={onClick}
      disabled={disabled}
      style={{
        width:"100%",
        background: GREEN,
        color:"#fff",
        border:"none",
        padding:"17px 24px",
        fontSize:12,
        fontFamily:"'Barlow Condensed',sans-serif",
        fontWeight:600,
        letterSpacing:"0.22em",
        textTransform:"uppercase",
        borderRadius:0,
        boxShadow:`0 0 0 rgba(74,120,58,0)`,
        ...style,
      }}
    >{children}</button>
  );
}

function GhostBtn({ children, onClick, style={}, danger=false }) {
  return (
    <button
      onClick={onClick}
      style={{
        width:"100%",
        background:"transparent",
        color: danger ? "#8b2020" : MUTED2,
        border:`1px solid ${danger ? "rgba(139,32,32,0.3)" : BORDER}`,
        padding:"16px 24px",
        fontSize:11,
        fontFamily:"'Barlow Condensed',sans-serif",
        fontWeight:500,
        letterSpacing:"0.22em",
        textTransform:"uppercase",
        borderRadius:0,
        transition:"all 0.2s",
        ...style,
      }}
      onMouseEnter={e=>{ e.currentTarget.style.borderColor = danger?"rgba(139,32,32,0.6)":BORDER_G; e.currentTarget.style.color=danger?"#c03030":TEXT; }}
      onMouseLeave={e=>{ e.currentTarget.style.borderColor = danger?"rgba(139,32,32,0.3)":BORDER; e.currentTarget.style.color=danger?"#8b2020":MUTED2; }}
    >{children}</button>
  );
}

/* ── LANDING ── */
function Landing({ trainer, onStart }) {
  return (
    <div style={{ minHeight:"100vh", background:BLACK, display:"flex", flexDirection:"column", maxWidth:480, margin:"0 auto", position:"relative", overflow:"hidden" }}>

      {/* Smoke / green glow background */}
      <div style={{
        position:"absolute",
        top:"18%", left:"50%",
        transform:"translateX(-50%)",
        width:360, height:360,
        borderRadius:"50%",
        background:"radial-gradient(ellipse, rgba(74,120,58,0.22) 0%, rgba(40,80,30,0.1) 45%, transparent 75%)",
        filter:"blur(40px)",
        pointerEvents:"none",
        animation:"pulse 4s ease-in-out infinite",
      }}/>

      <div style={{ flex:1, display:"flex", flexDirection:"column", padding:"0 28px", position:"relative", zIndex:1 }}>

        {/* Logo */}
        <div className="smu" style={{ animationDelay:"0.1s", display:"flex", justifyContent:"center", paddingTop:72 }}>
          <IgniteLogo size={62} />
        </div>

        {/* Divider */}
        <div className="fi" style={{ animationDelay:"0.4s", margin:"36px 0 28px" }}>
          <GreenLine />
        </div>

        {/* Bio */}
        <div className="fu" style={{ animationDelay:"0.5s", textAlign:"center" }}>
          <p style={{
            color:"rgba(242,242,240,0.45)",
            fontSize:14,
            fontFamily:"'Barlow',sans-serif",
            fontWeight:300,
            lineHeight:1.85,
            letterSpacing:"0.03em",
          }}>
            {trainer.bio}
          </p>
        </div>

        {/* Stats */}
        <div className="fu" style={{ animationDelay:"0.6s", display:"flex", marginTop:40, borderTop:`1px solid ${BORDER}`, borderBottom:`1px solid ${BORDER}` }}>
          {[["100+","Clientes"],["5+","Anos"],["∞","Dedicação"]].map(([n,l],i)=>(
            <div key={l} style={{
              flex:1, padding:"22px 0", textAlign:"center",
              borderRight: i<2?`1px solid ${BORDER}`:"none",
            }}>
              <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:28, color: GREEN_L, letterSpacing:"0.05em" }}>{n}</div>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, color:MUTED, letterSpacing:"0.2em", textTransform:"uppercase", marginTop:4 }}>{l}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="fu" style={{ animationDelay:"0.75s", marginTop:44, marginBottom:60 }}>
          <PrimaryBtn onClick={onStart}>Inicia a Tua Transformação</PrimaryBtn>
          <div style={{ display:"flex", justifyContent:"center", marginTop:18, gap:6, alignItems:"center" }}>
            <div style={{ width:16, height:1, background:BORDER }}/>
            <a
              href={`https://instagram.com/${trainer.instagram?.replace("@","")}`}
              target="_blank" rel="noreferrer"
              style={{
                fontFamily:"'Barlow Condensed',sans-serif",
                fontSize:11, color:MUTED, letterSpacing:"0.18em",
                textDecoration:"none", textTransform:"uppercase",
              }}
            >{trainer.instagram}</a>
            <div style={{ width:16, height:1, background:BORDER }}/>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── CLIENT FORM ── */
const TOTAL = 6;
const STEP_LABELS = ["Nome","Instagram","Telemóvel","Objetivos","Local de Treino","Dificuldade"];
const STEP_QUESTIONS = [
  "Qual é o teu nome?",
  "Qual é o teu Instagram?",
  "Qual é o teu telemóvel?",
  "Quais são os teus objetivos?",
  "Onde costumas treinar?",
  "Qual é a tua maior dificuldade?",
];

function ClientForm({ trainer, onBack }) {
  const [step, setStep]     = useState(1);
  const [anim, setAnim]     = useState(0);
  const [done, setDone]     = useState(false);
  const [form, setForm]     = useState({ firstName:"", lastName:"", instagram:"", phone:"", goals:[], location:"", difficulty:"" });

  function advance() { setAnim(a=>a+1); setStep(s=>s+1); }
  function retreat() { if(step===1){ onBack(); return; } setAnim(a=>a+1); setStep(s=>s-1); }

  function toggleGoal(id) {
    setForm(f=>({ ...f, goals: f.goals.includes(id) ? f.goals.filter(g=>g!==id) : [...f.goals,id] }));
  }

  const valid = () => {
    if(step===1) return form.firstName.trim() && form.lastName.trim();
    if(step===2) return form.instagram.trim();
    if(step===3) return form.phone.trim();
    if(step===4) return form.goals.length>0;
    if(step===5) return form.location;
    if(step===6) return form.difficulty.trim();
  };

  function submit() {
    const entry = { ...form, id:Date.now(), submittedAt:new Date().toISOString() };
    const list = gc(); list.unshift(entry); sc(list);
    setDone(true);
  }

  if(done) return (
    <div style={{ minHeight:"100vh", background:BLACK, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"0 28px", maxWidth:480, margin:"0 auto", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", top:"30%", left:"50%", transform:"translateX(-50%)", width:320, height:320, borderRadius:"50%", background:"radial-gradient(ellipse, rgba(74,120,58,0.25) 0%, transparent 70%)", filter:"blur(50px)", animation:"pulse 3s ease-in-out infinite", pointerEvents:"none" }}/>
      <div className="si" style={{ textAlign:"center", position:"relative", zIndex:1, width:"100%" }}>
        <IgniteLogo size={44} style={{ marginBottom:40 }} />
        <GreenLine style={{ marginBottom:32 }} />
        <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:42, color:TEXT, letterSpacing:"0.06em", lineHeight:1.1, marginBottom:12 }}>
          BEM-VINDO,<br/>{form.firstName.toUpperCase()}.
        </div>
        <p style={{ fontFamily:"'Barlow',sans-serif", fontWeight:300, color:"rgba(242,242,240,0.45)", fontSize:14, lineHeight:1.8, marginBottom:40, letterSpacing:"0.02em" }}>
          A tua candidatura foi recebida com sucesso.<br/>Entraremos em contacto em breve.
        </p>
        <GhostBtn onClick={onBack}>Voltar ao Início</GhostBtn>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:BLACK, display:"flex", flexDirection:"column", maxWidth:480, margin:"0 auto" }}>

      {/* Header */}
      <div style={{ padding:"20px 28px 0", flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:24 }}>
          <button onClick={retreat} style={{ background:"none", border:"none", color:MUTED2, fontSize:20, padding:0, lineHeight:1, cursor:"pointer" }}>←</button>
          <IgniteLogo size={22} style={{ flexDirection:"row", gap:8, alignItems:"baseline" }} />
        </div>

        {/* Progress */}
        <div style={{ display:"flex", gap:3, marginBottom:24 }}>
          {Array.from({length:TOTAL}).map((_,i)=>(
            <div key={i} style={{
              flex:1, height:2,
              background: i<step ? GREEN : "#1a1a1a",
              transition:"background 0.35s",
              boxShadow: i<step ? `0 0 6px rgba(74,120,58,0.6)` : "none",
            }}/>
          ))}
        </div>

        <SectionLabel style={{ marginBottom:8 }}>{STEP_LABELS[step-1]} · {step}/{TOTAL}</SectionLabel>
        <h2 key={`q-${anim}`} className="fu" style={{
          fontFamily:"'Bebas Neue',sans-serif",
          fontSize:34, color:TEXT, letterSpacing:"0.05em",
          lineHeight:1.1, marginBottom:28,
        }}>{STEP_QUESTIONS[step-1]}</h2>
      </div>

      {/* Body */}
      <div key={`b-${anim}`} className="fu" style={{ flex:1, padding:"0 28px", overflowY:"auto" }}>

        {step===1 && (
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            <IGInput placeholder="Primeiro nome" value={form.firstName} onChange={e=>setForm(f=>({...f,firstName:e.target.value}))} autoFocus />
            <IGInput placeholder="Último nome"   value={form.lastName}  onChange={e=>setForm(f=>({...f,lastName:e.target.value}))} />
          </div>
        )}

        {step===2 && (
          <div>
            <div style={{ position:"relative" }}>
              <span style={{ position:"absolute", left:16, top:"50%", transform:"translateY(-50%)", color:GREEN_L, fontSize:15, fontFamily:"'Barlow'" }}>@</span>
              <IGInput style={{ paddingLeft:34 }} placeholder="seuinstagram"
                value={form.instagram.replace("@","")}
                onChange={e=>setForm(f=>({...f,instagram:e.target.value?"@"+e.target.value.replace("@",""):""}))}
                autoFocus
              />
            </div>
            <p style={{ fontSize:11, color:MUTED, marginTop:10, letterSpacing:"0.08em", fontFamily:"'Barlow'", lineHeight:1.6 }}>
              Utilizado para acompanhamento e comunicação.
            </p>
          </div>
        )}

        {step===3 && (
          <IGInput placeholder="+351 9XX XXX XXX" type="tel" value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} autoFocus />
        )}

        {step===4 && (
          <div>
            <p style={{ fontSize:11, color:MUTED, marginBottom:18, fontFamily:"'Barlow'", letterSpacing:"0.06em", lineHeight:1.6 }}>
              Escolhe todos os que se aplicam a ti.
            </p>
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              {GOALS.map(g=>{
                const sel = form.goals.includes(g.id);
                return (
                  <button key={g.id} className="ig-option" onClick={()=>toggleGoal(g.id)} style={{
                    display:"flex", alignItems:"center", justifyContent:"space-between",
                    padding:"15px 18px",
                    border: sel ? `1px solid ${GREEN}` : `1px solid ${BORDER}`,
                    background: sel ? "rgba(74,120,58,0.1)" : "#0a0a0a",
                    color: sel ? TEXT : MUTED2,
                    fontFamily:"'Barlow',sans-serif", fontSize:14, fontWeight: sel?500:300,
                    letterSpacing:"0.03em", cursor:"pointer", textAlign:"left",
                    boxShadow: sel ? `inset 0 0 0 1px rgba(74,120,58,0.2), 0 0 12px rgba(74,120,58,0.08)` : "none",
                    transition:"all 0.18s",
                  }}>
                    <span>{g.label}</span>
                    <span style={{
                      width:16, height:16,
                      border:`1px solid ${sel?GREEN:BORDER}`,
                      background: sel?GREEN:"transparent",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:10, color:"#fff", flexShrink:0,
                      transition:"all 0.18s",
                    }}>{sel?"✓":""}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step===5 && (
          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            {[
              { v:"ginásio",  l:"Ginásio",        s:"Acesso a equipamentos completos" },
              { v:"casa",     l:"Casa",            s:"Treino sem ou com pouco equipamento" },
              { v:"ambos",    l:"Ginásio & Casa",  s:"Conforme a disponibilidade do dia" },
              { v:"exterior", l:"Ao Ar Livre",     s:"Parques e espaços exteriores" },
            ].map(opt=>{
              const sel = form.location===opt.v;
              return (
                <button key={opt.v} className="ig-option" onClick={()=>setForm(f=>({...f,location:opt.v}))} style={{
                  display:"flex", alignItems:"center", justifyContent:"space-between",
                  padding:"17px 18px",
                  border: sel?`1px solid ${GREEN}`:`1px solid ${BORDER}`,
                  background: sel?"rgba(74,120,58,0.1)":"#0a0a0a",
                  cursor:"pointer", textAlign:"left",
                  boxShadow: sel?`0 0 12px rgba(74,120,58,0.08)`:"none",
                  transition:"all 0.18s",
                }}>
                  <div>
                    <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:14, color:sel?TEXT:MUTED2, fontWeight:sel?500:300, letterSpacing:"0.03em" }}>{opt.l}</div>
                    <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:11, color:MUTED, marginTop:2 }}>{opt.s}</div>
                  </div>
                  <div style={{
                    width:16, height:16,
                    border:`1px solid ${sel?GREEN:BORDER}`,
                    borderRadius:"50%",
                    background: sel?GREEN:"transparent",
                    transition:"all 0.18s", flexShrink:0,
                  }}/>
                </button>
              );
            })}
          </div>
        )}

        {step===6 && (
          <div>
            <IGTextarea rows={6}
              placeholder="Ex: Falta de motivação, não sei por onde começar, pouco tempo disponível..."
              value={form.difficulty}
              onChange={e=>setForm(f=>({...f,difficulty:e.target.value}))}
              autoFocus
            />
            <p style={{ fontSize:11, color:MUTED, marginTop:10, letterSpacing:"0.06em", fontFamily:"'Barlow'", lineHeight:1.6 }}>
              Esta informação é confidencial e permite-nos personalizar o teu programa de raiz.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ padding:"28px 28px 52px", flexShrink:0 }}>
        {step<TOTAL
          ? <PrimaryBtn onClick={advance} disabled={!valid()}>Continuar</PrimaryBtn>
          : <PrimaryBtn onClick={submit}  disabled={!valid()}>Submeter Candidatura</PrimaryBtn>
        }
      </div>
    </div>
  );
}

/* ── PIN GATE ── */
function PinGate({ onSuccess }) {
  const [entered, setEntered] = useState("");
  const [err,     setErr]     = useState(false);
  const pin = gp();

  function press(d) {
    if(entered.length>=4) return;
    const next = entered+d;
    setEntered(next);
    if(next.length===4){
      if(next===pin){ setTimeout(onSuccess,250); }
      else {
        setTimeout(()=>{ setErr(true); setEntered(""); setTimeout(()=>setErr(false),800); },150);
      }
    }
  }
  function del() { setEntered(e=>e.slice(0,-1)); }

  return (
    <div style={{ minHeight:"100vh", background:BLACK, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", maxWidth:480, margin:"0 auto", padding:"0 28px", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", bottom:"10%", left:"50%", transform:"translateX(-50%)", width:280, height:280, borderRadius:"50%", background:"radial-gradient(ellipse, rgba(74,120,58,0.14) 0%, transparent 70%)", filter:"blur(40px)", pointerEvents:"none" }}/>

      <div className="fu" style={{ textAlign:"center", width:"100%", maxWidth:280, position:"relative", zIndex:1 }}>
        <IgniteLogo size={44} style={{ marginBottom:44 }} />
        <GreenLine style={{ marginBottom:36 }} />
        <SectionLabel style={{ textAlign:"center", marginBottom:28 }}>Área Restrita — Editor</SectionLabel>

        {/* Dots */}
        <div style={{ display:"flex", justifyContent:"center", gap:18, marginBottom:40 }}>
          {[0,1,2,3].map(i=>(
            <div key={i} style={{
              width:10, height:10, borderRadius:"50%",
              border:`1px solid ${err ? "#8b2020" : i<entered.length ? GREEN : BORDER}`,
              background: i<entered.length ? (err?"#8b2020":GREEN) : "transparent",
              transition:"all 0.15s",
              boxShadow: i<entered.length&&!err ? `0 0 8px rgba(74,120,58,0.5)` : "none",
            }}/>
          ))}
        </div>

        {/* Numpad */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
          {[1,2,3,4,5,6,7,8,9,"",0,"⌫"].map((d,i)=>(
            d==="" ? <div key={i}/> :
            <button key={i} className="numpad-key" onClick={()=>d==="⌫"?del():press(String(d))} style={{
              height:52, background:"#0c0c0c",
              border:`1px solid ${BORDER}`,
              color: d==="⌫" ? MUTED : TEXT,
              fontSize: d==="⌫" ? 16 : 20,
              fontFamily: d==="⌫"?"'Barlow',sans-serif":"'Bebas Neue',sans-serif",
              letterSpacing:"0.05em",
              cursor:"pointer", transition:"background 0.15s, transform 0.1s",
              borderRadius:0,
            }}>{d}</button>
          ))}
        </div>
        <p style={{ fontSize:10, color:"#222", marginTop:20, letterSpacing:"0.12em", fontFamily:"'Barlow Condensed'" }}>
          PIN padrão: 1234
        </p>
      </div>
    </div>
  );
}

/* ── EDITOR DASHBOARD ── */
function Editor({ trainer, setTrainer, onExit }) {
  const [clients, setClients] = useState(gc());
  const [tab,     setTab]     = useState("clients");
  const [sel,     setSel]     = useState(null);
  const [editT,   setEditT]   = useState({...trainer});
  const [newPin,  setNewPin]  = useState("");
  const [saved,   setSaved]   = useState(false);

  function delClient(id) {
    if(!confirm("Eliminar este cliente?")) return;
    const u = clients.filter(c=>c.id!==id);
    sc(u); setClients(u); setSel(null);
  }

  function saveProfile() {
    st(editT); setTrainer(editT);
    if(newPin.length===4) sp(newPin);
    setSaved(true); setTimeout(()=>setSaved(false),2000);
  }

  /* Client detail */
  if(sel) {
    const c = sel;
    const goalLabels = c.goals?.map(id=>GOALS.find(g=>g.id===id)?.label).filter(Boolean)||[];
    return (
      <div style={{ minHeight:"100vh", background:BLACK, display:"flex", flexDirection:"column", maxWidth:480, margin:"0 auto" }}>
        <div style={{ padding:"20px 28px", display:"flex", alignItems:"center", gap:14, borderBottom:`1px solid ${BORDER}` }}>
          <button onClick={()=>setSel(null)} style={{ background:"none", border:"none", color:MUTED2, fontSize:20, cursor:"pointer", padding:0, lineHeight:1 }}>←</button>
          <div>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:22, color:TEXT, letterSpacing:"0.06em" }}>{c.firstName} {c.lastName}</div>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, color:MUTED, letterSpacing:"0.15em", textTransform:"uppercase" }}>
              {new Date(c.submittedAt).toLocaleDateString("pt-PT",{day:"numeric",month:"long",year:"numeric"})}
            </div>
          </div>
        </div>
        <div style={{ flex:1, padding:"24px 28px", overflowY:"auto", display:"flex", flexDirection:"column", gap:0 }}>
          {[["Instagram",c.instagram],["Telemóvel",c.phone],["Local de treino",c.location]].map(([l,v])=>(
            <div key={l} style={{ padding:"16px 0", borderBottom:`1px solid ${BORDER}` }}>
              <SectionLabel style={{ marginBottom:6 }}>{l}</SectionLabel>
              <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:14, color:"rgba(242,242,240,0.6)", fontWeight:300 }}>{v||"—"}</div>
            </div>
          ))}
          <div style={{ padding:"16px 0", borderBottom:`1px solid ${BORDER}` }}>
            <SectionLabel style={{ marginBottom:12 }}>Objetivos</SectionLabel>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {goalLabels.map(g=><Tag key={g}>{g}</Tag>)}
            </div>
          </div>
          <div style={{ padding:"16px 0", borderBottom:`1px solid ${BORDER}` }}>
            <SectionLabel style={{ marginBottom:10 }}>Maior dificuldade</SectionLabel>
            <p style={{ fontFamily:"'Barlow',sans-serif", fontSize:14, color:"rgba(242,242,240,0.5)", lineHeight:1.75, fontWeight:300 }}>{c.difficulty}</p>
          </div>
          <div style={{ display:"flex", gap:8, marginTop:24 }}>
            {c.phone && (
              <a href={`https://wa.me/${c.phone.replace(/[\s\-\+]/g,"")}`} target="_blank" rel="noreferrer"
                style={{ flex:1, padding:"14px", border:`1px solid rgba(37,211,102,0.25)`, color:"#25d366", textDecoration:"none", textAlign:"center", fontSize:10, letterSpacing:"0.2em", textTransform:"uppercase", fontFamily:"'Barlow Condensed'", fontWeight:500 }}>
                WhatsApp
              </a>
            )}
            {c.instagram && (
              <a href={`https://instagram.com/${c.instagram.replace("@","")}`} target="_blank" rel="noreferrer"
                style={{ flex:1, padding:"14px", border:`1px solid rgba(225,48,108,0.25)`, color:"#e1306c", textDecoration:"none", textAlign:"center", fontSize:10, letterSpacing:"0.2em", textTransform:"uppercase", fontFamily:"'Barlow Condensed'", fontWeight:500 }}>
                Instagram
              </a>
            )}
          </div>
          <div style={{ marginTop:10 }}>
            <GhostBtn danger onClick={()=>delClient(c.id)}>Eliminar registo</GhostBtn>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight:"100vh", background:BLACK, display:"flex", flexDirection:"column", maxWidth:480, margin:"0 auto" }}>
      {/* Header */}
      <div style={{ padding:"20px 28px 0", borderBottom:`1px solid ${BORDER}` }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20 }}>
          <div>
            <SectionLabel style={{ marginBottom:6 }}>Painel de Controlo</SectionLabel>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:26, color:TEXT, letterSpacing:"0.06em" }}>IGNITE</div>
          </div>
          <button onClick={onExit} style={{
            background:"transparent", border:`1px solid ${BORDER}`,
            color:MUTED, fontSize:9, letterSpacing:"0.2em", textTransform:"uppercase",
            padding:"9px 14px", fontFamily:"'Barlow Condensed'", cursor:"pointer",
            transition:"border-color 0.2s",
          }}
            onMouseEnter={e=>e.currentTarget.style.borderColor=BORDER_G}
            onMouseLeave={e=>e.currentTarget.style.borderColor=BORDER}
          >Sair</button>
        </div>
        {/* Tabs */}
        <div style={{ display:"flex" }}>
          {[["clients",`Clientes (${clients.length})`],["profile","Perfil"]].map(([k,l])=>(
            <button key={k} onClick={()=>setTab(k)} className={tab===k?"ig-tab-active":""} style={{
              flex:1, padding:"12px 0", background:"none", border:"none",
              color:MUTED, fontSize:10, letterSpacing:"0.2em", textTransform:"uppercase",
              fontFamily:"'Barlow Condensed'", cursor:"pointer",
              borderBottom:`1px solid transparent`,
              transition:"all 0.2s",
            }}>{l}</button>
          ))}
        </div>
      </div>

      {/* Clients list */}
      {tab==="clients" && (
        <div style={{ flex:1, padding:"0 28px", overflowY:"auto" }}>
          {clients.length===0 ? (
            <div style={{ textAlign:"center", paddingTop:80 }}>
              <GreenLine style={{ marginBottom:32 }} />
              <p style={{ color:"#1e1e1e", fontFamily:"'Barlow Condensed'", fontSize:11, letterSpacing:"0.15em", textTransform:"uppercase" }}>Nenhum cliente registado</p>
            </div>
          ) : clients.map((c,i)=>(
            <button key={c.id} onClick={()=>setSel(c)} style={{
              display:"flex", alignItems:"center", justifyContent:"space-between",
              width:"100%", padding:"18px 0",
              border:"none", borderBottom:`1px solid ${BORDER}`,
              background:"none", cursor:"pointer", textAlign:"left",
              animation:`fadeUp 0.4s ${i*0.04}s both`,
            }}>
              <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                <div style={{
                  width:38, height:38,
                  border:`1px solid ${BORDER_G}`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontFamily:"'Bebas Neue',sans-serif",
                  fontSize:14, color:GREEN_L, letterSpacing:"0.05em",
                }}>
                  {c.firstName[0]}{c.lastName[0]}
                </div>
                <div>
                  <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:14, color:TEXT, fontWeight:400 }}>{c.firstName} {c.lastName}</div>
                  <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:11, color:MUTED, marginTop:2, fontWeight:300 }}>{c.instagram} · {c.location}</div>
                </div>
              </div>
              <span style={{ color:"#2a2a2a", fontSize:16 }}>›</span>
            </button>
          ))}
        </div>
      )}

      {/* Profile editor */}
      {tab==="profile" && (
        <div style={{ flex:1, padding:"24px 28px 60px", overflowY:"auto", display:"flex", flexDirection:"column", gap:18 }}>
          {[
            {k:"name",     l:"Nome",      pl:"Ignite Coaching"},
            {k:"tagline",  l:"Tagline",   pl:"Individual Coaching"},
            {k:"instagram",l:"Instagram", pl:"@_ignitecoaching_"},
            {k:"phone",    l:"Telemóvel", pl:"+351 9XX XXX XXX"},
          ].map(f=>(
            <div key={f.k}>
              <SectionLabel style={{ marginBottom:8 }}>{f.l}</SectionLabel>
              <IGInput value={editT[f.k]||""} placeholder={f.pl} onChange={e=>setEditT(p=>({...p,[f.k]:e.target.value}))} />
            </div>
          ))}
          <div>
            <SectionLabel style={{ marginBottom:8 }}>Bio</SectionLabel>
            <IGTextarea rows={4} value={editT.bio||""} onChange={e=>setEditT(p=>({...p,bio:e.target.value}))} />
          </div>
          <div>
            <SectionLabel style={{ marginBottom:8 }}>Novo PIN (4 dígitos)</SectionLabel>
            <IGInput value={newPin} placeholder="••••" maxLength={4} type="password"
              onChange={e=>setNewPin(e.target.value.replace(/\D/g,"").slice(0,4))} />
          </div>
          <PrimaryBtn onClick={saveProfile} style={{ marginTop:8 }}>
            {saved ? "Guardado ✓" : "Guardar Alterações"}
          </PrimaryBtn>
        </div>
      )}
    </div>
  );
}

/* ── ROOT ── */
export default function App() {
  const [trainer, setTrainer] = useState(gt);
  const [view,    setView]    = useState("landing");
  const [menu,    setMenu]    = useState(false);

  function go(v) { setView(v); setMenu(false); }

  return (
    <div style={{ background:BLACK, minHeight:"100vh", position:"relative" }}>

      {/* Floating menu */}
      <button onClick={()=>setMenu(m=>!m)} style={{
        position:"fixed", bottom:24, right:20, zIndex:300,
        width:40, height:40,
        background: view==="editor" ? GREEN : "#111",
        border:`1px solid ${view==="editor"?GREEN:BORDER}`,
        borderRadius:0,
        color: view==="editor" ? "#fff" : MUTED,
        fontSize:15, display:"flex", alignItems:"center", justifyContent:"center",
        boxShadow:`0 4px 30px rgba(0,0,0,0.7)`,
        cursor:"pointer", transition:"all 0.2s",
        fontFamily:"'Barlow'",
      }}>
        {menu ? "✕" : "⋯"}
      </button>

      {menu && (
        <div className="su" style={{
          position:"fixed", bottom:76, right:20, zIndex:299,
          background:"#0d0d0d", border:`1px solid ${BORDER}`,
          minWidth:180, boxShadow:"0 8px 48px rgba(0,0,0,0.8)",
        }}>
          {[
            { k:"landing", l:"Página Inicial" },
            { k:"form",    l:"Ver Formulário" },
            { k: view==="editor"?"landing":"pin", l: view==="editor"?"Sair do Editor":"Modo Editor" },
          ].map(m=>(
            <button key={m.k} onClick={()=>go(m.k)} style={{
              display:"block", width:"100%", padding:"14px 18px",
              border:"none", borderBottom:`1px solid ${BORDER}`,
              background:"none", color: view===m.k ? GREEN_L : MUTED2,
              fontSize:10, letterSpacing:"0.2em", textTransform:"uppercase",
              textAlign:"left", fontFamily:"'Barlow Condensed'", cursor:"pointer",
              fontWeight:500, transition:"color 0.15s",
            }}
              onMouseEnter={e=>e.currentTarget.style.color="#fff"}
              onMouseLeave={e=>e.currentTarget.style.color=view===m.k?GREEN_L:MUTED2}
            >{m.l}</button>
          ))}
        </div>
      )}

      {view==="landing" && <Landing  trainer={trainer} onStart={()=>go("form")} />}
      {view==="form"    && <ClientForm trainer={trainer} onBack={()=>go("landing")} />}
      {view==="pin"     && <PinGate onSuccess={()=>go("editor")} />}
      {view==="editor"  && <Editor trainer={trainer} setTrainer={setTrainer} onExit={()=>go("landing")} />}
    </div>
  );
}
