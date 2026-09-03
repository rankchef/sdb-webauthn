import React, { useState } from 'react'
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import AuthButtonGroup from './AuthButtonGroup';

const AuthCard = () => {
  const [activeTab, setActiveTab] = useState('najava');

  return (
    <div className="auth-card">
      <AuthButtonGroup activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'najava' ? <LoginForm /> : <RegisterForm />}
    </div>
  )
}

export default AuthCard
