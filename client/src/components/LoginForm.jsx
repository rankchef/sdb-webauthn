import React, { useState } from 'react'
import { useLogin } from '../hooks/useLogin';
import { useAuth } from '../context/AuthProvider';
import Toast from './Toast';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const { login, isLoading, success, error } = useLogin();
  const { setUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const loggedInUser = await login(username);
      setUser(loggedInUser);
    } catch (err) {
    }
  };

  return (
    <>
      <div className="auth-header">
        <h2>Најавете се</h2>
        <p className="subtitle">Користете го вашиот passkey за да продолжите.</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="field">
          <label htmlFor="login-username">Корисничко име</label>
          <input
            id="login-username"
            type="text"
            autoComplete="username"
            placeholder="на пр. ana"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <button className="btn-primary" type="submit" disabled={isLoading || !username.trim()}>
          {isLoading ? 'Се процесира...' : 'Најавете се'}
        </button>

        {error && <div className="feedback error">{error}</div>}
        {success && <Toast message={"Успешна најава"} isError={false} />}
      </form>
    </>
  )
}

export default LoginForm
