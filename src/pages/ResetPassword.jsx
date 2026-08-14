import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { resetPassword } from '../utils/api';
import './Auth.css';

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get('token') || '';
  const email = params.get('email') || '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const linkValid = Boolean(token && email);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
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
      await resetPassword({ token, email, password });
      setDone(true);
    } catch (err) {
      setError(err.message || 'Tautan reset tidak valid atau sudah kedaluwarsa.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="auth">
      <span className="auth__eyebrow"><ShieldCheck size={13} /> Reset Password</span>
      <h1 className="auth__title">Atur password baru</h1>
      <p className="auth__sub">
        {linkValid ? <>Untuk akun <strong>{email}</strong>.</> : 'Buat password baru untuk akunmu.'}
      </p>

      {!linkValid && (
        <div className="auth__error">
          <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
          Tautan reset tidak lengkap atau tidak valid. Minta tautan baru lewat halaman lupa password.
        </div>
      )}

      {error && <div className="auth__error"><AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} />{error}</div>}

      {done ? (
        <div className="auth__success">
          <CheckCircle2 size={16} style={{ flexShrink: 0, marginTop: 1 }} />
          <span>Password berhasil diubah. Silakan masuk dengan password barumu.</span>
        </div>
      ) : linkValid && (
        <form className="auth__form" onSubmit={handleSubmit}>
          <div className="auth__field">
            <label className="auth__label" htmlFor="password">Password Baru</label>
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
            <label className="auth__label" htmlFor="confirm">Konfirmasi Password Baru</label>
            <div className="auth__input-wrap">
              <span className="auth__input-icon"><Lock size={16} /></span>
              <input
                id="confirm" className="auth__input" type={showPw ? 'text' : 'password'} autoComplete="new-password"
                placeholder="Ulangi password baru"
                value={confirm} onChange={(e) => setConfirm(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="auth__submit" disabled={submitting}>
            {submitting ? 'Menyimpan...' : 'Simpan Password Baru'}
          </button>
        </form>
      )}

      <p className="auth__foot">
        {done ? <>Lanjut <Link to="/login">masuk sekarang</Link>.</>
              : <>Ingat password kamu? <Link to="/login">Masuk di sini</Link></>}
      </p>
    </main>
  );
}
