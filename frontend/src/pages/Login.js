import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

const API = 'https://team-task-manager-production-e1e6.up.railway.app'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errMsg, setErrMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async () => {
    if (!email || !password) { setErrMsg('please fill everything'); return }
    setLoading(true)
    try {
      const res = await axios.post(`${API}/api/auth/login`, { email, password })
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      navigate('/dashboard')
    } catch {
      setErrMsg('login failed, check your details')
    }
    setLoading(false)
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>✦ TaskFlow</div>
        <h2 style={styles.heading}>Welcome back</h2>
        <p style={styles.sub}>Sign in to your workspace</p>

        {errMsg && <div style={styles.error}>{errMsg}</div>}

        <div style={styles.field}>
          <label style={styles.label}>Email</label>
          <input style={styles.input} type="email" value={email}
            placeholder="you@example.com"
            onChange={e => { setEmail(e.target.value); setErrMsg('') }}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Password</label>
          <input style={styles.input} type="password" value={password}
            placeholder="••••••••"
            onChange={e => { setPassword(e.target.value); setErrMsg('') }}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
          />
        </div>

        <button style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }}
          onClick={handleLogin} disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in →'}
        </button>

        <p style={styles.footer}>
          No account? <Link to="/signup" style={styles.link}>Create one</Link>
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
  logo: {
    color: '#a78bfa', fontSize: '20px', fontWeight: 'bold',
    letterSpacing: '0.05em', marginBottom: '32px',
  },
  heading: { color: '#f1f0ff', margin: '0 0 8px', fontSize: '26px', fontWeight: 'normal' },
  sub: { color: '#6b6b8a', margin: '0 0 28px', fontSize: '14px' },
  error: {
    background: '#2d1a1a', border: '1px solid #5a2a2a',
    color: '#f87171', padding: '10px 14px',
    borderRadius: '8px', fontSize: '13px', marginBottom: '20px',
  },
  field: { marginBottom: '18px' },
  label: { display: 'block', color: '#9090b0', fontSize: '12px', marginBottom: '6px', letterSpacing: '0.05em', textTransform: 'uppercase' },
  input: {
    width: '100%', background: '#13131c', border: '1px solid #2a2a3a',
    borderRadius: '8px', padding: '12px 14px', color: '#f1f0ff',
    fontSize: '14px', outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  },
  btn: {
    width: '100%', background: '#7c3aed', color: '#fff',
    border: 'none', borderRadius: '8px', padding: '13px',
    fontSize: '15px', cursor: 'pointer', marginTop: '8px',
    letterSpacing: '0.02em', transition: 'background 0.2s',
  },
  footer: { color: '#6b6b8a', fontSize: '13px', textAlign: 'center', marginTop: '24px' },
  link: { color: '#a78bfa', textDecoration: 'none' },
}

export default Login