'use client';

import React from 'react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="public-header">
      <div className="header-container">
        {/* Brand */}
        <Link href="/" className="brand">
          <div className="brand-icon">
            <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
              local_library
            </span>
          </div>
          <div className="brand-text">
            <span className="brand-title">Lumine</span>
            <span className="brand-sub">Biblioteca Comunitária</span>
          </div>
        </Link>

        {/* Links de Navegação Pública */}
        <nav className="nav-links">
          <Link href="/" className="active">
            Início
          </Link>
          <a href="#catalogo">
            Acervo Completo
          </a>
          <a href="#sobre">
            Sobre a Biblioteca
          </a>
          <a href="#regras">
            Horários & Regras
          </a>
        </nav>

        {/* Botão de Acesso Administrativo */}
        <div className="header-actions">
          <Link href="/login" className="btn btn-primary btn-sm">
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
              lock
            </span>
            <span>Acesso do Bibliotecário</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
