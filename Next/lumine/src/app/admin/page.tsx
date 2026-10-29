'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useToast } from '@/components/Toast';

interface DashboardStats {
  totalBooks: number;
  totalMembers: number;
  activeLoans: number;
  delayedLoans: number;
  criticalDelayed: Array<{
    _id: string;
    book: {
      title: string;
      author: string;
      coverUrl?: string;
    };
    member: {
      name: string;
      phone: string;
      email: string;
    };
    daysDelayed: number;
  }>;
  recentLoans: Array<{
    _id: string;
    book: {
      title: string;
      author: string;
      coverUrl?: string;
      status: string;
    };
    member: {
      name: string;
      registrationNumber: string;
    };
    loanDate: string;
    expectedReturnDate: string;
    status: string;
  }>;
}

export default function AdminDashboardPage() {
  const { showToast } = useToast();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [notifiedMembers, setNotifiedMembers] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch('/api/dashboard/stats')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.stats) {
          setStats(data.stats);
        }
      })
      .catch((err) => {
        console.error('Erro ao carregar métricas:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleNotify = (id: string, memberName: string) => {
    setNotifiedMembers((prev) => ({ ...prev, [id]: true }));
    showToast(`Notificação humanizada enviada para ${memberName}!`, 'info');
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Hoje';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* 1. Cabeçalho Editorial de Boas-Vindas */}
      <section className="dashboard-welcome">
        <div className="welcome-watermark">
          <span className="material-symbols-outlined">auto_stories</span>
        </div>

        <div className="welcome-info">
          <div className="welcome-badge">
            <span className="pulse-dot" />
            <span>Sistema Comunitário Conectado</span>
          </div>

          <h1>Olá, Felipe! Bom trabalho na preservação das nossas histórias.</h1>
          <p>
            <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#99582A' }}>
              calendar_month
            </span>
            <span>Unidade Centro Histórico — Bairro da Paz</span>
          </p>
        </div>

        <div className="welcome-stat-pill">
          <div className="stat-text">
            <span className="stat-label">Taxa de Circulação</span>
            <span className="stat-val">93.4% Devolvidos a Tempo</span>
          </div>
          <span className="material-symbols-outlined" style={{ fontSize: '24px', color: '#BB9457' }}>
            verified
          </span>
        </div>
      </section>

      {/* 2. Quatro Cards de Métricas Principais */}
      <section className="metrics-grid">
        {/* Métrica 1: Total no Acervo */}
        <div className="metric-card">
          <div className="metric-top">
            <div>
              <div className="metric-label">Total no Acervo</div>
              <div className="metric-value">
                {loading ? '...' : stats?.totalBooks || 0}
              </div>
            </div>
            <div className="metric-icon-box">
              <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
                shelves
              </span>
            </div>
          </div>
          <div className="metric-sub">
            <span className="badge badge-vintage" style={{ fontSize: '10px' }}>
              +18 novos
            </span>
            <span>exemplares cadastrados</span>
          </div>
        </div>

        {/* Métrica 2: Membros Cadastrados */}
        <div className="metric-card">
          <div className="metric-top">
            <div>
              <div className="metric-label">Membros Cadastrados</div>
              <div className="metric-value">
                {loading ? '...' : stats?.totalMembers || 0}
              </div>
            </div>
            <div className="metric-icon-box">
              <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
                groups
              </span>
            </div>
          </div>
          <div className="metric-sub">
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#99582A' }} />
            <span>leitores ativos na comunidade</span>
          </div>
        </div>

        {/* Métrica 3: Empréstimos Ativos */}
        <div className="metric-card">
          <div className="metric-top">
            <div>
              <div className="metric-label">Empréstimos Ativos</div>
              <div className="metric-value">
                {loading ? '...' : stats?.activeLoans || 0}
              </div>
            </div>
            <div className="metric-icon-box">
              <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
                import_contacts
              </span>
            </div>
          </div>
          <div className="metric-sub">
            <span>em circulação no bairro</span>
          </div>
        </div>

        {/* Métrica 4: Devoluções Atrasadas */}
        <div className="metric-card">
          <div className="metric-top">
            <div>
              <div className="metric-label">Devoluções Atrasadas</div>
              <div className="metric-value" style={{ color: '#99582A' }}>
                {loading ? '...' : stats?.delayedLoans || 0}
              </div>
            </div>
            <div className="metric-icon-box alert-box">
              <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
                pending_actions
              </span>
            </div>
          </div>
          <div className="metric-sub">
            <span className="badge badge-delayed" style={{ fontSize: '10px' }}>
              Atenção necessária
            </span>
            <span>cobrança acolhedora</span>
          </div>
        </div>
      </section>

      {/* 3. Barra de Ações Rápidas do Balcão */}
      <section className="quick-actions-bar">
        <div className="quick-title">
          <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#99582A' }}>
            bolt
          </span>
          <span>Ações Rápidas do Balcão:</span>
        </div>

        <div className="quick-buttons">
          <Link href="/admin/emprestimos" className="btn btn-primary btn-sm">
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
              book_online
            </span>
            <span>Novo Empréstimo</span>
          </Link>

          <Link href="/admin/livros" className="btn btn-outline btn-sm">
            <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#99582A' }}>
              library_add
            </span>
            <span>Cadastrar Livro</span>
          </Link>

          <Link href="/admin/membros" className="btn btn-outline btn-sm">
            <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#99582A' }}>
              person_add
            </span>
            <span>Cadastrar Leitor</span>
          </Link>

          <Link href="/admin/atrasados" className="btn btn-outline btn-sm">
            <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#BA1A1A' }}>
              warning
            </span>
            <span>Ver Atrasos</span>
          </Link>
        </div>
      </section>

      {/* 4. Grid Dividido em Duas Colunas (60% / 40%) */}
      <section className="dashboard-two-cols">
        {/* Coluna da Esquerda: Últimos Empréstimos */}
        <div className="dash-card">
          <div className="dash-card-header">
            <div>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#99582A', fontWeight: 700 }}>
                Circulação em Tempo Real
              </span>
              <h3>Últimos Empréstimos Registrados</h3>
            </div>

            <Link href="/admin/emprestimos" className="dash-link">
              <span>Ver histórico completo</span>
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                arrow_forward
              </span>
            </Link>
          </div>

          <div className="recent-loans-list">
            {stats?.recentLoans && stats.recentLoans.length > 0 ? (
              stats.recentLoans.map((loan) => (
                <div key={loan._id} className="loan-item">
                  <div className="loan-book-info">
                    {loan.book?.coverUrl ? (
                      <Image
                        src={loan.book.coverUrl}
                        alt={loan.book.title}
                        width={38}
                        height={52}
                        className="mini-cover"
                        unoptimized
                      />
                    ) : (
                      <div
                        className="mini-cover"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#FFE6A7',
                        }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                          menu_book
                        </span>
                      </div>
                    )}

                    <div className="loan-text">
                      <div className="loan-book-title">{loan.book?.title}</div>
                      <div className="loan-member-name">
                        <span className="material-symbols-outlined" style={{ fontSize: '13px', verticalAlign: 'middle', marginRight: '2px' }}>
                          person
                        </span>
                        {loan.member?.name} ({loan.member?.registrationNumber})
                      </div>
                    </div>
                  </div>

                  <div className="loan-dates">
                    <span className="date-label">Devolução Prevista:</span>
                    <span className="date-value">{formatDate(loan.expectedReturnDate)}</span>
                    <span className="badge badge-vintage" style={{ fontSize: '10px', marginTop: '4px' }}>
                      {loan.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ textAlign: 'center', padding: '2rem 1rem', color: '#50443F' }}>
                Nenhum empréstimo ativo no momento.
              </p>
            )}
          </div>
        </div>

        {/* Coluna da Direita: Atrasos Críticos & Destaque do Mês */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Card 1: Atrasos Críticos */}
          <div className="dash-card">
            <div className="dash-card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: '#FFDAD6',
                    color: '#93000A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                    priority_high
                  </span>
                </span>
                <div>
                  <h3>Atrasos Críticos</h3>
                  <span style={{ fontSize: '12px', color: '#50443F' }}>Contato humanizado</span>
                </div>
              </div>

              <span className="badge badge-delayed">
                {stats?.criticalDelayed?.length || 0} prioritários
              </span>
            </div>

            <div className="critical-delays-list">
              {stats?.criticalDelayed && stats.criticalDelayed.length > 0 ? (
                stats.criticalDelayed.map((item) => (
                  <div key={item._id} className="delay-item">
                    <div className="delay-top">
                      <div>
                        <div className="delay-book-title">{item.book?.title}</div>
                        <div className="delay-member">{item.member?.name}</div>
                      </div>

                      <span className="badge badge-delayed" style={{ fontWeight: 700 }}>
                        {item.daysDelayed} dias de atraso
                      </span>
                    </div>

                    <div className="delay-bottom">
                      <div className="delay-phone">
                        <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#99582A' }}>
                          phone
                        </span>
                        <span>{item.member?.phone}</span>
                      </div>

                      <button
                        className="btn btn-outline btn-sm"
                        style={{ padding: '2px 8px', fontSize: '11px' }}
                        onClick={() => handleNotify(item._id, item.member?.name)}
                        type="button"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>
                          {notifiedMembers[item._id] ? 'check' : 'send'}
                        </span>
                        <span>{notifiedMembers[item._id] ? 'Avisado!' : 'Notificar'}</span>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '1.5rem', color: '#1B6E3F' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>
                    verified
                  </span>
                  <p style={{ fontSize: '13px', marginTop: '4px' }}>
                    Nenhuma devolução em atraso crítico no momento!
                  </p>
                </div>
              )}
            </div>

            <div
              style={{
                backgroundColor: '#F0EDE9',
                padding: '8px 12px',
                borderRadius: '6px',
                fontSize: '11px',
                color: '#50443F',
                textAlign: 'center',
              }}
            >
              Lembrete: Nossa abordagem prioriza incentivo e escuta comunitária antes de sanções.
            </div>
          </div>

          {/* Card 2: Destaque do Mês na Comunidade */}
          <div className="dash-card">
            <div className="dash-card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#BB9457' }}>
                  star
                </span>
                <span style={{ fontSize: '12px', textTransform: 'uppercase', fontWeight: 700, color: '#99582A' }}>
                  Destaque do Mês
                </span>
              </div>
              <span style={{ fontSize: '12px', color: '#50443F' }}>Outubro / 2024</span>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div
                style={{
                  width: '64px',
                  height: '88px',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  backgroundColor: '#432818',
                  position: 'relative',
                  flexShrink: 0,
                  boxShadow: '0 2px 8px rgba(67,40,24,0.15)',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '2px',
                    left: '2px',
                    backgroundColor: '#99582A',
                    color: '#ffffff',
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '1px 5px',
                    borderRadius: '3px',
                  }}
                >
                  #1
                </div>
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFE6A7',
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>
                    auto_stories
                  </span>
                </div>
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <h4 style={{ fontSize: '1.05rem', color: '#432818', lineHeight: 1.2 }}>
                  Capitães da Areia
                </h4>
                <span style={{ fontSize: '13px', color: '#99582A', fontWeight: 500 }}>
                  Jorge Amado
                </span>

                <div style={{ marginTop: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#50443F', marginBottom: '3px' }}>
                    <span>14 empréstimos registrados</span>
                    <strong style={{ color: '#99582A' }}>Alta Procura</strong>
                  </div>
                  <div style={{ width: '100%', height: '6px', backgroundColor: '#E5E2DD', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: '88%', height: '100%', backgroundColor: '#99582A', borderRadius: '4px' }} />
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                backgroundColor: '#F6F3EE',
                padding: '8px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span style={{ color: '#50443F' }}>3 de 3 cópias disponíveis no balcão</span>
              <Link href="/admin/emprestimos" style={{ color: '#99582A', fontWeight: 600 }}>
                Emprestar agora
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
