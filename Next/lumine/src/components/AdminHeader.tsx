'use client';

import React, { useEffect, useState } from 'react';

interface AdminHeaderProps {
  onToggleMobileMenu?: () => void;
}

export default function AdminHeader({ onToggleMobileMenu }: AdminHeaderProps) {
  const [userName, setUserName] = useState<string>('Felipe Silva');
  const [currentDate, setCurrentDate] = useState<string>('');

  useEffect(() => {
    // Buscar usuário conectado
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) {
          setUserName(data.user.name);
        }
      })
      .catch(() => {});

    // Formatar data em português
    const now = new Date();
    const formatted = now.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    // Capitalizar a primeira letra
    setCurrentDate(formatted.charAt(0).toUpperCase() + formatted.slice(1));
  }, []);

  return (
    <header className="admin-header">
      <div className="header-left">
        <button
          className="btn-toggle-menu"
          onClick={onToggleMobileMenu}
          aria-label="Abrir menu de navegação"
          type="button"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>

        <div className="header-search">
          <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#99582A' }}>
            search
          </span>
          <input type="text" placeholder="Buscar no sistema..." aria-label="Busca global" />
        </div>
      </div>

      <div className="header-right">
        {currentDate && (
          <div className="date-display">
            <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#BB9457' }}>
              calendar_today
            </span>
            <span>{currentDate}</span>
          </div>
        )}

        <div className="user-profile">
          <div className="user-info">
            <div className="user-name">{userName}</div>
            <div className="user-role">Bibliotecário Chefe</div>
          </div>
          <div className="user-avatar" title={userName}>
            {userName ? userName.charAt(0).toUpperCase() : 'B'}
          </div>
        </div>
      </div>
    </header>
  );
}
