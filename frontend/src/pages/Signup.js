import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

const API = 'https://team-task-manager-production-e1e6.up.railway.app'

function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'member' })
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const update = (field, val) => setForm(prev => ({ ...prev, [field]: val }))

  const handleSignup = async () => {
    if (!form.name || !form.email || !form.password) { setMsg('all fields are needed'); return }
    setLoading(true)
    try {
      await axios.post(`${API}/api/auth/signup`, form)
      setSuccess(true)
      setMsg('account created!')
      setTimeout(() => navigate('/login'), 1500)
    } catch (err) {
      setMsg(err.response?.data?.msg || 'something went wrong')
    }
    setLoading(false)
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>✦ TaskFlow</div>
        <h2 style={styles.heading}>Create account</h2>
        <p style={styles.sub}>Start managing your team's work</p>

        {msg && (
          <div style={{ ...styles.notice, ...(success ? styles.noticeSuccess : styles.noticeError) }}>
            {msg}
          </div>
        )}

        <div style={styles.field}>
          <label style={styles.label}>Full name</label>
          <input style={styles.input} value={form.name} placeholder="Anil Joshi"
            onChange={e => update('name', e.target.value)} />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Email</label>
          <input style={styles.input} value={form.email} placeholder="you@example.com"
            onChange={e => update('email', e.target.value)} />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Password</label>
          <input style={styles.input} type="password" value={form.password} placeholder="••••••••"
            onChange={e => update('password', e.target.value)} />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Role</label>
          <div style={styles.roleRow}>
            {['member', 'admin'].map(r => (
              <button key={r} onClick={() => update('role', r)}
                style={{ ...styles.roleBtn, ...(form.role === r ? styles.roleBtnActive : {}) }}>
                {r === 'admin' ? '⚡ Admin' : '👤 Member'}
              </button>
            ))}
          </div>
        </div>

        <button style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }}
          onClick={handleSignup} disabled={loading}>
          {loading ? 'Creating...' : 'Create account →'}
        </button>

        <p style={styles.footer}>
          Already have one? <Link to="/login" style={styles.link}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh', background: '#0f0f13',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: "'Georgia', serif",
  },
  card: {
    background: '#1a1a24', border: '1px solid #2a2a3a',
    borderRadius: '16px', padding: '48px 40px',
    width: '100%', maxWidth: '400px',
    boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
  },
  logo: { color: '#a78bfa', fontSize: '20px', fontWeight: 'bold', letterSpacing: '0.05em', marginBottom: '32px' },
  heading: { color: '#f1f0ff', margin: '0 0 8px', fontSize: '26px', fontWeight: 'normal' },
  sub: { color: '#6b6b8a', margin: '0 0 28px', fontSize: '14px' },
  notice: { padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '20px', border: '1px solid' },
  noticeError: { background: '#2d1a1a', borderColor: '#5a2a2a', color: '#f87171' },
  noticeSuccess: { background: '#1a2d1a', borderColor: '#2a5a2a', color: '#4ade80' },
  field: { marginBottom: '18px' },
  label: { display: 'block', color: '#9090b0', fontSize: '12px', marginBottom: '6px', letterSpacing: '0.05em', textTransform: 'uppercase' },
  input: {
    width: '100%', background: '#13131c', border: '1px solid #2a2a3a',
    borderRadius: '8px', padding: '12px 14px', color: '#f1f0ff',
    fontSize: '14px', outline: 'none', boxSizing: 'border-box',
  },
  roleRow: { display: 'flex', gap: '10px' },
  roleBtn: {
    flex: 1, padding: '10px', borderRadius: '8px', cursor: 'pointer',
    background: '#13131c', border: '1px solid #2a2a3a',
    color: '#6b6b8a', fontSize: '13px', transition: 'all 0.2s',
  },
  roleBtnActive: { background: '#2d1f4e', border: '1px solid #7c3aed', color: '#a78bfa' },
  btn: {
    width: '100%', background: '#7c3aed', color: '#fff',
    border: 'none', borderRadius: '8px', padding: '13px',
    fontSize: '15px', cursor: 'pointer', marginTop: '8px',
    letterSpacing: '0.02em',
  },
  footer: { color: '#6b6b8a', fontSize: '13px', textAlign: 'center', marginTop: '24px' },
  link: { color: '#a78bfa', textDecoration: 'none' },
}

export default Signup