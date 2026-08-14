import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, KeyRound, AlertCircle, CheckCircle2 } from 'lucide-react';
import { forgotPassword } from '../utils/api';
import './Auth.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) {
      setError('Masukkan alamat email yang valid.');
      return;
    }
    setSubmitting(true);
    try {
      await forgotPassword(email.trim());
      setSent(true);
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan. Coba lagi.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="auth">
      <Link to="/login" className="auth__back"><ArrowLeft size={14} /> Kembali ke halaman masuk</Link>

      <span className="auth__eyebrow"><KeyRound size={13} /> Lupa Password</span>
      <h1 className="auth__title">Reset password kamu</h1>
      <p className="auth__sub">Masukkan email yang terdaftar. Kami akan kirim tautan untuk mengatur ulang password.</p>

      {error && <div className="auth__error"><AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} />{error}</div>}

      {sent ? (
        <div className="auth__success">
          <CheckCircle2 size={16} style={{ flexShrink: 0, marginTop: 1 }} />
          <span>Jika email <strong>{email}</strong> terdaftar, kami sudah mengirim tautan reset password. Cek juga folder spam kalau belum muncul.</span>
        </div>
      ) : (
        <form className="auth__form" onSubmit={handleSubmit}>
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

          <button type="submit" className="auth__submit" disabled={submitting}>
            {submitting ? 'Mengirim...' : 'Kirim Tautan Reset'}
          </button>
        </form>
      )}

      <p className="auth__foot">Belum punya akun? <Link to="/register">Daftar di sini</Link></p>
    </main>
  );
}
