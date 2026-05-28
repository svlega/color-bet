import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../api/auth';
import type { User } from '@color-bet/shared-types';
import * as s from './Login.css';

interface Props {
  onLogin: (token: string, user: User) => void;
}

export function Login({ onLogin }: Props) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handle(mode: 'login' | 'register') {
    setError('');
    setLoading(true);
    try {
      const res = await (mode === 'login' ? login : register)({ username, password });
      localStorage.setItem('token', res.token);
      onLogin(res.token, res.user);
      navigate('/');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={s.page}>
      <div className={s.card}>
        <div className={s.title}>COLOR BET</div>
        <div className={s.subtitle}>Real-time betting · 1,000 starting credits</div>

        <input
          className={s.inputStyle}
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          data-testid="username"
        />
        <input
          className={s.inputStyle}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handle('login')}
          data-testid="password"
        />

        {error && <div className={s.errorBox}>{error}</div>}

        <button
          className={`${s.btn} ${s.primaryBtn}`}
          onClick={() => handle('login')}
          disabled={loading}
          data-testid="login-btn"
        >
          Login
        </button>
        <button
          className={`${s.btn} ${s.secondaryBtn}`}
          onClick={() => handle('register')}
          disabled={loading}
          data-testid="register-btn"
        >
          Register
        </button>
      </div>
    </div>
  );
}
