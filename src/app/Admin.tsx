import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const PASSWORD = 'bayar2026';

interface RsvpRow {
  id: number;
  created_at: string;
  name: string;
  attending: boolean;
  guests: number;
  message: string | null;
}

interface PostcardRow {
  id: number;
  created_at: string;
  from_name: string;
  message: string;
}

const fmt = (iso: string) =>
  new Date(iso).toLocaleString('mn-MN', { dateStyle: 'short', timeStyle: 'short' });

// ── Login ──────────────────────────────────────────────────────────────────
const Login = ({ onAuth }: { onAuth: () => void }) => {
  const [pw, setPw] = useState('');
  const [err, setErr] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw === PASSWORD) { onAuth(); }
    else { setErr(true); setTimeout(() => setErr(false), 1500); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f8f8' }}>
      <form onSubmit={submit} style={{ background: '#fff', padding: 40, borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.10)', width: 320 }}>
        <h1 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Admin</h1>
        <p style={{ fontSize: 13, color: '#888', marginBottom: 24 }}>Нэвтрэх нууц үг оруулна уу</p>
        <input
          type="password"
          value={pw}
          onChange={e => setPw(e.target.value)}
          placeholder="Нууц үг"
          autoFocus
          style={{
            width: '100%', padding: '10px 14px', borderRadius: 10,
            border: `1.5px solid ${err ? '#e53e3e' : '#e2e8f0'}`,
            fontSize: 14, outline: 'none', marginBottom: 16, boxSizing: 'border-box',
            transition: 'border-color 0.2s',
          }}
        />
        {err && <p style={{ color: '#e53e3e', fontSize: 12, marginBottom: 8 }}>Нууц үг буруу байна</p>}
        <button type="submit" style={{
          width: '100%', padding: '10px 0', background: '#1a1a1a', color: '#fff',
          border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer',
        }}>
          Нэвтрэх
        </button>
      </form>
    </div>
  );
};

// ── Stats card ─────────────────────────────────────────────────────────────
const Stat = ({ label, value, color = '#1a1a1a' }: { label: string; value: number | string; color?: string }) => (
  <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: 12, padding: '16px 20px', minWidth: 120 }}>
    <div style={{ fontSize: 26, fontWeight: 700, color }}>{value}</div>
    <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{label}</div>
  </div>
);

// ── RSVP Tab ───────────────────────────────────────────────────────────────
const RsvpTab = () => {
  const [rows, setRows] = useState<RsvpRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('rsvp').select('*').order('created_at', { ascending: false });
    if (data) setRows(data as RsvpRow[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const exportCSV = () => {
    const headers = ['Нэр', 'Ирэх эсэх', 'Хүний тоо', 'Захиа', 'Огноо'];
    const csvRows = rows.map(r => [
      r.name,
      r.attending ? 'Тийм' : 'Үгүй',
      r.guests ?? 0,
      (r.message ?? '').replace(/,/g, ';'),
      fmt(r.created_at),
    ]);
    const csv = [headers, ...csvRows].map(row => row.join(',')).join('\n');
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'rsvp.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const total = rows.length;
  const coming = rows.filter(r => r.attending).length;
  const notComing = rows.filter(r => !r.attending).length;
  const totalGuests = rows.filter(r => r.attending).reduce((s, r) => s + (r.guests || 1), 0);

  if (loading) return <p style={{ color: '#888', padding: 20 }}>Ачааллаж байна...</p>;

  return (
    <div>
      {/* Stats */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
        <Stat label="Нийт хариу" value={total} />
        <Stat label="Ирэх тоо" value={coming} color="#22c55e" />
        <Stat label="Ирэхгүй тоо" value={notComing} color="#ef4444" />
        <Stat label="Нийт хүний тоо" value={totalGuests} color="#3b82f6" />
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        <button onClick={load} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', fontSize: 13, cursor: 'pointer' }}>
          ↻ Refresh
        </button>
        <button onClick={exportCSV} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: '#1a1a1a', color: '#fff', fontSize: 13, cursor: 'pointer' }}>
          ⬇ CSV Export
        </button>
      </div>

      {/* Table */}
      {rows.length === 0 ? (
        <p style={{ color: '#888', textAlign: 'center', padding: 40 }}>Одоогоор хариу байхгүй байна</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                {['Нэр', 'Ирэх эсэх', 'Хүний тоо', 'Захиа', 'Огноо'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: '#374151', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.id} style={{ borderBottom: '1px solid #f3f4f6', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 500 }}>{r.name}</td>
                  <td style={{ padding: '10px 14px', fontSize: 18 }}>{r.attending ? '✅' : '❌'}</td>
                  <td style={{ padding: '10px 14px', textAlign: 'center' }}>{r.attending ? (r.guests || 1) : '—'}</td>
                  <td style={{ padding: '10px 14px', color: '#6b7280', maxWidth: 200 }}>{r.message || '—'}</td>
                  <td style={{ padding: '10px 14px', color: '#9ca3af', whiteSpace: 'nowrap' }}>{fmt(r.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// ── Postcards Tab ──────────────────────────────────────────────────────────
const PostcardsTab = () => {
  const [cards, setCards] = useState<PostcardRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('postcards').select('*').order('created_at', { ascending: false });
    if (data) setCards(data as PostcardRow[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const deleteCard = async (id: number) => {
    if (!confirm('Энэ захиаг устгах уу?')) return;
    setDeleting(id);
    await supabase.from('postcards').delete().eq('id', id);
    setCards(prev => prev.filter(c => c.id !== id));
    setDeleting(null);
  };

  if (loading) return <p style={{ color: '#888', padding: 20 }}>Ачааллаж байна...</p>;

  return (
    <div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <button onClick={load} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', fontSize: 13, cursor: 'pointer' }}>
          ↻ Refresh
        </button>
        <span style={{ color: '#888', fontSize: 13, lineHeight: '34px' }}>Нийт: {cards.length} захиа</span>
      </div>

      {cards.length === 0 ? (
        <p style={{ color: '#888', textAlign: 'center', padding: 40 }}>Одоогоор захиа байхгүй байна</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {cards.map(c => (
            <div key={c.id} style={{
              background: '#fdfaf4', border: '1px solid #e8e0d0', borderRadius: 12,
              padding: '18px 20px', position: 'relative',
            }}>
              <button
                onClick={() => deleteCard(c.id)}
                disabled={deleting === c.id}
                style={{
                  position: 'absolute', top: 10, right: 10,
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#d1d5db', fontSize: 16, lineHeight: 1, padding: 4,
                  transition: 'color 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')}
                onMouseLeave={e => (e.currentTarget.style.color = '#d1d5db')}
                title="Устгах"
              >
                ✕
              </button>
              <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: 17, lineHeight: 1.6, color: '#3a2e1c', marginBottom: 12, paddingRight: 24 }}>
                {c.message}
              </p>
              <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: 14, color: '#7a5838', borderTop: '1px solid rgba(0,0,0,0.07)', paddingTop: 8, marginBottom: 4 }}>
                — {c.from_name}
              </p>
              <p style={{ fontSize: 11, color: '#9ca3af' }}>{fmt(c.created_at)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Main Admin ─────────────────────────────────────────────────────────────
export const Admin = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [tab, setTab] = useState<'rsvp' | 'postcards'>('rsvp');

  if (!authenticated) return <Login onAuth={() => setAuthenticated(true)} />;

  return (
    <div style={{ minHeight: '100vh', background: '#f8f8f8', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>🎓 Admin Dashboard</h1>
          <p style={{ fontSize: 12, color: '#9ca3af', margin: '2px 0 0' }}>Ц.Баярцэцэг — Төгсөлтийн урилга 2026</p>
        </div>
        <button
          onClick={() => setAuthenticated(false)}
          style={{ fontSize: 12, color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          Гарах
        </button>
      </div>

      {/* Tabs */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '0 32px' }}>
        {(['rsvp', 'postcards'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: '14px 20px', border: 'none', background: 'none', cursor: 'pointer',
              fontSize: 14, fontWeight: tab === t ? 600 : 400,
              color: tab === t ? '#1a1a1a' : '#6b7280',
              borderBottom: tab === t ? '2px solid #1a1a1a' : '2px solid transparent',
              marginBottom: -1,
            }}
          >
            {t === 'rsvp' ? 'RSVP жагсаалт' : 'Захиаанууд'}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: '28px 32px', maxWidth: 1100, margin: '0 auto' }}>
        {tab === 'rsvp' ? <RsvpTab /> : <PostcardsTab />}
      </div>
    </div>
  );
};
