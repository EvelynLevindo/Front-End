'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Modal from '@/components/Modal';
import EmptyState from '@/components/EmptyState';
import { useToast } from '@/components/Toast';
import Image from 'next/image';

interface BookItem {
  _id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  coverUrl?: string;
  shelfLocation?: string;
  publicationYear?: number;
  pages?: number;
  synopsis?: string;
  status: 'Disponível' | 'Emprestado';
  totalCopies: number;
  availableCopies: number;
}

export default function BooksManagementPage() {
  const { showToast } = useToast();
  const [books, setBooks] = useState<BookItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('todos');

  // Modais de Criação e Edição
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const [editingBook, setEditingBook] = useState<BookItem | null>(null);
  const [formSubmitting, setFormSubmitting] = useState<boolean>(false);

  // Modal de Confirmação de Exclusão
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [bookToDelete, setBookToDelete] = useState<BookItem | null>(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState<boolean>(false);

  // Modal de Visualização
  const [viewingBook, setViewingBook] = useState<BookItem | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);

  // Estado do Formulário
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: 'Literatura Brasileira',
    coverUrl: '',
    shelfLocation: 'Estante Geral',
    publicationYear: '',
    pages: '',
    synopsis: '',
    totalCopies: 1,
    status: 'Disponível' as 'Disponível' | 'Emprestado',
  });

  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search.trim()) params.append('search', search.trim());
      if (filterCategory !== 'todos') params.append('category', filterCategory);

      const res = await fetch(`/api/books?${params.toString()}`);
      const data = await res.json();
      if (data.success && data.books) {
        setBooks(data.books);
      }
    } catch {
      showToast('Erro ao carregar lista de livros.', 'error');
    } finally {
      setLoading(false);
    }
  }, [search, filterCategory, showToast]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleOpenCreateModal = () => {
    setEditingBook(null);
    setFormData({
      title: '',
      author: '',
      isbn: '',
      category: 'Literatura Brasileira',
      coverUrl: '',
      shelfLocation: 'Estante Geral',
      publicationYear: '',
      pages: '',
      synopsis: '',
      totalCopies: 1,
      status: 'Disponível',
    });
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (book: BookItem) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      category: book.category,
      coverUrl: book.coverUrl || '',
      shelfLocation: book.shelfLocation || 'Estante Geral',
      publicationYear: book.publicationYear ? String(book.publicationYear) : '',
      pages: book.pages ? String(book.pages) : '',
      synopsis: book.synopsis || '',
      totalCopies: book.totalCopies || 1,
      status: book.status,
    });
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);

    try {
      const url = editingBook ? `/api/books/${editingBook._id}` : '/api/books';
      const method = editingBook ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        showToast(data.message || 'Falha ao salvar livro.', 'error');
        return;
      }

      showToast(data.message || 'Livro salvo com sucesso!', 'success');
      setIsFormModalOpen(false);
      fetchBooks();
    } catch {
      showToast('Erro de comunicação com o servidor.', 'error');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleOpenDeleteModal = (book: BookItem) => {
    setBookToDelete(book);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!bookToDelete) return;
    setDeleteSubmitting(true);

    try {
      const res = await fetch(`/api/books/${bookToDelete._id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        showToast(data.message || 'Não foi possível excluir o livro.', 'error');
        return;
      }

      showToast(data.message || 'Livro excluído com sucesso!', 'success');
      setIsDeleteModalOpen(false);
      setBookToDelete(null);
      fetchBooks();
    } catch {
      showToast('Erro de conexão ao excluir exemplar.', 'error');
    } finally {
      setDeleteSubmitting(false);
    }
  };

  const handleOpenViewModal = (book: BookItem) => {
    setViewingBook(book);
    setIsViewModalOpen(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Cabeçalho da Gestão */}
      <div className="management-header">
        <div className="header-titles">
          <h2>Gerenciamento do Acervo Literário</h2>
          <p>Cadastre, edite, organize e consulte todos os exemplares catalogados na biblioteca.</p>
        </div>

        <button className="btn btn-primary" onClick={handleOpenCreateModal} type="button">
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
            add_circle
          </span>
          <span>Cadastrar Novo Livro</span>
        </button>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="management-toolbar">
        <div className="search-box">
          <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#99582A' }}>
            search
          </span>
          <input
            type="text"
            placeholder="Buscar por título, autor ou ISBN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="toolbar-filters">
          <label style={{ fontSize: '12px', fontWeight: 600, color: '#50443F' }}>
            Categoria:
          </label>
          <select
            className="form-control"
            style={{ width: 'auto', padding: '6px 12px', fontSize: '13px' }}
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="todos">Todas as Categorias</option>
            <option value="Literatura Brasileira">Literatura Brasileira</option>
            <option value="Clássicos Universais">Clássicos Universais</option>
            <option value="Memórias & Biografias">Memórias & Biografias</option>
            <option value="Infanto-Juvenil">Infanto-Juvenil</option>
            <option value="Poesia & Crônica">Poesia & Crônica</option>
            <option value="História & Filosofia">História & Filosofia</option>
          </select>
        </div>
      </div>

      {/* Tabela de Livros */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '32px', color: '#99582A' }}>
            autorenew
          </span>
          <p style={{ marginTop: '0.5rem', color: '#50443F' }}>Carregando exemplares...</p>
        </div>
      ) : books.length === 0 ? (
        <EmptyState
          title="Nenhum exemplar catalogado"
          description="Não encontramos livros com os critérios informados. Clique no botão abaixo para adicionar o primeiro livro."
          actionText="Cadastrar Primeiro Livro"
          onAction={handleOpenCreateModal}
        />
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th style={{ width: '60px' }}>Capa</th>
                <th>Título & Autor</th>
                <th>ISBN</th>
                <th>Categoria</th>
                <th>Localização</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => {
                const isAvailable = book.status === 'Disponível';

                return (
                  <tr key={book._id}>
                    <td>
                      {book.coverUrl ? (
                        <Image
                          src={book.coverUrl}
                          alt={book.title}
                          width={40}
                          height={54}
                          style={{ borderRadius: '4px', objectFit: 'cover' }}
                          unoptimized
                        />
                      ) : (
                        <div
                          style={{
                            width: '40px',
                            height: '54px',
                            backgroundColor: '#432818',
                            color: '#FFE6A7',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                            auto_stories
                          </span>
                        </div>
                      )}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#432818' }}>{book.title}</div>
                      <div style={{ fontSize: '12px', color: '#50443F' }}>{book.author}</div>
                    </td>
                    <td>
                      <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{book.isbn}</span>
                    </td>
                    <td>
                      <span className="badge badge-vintage" style={{ fontSize: '11px' }}>
                        {book.category}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '13px', color: '#50443F' }}>
                        {book.shelfLocation || 'Estante Geral'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${isAvailable ? 'badge-available' : 'badge-borrowed'}`}>
                        <span
                          style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            backgroundColor: isAvailable ? '#1B6E3F' : '#99582A',
                          }}
                        />
                        {book.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button
                          className="btn btn-outline btn-sm"
                          style={{ padding: '4px 8px' }}
                          onClick={() => handleOpenViewModal(book)}
                          title="Visualizar detalhes"
                          type="button"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                            visibility
                          </span>
                        </button>

                        <button
                          className="btn btn-outline btn-sm"
                          style={{ padding: '4px 8px' }}
                          onClick={() => handleOpenEditModal(book)}
                          title="Editar exemplar"
                          type="button"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#99582A' }}>
                            edit
                          </span>
                        </button>

                        <button
                          className="btn btn-outline btn-sm"
                          style={{ padding: '4px 8px' }}
                          onClick={() => handleOpenDeleteModal(book)}
                          title="Excluir livro do acervo"
                          type="button"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#BA1A1A' }}>
                            delete
                          </span>
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

      {/* MODAL DE CADASTRO / EDIÇÃO */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={editingBook ? 'Editar Dados do Exemplar' : 'Cadastrar Novo Livro no Acervo'}
        size="lg"
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
              {formSubmitting ? 'Salvando...' : editingBook ? 'Atualizar Livro' : 'Salvar Livro'}
            </button>
          </>
        }
      >
        <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="modal-title">Título da Obra *</label>
              <input
                id="modal-title"
                className="form-control"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="ex: Dom Casmurro"
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="modal-author">Autor / Autora *</label>
              <input
                id="modal-author"
                className="form-control"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="ex: Machado de Assis"
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="modal-isbn">Código ISBN *</label>
              <input
                id="modal-isbn"
                className="form-control"
                value={formData.isbn}
                onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                placeholder="ex: 978-85-359-0277-1"
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="modal-category">Categoria Literária</label>
              <select
                id="modal-category"
                className="form-control"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="Literatura Brasileira">Literatura Brasileira</option>
                <option value="Clássicos Universais">Clássicos Universais</option>
                <option value="Memórias & Biografias">Memórias & Biografias</option>
                <option value="Infanto-Juvenil">Infanto-Juvenil</option>
                <option value="Poesia & Crônica">Poesia & Crônica</option>
                <option value="História & Filosofia">História & Filosofia</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="modal-shelf">Localização na Estante</label>
              <input
                id="modal-shelf"
                className="form-control"
                value={formData.shelfLocation}
                onChange={(e) => setFormData({ ...formData, shelfLocation: e.target.value })}
                placeholder="ex: Estante A1 · P2"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="modal-year">Ano de Publicação</label>
              <input
                id="modal-year"
                type="number"
                className="form-control"
                value={formData.publicationYear}
                onChange={(e) => setFormData({ ...formData, publicationYear: e.target.value })}
                placeholder="ex: 1899"
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="modal-pages">Nº de Páginas</label>
              <input
                id="modal-pages"
                type="number"
                className="form-control"
                value={formData.pages}
                onChange={(e) => setFormData({ ...formData, pages: e.target.value })}
                placeholder="ex: 256"
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="modal-status">Status</label>
              <select
                id="modal-status"
                className="form-control"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Disponível' | 'Emprestado' })}
              >
                <option value="Disponível">Disponível</option>
                <option value="Emprestado">Emprestado</option>
              </select>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="modal-cover">URL da Imagem da Capa (Opcional)</label>
            <input
              id="modal-cover"
              className="form-control"
              value={formData.coverUrl}
              onChange={(e) => setFormData({ ...formData, coverUrl: e.target.value })}
              placeholder="https://exemplo.com/capa.jpg"
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="modal-synopsis">Sinopse da Obra</label>
            <textarea
              id="modal-synopsis"
              className="form-control"
              rows={3}
              value={formData.synopsis}
              onChange={(e) => setFormData({ ...formData, synopsis: e.target.value })}
              placeholder="Breve resumo sobre a temática e contexto do livro..."
            />
          </div>
        </form>
      </Modal>

      {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirmar Exclusão de Livro"
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
              {deleteSubmitting ? 'Excluindo...' : 'Sim, Excluir do Acervo'}
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
              Deseja realmente excluir &quot;{bookToDelete?.title}&quot;?
            </h4>
            <p style={{ fontSize: '14px', color: '#50443F' }}>
              Esta ação removerá permanentemente o livro do acervo comunitário. O sistema
              impedirá automaticamente a exclusão se houver empréstimos ativos pendentes
              vinculados a este exemplar.
            </p>
          </div>
        </div>
      </Modal>

      {/* MODAL DE VISUALIZAÇÃO RÁPIDA */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Ficha do Exemplar no Sistema"
        footer={
          <button className="btn btn-outline" onClick={() => setIsViewModalOpen(false)} type="button">
            Fechar
          </button>
        }
      >
        {viewingBook && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div
                style={{
                  width: '58px',
                  height: '80px',
                  borderRadius: '6px',
                  backgroundColor: '#432818',
                  color: '#FFE6A7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>
                  auto_stories
                </span>
              </div>
              <div>
                <span className="badge badge-vintage" style={{ fontSize: '11px' }}>
                  {viewingBook.category}
                </span>
                <h3 style={{ fontSize: '1.25rem', color: '#432818', marginTop: '4px' }}>
                  {viewingBook.title}
                </h3>
                <p style={{ color: '#99582A', fontWeight: 500 }}>por {viewingBook.author}</p>
              </div>
            </div>

            <div className="table-container" style={{ margin: '8px 0' }}>
              <table>
                <tbody>
                  <tr>
                    <td style={{ fontWeight: 600, width: '140px' }}>ISBN</td>
                    <td>{viewingBook.isbn}</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 600 }}>Localização</td>
                    <td>{viewingBook.shelfLocation || 'Estante Geral'}</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 600 }}>Status Atual</td>
                    <td>
                      <span className={`badge ${viewingBook.status === 'Disponível' ? 'badge-available' : 'badge-borrowed'}`}>
                        {viewingBook.status}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 600 }}>Ano / Páginas</td>
                    <td>
                      {viewingBook.publicationYear || 'N/A'} · {viewingBook.pages ? `${viewingBook.pages} páginas` : 'N/A'}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 600 }}>Sinopse</td>
                    <td>{viewingBook.synopsis || 'Sem sinopse cadastrada.'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
