import React, { useState } from 'react';
import { useRegistration } from '../hooks/useRegistration';
import Toast from './Toast';

const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const { register, isLoading, success, error } = useRegistration();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(username);
    } catch (err) {
    }
  };

  return (
    <>
      <div className="auth-header">
        <h2>Креирајте сметка</h2>
        <p className="subtitle">Регистрирајте се со passkey.</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="field">
          <label htmlFor="register-username">Корисничко име</label>
          <input
            id="register-username"
            type="text"
            autoComplete="username"
            placeholder="на пр. ana"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <button className="btn-primary" type="submit" disabled={isLoading || !username.trim()}>
          {isLoading ? 'Се процесира...' : 'Регистрирај се'}
        </button>

        {error && <div className="feedback error">{error}</div>}
        {success && <Toast message={"Успешна регистрација"} isError={false} />}
      </form>
    </>
  );
};

export default RegisterForm;
