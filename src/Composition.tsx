import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
  AbsoluteFill,
  Easing,
} from "remotion";

// ─── Helpers ────────────────────────────────────────────────────────────────

const useSpr = (frame: number, fps: number, delay = 0, damping = 18, stiffness = 120) =>
  spring({ frame: frame - delay, fps, config: { damping, stiffness, mass: 0.8 } });

const fade = (frame: number, from: number, to: number, inDur = 8, outDur = 8) =>
  interpolate(frame, [from, from + inDur, to - outDur, to], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const slideUp = (spr: number, px = 40) => ({
  transform: `translateY(${interpolate(spr, [0, 1], [px, 0])}px)`,
  opacity: spr,
});

// ─── Design tokens ──────────────────────────────────────────────────────────

const C = {
  purple: "#6C4DFF",
  blue: "#4f46e5",
  bg: "#0f172a",
  surface: "#1e293b",
  surfaceLight: "#ffffff0d",
  text: "#f1f5f9",
  muted: "#94a3b8",
  accent: "#a78bfa",
  green: "#10b981",
  orange: "#f59e0b",
};

const gradMain = `linear-gradient(135deg, ${C.purple} 0%, ${C.blue} 100%)`;
const gradPremium = `linear-gradient(160deg, #1e1b4b 0%, #0f172a 60%, #1a1035 100%)`;

// ─── Shared UI atoms ─────────────────────────────────────────────────────────

const Logo: React.FC<{ scale?: number; opacity?: number }> = ({ scale = 1, opacity = 1 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 14, opacity, transform: `scale(${scale})` }}>
    <div style={{
      width: 52, height: 52, borderRadius: 16,
      background: gradMain,
      display: "flex", alignItems: "center", justifyContent: "center",
      boxShadow: `0 8px 32px ${C.purple}66`,
    }}>
      <span style={{ fontSize: 26 }}>🧠</span>
    </div>
    <div>
      <span style={{ fontFamily: "Sora, sans-serif", fontWeight: 900, fontSize: 32, color: C.text, letterSpacing: -1 }}>Mentor</span>
      <span style={{ fontFamily: "Sora, sans-serif", fontWeight: 900, fontSize: 32, background: gradMain, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}> IA</span>
    </div>
  </div>
);

const Pill: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = C.purple }) => (
  <div style={{
    display: "inline-flex", alignItems: "center", gap: 6,
    padding: "8px 20px", borderRadius: 100,
    background: `${color}22`, border: `1px solid ${color}55`,
    color, fontSize: 22, fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 600,
  }}>{children}</div>
);

const Card: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{
    background: C.surface,
    borderRadius: 24, padding: "36px 40px",
    border: "1px solid #ffffff14",
    boxShadow: "0 24px 64px #00000040",
    ...style,
  }}>{children}</div>
);

const StatBadge: React.FC<{ icon: string; value: string; label: string; color: string; spr: number }> = ({ icon, value, label, color, spr }) => (
  <div style={{
    ...slideUp(spr, 30),
    background: C.surfaceLight,
    backdropFilter: "blur(20px)",
    borderRadius: 20, padding: "28px 32px",
    border: `1px solid ${color}33`,
    textAlign: "center", minWidth: 200,
  }}>
    <div style={{ fontSize: 40, marginBottom: 8 }}>{icon}</div>
    <div style={{ fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: 42, color, lineHeight: 1 }}>{value}</div>
    <div style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: 22, color: C.muted, marginTop: 6 }}>{label}</div>
  </div>
);

// ─── Scene 1: Hook (0–2s / frames 0–59) ─────────────────────────────────────

const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgScale = interpolate(frame, [0, 60], [1.08, 1], { extrapolateRight: "clamp" });
  const wordSpr1 = useSpr(frame, fps, 0, 22, 140);
  const wordSpr2 = useSpr(frame, fps, 6, 22, 140);
  const wordSpr3 = useSpr(frame, fps, 12, 22, 140);
  const subSpr = useSpr(frame, fps, 20, 18, 100);
  const logoSpr = useSpr(frame, fps, 28, 20, 110);

  return (
    <AbsoluteFill style={{ background: gradPremium, overflow: "hidden" }}>
      {/* Ambient orb */}
      <div style={{
        position: "absolute", top: -200, left: -200,
        width: 900, height: 900, borderRadius: "50%",
        background: `radial-gradient(circle, ${C.purple}30 0%, transparent 70%)`,
        transform: `scale(${bgScale})`,
      }} />
      <div style={{
        position: "absolute", bottom: -300, right: -150,
        width: 700, height: 700, borderRadius: "50%",
        background: `radial-gradient(circle, ${C.blue}25 0%, transparent 70%)`,
      }} />

      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "0 80px", gap: 0,
      }}>
        {/* Hook words */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          {[
            { text: "Estudar", spr: wordSpr1 },
            { text: "nunca mais", spr: wordSpr2 },
            { text: "será igual.", spr: wordSpr3 },
          ].map(({ text, spr }, i) => (
            <div key={i} style={{
              ...slideUp(spr, 60),
              fontFamily: "Sora, sans-serif",
              fontWeight: 900,
              fontSize: i === 1 ? 112 : 96,
              lineHeight: 1.05,
              color: i === 1 ? "transparent" : C.text,
              background: i === 1 ? gradMain : undefined,
              WebkitBackgroundClip: i === 1 ? "text" : undefined,
              WebkitTextFillColor: i === 1 ? "transparent" : undefined,
              letterSpacing: -3,
            }}>{text}</div>
          ))}
        </div>

        <div style={{ ...slideUp(subSpr, 20), textAlign: "center", marginBottom: 60 }}>
          <span style={{
            fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: 32,
            color: C.muted, fontWeight: 400, letterSpacing: 0.5,
          }}>Sua IA de estudos. Personalizada. Inteligente.</span>
        </div>

        <div style={{ ...slideUp(logoSpr, 20) }}>
          <Logo />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 2: Problema (frames 60–149 / 2–5s) ────────────────────────────────

const Scene2Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const spr1 = useSpr(frame, fps, 0, 20, 120);
  const spr2 = useSpr(frame, fps, 8, 20, 120);
  const spr3 = useSpr(frame, fps, 16, 20, 120);
  const spr4 = useSpr(frame, fps, 24, 20, 120);

  const problems = [
    { icon: "😩", text: "Estudar sozinho é difícil" },
    { icon: "📚", text: "Material demais, tempo de menos" },
    { icon: "🤯", text: "Não sabe por onde começar" },
    { icon: "📉", text: "Progresso invisível" },
  ];
  const sprs = [spr1, spr2, spr3, spr4];

  return (
    <AbsoluteFill style={{ background: gradPremium, overflow: "hidden" }}>
      <div style={{
        position: "absolute", top: 100, right: -300,
        width: 600, height: 600, borderRadius: "50%",
        background: `radial-gradient(circle, #ef444420 0%, transparent 70%)`,
      }} />

      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        padding: "120px 80px",
        gap: 40,
        justifyContent: "center",
      }}>
        <div style={{ ...slideUp(spr1, 30), marginBottom: 16 }}>
          <Pill color="#ef4444">O problema real</Pill>
        </div>
        <div style={{ ...slideUp(spr1, 40), fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: 72, color: C.text, lineHeight: 1.1, letterSpacing: -2, marginBottom: 20 }}>
          Por que você ainda não está aprendendo de verdade?
        </div>

        {problems.map((p, i) => (
          <div key={i} style={{
            ...slideUp(sprs[i], 30),
            display: "flex", alignItems: "center", gap: 24,
            background: "#ffffff08", borderRadius: 20,
            padding: "28px 36px",
            border: "1px solid #ffffff10",
          }}>
            <span style={{ fontSize: 44 }}>{p.icon}</span>
            <span style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: 30, color: C.muted, fontWeight: 500 }}>{p.text}</span>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 3: Chat IA (frames 150–359 / 5–12s) ────────────────────────────────

const Scene3Chat: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerSpr = useSpr(frame, fps, 0, 20, 120);
  const cardSpr = useSpr(frame, fps, 6, 18, 100);
  const msg1Spr = useSpr(frame, fps, 14, 16, 90);
  const msg2Spr = useSpr(frame, fps, 30, 16, 90);
  const msg3Spr = useSpr(frame, fps, 50, 16, 90);
  const chipsSpr = useSpr(frame, fps, 70, 16, 90);

  const typingProgress = interpolate(frame, [50, 110], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const fullText = "Claro! A fotossíntese é o processo pelo qual as plantas convertem luz solar em energia química...";
  const displayText = fullText.slice(0, Math.floor(typingProgress * fullText.length));

  const chips = ["💡 Explicar", "📝 Resumir", "⚡ Quiz", "🃏 Flashcards"];

  return (
    <AbsoluteFill style={{ background: gradPremium, overflow: "hidden" }}>
      <div style={{
        position: "absolute", bottom: -200, left: -200,
        width: 700, height: 700, borderRadius: "50%",
        background: `radial-gradient(circle, ${C.purple}20 0%, transparent 70%)`,
      }} />

      <div style={{ position: "absolute", inset: 0, padding: "100px 60px", display: "flex", flexDirection: "column", gap: 32 }}>
        {/* Header */}
        <div style={{ ...slideUp(headerSpr, 30) }}>
          <Pill>✨ Chat com IA</Pill>
          <div style={{ fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: 68, color: C.text, lineHeight: 1.1, letterSpacing: -2, marginTop: 20 }}>
            Seu tutor pessoal.<br />Disponível 24h.
          </div>
        </div>

        {/* Chat Card */}
        <div style={{ ...slideUp(cardSpr, 40), flex: 1, display: "flex", flexDirection: "column", gap: 20 }}>
          {/* AI Avatar bar */}
          <div style={{
            display: "flex", alignItems: "center", gap: 16,
            background: C.surfaceLight, borderRadius: 20, padding: "20px 28px",
            border: "1px solid #ffffff14",
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14, background: gradMain,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24,
            }}>🧠</div>
            <div>
              <div style={{ fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: 26, color: C.text }}>MentorIA</div>
              <div style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: 20, color: C.green }}>● Online agora</div>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
              {["Tutor", "Quiz", "Flashcards"].map((t, i) => (
                <span key={i} style={{
                  padding: "6px 16px", borderRadius: 100, fontSize: 18,
                  background: i === 0 ? gradMain : "#ffffff0d",
                  color: C.text, fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 600,
                }}>{t}</span>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* User message */}
            <div style={{ ...slideUp(msg1Spr, 20), display: "flex", justifyContent: "flex-end" }}>
              <div style={{
                background: gradMain, borderRadius: "20px 20px 4px 20px",
                padding: "20px 28px", maxWidth: "75%",
                fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: 26, color: "#fff", fontWeight: 500,
                boxShadow: `0 8px 24px ${C.purple}44`,
              }}>
                Me explica fotossíntese de forma simples 🌱
              </div>
            </div>

            {/* AI typing indicator */}
            {frame > 30 && frame < 50 && (
              <div style={{ ...slideUp(msg2Spr, 20), display: "flex", gap: 16, alignItems: "flex-end" }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, background: gradMain,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0,
                }}>🧠</div>
                <div style={{
                  background: C.surface, borderRadius: "20px 20px 20px 4px",
                  padding: "20px 28px",
                  border: "1px solid #ffffff14",
                  display: "flex", gap: 8, alignItems: "center",
                }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{
                      width: 10, height: 10, borderRadius: "50%",
                      background: C.accent,
                      opacity: interpolate(
                        (frame * 6 + i * 8) % 24,
                        [0, 8, 16, 24], [0.3, 1, 0.3, 0.3],
                        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                      ),
                    }} />
                  ))}
                </div>
              </div>
            )}

            {/* AI response */}
            {frame >= 50 && (
              <div style={{ ...slideUp(msg3Spr, 20), display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, background: gradMain,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0,
                }}>🧠</div>
                <div style={{
                  background: C.surface, borderRadius: "20px 20px 20px 4px",
                  padding: "24px 28px", flex: 1,
                  border: "1px solid #ffffff14",
                  fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: 26, color: C.text,
                  lineHeight: 1.6, fontWeight: 400,
                }}>
                  {displayText}
                  {typingProgress < 1 && <span style={{ opacity: 0.6 }}>|</span>}
                </div>
              </div>
            )}
          </div>

          {/* Quick action chips */}
          <div style={{
            ...slideUp(chipsSpr, 20),
            display: "flex", flexWrap: "wrap", gap: 14, marginTop: 8,
          }}>
            {chips.map((c, i) => (
              <span key={i} style={{
                padding: "12px 24px", borderRadius: 100,
                background: "#ffffff08", border: "1px solid #ffffff14",
                fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: 22, color: C.muted,
                fontWeight: 500,
              }}>{c}</span>
            ))}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 4: Features Grid (frames 360–599 / 12–20s) ────────────────────────

const Scene4Features: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpr = useSpr(frame, fps, 0, 20, 110);

  const features = [
    { icon: "🃏", title: "Flashcards SM2", desc: "Repetição espaçada inteligente. 40 cards hoje.", color: "#6C4DFF", delay: 10 },
    { icon: "⚡", title: "Quiz IA", desc: "Questões geradas automaticamente por matéria.", color: "#f59e0b", delay: 18 },
    { icon: "🗺️", title: "Mapas Mentais", desc: "Resumos visuais interativos gerados em segundos.", color: "#10b981", delay: 26 },
    { icon: "📅", title: "Plano de Estudos", desc: "Cronograma 100% personalizado pela IA.", color: "#3b82f6", delay: 34 },
    { icon: "📊", title: "Progresso", desc: "Heatmap, streak e evolução por matéria.", color: "#ec4899", delay: 42 },
    { icon: "📚", title: "Materiais IA", desc: "Resumos, explicações e exercícios gerados.", color: "#a78bfa", delay: 50 },
  ];

  return (
    <AbsoluteFill style={{ background: gradPremium, overflow: "hidden" }}>
      <div style={{
        position: "absolute", top: -100, right: -200,
        width: 600, height: 600, borderRadius: "50%",
        background: `radial-gradient(circle, ${C.blue}20 0%, transparent 70%)`,
      }} />

      <div style={{ position: "absolute", inset: 0, padding: "100px 60px", display: "flex", flexDirection: "column", gap: 40 }}>
        <div style={{ ...slideUp(titleSpr, 30) }}>
          <Pill color={C.accent}>🛠️ Ferramentas</Pill>
          <div style={{ fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: 72, color: C.text, lineHeight: 1.1, letterSpacing: -2, marginTop: 20 }}>
            Tudo que você<br />precisa. Em um lugar.
          </div>
        </div>

        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: 20, flex: 1,
        }}>
          {features.map((f, i) => {
            const spr = useSpr(frame, fps, f.delay, 18, 100);
            return (
              <div key={i} style={{
                ...slideUp(spr, 40),
                background: `${f.color}0f`,
                borderRadius: 24, padding: "32px 30px",
                border: `1px solid ${f.color}22`,
                display: "flex", flexDirection: "column", gap: 12,
              }}>
                <div style={{ fontSize: 44 }}>{f.icon}</div>
                <div style={{ fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: 28, color: C.text }}>{f.title}</div>
                <div style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: 22, color: C.muted, lineHeight: 1.5 }}>{f.desc}</div>
                <div style={{ marginTop: "auto" }}>
                  <div style={{ height: 3, borderRadius: 100, background: `${f.color}33` }}>
                    <div style={{
                      height: "100%", borderRadius: 100,
                      background: f.color,
                      width: `${interpolate(spr, [0, 1], [0, 70 + i * 5])}%`,
                    }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 5: Dashboard (frames 600–749 / 20–25s) ────────────────────────────

const Scene5Dashboard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpr = useSpr(frame, fps, 0, 20, 110);
  const greetSpr = useSpr(frame, fps, 8, 18, 100);
  const streakSpr = useSpr(frame, fps, 18, 18, 100);
  const stat1Spr = useSpr(frame, fps, 26, 18, 100);
  const stat2Spr = useSpr(frame, fps, 33, 18, 100);
  const stat3Spr = useSpr(frame, fps, 40, 18, 100);
  const heatSpr = useSpr(frame, fps, 50, 18, 100);

  const heatmap = Array.from({ length: 70 }, (_, i) => ({
    active: Math.random() > 0.45,
    intensity: Math.random(),
  }));

  const heatReveal = interpolate(frame, [50, 130], [0, 70], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{ background: gradPremium, overflow: "hidden" }}>
      <div style={{
        position: "absolute", top: 200, left: -300,
        width: 800, height: 800, borderRadius: "50%",
        background: `radial-gradient(circle, ${C.purple}18 0%, transparent 70%)`,
      }} />

      <div style={{ position: "absolute", inset: 0, padding: "100px 60px", display: "flex", flexDirection: "column", gap: 36 }}>
        <div style={{ ...slideUp(titleSpr, 30) }}>
          <Pill color={C.green}>📊 Progresso real</Pill>
          <div style={{ fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: 72, color: C.text, lineHeight: 1.1, letterSpacing: -2, marginTop: 20 }}>
            Veja sua evolução.<br />Dia a dia.
          </div>
        </div>

        {/* Greeting card */}
        <div style={{
          ...slideUp(greetSpr, 30),
          borderRadius: 28, padding: "40px 44px",
          background: gradMain,
          boxShadow: `0 24px 60px ${C.purple}44`,
        }}>
          <div style={{ fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: 44, color: "#fff" }}>
            Boa noite, Jefferson! 👋
          </div>
          <div style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: 26, color: "#ffffffbb", marginTop: 8 }}>
            Sequência de 13 dias. Continue assim! 🔥
          </div>
          <div style={{
            marginTop: 20, display: "inline-flex", alignItems: "center", gap: 10,
            background: "#ffffff22", borderRadius: 100, padding: "10px 24px",
          }}>
            <span style={{ fontSize: 22 }}>🏅</span>
            <span style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 700, fontSize: 24, color: "#fff" }}>13 dias de sequência!</span>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: "flex", gap: 20 }}>
          <StatBadge icon="⏱️" value="0h" label="Horas estudadas" color={C.purple} spr={stat1Spr} />
          <StatBadge icon="🎯" value="0%" label="Taxa de acerto" color={C.green} spr={stat2Spr} />
          <StatBadge icon="🔥" value="13" label="Sequência dias" color={C.orange} spr={stat3Spr} />
        </div>

        {/* Heatmap */}
        <div style={{ ...slideUp(heatSpr, 20) }}>
          <div style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: 24, color: C.muted, marginBottom: 16 }}>Mapa de atividades (6 meses)</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {heatmap.map((cell, i) => (
              <div key={i} style={{
                width: 26, height: 26, borderRadius: 6,
                background: i < heatReveal && cell.active
                  ? `rgba(108,77,255,${0.3 + cell.intensity * 0.7})`
                  : "#ffffff0a",
                transition: "background 0.2s",
              }} />
            ))}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 6: CTA Final (frames 750–900 / 25–30s) ────────────────────────────

const Scene6CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgPulse = interpolate(frame, [0, 60, 120], [1, 1.04, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.sine),
  });

  const logoSpr = useSpr(frame, fps, 0, 20, 110);
  const tagSpr = useSpr(frame, fps, 10, 18, 100);
  const headSpr = useSpr(frame, fps, 18, 18, 100);
  const subSpr = useSpr(frame, fps, 26, 18, 100);
  const ctaSpr = useSpr(frame, fps, 36, 16, 90);
  const planSpr = useSpr(frame, fps, 48, 16, 90);
  const footSpr = useSpr(frame, fps, 60, 14, 80);

  const ctaGlow = interpolate(frame, [36, 100, 150], [0, 1, 0.7], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {/* Animated gradient background */}
      <div style={{
        position: "absolute", inset: 0,
        background: gradPremium,
        transform: `scale(${bgPulse})`,
      }} />
      <div style={{
        position: "absolute", top: -300, left: "50%",
        transform: "translateX(-50%)",
        width: 1000, height: 1000, borderRadius: "50%",
        background: `radial-gradient(circle, ${C.purple}35 0%, transparent 65%)`,
      }} />
      <div style={{
        position: "absolute", bottom: -200, right: -200,
        width: 700, height: 700, borderRadius: "50%",
        background: `radial-gradient(circle, ${C.blue}25 0%, transparent 70%)`,
      }} />

      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "0 80px", textAlign: "center", gap: 0,
      }}>
        {/* Logo */}
        <div style={{ ...slideUp(logoSpr, 30), marginBottom: 48 }}>
          <Logo />
        </div>

        {/* Tag */}
        <div style={{ ...slideUp(tagSpr, 20), marginBottom: 32 }}>
          <Pill>🚀 Comece agora gratuitamente</Pill>
        </div>

        {/* Main headline */}
        <div style={{ ...slideUp(headSpr, 40), marginBottom: 28 }}>
          <div style={{
            fontFamily: "Sora, sans-serif", fontWeight: 900,
            fontSize: 96, color: C.text, lineHeight: 1.05, letterSpacing: -3,
          }}>
            Seu cérebro.<br />
            <span style={{
              background: gradMain,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>Potencializado.</span>
          </div>
        </div>

        {/* Subheadline */}
        <div style={{ ...slideUp(subSpr, 20), marginBottom: 64 }}>
          <span style={{
            fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: 30,
            color: C.muted, fontWeight: 400, lineHeight: 1.6,
          }}>
            Junte-se a milhares de estudantes que já<br />aprendem mais rápido com o MentorIA.
          </span>
        </div>

        {/* CTA Button */}
        <div style={{
          ...slideUp(ctaSpr, 30),
          marginBottom: 32,
        }}>
          <div style={{
            background: gradMain,
            borderRadius: 24, padding: "36px 80px",
            fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: 38, color: "#fff",
            letterSpacing: -0.5,
            boxShadow: `0 ${24 + ctaGlow * 16}px ${48 + ctaGlow * 40}px ${C.purple}${Math.round(ctaGlow * 80).toString(16).padStart(2, "0")}`,
          }}>
            Começar grátis →
          </div>
        </div>

        {/* Plan hint */}
        <div style={{ ...slideUp(planSpr, 20), marginBottom: 60 }}>
          <div style={{ display: "flex", gap: 32, justifyContent: "center" }}>
            {["✅ Sem cartão", "✅ Acesso imediato", "✅ IA inclusa"].map((t, i) => (
              <span key={i} style={{
                fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: 24,
                color: C.muted, fontWeight: 500,
              }}>{t}</span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ ...slideUp(footSpr, 10) }}>
          <span style={{
            fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: 22,
            color: "#ffffff22", letterSpacing: 2, textTransform: "uppercase",
          }}>mentorai.com.br</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Root composition ─────────────────────────────────────────────────────────

export const MentorIAVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ fontFamily: "Sora, sans-serif", background: C.bg }}>
      {/* Scene 1: Hook — 0–2s (0–59) */}
      <Sequence from={0} durationInFrames={60}>
        <Scene1Hook />
      </Sequence>

      {/* Scene 2: Problem — 2–5s (60–149) */}
      <Sequence from={60} durationInFrames={90}>
        <Scene2Problem />
      </Sequence>

      {/* Scene 3: Chat IA — 5–12s (150–359) */}
      <Sequence from={150} durationInFrames={210}>
        <Scene3Chat />
      </Sequence>

      {/* Scene 4: Features — 12–20s (360–599) */}
      <Sequence from={360} durationInFrames={240}>
        <Scene4Features />
      </Sequence>

      {/* Scene 5: Dashboard — 20–25s (600–749) */}
      <Sequence from={600} durationInFrames={150}>
        <Scene5Dashboard />
      </Sequence>

      {/* Scene 6: CTA — 25–30s (750–900) */}
      <Sequence from={750} durationInFrames={150}>
        <Scene6CTA />
      </Sequence>
    </AbsoluteFill>
  );
};
