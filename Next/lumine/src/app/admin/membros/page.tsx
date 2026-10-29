'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Modal from '@/components/Modal';
import EmptyState from '@/components/EmptyState';
import { useToast } from '@/components/Toast';

interface MemberItem {
  _id: string;
  name: string;
  email: string;
  phone: string;
  registrationNumber: string;
  address?: string;
  active: boolean;
  activeLoansCount?: number;
  createdAt?: string;
}

export default function MembersManagementPage() {
  const { showToast } = useToast();
  const [members, setMembers] = useState<MemberItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');

  // Modais de Criação e Edição
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const [editingMember, setEditingMember] = useState<MemberItem | null>(null);
  const [formSubmitting, setFormSubmitting] = useState<boolean>(false);

  // Modal de Exclusão
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [memberToDelete, setMemberToDelete] = useState<MemberItem | null>(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState<boolean>(false);

  // Formulário
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    registrationNumber: '',
    address: '',
  });

  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search.trim()) params.append('search', search.trim());

      const res = await fetch(`/api/members?${params.toString()}`);
      const data = await res.json();
      if (data.success && data.members) {
        setMembers(data.members);
      }
    } catch {
      showToast('Erro ao carregar lista de membros.', 'error');
    } finally {
      setLoading(false);
    }
  }, [search, showToast]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const handleOpenCreateModal = () => {
    setEditingMember(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      registrationNumber: '',
      address: '',
    });
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (member: MemberItem) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      email: member.email,
      phone: member.phone,
      registrationNumber: member.registrationNumber,
      address: member.address || '',
    });
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);

    try {
      const url = editingMember ? `/api/members/${editingMember._id}` : '/api/members';
      const method = editingMember ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        showToast(data.message || 'Falha ao salvar membro.', 'error');
        return;
      }

      showToast(data.message || 'Membro leitor salvo com sucesso!', 'success');
      setIsFormModalOpen(false);
      fetchMembers();
    } catch {
      showToast('Erro de comunicação com o servidor.', 'error');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleOpenDeleteModal = (member: MemberItem) => {
    setMemberToDelete(member);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!memberToDelete) return;
    setDeleteSubmitting(true);

    try {
      const res = await fetch(`/api/members/${memberToDelete._id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        showToast(data.message || 'Não foi possível excluir o membro.', 'error');
        return;
      }

      showToast(data.message || 'Cadastro do leitor excluído com sucesso!', 'success');
      setIsDeleteModalOpen(false);
      setMemberToDelete(null);
      fetchMembers();
    } catch {
      showToast('Erro de conexão ao excluir cadastro.', 'error');
    } finally {
      setDeleteSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Cabeçalho */}
      <div className="management-header">
        <div className="header-titles">
          <h2>Gerenciamento de Membros Leitores</h2>
          <p>Controle os cadastros comunitários, dados de contato e empréstimos em andamento.</p>
        </div>

        <button className="btn btn-primary" onClick={handleOpenCreateModal} type="button">
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
            person_add
          </span>
          <span>Cadastrar Novo Leitor</span>
        </button>
      </div>

      {/* Barra de Busca */}
      <div className="management-toolbar">
        <div className="search-box">
          <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#99582A' }}>
            search
          </span>
          <input
            type="text"
            placeholder="Buscar por nome, e-mail, telefone ou matrícula..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ fontSize: '13px', color: '#50443F' }}>
          Total de Leitores: <strong>{members.length}</strong>
        </div>
      </div>

      {/* Tabela de Membros */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '32px', color: '#99582A' }}>
            autorenew
          </span>
          <p style={{ marginTop: '0.5rem', color: '#50443F' }}>Carregando leitores...</p>
        </div>
      ) : members.length === 0 ? (
        <EmptyState
          title="Nenhum leitor localizado"
          description="Não encontramos membros cadastrados com os critérios informados. Clique no botão abaixo para registrar o primeiro leitor."
          icon="group"
          actionText="Cadastrar Primeiro Leitor"
          onAction={handleOpenCreateModal}
        />
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Matrícula</th>
                <th>Nome do Leitor</th>
                <th>E-mail</th>
                <th>Telefone</th>
                <th>Endereço</th>
                <th>Empréstimos Ativos</th>
                <th style={{ textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member._id}>
                  <td>
                    <span
                      style={{
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        backgroundColor: '#F0EDE9',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        color: '#432818',
                      }}
                    >
                      {member.registrationNumber}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#432818' }}>{member.name}</div>
                  </td>
                  <td>
                    <span style={{ color: '#50443F', fontSize: '13px' }}>{member.email}</span>
                  </td>
                  <td>
                    <span style={{ color: '#50443F', fontSize: '13px' }}>{member.phone}</span>
                  </td>
                  <td>
                    <span style={{ color: '#7A6B63', fontSize: '13px' }}>
                      {member.address || 'Não informado'}
                    </span>
                  </td>
                  <td>
                    {member.activeLoansCount && member.activeLoansCount > 0 ? (
                      <span className="badge badge-borrowed">
                        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                          menu_book
                        </span>
                        {member.activeLoansCount} ativo(s)
                      </span>
                    ) : (
                      <span className="badge badge-available">
                        Nenhum livro retido
                      </span>
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '6px' }}>
                      <button
                        className="btn btn-outline btn-sm"
                        style={{ padding: '4px 8px' }}
                        onClick={() => handleOpenEditModal(member)}
                        title="Editar cadastro"
                        type="button"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#99582A' }}>
                          edit
                        </span>
                      </button>

                      <button
                        className="btn btn-outline btn-sm"
                        style={{ padding: '4px 8px' }}
                        onClick={() => handleOpenDeleteModal(member)}
                        title="Excluir cadastro"
                        type="button"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#BA1A1A' }}>
                          delete
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL DE CADASTRO / EDIÇÃO DE MEMBRO */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={editingMember ? 'Editar Cadastro do Leitor' : 'Cadastrar Novo Leitor Comunitário'}
        footer={
          <>
            <button
              className="btn btn-outline"
              onClick={() => setIsFormModalOpen(false)}
              type="button"
              disabled={formSubmitting}
            >
              Cancelar
            </button>
            <button
              className="btn btn-primary"
              onClick={handleFormSubmit}
              type="button"
              disabled={formSubmitting}
            >
              {formSubmitting ? 'Salvando...' : editingMember ? 'Atualizar Leitor' : 'Cadastrar Leitor'}
            </button>
          </>
        }
      >
        <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="modal-name">Nome Completo do Leitor *</label>
            <input
              id="modal-name"
              className="form-control"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="ex: Mariana Souza Santos"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="modal-email">E-mail de Contato *</label>
              <input
                id="modal-email"
                type="email"
                className="form-control"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="ex: mariana.souza@email.com"
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="modal-phone">Telefone / WhatsApp *</label>
              <input
                id="modal-phone"
                className="form-control"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="ex: (11) 98765-4321"
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="modal-reg">Nº de Matrícula (Opcional - gerada automaticamente se vazio)</label>
              <input
                id="modal-reg"
                className="form-control"
                value={formData.registrationNumber}
                onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                placeholder="ex: MEM-0418"
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="modal-address">Endereço Comunitário</label>
              <input
                id="modal-address"
                className="form-control"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="ex: Rua das Flores, 120 - Bairro da Paz"
              />
            </div>
          </div>
        </form>
      </Modal>

      {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirmar Exclusão de Leitor"
        footer={
          <>
            <button
              className="btn btn-outline"
              onClick={() => setIsDeleteModalOpen(false)}
              type="button"
              disabled={deleteSubmitting}
            >
              Cancelar
            </button>
            <button
              className="btn btn-danger"
              onClick={handleConfirmDelete}
              type="button"
              disabled={deleteSubmitting}
            >
              {deleteSubmitting ? 'Excluindo...' : 'Sim, Excluir Leitor'}
            </button>
          </>
        }
      >
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: '#FFDAD6',
              color: '#93000A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '26px' }}>
              warning
            </span>
          </div>

          <div>
            <h4 style={{ color: '#432818', marginBottom: '0.35rem' }}>
              Deseja realmente remover o leitor &quot;{memberToDelete?.name}&quot;?
            </h4>
            <p style={{ fontSize: '14px', color: '#50443F' }}>
              Esta ação excluirá permanentemente a ficha deste leitor da base. Caso o leitor possua
              empréstimos ativos pendentes de devolução, o sistema rejeitará a exclusão para manter a integridade do acervo.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
