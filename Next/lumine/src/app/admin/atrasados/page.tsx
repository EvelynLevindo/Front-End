'use client';

import React, { useState, useEffect, useCallback } from 'react';
import EmptyState from '@/components/EmptyState';
import { useToast } from '@/components/Toast';

interface DelayedLoan {
  _id: string;
  book: {
    _id: string;
    title: string;
    author: string;
    isbn: string;
    category?: string;
    shelfLocation?: string;
  };
  member: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    registrationNumber: string;
    address?: string;
  };
  loanDate: string;
  expectedReturnDate: string;
  daysDelayed: number;
}

export default function DelayedLoansPage() {
  const { showToast } = useToast();
  const [delayedLoans, setDelayedLoans] = useState<DelayedLoan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [notified, setNotified] = useState<Record<string, boolean>>({});

  const fetchDelayedLoans = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/loans/delayed');
      const data = await res.json();
      if (data.success && data.delayedLoans) {
        setDelayedLoans(data.delayedLoans);
      }
    } catch {
      showToast('Erro ao carregar devoluções atrasadas.', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchDelayedLoans();
  }, [fetchDelayedLoans]);

  const handleReturnBook = async (loanId: string, bookTitle: string) => {
    try {
      const res = await fetch(`/api/loans/${loanId}/return`, {
        method: 'POST',
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        showToast(data.message || 'Falha ao registrar devolução.', 'error');
        return;
      }

      showToast(`Devolução de "${bookTitle}" concluída com sucesso! Exemplar restaurado para o acervo.`, 'success');
      fetchDelayedLoans();
    } catch {
      showToast('Erro ao registrar devolução.', 'error');
    }
  };

  const handleNotify = (id: string, name: string) => {
    setNotified((prev) => ({ ...prev, [id]: true }));
    showToast(`Lembrete gentil e acolhedor enviado para ${name}!`, 'info');
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  // Métricas de atraso
  const totalOverdue = delayedLoans.length;
  const maxDelay = delayedLoans.reduce((max, item) => (item.daysDelayed > max ? item.daysDelayed : max), 0);
  const distinctMembers = new Set(delayedLoans.map((l) => l.member?._id)).size;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Cabeçalho */}
      <div className="management-header">
        <div className="header-titles">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2>Controle de Devoluções Atrasadas</h2>
            <span className="badge badge-delayed" style={{ fontWeight: 700 }}>
              Cálculo Automático
            </span>
          </div>
          <p>
            Identificação em tempo real de exemplares com prazo expirado. Contate os leitores
            de maneira acolhedora para manter o acervo comunitário circulando.
          </p>
        </div>
      </div>

      {/* Mini-Cards de Alerta */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <div className="metric-card">
          <div className="metric-top">
            <div>
              <div className="metric-label">Exemplares em Atraso</div>
              <div className="metric-value" style={{ color: '#BA1A1A' }}>
                {loading ? '...' : totalOverdue}
              </div>
            </div>
            <div className="metric-icon-box alert-box">
              <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
                priority_high
              </span>
            </div>
          </div>
          <div className="metric-sub">
            <span>pendentes de retorno ao balcão</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-top">
            <div>
              <div className="metric-label">Leitores com Pendência</div>
              <div className="metric-value">
                {loading ? '...' : distinctMembers}
              </div>
            </div>
            <div className="metric-icon-box">
              <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
                person_alert
              </span>
            </div>
          </div>
          <div className="metric-sub">
            <span>membros comunitários</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-top">
            <div>
              <div className="metric-label">Maior Atraso Registrado</div>
              <div className="metric-value" style={{ color: '#99582A' }}>
                {loading ? '...' : `${maxDelay} dias`}
              </div>
            </div>
            <div className="metric-icon-box">
              <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
                hourglass_bottom
              </span>
            </div>
          </div>
          <div className="metric-sub">
            <span>calculado a partir da data prevista</span>
          </div>
        </div>
      </div>

      {/* Tabela de Empréstimos Atrasados */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '32px', color: '#99582A' }}>
            autorenew
          </span>
          <p style={{ marginTop: '0.5rem', color: '#50443F' }}>Calculando dias de atraso do acervo...</p>
        </div>
      ) : delayedLoans.length === 0 ? (
        <EmptyState
          title="Nenhum empréstimo atrasado!"
          description="Parabéns! Todos os empréstimos ativos da biblioteca comunitária estão rigorosamente em dia dentro do prazo de devolução."
          icon="verified"
        />
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Livro Retirado</th>
                <th>Membro / Contato</th>
                <th>Prazo Previsto</th>
                <th>Atraso Calculado</th>
                <th>Localização Original</th>
                <th style={{ textAlign: 'right' }}>Ações de Resolução</th>
              </tr>
            </thead>
            <tbody>
              {delayedLoans.map((item) => {
                const isCritical = item.daysDelayed >= 10;

                return (
                  <tr key={item._id}>
                    <td>
                      <div style={{ fontWeight: 600, color: '#432818' }}>
                        {item.book?.title}
                      </div>
                      <div style={{ fontSize: '12px', color: '#50443F' }}>
                        {item.book?.author} · ISBN: {item.book?.isbn}
                      </div>
                    </td>

                    <td>
                      <div style={{ fontWeight: 600, color: '#432818' }}>
                        {item.member?.name}
                      </div>
                      <div style={{ fontSize: '12px', color: '#50443F' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '13px', verticalAlign: 'middle', marginRight: '3px', color: '#99582A' }}>
                          phone
                        </span>
                        {item.member?.phone} · Matrícula: {item.member?.registrationNumber}
                      </div>
                    </td>

                    <td>
                      <div style={{ fontSize: '13px', color: '#BA1A1A', fontWeight: 600 }}>
                        {formatDate(item.expectedReturnDate)}
                      </div>
                      <div style={{ fontSize: '11px', color: '#7A6B63' }}>
                        Retirado em {formatDate(item.loanDate)}
                      </div>
                    </td>

                    <td>
                      <span
                        className="badge badge-delayed"
                        style={{
                          fontWeight: 700,
                          backgroundColor: isCritical ? '#FFDAD6' : '#FFE8BF',
                          color: isCritical ? '#93000A' : '#593500',
                          fontSize: '12px',
                        }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                          alarm
                        </span>
                        {item.daysDelayed} dia(s) de atraso
                      </span>
                    </td>

                    <td>
                      <span style={{ fontSize: '12px', color: '#50443F' }}>
                        {item.book?.shelfLocation || 'Estante Geral'}
                      </span>
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        {/* Botão de Notificar Leitor */}
                        <button
                          className="btn btn-outline btn-sm"
                          style={{ padding: '4px 10px', fontSize: '12px' }}
                          onClick={() => handleNotify(item._id, item.member?.name)}
                          type="button"
                          title="Enviar lembrete amigável"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#99582A' }}>
                            {notified[item._id] ? 'check' : 'send'}
                          </span>
                          <span>{notified[item._id] ? 'Lembrado' : 'Notificar'}</span>
                        </button>

                        {/* Botão de Devolver Imediato */}
                        <button
                          className="btn btn-primary btn-sm"
                          style={{ padding: '4px 10px', fontSize: '12px' }}
                          onClick={() => handleReturnBook(item._id, item.book?.title)}
                          type="button"
                          title="Registrar devolução e atualizar livro para Disponível"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                            assignment_return
                          </span>
                          <span>Devolver</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Caixa de Diretriz Editorial */}
      <div
        style={{
          backgroundColor: '#F6F3EE',
          border: '1px solid #EADCC9',
          borderRadius: '10px',
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '13px',
          color: '#50443F',
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: '22px', color: '#BB9457' }}>
          volunteer_activism
        </span>
        <div>
          <strong style={{ color: '#432818' }}>Política de Incentivo Comunitário: </strong>
          Nosso objetivo é garantir que os livros retornem para que mais crianças, jovens e vizinhos
          possam ler. Em caso de atrasos, promova sempre o diálogo compreensivo e o acolhimento.
        </div>
      </div>
    </div>
  );
}
