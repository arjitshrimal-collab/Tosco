'use client'
import { useState, useEffect } from 'react'

const inputStyle = { border: '1px solid #E8E2D5', background: 'white', color: '#1A1A1A', width: '100%', padding: '8px 12px', fontFamily: 'var(--font-inter)', fontSize: '14px' }
const labelStyle = { color: '#9C9080', fontSize: '11px', letterSpacing: '0.08em', display: 'block', marginBottom: '6px', fontFamily: 'var(--font-inter)', textTransform: 'uppercase' as const }

export default function AdminSettingsPage() {
  const [contact, setContact] = useState({ address: '', email: '', phone: '', hours: '' })
  const [social, setSocial] = useState({ instagram: '', facebook: '', pinterest: '' })
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' })
  const [savingContact, setSavingContact] = useState(false)
  const [savingPw, setSavingPw] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    fetch('/api/admin/settings').then((r) => r.json()).then((s) => {
      setContact({ address: s.address || '', email: s.contactEmail || '', phone: s.phone || '', hours: s.hours || '' })
      setSocial({ instagram: s.instagram || '', facebook: s.facebook || '', pinterest: s.pinterest || '' })
    })
  }, [])

  async function saveContact() {
    setSavingContact(true); setMsg('')
    const entries = [
      ['address', contact.address], ['contactEmail', contact.email], ['phone', contact.phone], ['hours', contact.hours],
      ['instagram', social.instagram], ['facebook', social.facebook], ['pinterest', social.pinterest],
    ]
    for (const [key, value] of entries) {
      await fetch('/api/admin/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key, value }) })
    }
    setSavingContact(false); setMsg('Settings saved.')
    setTimeout(() => setMsg(''), 3000)
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault()
    if (pw.next !== pw.confirm) { setMsg('Passwords do not match'); return }
    setSavingPw(true); setMsg('')
    const res = await fetch('/api/admin/change-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ currentPassword: pw.current, newPassword: pw.next }) })
    const d = await res.json()
    setMsg(res.ok ? 'Password updated.' : d.error || 'Failed')
    setSavingPw(false)
    if (res.ok) setPw({ current: '', next: '', confirm: '' })
    setTimeout(() => setMsg(''), 4000)
  }

  return (
    <div style={{ maxWidth: '640px' }}>
      <h1 style={{ fontFamily: 'var(--font-cormorant)', color: '#1A1A1A', fontSize: '32px', fontWeight: 300, marginBottom: '32px' }}>Settings</h1>
      {msg && <div style={{ background: '#F2EDE4', borderLeft: '3px solid #B8935A', padding: '10px 16px', marginBottom: '16px', fontSize: '13px', color: '#1A1A1A' }} className="font-sans">{msg}</div>}

      <div style={{ background: 'white', border: '1px solid #E8E2D5', padding: '32px', marginBottom: '24px' }}>
        <p style={{ fontFamily: 'var(--font-cormorant)', color: '#1A1A1A', fontSize: '22px', marginBottom: '20px' }}>Contact Information</p>
        <div className="space-y-4">
          <div><label style={labelStyle}>Address</label><input style={inputStyle} value={contact.address} onChange={(e) => setContact((c) => ({ ...c, address: e.target.value }))} /></div>
          <div><label style={labelStyle}>Email</label><input type="email" style={inputStyle} value={contact.email} onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))} /></div>
          <div><label style={labelStyle}>Phone</label><input style={inputStyle} value={contact.phone} onChange={(e) => setContact((c) => ({ ...c, phone: e.target.value }))} /></div>
          <div><label style={labelStyle}>Hours</label><input style={inputStyle} value={contact.hours} onChange={(e) => setContact((c) => ({ ...c, hours: e.target.value }))} /></div>
        </div>
        <p style={{ fontFamily: 'var(--font-cormorant)', color: '#1A1A1A', fontSize: '22px', margin: '24px 0 20px' }}>Social Links</p>
        <div className="space-y-4">
          {[['Instagram', 'instagram'], ['Facebook', 'facebook'], ['Pinterest', 'pinterest']].map(([label, key]) => (
            <div key={key}><label style={labelStyle}>{label} URL</label><input style={inputStyle} value={social[key as keyof typeof social]} onChange={(e) => setSocial((s) => ({ ...s, [key]: e.target.value }))} /></div>
          ))}
        </div>
        <button onClick={saveContact} disabled={savingContact} style={{ background: '#B8935A', color: '#FAF7F2', padding: '10px 24px', fontSize: '12px', letterSpacing: '0.1em', marginTop: '20px' }} className="uppercase font-sans disabled:opacity-60">
          {savingContact ? 'Saving…' : 'Save Settings'}
        </button>
      </div>

      <div style={{ background: 'white', border: '1px solid #E8E2D5', padding: '32px' }}>
        <p style={{ fontFamily: 'var(--font-cormorant)', color: '#1A1A1A', fontSize: '22px', marginBottom: '20px' }}>Change Password</p>
        <form onSubmit={changePassword} className="space-y-4">
          {[['Current Password', 'current'], ['New Password', 'next'], ['Confirm New Password', 'confirm']].map(([label, key]) => (
            <div key={key}><label style={labelStyle}>{label}</label><input type="password" required style={inputStyle} value={pw[key as keyof typeof pw]} onChange={(e) => setPw((p) => ({ ...p, [key]: e.target.value }))} /></div>
          ))}
          <button type="submit" disabled={savingPw} style={{ background: '#1A1A1A', color: '#FAF7F2', padding: '10px 24px', fontSize: '12px', letterSpacing: '0.1em' }} className="uppercase font-sans disabled:opacity-60">
            {savingPw ? 'Updating…' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  )
}
