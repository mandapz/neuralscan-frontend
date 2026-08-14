import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, User, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import './Auth.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = location.state?.from || '/history';

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!identifier.trim() || !password) {
      setError('Isi username/email dan password.');
      return;
    }
    setSubmitting(true);
    try {
      await login(identifier.trim(), password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || 'Gagal masuk. Coba lagi.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="auth">
      <span className="auth__eyebrow"><LogIn size={13} /> Masuk</span>
      <h1 className="auth__title">Selamat datang kembali</h1>
      <p className="auth__sub">Masuk untuk menyimpan dan menyinkronkan riwayat deteksi kamu.</p>

      {error && <div className="auth__error"><AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} />{error}</div>}

      <form className="auth__form" onSubmit={handleSubmit}>
        <div className="auth__field">
          <label className="auth__label" htmlFor="identifier">Username atau Email</label>
          <div className="auth__input-wrap">
            <span className="auth__input-icon"><User size={16} /></span>
            <input
              id="identifier" className="auth__input" type="text" autoComplete="username"
              placeholder="username atau email kamu"
              value={identifier} onChange={(e) => setIdentifier(e.target.value)}
            />
          </div>
        </div>

        <div className="auth__field">
          <label className="auth__label" htmlFor="password">Password</label>
          <div className="auth__input-wrap">
            <span className="auth__input-icon"><Lock size={16} /></span>
            <input
              id="password" className="auth__input" type={showPw ? 'text' : 'password'} autoComplete="current-password"
              placeholder="Password kamu"
              value={password} onChange={(e) => setPassword(e.target.value)}
              style={{ paddingRight: 40 }}
            />
            <button type="button" className="auth__input-toggle" onClick={() => setShowPw(!showPw)} tabIndex={-1}>
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <Link to="/forgot-password" className="auth__forgot-link">Lupa password?</Link>
        </div>

        <button type="submit" className="auth__submit" disabled={submitting}>
          {submitting ? 'Memproses...' : 'Masuk'}
        </button>
      </form>

      <p className="auth__foot">Belum punya akun? <Link to="/register">Daftar di sini</Link></p>
    </main>
  );
}
