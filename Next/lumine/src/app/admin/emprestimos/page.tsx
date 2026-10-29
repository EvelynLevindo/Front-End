'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Modal from '@/components/Modal';
import EmptyState from '@/components/EmptyState';
import { useToast } from '@/components/Toast';

interface LoanItem {
  _id: string;
  book: {
    _id: string;
    title: string;
    author: string;
    isbn: string;
    coverUrl?: string;
    status: string;
    shelfLocation?: string;
  };
  member: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    registrationNumber: string;
  };
  loanDate: string;
  expectedReturnDate: string;
  returnDate?: string | null;
  status: 'Ativo' | 'Devolvido' | 'Atrasado';
  notes?: string;
}

interface AvailableBook {
  _id: string;
  title: string;
  author: string;
  isbn: string;
  status: string;
}

interface MemberOption {
  _id: string;
  name: string;
  registrationNumber: string;
}

export default function LoansManagementPage() {
  const { showToast } = useToast();
  const [loans, setLoans] = useState<LoanItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>('Ativo');

  // Modal de Novo Empréstimo
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [availableBooks, setAvailableBooks] = useState<AvailableBook[]>([]);
  const [membersList, setMembersList] = useState<MemberOption[]>([]);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Form de Empréstimo
  const [selectedBookId, setSelectedBookId] = useState<string>('');
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  const [loanDate, setLoanDate] = useState<string>('');
  const [expectedReturnDate, setExpectedReturnDate] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [nowTimestamp, setNowTimestamp] = useState<number>(0);

  const fetchLoans = useCallback(async () => {
    try {
      setLoading(true);
      const url = statusFilter === 'all' ? '/api/loans' : `/api/loans?status=${statusFilter}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success && data.loans) {
        setLoans(data.loans);
      }
    } catch {
      showToast('Erro ao carregar lista de empréstimos.', 'error');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, showToast]);

  useEffect(() => {
    setNowTimestamp(Date.now());
    fetchLoans();
  }, [fetchLoans]);

  const handleOpenNewLoanModal = async () => {
    try {
      const today = new Date();
      setLoanDate(today.toISOString().split('T')[0]);
      const returnDate = new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000);
      setExpectedReturnDate(returnDate.toISOString().split('T')[0]);

      // Buscar livros disponíveis
      const booksRes = await fetch('/api/books?status=disponivel');
      const booksData = await booksRes.json();
      if (booksData.success) {
        setAvailableBooks(booksData.books || []);
        if (booksData.books?.length > 0) {
          setSelectedBookId(booksData.books[0]._id);
        }
      }

      // Buscar membros
      const membersRes = await fetch('/api/members');
      const membersData = await membersRes.json();
      if (membersData.success) {
        setMembersList(membersData.members || []);
        if (membersData.members?.length > 0) {
          setSelectedMemberId(membersData.members[0]._id);
        }
      }

      setIsModalOpen(true);
    } catch {
      showToast('Falha ao carregar livros e membros para o formulário.', 'error');
    }
  };

  const handleRegisterLoan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookId || !selectedMemberId || !expectedReturnDate) {
      showToast('Selecione o livro, o membro e a data prevista.', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/loans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookId: selectedBookId,
          memberId: selectedMemberId,
          loanDate,
          expectedReturnDate,
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast(data.message || 'Erro ao registrar empréstimo.', 'error');
        return;
      }

      showToast(data.message || 'Empréstimo registrado com sucesso!', 'success');
      setIsModalOpen(false);
      fetchLoans();
    } catch {
      showToast('Erro de conexão ao processar empréstimo.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

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

      showToast(`Devolução de "${bookTitle}" confirmada! Exemplar disponível novamente no acervo.`, 'success');
      fetchLoans();
    } catch {
      showToast('Erro ao comunicar devolução com o servidor.', 'error');
    }
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Cabeçalho */}
      <div className="management-header">
        <div className="header-titles">
          <h2>Controle de Empréstimos e Devoluções</h2>
          <p>Registre saídas, acompanhe prazos de leitura e confirme devoluções com atualização automática do acervo.</p>
        </div>

        <button className="btn btn-primary" onClick={handleOpenNewLoanModal} type="button">
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
            book_online
          </span>
          <span>Registrar Novo Empréstimo</span>
        </button>
      </div>

      {/* Barra de Filtros */}
      <div className="management-toolbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#50443F' }}>
            Visualizar:
          </span>

          <button
            className={`btn btn-sm ${statusFilter === 'Ativo' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setStatusFilter('Ativo')}
            type="button"
          >
            Empréstimos Ativos
          </button>

          <button
            className={`btn btn-sm ${statusFilter === 'Devolvido' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setStatusFilter('Devolvido')}
            type="button"
          >
            Histórico de Devolvidos
          </button>

          <button
            className={`btn btn-sm ${statusFilter === 'all' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setStatusFilter('all')}
            type="button"
          >
            Todos os Registros
          </button>
        </div>

        <div style={{ fontSize: '13px', color: '#50443F' }}>
          Registros listados: <strong>{loans.length}</strong>
        </div>
      </div>

      {/* Tabela de Empréstimos */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '32px', color: '#99582A' }}>
            autorenew
          </span>
          <p style={{ marginTop: '0.5rem', color: '#50443F' }}>Consultando registros de circulação...</p>
        </div>
      ) : loans.length === 0 ? (
        <EmptyState
          title="Nenhum empréstimo encontrado"
          description={
            statusFilter === 'Ativo'
              ? 'Não há livros emprestados no momento. Todos os exemplares estão disponíveis na biblioteca!'
              : 'Nenhum registro para o filtro selecionado.'
          }
          icon="swap_horiz"
          actionText="Registrar Empréstimo Agora"
          onAction={handleOpenNewLoanModal}
        />
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Livro Retirado</th>
                <th>Leitor Responsável</th>
                <th>Data da Retirada</th>
                <th>Devolução Prevista</th>
                <th>Status</th>
                <th>Observações</th>
                <th style={{ textAlign: 'right' }}>Ação de Devolução</th>
              </tr>
            </thead>
            <tbody>
              {loans.map((loan) => {
                const isReturned = loan.status === 'Devolvido';
                const isOverdue =
                  !isReturned &&
                  nowTimestamp > 0 &&
                  new Date(loan.expectedReturnDate).getTime() < nowTimestamp;

                return (
                  <tr key={loan._id}>
                    <td>
                      <div style={{ fontWeight: 600, color: '#432818' }}>
                        {loan.book?.title || 'Exemplar Removido'}
                      </div>
                      <div style={{ fontSize: '12px', color: '#50443F' }}>
                        {loan.book?.author} · ISBN: {loan.book?.isbn}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#432818' }}>
                        {loan.member?.name || 'Leitor'}
                      </div>
                      <div style={{ fontSize: '12px', color: '#50443F' }}>
                        Matrícula: {loan.member?.registrationNumber} · {loan.member?.phone}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '13px', color: '#50443F' }}>
                        {formatDate(loan.loanDate)}
                      </span>
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: '13px',
                          fontWeight: isOverdue ? 700 : 500,
                          color: isOverdue ? '#BA1A1A' : '#432818',
                        }}
                      >
                        {formatDate(loan.expectedReturnDate)}
                      </span>
                    </td>
                    <td>
                      {isReturned ? (
                        <span className="badge badge-available">
                          Devolvido em {formatDate(loan.returnDate)}
                        </span>
                      ) : isOverdue ? (
                        <span className="badge badge-delayed">
                          Atrasado
                        </span>
                      ) : (
                        <span className="badge badge-vintage">
                          Ativo (No Prazo)
                        </span>
                      )}
                    </td>
                    <td>
                      <span style={{ fontSize: '12px', color: '#7A6B63' }}>
                        {loan.notes || '—'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {isReturned ? (
                        <span style={{ fontSize: '12px', color: '#1B6E3F', fontWeight: 600 }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '16px', verticalAlign: 'middle', marginRight: '4px' }}>
                            check_circle
                          </span>
                          Finalizado
                        </span>
                      ) : (
                        <button
                          className="btn btn-primary btn-sm"
                          style={{ padding: '4px 10px', fontSize: '12px' }}
                          onClick={() => handleReturnBook(loan._id, loan.book?.title || 'Livro')}
                          title="Confirmar devolução do livro ao acervo"
                          type="button"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>
                            assignment_return
                          </span>
                          <span>Devolver</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL DE NOVO EMPRÉSTIMO */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Registrar Empréstimo no Balcão"
        size="lg"
        footer={
          <>
            <button
              className="btn btn-outline"
              onClick={() => setIsModalOpen(false)}
              type="button"
              disabled={submitting}
            >
              Cancelar
            </button>
            <button
              className="btn btn-primary"
              onClick={handleRegisterLoan}
              type="button"
              disabled={submitting || availableBooks.length === 0 || membersList.length === 0}
            >
              {submitting ? 'Registrando...' : 'Confirmar Empréstimo'}
            </button>
          </>
        }
      >
        <form onSubmit={handleRegisterLoan} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Seleção do Livro Disponível */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="select-book">
              Livro Disponível para Retirada *
            </label>
            {availableBooks.length === 0 ? (
              <div style={{ padding: '8px 12px', backgroundColor: '#FFDAD6', color: '#93000A', borderRadius: '6px', fontSize: '13px' }}>
                Nenhum exemplar com status &quot;Disponível&quot; no acervo no momento.
              </div>
            ) : (
              <select
                id="select-book"
                className="form-control"
                value={selectedBookId}
                onChange={(e) => setSelectedBookId(e.target.value)}
                required
              >
                {availableBooks.map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.title} — {b.author} (ISBN: {b.isbn})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Seleção do Leitor */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="select-member">
              Membro Leitor Comunitário *
            </label>
            {membersList.length === 0 ? (
              <div style={{ padding: '8px 12px', backgroundColor: '#FFDAD6', color: '#93000A', borderRadius: '6px', fontSize: '13px' }}>
                Nenhum membro cadastrado. Cadastre um leitor primeiro.
              </div>
            ) : (
              <select
                id="select-member"
                className="form-control"
                value={selectedMemberId}
                onChange={(e) => setSelectedMemberId(e.target.value)}
                required
              >
                {membersList.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.name} ({m.registrationNumber})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Datas */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="input-loan-date">Data da Retirada *</label>
              <input
                id="input-loan-date"
                type="date"
                className="form-control"
                value={loanDate}
                onChange={(e) => setLoanDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="input-expected-date">Data Prevista de Devolução *</label>
              <input
                id="input-expected-date"
                type="date"
                className="form-control"
                value={expectedReturnDate}
                onChange={(e) => setExpectedReturnDate(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Observações */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="input-notes">Observações do Atendimento (Opcional)</label>
            <input
              id="input-notes"
              className="form-control"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="ex: Leitor solicitou prorrogação ou exemplar em excelente estado"
            />
          </div>

          <div
            style={{
              padding: '10px 14px',
              backgroundColor: '#F6F3EE',
              borderRadius: '8px',
              fontSize: '12px',
              color: '#50443F',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#99582A' }}>
              info
            </span>
            <span>
              Ao confirmar o empréstimo, o status do exemplar no acervo será automaticamente
              atualizado para &quot;Emprestado&quot;, impedindo retiradas duplicadas.
            </span>
          </div>
        </form>
      </Modal>
    </div>
  );
}
