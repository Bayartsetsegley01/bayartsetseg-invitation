import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../../lib/supabase';

// ─── Botanical iris with bezier petals + gradient fills ───────────────────────
const Iris = ({
  id, x, y, stemH, fallColor, fallLight, standColor, lean = 0, leafSide = 1,
}: {
  id: string; x: number; y: number; stemH: number;
  fallColor: string; fallLight: string; standColor: string;
  lean?: number; leafSide?: number;
}) => {
  const cx = lean > 0 ? 5 : -5;
  const lx1 = leafSide * 20; const lx2 = leafSide * 26; const lx3 = leafSide * 14;

  return (
    <g transform={`translate(${x},${y}) rotate(${lean})`}>
      <defs>
        <radialGradient id={`fall-${id}`} cx="40%" cy="30%" r="65%">
          <stop offset="0%" stopColor={fallLight} stopOpacity="0.95"/>
          <stop offset="100%" stopColor={fallColor} stopOpacity="0.98"/>
        </radialGradient>
        <radialGradient id={`stand-${id}`} cx="50%" cy="70%" r="60%">
          <stop offset="0%" stopColor={fallLight} stopOpacity="0.88"/>
          <stop offset="100%" stopColor={standColor} stopOpacity="0.95"/>
        </radialGradient>
      </defs>

      {/* Stem — subtly curved */}
      <path
        d={`M0,0 C${cx},${-stemH * 0.32} ${-cx * 0.5},${-stemH * 0.7} 0,${-stemH}`}
        stroke="#3a5e1c" strokeWidth="2.6" fill="none" strokeLinecap="round"
      />

      {/* Sword leaf with midrib */}
      <path
        d={`M0,${-stemH * 0.42} C${lx1},${-stemH * 0.5} ${lx2},${-stemH * 0.78} ${lx3},${-stemH * 0.94} C${leafSide * 4},${-stemH * 0.78} 0,${-stemH * 0.5} 0,${-stemH * 0.42}`}
        fill="#4a7222" opacity="0.88"
      />
      <line
        x1={leafSide * 4} y1={-stemH * 0.45}
        x2={leafSide * 13} y2={-stemH * 0.93}
        stroke="#3a5e1c" strokeWidth="0.7" opacity="0.45"
      />

      <g transform={`translate(0,${-stemH})`}>
        {/* Fall petals — 3 drooping, with beard stripe */}
        {([-38, 0, 38] as number[]).map((rot, i) => (
          <g key={i} transform={`rotate(${rot})`}>
            <path
              d="M0,0 C-13,-4 -20,12 -17,32 C-13,50 -4,58 0,60 C4,58 13,50 17,32 C20,12 13,-4 0,0"
              fill={`url(#fall-${id})`} opacity="0.9"
            />
            {/* Beard (fuzzy stripe on fall petals) */}
            <path d="M-1,4 C-1,14 0,22 1,30" stroke="white" strokeWidth="2.2"
              opacity="0.45" strokeLinecap="round" fill="none"/>
            <path d="M0,4 C0,14 0,22 0,30" stroke="#f8e870" strokeWidth="1.2"
              opacity="0.35" strokeLinecap="round" fill="none"/>
          </g>
        ))}

        {/* Standard petals — 3 upright */}
        {([-36, 0, 36] as number[]).map((rot, i) => (
          <g key={i} transform={`rotate(${rot + 18})`}>
            <path
              d="M0,2 C-10,0 -15,-18 -11,-40 C-7,-58 0,-66 0,-66 C0,-66 7,-58 11,-40 C15,-18 10,0 0,2"
              fill={`url(#stand-${id})`} opacity="0.93"
            />
          </g>
        ))}

        {/* Center detail */}
        <ellipse cx={0} cy={0} rx={7} ry={5} fill="#fff8d4" opacity="0.9"/>
        <ellipse cx={0} cy={0} rx={4} ry={3} fill="#f0d840" opacity="0.7"/>
        <circle cx={0} cy={-1} r={2} fill="#e8b820" opacity="0.5"/>
      </g>
    </g>
  );
};

function toLines(text: string, maxChars: number): string[] {
  if (!text) return [];
  const words = text.split(' ');
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    if (line.length + w.length + 1 <= maxChars) { line = line ? line + ' ' + w : w; }
    else { if (line) lines.push(line); line = w; }
  }
  if (line) lines.push(line);
  return lines;
}

interface GMessage { id: number; from: string; text: string; rotate: number; }

const FONT = 'Montserrat, Arial, sans-serif';
const CURSIVE = "'Dancing Script', cursive";

const stableRotation = (id: number) => ((id % 9) - 4) * 0.6;

export const PostcardMessage = () => {
  const { t } = useLanguage();
  const [from, setFrom] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<GMessage[]>([]);
  const [latest, setLatest] = useState<GMessage | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('postcards')
        .select('*')
        .order('created_at', { ascending: false });
      if (data) {
        setMessages(data.map(p => ({
          id: p.id,
          from: p.from_name,
          text: p.message,
          rotate: stableRotation(p.id),
        })));
      }
    };
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !from.trim()) return;
    setLoading(true);

    const { data, error } = await supabase
      .from('postcards')
      .insert({ from_name: from.trim(), message: message.trim() })
      .select()
      .single();

    setLoading(false);
    if (!error && data) {
      const newMsg: GMessage = {
        id: data.id, from: data.from_name, text: data.message,
        rotate: stableRotation(data.id),
      };
      setMessages(prev => [newMsg, ...prev]);
      setLatest(newMsg);
      setMessage(''); setFrom('');
      setDone(true);
      setTimeout(() => setDone(false), 3000);
    }
  };

  const msgLines = toLines(latest?.text ?? '', 18);

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, ease: 'easeOut' }}
      className="w-full flex flex-col items-center gap-10 py-4"
    >
      {/* Title — just "Захиа" */}
      <h2 className="text-2xl sm:text-3xl font-light tracking-wide text-center">
        {t.postcardTitle}
      </h2>

      <div className="w-full max-w-2xl flex flex-col sm:flex-row gap-6 items-center sm:items-start justify-center">

        {/* ── Envelope Scene ── */}
        <div className="flex-shrink-0">
          <div className="rounded-2xl overflow-hidden" style={{ width: 260, height: 390,
            background: 'linear-gradient(175deg, #fefce8 0%, #e8f4fa 100%)' }}>
            <svg viewBox="0 0 260 390" width="260" height="390" xmlns="http://www.w3.org/2000/svg">
              <defs>
                {/* Kraft paper gradient for envelope */}
                <linearGradient id="envBody" x1="0" y1="0" x2="0.2" y2="1">
                  <stop offset="0%" stopColor="#d4b484"/>
                  <stop offset="100%" stopColor="#b8925a"/>
                </linearGradient>
                <linearGradient id="envLeft" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#a07840"/>
                  <stop offset="100%" stopColor="#b8935c"/>
                </linearGradient>
                <linearGradient id="envRight" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#c4a068"/>
                  <stop offset="100%" stopColor="#a88040"/>
                </linearGradient>
                <linearGradient id="envFlap" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#c8a060"/>
                  <stop offset="100%" stopColor="#a07838"/>
                </linearGradient>
                {/* Drop shadow filter for letter */}
                <filter id="letterShadow" x="-10%" y="-10%" width="120%" height="120%">
                  <feDropShadow dx="1" dy="2" stdDeviation="3" floodOpacity="0.15"/>
                </filter>
              </defs>

              {/* ── LETTER peeking out ── */}
              <g transform="rotate(-2,130,295)" filter="url(#letterShadow)">
                <rect x="44" y="158" width="172" height="210" rx="2" fill="#f5f3ee"/>
                {/* Ruled lines */}
                {[0,1,2,3,4,5,6].map(i => (
                  <line key={i} x1="56" y1={186 + i * 24} x2="204" y2={186 + i * 24}
                    stroke="#ccc5b0" strokeWidth="0.65" opacity="0.5"/>
                ))}
                {latest ? (
                  <>
                    <text fontFamily={CURSIVE} fontSize="13" fill="#3a2e1c" opacity="0.88">
                      {msgLines.slice(0, 7).map((line, i) => (
                        <tspan key={i} x="58" y={188 + i * 24}>{line}</tspan>
                      ))}
                    </text>
                    <text x="198" y={188 + Math.min(msgLines.length, 7) * 24 + 12}
                      fontFamily={CURSIVE} fontSize="12" fill="#6a5030" textAnchor="end" opacity="0.8">
                      — {latest.from}
                    </text>
                  </>
                ) : (
                  <text x="130" y="262" fontFamily={FONT} fontSize="9"
                    fill="#b8b0a0" textAnchor="middle" opacity="0.6">
                    {t.postcardEmptyHint}
                  </text>
                )}
              </g>

              {/* ── FLOWERS (most realistic above envelope) ── */}
              {/* Yellow — far left, leaning */}
              <Iris id="a" x={58} y={258} stemH={122} fallColor="#b89010" fallLight="#ddb820" standColor="#c8a420" lean={-14} leafSide={-1}/>
              {/* Dark burgundy/maroon */}
              <Iris id="b" x={96} y={258} stemH={146} fallColor="#5a1520" fallLight="#8a2838" standColor="#7a2030" lean={-5} leafSide={1}/>
              {/* Deep rust orange — tallest, center */}
              <Iris id="c" x={132} y={258} stemH={160} fallColor="#b83818" fallLight="#d85838" standColor="#c84828" lean={1} leafSide={-1}/>
              {/* Warm red */}
              <Iris id="d" x={168} y={258} stemH={148} fallColor="#b04020" fallLight="#d06038" standColor="#c05030" lean={6} leafSide={1}/>
              {/* Dusty pink */}
              <Iris id="e" x={202} y={258} stemH={128} fallColor="#b07878" fallLight="#d0a898" standColor="#c09090" lean={10} leafSide={-1}/>
              {/* Blue iris — far right */}
              <Iris id="f" x={236} y={258} stemH={112} fallColor="#284890" fallLight="#5070c0" standColor="#4860b0" lean={17} leafSide={1}/>

              {/* ── ENVELOPE BODY ── */}
              {/* Main body */}
              <rect x="14" y="250" width="232" height="135" rx="2" fill="url(#envBody)"/>

              {/* Fold shadows — left triangle */}
              <path d="M14,250 L14,385 L130,318 Z" fill="url(#envLeft)" opacity="0.9"/>
              {/* Right triangle */}
              <path d="M246,250 L246,385 L130,318 Z" fill="url(#envRight)" opacity="0.9"/>
              {/* Bottom triangle */}
              <path d="M14,385 L130,318 L246,385 Z" fill="#a07840" opacity="0.88"/>
              {/* Top flap (open) — points down into envelope */}
              <path d="M14,250 L130,304 L246,250 Z" fill="url(#envFlap)"/>

              {/* Fold edge highlights for depth */}
              <line x1="14" y1="250" x2="130" y2="304" stroke="rgba(255,255,255,0.12)" strokeWidth="1"/>
              <line x1="246" y1="250" x2="130" y2="304" stroke="rgba(0,0,0,0.08)" strokeWidth="1"/>

              {/* Envelope rim */}
              <line x1="14" y1="250" x2="246" y2="250" stroke="#8a6828" strokeWidth="1.2"/>

              {/* "To:" label in cursive */}
              <text x="38" y="372" fontFamily={CURSIVE} fontSize="13" fill="#7a5830" opacity="0.78">
                To: Баярцэцэг
              </text>
            </svg>
          </div>
        </div>

        {/* ── Form panel ── */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 w-full flex flex-col gap-4"
          style={{
            background: '#ffffff',
            border: '1px solid rgba(0,0,0,0.07)',
            borderRadius: 16,
            boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
            padding: '24px 20px',
            fontFamily: FONT,
          }}
        >
          <div>
            <label style={{ display: 'block', fontSize: 10, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.55, marginBottom: 4, fontFamily: FONT }}>
              {t.postcardFrom}
            </label>
            <input
              type="text"
              value={from}
              onChange={e => setFrom(e.target.value)}
              required maxLength={40}
              placeholder={t.postcardFromPlaceholder}
              className="w-full rounded-xl border px-3 py-2.5 bg-transparent focus:outline-none focus:ring-1 focus:ring-current"
              style={{ borderColor: 'rgba(0,0,0,0.10)', fontSize: 14, fontFamily: FONT }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 10, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.55, marginBottom: 4, fontFamily: FONT }}>
              {t.postcardMessageLabel}
            </label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              required maxLength={200} rows={5}
              placeholder={t.postcardPlaceholder}
              className="w-full rounded-xl border px-3 py-2.5 bg-transparent focus:outline-none focus:ring-1 focus:ring-current resize-none"
              style={{
                borderColor: 'rgba(0,0,0,0.10)',
                fontFamily: CURSIVE,
                fontSize: 17,
                lineHeight: 1.55,
              }}
            />
            <p style={{ textAlign: 'right', fontSize: 9, opacity: 0.25, marginTop: 2, fontFamily: FONT }}>{message.length}/200</p>
          </div>

          <AnimatePresence mode="wait">
            {done ? (
              <motion.div key="sent" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }} className="text-center py-3 text-sm"
                style={{ color: '#5a8a38', fontFamily: FONT }}>
                🌸 {t.postcardSent}
              </motion.div>
            ) : (
              <motion.button key="btn" type="submit"
                disabled={loading}
                whileHover={loading ? {} : { scale: 1.02 }} whileTap={{ scale: 0.97 }}
                className="w-full py-3 rounded-xl text-xs font-medium tracking-widest uppercase"
                style={{
                  background: loading ? '#ddd' : 'linear-gradient(135deg, #e4ccb0 0%, #ceb898 100%)',
                  color: '#4a3020',
                  border: '1px solid rgba(0,0,0,0.06)',
                  fontFamily: FONT,
                  letterSpacing: '0.18em',
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}>
                {loading ? '...' : `${t.postcardSubmit} ✉`}
              </motion.button>
            )}
          </AnimatePresence>
        </form>
      </div>

      {/* ── Saved messages ── */}
      <AnimatePresence>
        {messages.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="w-full max-w-2xl">
            <p className="text-[10px] uppercase tracking-[0.3em] opacity-40 text-center mb-4"
              style={{ fontFamily: FONT }}>{t.postcardMessagesTitle}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {messages.map(msg => (
                <motion.div key={msg.id}
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{
                    background: 'linear-gradient(160deg,#fdfaf4 0%,#f5efe4 100%)',
                    border: '1px solid rgba(0,0,0,0.06)',
                    borderRadius: 12, padding: '16px 18px',
                    boxShadow: '0 4px 18px rgba(0,0,0,0.07)',
                    transform: `rotate(${msg.rotate}deg)`,
                  }}>
                  <p style={{ fontFamily: CURSIVE, fontSize: 17, lineHeight: 1.55, color: '#3a2e1c', marginBottom: 10 }}>
                    {msg.text}
                  </p>
                  <p style={{ fontFamily: CURSIVE, fontSize: 14, color: '#7a5838', opacity: 0.85,
                    borderTop: '1px solid rgba(0,0,0,0.07)', paddingTop: 8 }}>
                    — {msg.from}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};
