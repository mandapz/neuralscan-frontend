import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, User, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import './Auth.css';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!/^[a-zA-Z0-9_]{3,32}$/.test(username.trim())) {
      setError('Username harus 3-32 karakter, hanya huruf/angka/underscore.');
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) {
      setError('Format email tidak valid.');
      return;
    }
    if (password.length < 8) {
      setError('Password minimal 8 karakter.');
      return;
    }
    if (password !== confirm) {
      setError('Konfirmasi password tidak cocok.');
      return;
    }

    setSubmitting(true);
    try {
      await register(username.trim(), email.trim(), password);
      navigate('/history', { replace: true });
    } catch (err) {
      setError(err.message || 'Gagal mendaftar. Coba lagi.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="auth">
      <span className="auth__eyebrow"><UserPlus size={13} /> Daftar</span>
      <h1 className="auth__title">Buat akun NeuralScan</h1>
      <p className="auth__sub">Simpan riwayat deteksimu dan sinkronkan lintas perangkat.</p>

      {error && <div className="auth__error"><AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} />{error}</div>}

      <form className="auth__form" onSubmit={handleSubmit}>
        <div className="auth__field">
          <label className="auth__label" htmlFor="username">Username</label>
          <div className="auth__input-wrap">
            <span className="auth__input-icon"><User size={16} /></span>
            <input
              id="username" className="auth__input" type="text" autoComplete="username"
              placeholder="username unik kamu"
              value={username} onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <span className="auth__hint">3-32 karakter, huruf/angka/underscore saja.</span>
        </div>

        <div className="auth__field">
          <label className="auth__label" htmlFor="email">Email</label>
          <div className="auth__input-wrap">
            <span className="auth__input-icon"><Mail size={16} /></span>
            <input
              id="email" className="auth__input" type="email" autoComplete="email"
              placeholder="kamu@email.com"
              value={email} onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="auth__field">
          <label className="auth__label" htmlFor="password">Password</label>
          <div className="auth__input-wrap">
            <span className="auth__input-icon"><Lock size={16} /></span>
            <input
              id="password" className="auth__input" type={showPw ? 'text' : 'password'} autoComplete="new-password"
              placeholder="Minimal 8 karakter"
              value={password} onChange={(e) => setPassword(e.target.value)}
              style={{ paddingRight: 40 }}
            />
            <button type="button" className="auth__input-toggle" onClick={() => setShowPw(!showPw)} tabIndex={-1}>
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div className="auth__field">
          <label className="auth__label" htmlFor="confirm">Konfirmasi Password</label>
          <div className="auth__input-wrap">
            <span className="auth__input-icon"><Lock size={16} /></span>
            <input
              id="confirm" className="auth__input" type={showPw ? 'text' : 'password'} autoComplete="new-password"
              placeholder="Ulangi password"
              value={confirm} onChange={(e) => setConfirm(e.target.value)}
            />
          </div>
        </div>

        <button type="submit" className="auth__submit" disabled={submitting}>
          {submitting ? 'Memproses...' : 'Daftar'}
        </button>
      </form>

      <p className="auth__foot">Sudah punya akun? <Link to="/login">Masuk di sini</Link></p>
    </main>
  );
}
