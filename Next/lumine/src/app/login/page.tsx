'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import '@/styles/login.scss';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>('felipe.silva@lereviver.org.br');
  const [password, setPassword] = useState<string>('Lumine@2024');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email || !password) {
      setErrorMessage('Por favor, informe seu e-mail institucional e senha.');
      return;
    }

    try {
      setLoading(true);

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.message || 'Falha na autenticação. Verifique suas credenciais.');
        return;
      }

      setSuccessMessage('Acesso autorizado! Redirecionando para o painel administrativo...');

      setTimeout(() => {
        router.push('/admin');
        router.refresh();
      }, 800);
    } catch {
      setErrorMessage('Ocorreu um erro de rede ao tentar conectar ao servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="ambient-glow-1" />
      <div className="ambient-glow-2" />

      <main className="login-card">
        {/* Ícone de Destaque */}
        <div className="icon-wrapper">
          <span className="material-symbols-outlined">local_library</span>
        </div>

        {/* Badge da Comunidade */}
        <div className="brand-badge">
          <span>Biblioteca Comunitária</span>
          <span className="dot" />
          <span>Ler é Viver</span>
        </div>

        {/* Título Editorial */}
        <h1>Portal do Bibliotecário & Voluntário</h1>
        <p className="login-description">
          Acesse o sistema de gestão para catalogar livros, gerenciar leitores e registrar empréstimos
          da nossa comunidade.
        </p>

        {/* Formulário */}
        <form className="login-form" onSubmit={handleSubmit}>
          {/* Mensagem de Erro */}
          {errorMessage && (
            <div className="status-alert alert-error">
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                error
              </span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Mensagem de Sucesso */}
          {successMessage && (
            <div className="status-alert alert-success">
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                check_circle
              </span>
              <span>{successMessage}</span>
            </div>
          )}

          {/* Campo E-mail */}
          <div className="form-group">
            <label htmlFor="email">E-mail institucional</label>
            <input
              id="email"
              type="email"
              className="form-control"
              placeholder="ex: felipe.silva@lereviver.org.br"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          {/* Campo Senha */}
          <div className="form-group">
            <label htmlFor="password">Senha de acesso</label>
            <div className="password-input-group">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="btn-toggle-visibility"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          {/* Aviso de Ambiente Protegido */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              backgroundColor: '#F6F3EE',
              borderRadius: '8px',
              fontSize: '12px',
              color: '#50443F',
              marginBottom: '1rem',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#99582A' }}>
              shield
            </span>
            <span>Ambiente protegido sob autenticação JWT e criptografia Bcrypt.</span>
          </div>

          {/* Botão de Envio */}
          <button
            type="submit"
            className="btn btn-primary btn-submit"
            disabled={loading}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
              {loading ? 'autorenew' : 'menu_book'}
            </span>
            <span>{loading ? 'Autenticando credenciais...' : 'Entrar no Sistema'}</span>
          </button>
        </form>

        {/* Rodapé do Card */}
        <div className="login-footer">
          <Link href="/" className="back-link">
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
              arrow_back
            </span>
            <span>Retornar à Consulta Pública</span>
          </Link>

          <div className="system-version">
            Sistema Comunitário v2.4 • Acervo e Gestão Viva
          </div>
        </div>
      </main>
    </div>
  );
}
