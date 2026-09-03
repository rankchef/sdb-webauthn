import React from 'react';

const AuthButtonGroup = ({ activeTab, onTabChange }) => {
    return (
        <div className="auth-button-group">
            <button
                type="button"
                className={`tab-btn ${activeTab === 'najava' ? 'active' : ''}`}
                onClick={() => onTabChange('najava')}
            >
                Најава
            </button>
            <button
                type="button"
                className={`tab-btn ${activeTab === 'registracija' ? 'active' : ''}`}
                onClick={() => onTabChange('registracija')}
            >
                Регистрација
            </button>
        </div>
    );
};

export default AuthButtonGroup;
