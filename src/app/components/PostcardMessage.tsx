import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';

// Simplified botanical iris drawn in SVG
const Iris = ({
  x, y, stemH, fallColor, standColor, lean = 0, leafSide = 1,
}: {
  x: number; y: number; stemH: number;
  fallColor: string; standColor: string;
  lean?: number; leafSide?: number;
}) => {
  const c1x = lean > 0 ? 6 : -6;
  const c2x = lean > 0 ? -3 : 3;
  const lx1 = leafSide * 22;
  const lx2 = leafSide * 28;
  const lx3 = leafSide * 15;
  return (
    <g transform={`translate(${x},${y}) rotate(${lean})`}>
      {/* Stem */}
      <path
        d={`M0,0 C${c1x},${-stemH * 0.35} ${c2x},${-stemH * 0.72} 0,${-stemH}`}
        stroke="#3d6020"
        strokeWidth="2.8"
        fill="none"
        strokeLinecap="round"
      />
      {/* Sword leaf */}
      <path
        d={`M0,${-stemH * 0.44} C${lx1},${-stemH * 0.52} ${lx2},${-stemH * 0.8} ${lx3},${-stemH * 0.96} C${leafSide * 5},${-stemH * 0.8} 0,${-stemH * 0.52} 0,${-stemH * 0.44}`}
        fill="#4d7828"
        opacity="0.85"
      />
      {/* Falls — 3 drooping petals */}
      <g transform={`translate(0,${-stemH})`}>
        <ellipse cx={-14} cy={15} rx={9.5} ry={21} fill={fallColor}
          transform="rotate(30,-14,15)" opacity="0.88"/>
        <ellipse cx={0} cy={17} rx={9.5} ry={20} fill={fallColor} opacity="0.88"/>
        <ellipse cx={14} cy={15} rx={9.5} ry={21} fill={fallColor}
          transform="rotate(-30,14,15)" opacity="0.88"/>
        {/* Standards — 3 upright petals */}
        <ellipse cx={-11} cy={-22} rx={8} ry={18} fill={standColor}
          transform="rotate(-20,-11,-22)" opacity="0.93"/>
        <ellipse cx={0} cy={-26} rx={8} ry={19} fill={standColor} opacity="0.93"/>
        <ellipse cx={11} cy={-22} rx={8} ry={18} fill={standColor}
          transform="rotate(20,11,-22)" opacity="0.93"/>
        {/* Center */}
        <circle cx={0} cy={0} r={6} fill="#fffce0" opacity="0.85"/>
        <circle cx={0} cy={0} r={3.5} fill="#f5e040" opacity="0.65"/>
      </g>
    </g>
  );
};

// Wrap text into lines for SVG tspan rendering
function toLines(text: string, maxChars: number): string[] {
  if (!text) return [];
  const words = text.split(' ');
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    if (line.length + w.length + 1 <= maxChars) {
      line = line ? line + ' ' + w : w;
    } else {
      if (line) lines.push(line);
      line = w;
    }
  }
  if (line) lines.push(line);
  return lines;
}

interface GMessage {
  id: number;
  from: string;
  text: string;
  rotate: number;
}

export const PostcardMessage = () => {
  const { t } = useLanguage();
  const [from, setFrom] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<GMessage[]>([]);
  const [latest, setLatest] = useState<GMessage | null>(null);
  const [done, setDone] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !from.trim()) return;
    const msg: GMessage = {
      id: Date.now(),
      from: from.trim(),
      text: message.trim(),
      rotate: (messages.length % 2 === 0 ? 1 : -1) * (1 + (messages.length % 3) * 0.5),
    };
    setMessages(prev => [msg, ...prev]);
    setLatest(msg);
    setMessage('');
    setFrom('');
    setDone(true);
    setTimeout(() => setDone(false), 3000);
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
      {/* Header */}
      <div className="text-center">
        <p className="text-[10px] uppercase tracking-[0.35em] opacity-50 mb-2">{t.postcardLabel}</p>
        <h2 className="text-2xl sm:text-3xl font-light tracking-wide">{t.postcardTitle}</h2>
      </div>

      {/* Scene + Form side by side */}
      <div className="w-full max-w-2xl flex flex-col sm:flex-row gap-6 items-center sm:items-start justify-center">

        {/* ── Envelope Scene ── */}
        <div className="flex-shrink-0">
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              width: 260,
              height: 380,
              background: 'linear-gradient(175deg, #fefce8 0%, #e8f4fa 100%)',
            }}
          >
            <svg viewBox="0 0 260 380" width="260" height="380" xmlns="http://www.w3.org/2000/svg">

              {/* ── LETTER ── (behind flowers & above envelope) */}
              <g transform="rotate(-2,130,290)">
                <rect x="42" y="155" width="174" height="208" fill="#f4f2ed" rx="2"
                  style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.12))' }}/>
                {/* Ruled lines */}
                {[0,1,2,3,4,5].map(i => (
                  <line key={i} x1="54" y1={185 + i * 24} x2="204" y2={185 + i * 24}
                    stroke="#cdc4b0" strokeWidth="0.7" opacity="0.5"/>
                ))}
                {/* Message or placeholder */}
                {latest ? (
                  <>
                    <text
                      fontFamily="'Dancing Script',cursive"
                      fontSize="13"
                      fill="#3a2e1c"
                      opacity="0.88"
                    >
                      {msgLines.slice(0, 6).map((line, i) => (
                        <tspan key={i} x="56" y={186 + i * 24}>{line}</tspan>
                      ))}
                    </text>
                    <text x="196" y={186 + Math.min(msgLines.length, 6) * 24 + 14}
                      fontFamily="'Dancing Script',cursive" fontSize="12"
                      fill="#6a5030" textAnchor="end" opacity="0.8">
                      — {latest.from}
                    </text>
                  </>
                ) : (
                  <text x="130" y="255" fontFamily="Georgia,serif" fontSize="9"
                    fill="#b8b0a0" textAnchor="middle" opacity="0.7">
                    {t.postcardEmptyHint}
                  </text>
                )}
              </g>

              {/* ── IRIS FLOWERS ── */}
              {/* Yellow — far left, leaning left */}
              <Iris x={60} y={255} stemH={118} fallColor="#c09818" standColor="#e0c030" lean={-14} leafSide={-1}/>
              {/* Dark maroon */}
              <Iris x={98} y={255} stemH={142} fallColor="#5e1a22" standColor="#8c3040" lean={-5} leafSide={1}/>
              {/* Rust orange — tallest, center */}
              <Iris x={133} y={255} stemH={156} fallColor="#b84020" standColor="#dc6040" lean={1} leafSide={-1}/>
              {/* Red-orange */}
              <Iris x={168} y={255} stemH={144} fallColor="#b84830" standColor="#d86050" lean={5} leafSide={1}/>
              {/* Pink */}
              <Iris x={200} y={255} stemH={124} fallColor="#c08888" standColor="#d8aeae" lean={9} leafSide={-1}/>
              {/* Blue — far right */}
              <Iris x={232} y={255} stemH={110} fallColor="#2e4898" standColor="#5878cc" lean={16} leafSide={1}/>

              {/* ── ENVELOPE BODY ── */}
              <rect x="14" y="248" width="232" height="128" fill="#c4a882" rx="3"/>

              {/* Fold triangles */}
              {/* Left */}
              <path d="M14,248 L14,376 L130,314 Z" fill="#b8936a"/>
              {/* Right */}
              <path d="M246,248 L246,376 L130,314 Z" fill="#c2a070"/>
              {/* Bottom */}
              <path d="M14,376 L130,314 L246,376 Z" fill="#b08858"/>
              {/* Top flap (opening) — darker V pointing down */}
              <path d="M14,248 L130,300 L246,248 Z" fill="#a87c48"/>
              {/* Envelope rim line */}
              <line x1="14" y1="248" x2="246" y2="248" stroke="#9a7038" strokeWidth="1.2"/>

              {/* To: label */}
              <text x="36" y="360" fontFamily="'Dancing Script',cursive"
                fontSize="13" fill="#7a5838" opacity="0.78">
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
            minWidth: 0,
          }}
        >
          {/* From */}
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] opacity-55 mb-1">
              {t.postcardFrom}
            </label>
            <p className="text-[10px] opacity-35 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
              {t.postcardFromHint}
            </p>
            <input
              type="text"
              value={from}
              onChange={e => setFrom(e.target.value)}
              required
              maxLength={40}
              placeholder={t.postcardFromPlaceholder}
              className="w-full rounded-xl border px-3 py-2.5 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-current"
              style={{ borderColor: 'rgba(0,0,0,0.10)' }}
            />
            <p className="text-right text-[9px] opacity-25 mt-1">{from.length}/40</p>
          </div>

          {/* Message */}
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] opacity-55 mb-1">
              {t.postcardMessageLabel}
            </label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              required
              maxLength={200}
              rows={5}
              placeholder={t.postcardPlaceholder}
              className="w-full rounded-xl border px-3 py-2.5 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-current resize-none"
              style={{
                borderColor: 'rgba(0,0,0,0.10)',
                fontFamily: "'Dancing Script', cursive",
                fontSize: 17,
                lineHeight: 1.55,
              }}
            />
            <p className="text-right text-[9px] opacity-25 mt-0.5">{message.length}/200</p>
          </div>

          <AnimatePresence mode="wait">
            {done ? (
              <motion.div
                key="sent"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center py-3 text-sm"
                style={{ color: '#5a8a38', fontFamily: 'Georgia, serif' }}
              >
                🌸 {t.postcardSent}
              </motion.div>
            ) : (
              <motion.button
                key="btn"
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="w-full py-3 rounded-xl text-xs font-medium tracking-[0.2em] uppercase"
                style={{
                  background: 'linear-gradient(135deg, #e4ccb0 0%, #ceb898 100%)',
                  color: '#4a3020',
                  border: '1px solid rgba(0,0,0,0.06)',
                  fontFamily: 'Montserrat, sans-serif',
                }}
              >
                {t.postcardSubmit} ✉
              </motion.button>
            )}
          </AnimatePresence>
        </form>
      </div>

      {/* ── Submitted messages ── */}
      <AnimatePresence>
        {messages.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-2xl"
          >
            <p className="text-[10px] uppercase tracking-[0.3em] opacity-40 text-center mb-4"
              style={{ fontFamily: 'Georgia, serif' }}>
              {t.postcardMessagesTitle}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {messages.map(msg => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{
                    background: 'linear-gradient(160deg, #fdfaf4 0%, #f5efe4 100%)',
                    border: '1px solid rgba(0,0,0,0.06)',
                    borderRadius: 12,
                    padding: '16px 18px',
                    boxShadow: '0 4px 18px rgba(0,0,0,0.07)',
                    transform: `rotate(${msg.rotate}deg)`,
                  }}
                >
                  <p style={{
                    fontFamily: "'Dancing Script', cursive",
                    fontSize: 17,
                    lineHeight: 1.55,
                    color: '#3a2e1c',
                    marginBottom: 10,
                  }}>
                    {msg.text}
                  </p>
                  <p style={{
                    fontFamily: "'Dancing Script', cursive",
                    fontSize: 14,
                    color: '#7a5838',
                    opacity: 0.85,
                    borderTop: '1px solid rgba(0,0,0,0.07)',
                    paddingTop: 8,
                  }}>
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
