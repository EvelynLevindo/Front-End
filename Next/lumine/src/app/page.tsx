'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BookModal, { BookDetailData } from '@/components/BookModal';
import EmptyState from '@/components/EmptyState';
import Image from 'next/image';
import '@/styles/catalog.scss';

export default function CatalogPage() {
  const [books, setBooks] = useState<BookDetailData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');
  const [selectedSort, setSelectedSort] = useState<string>('recentes');

  // Modal de Detalhes
  const [selectedBook, setSelectedBook] = useState<BookDetailData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (searchTerm.trim()) params.append('search', searchTerm.trim());
      if (selectedCategory && selectedCategory !== 'todos') params.append('category', selectedCategory);
      if (selectedStatus && selectedStatus !== 'todos') params.append('status', selectedStatus);
      if (selectedSort) params.append('sort', selectedSort);

      const res = await fetch(`/api/books?${params.toString()}`);
      const data = await res.json();

      if (data.success && data.books) {
        setBooks(data.books);
      }
    } catch (err) {
      console.error('Erro ao carregar acervo:', err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedCategory, selectedStatus, selectedSort]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleOpenDetails = (book: BookDetailData) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const handleApplySuggestion = (author: string) => {
    setSearchTerm(author);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('todos');
    setSelectedStatus('todos');
    setSelectedSort('recentes');
  };

  // Contagens para os botões de filtro
  const totalCount = books.length;
  const availableCount = books.filter((b) => b.status === 'Disponível').length;
  const borrowedCount = books.filter((b) => b.status === 'Emprestado').length;

  return (
    <div className="catalog-page">
      <Header />

      {/* Hero Editorial com Atmosfera de Biblioteca */}
      <section className="catalog-hero">
        <div className="hero-glow-1" />
        <div className="hero-glow-2" />

        <div className="hero-content">
          <div className="community-pill">
            <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#99582A' }}>
              auto_stories
            </span>
            <span>Acesso Livre & Gratuito à Comunidade</span>
            <span className="dot" />
            <span style={{ color: '#50443F' }}>Bairro da Paz</span>
          </div>

          <h1 className="hero-title">
            Bem-vindo ao nosso <em>refúgio</em> literário
          </h1>

          <p className="hero-subtitle">
            Preservamos a magia do livro impresso e democratizamos o saber. Todo vizinho tem
            direito à imaginação, à poesia e à pesquisa sem custos nem burocracia.
          </p>

          {/* Painel de Busca Proeminente */}
          <div className="search-card">
            <div className="search-input-wrapper">
              <span className="material-symbols-outlined search-icon">search</span>
              <input
                type="text"
                placeholder="Buscar por título, autor, gênero ou ISBN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Campo de busca de livros"
              />
              {searchTerm && (
                <button
                  className="btn-clear"
                  onClick={() => setSearchTerm('')}
                  type="button"
                  aria-label="Limpar termo de busca"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                    cancel
                  </span>
                </button>
              )}
            </div>

            <div className="category-select-wrapper">
              <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#99582A', marginRight: '6px' }}>
                category
              </span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                aria-label="Filtrar por categoria"
              >
                <option value="todos">Todas as Categorias</option>
                <option value="Literatura Brasileira">Literatura Brasileira</option>
                <option value="Clássicos Universais">Clássicos Universais</option>
                <option value="Memórias & Biografias">Memórias & Biografias</option>
                <option value="Infanto-Juvenil">Infanto-Juvenil</option>
                <option value="Poesia & Crônica">Poesia & Crônica</option>
                <option value="História & Filosofia">História & Filosofia</option>
              </select>
              <span className="material-symbols-outlined select-arrow">expand_more</span>
            </div>

            <button
              className="btn btn-primary"
              onClick={fetchBooks}
              type="button"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                menu_book
              </span>
              <span>Explorar</span>
            </button>
          </div>

          {/* Sugestões Rápidas de Autores Clássicos */}
          <div className="search-suggestions">
            <span>Sugestões de busca:</span>
            <button
              className="suggestion-btn"
              onClick={() => handleApplySuggestion('Machado de Assis')}
              type="button"
            >
              Machado de Assis
            </button>
            <span>•</span>
            <button
              className="suggestion-btn"
              onClick={() => handleApplySuggestion('Carolina Maria de Jesus')}
              type="button"
            >
              Carolina Maria de Jesus
            </button>
            <span>•</span>
            <button
              className="suggestion-btn"
              onClick={() => handleApplySuggestion('Clarice Lispector')}
              type="button"
            >
              Clarice Lispector
            </button>
            <span>•</span>
            <button
              className="suggestion-btn"
              onClick={() => handleApplySuggestion('Guimarães Rosa')}
              type="button"
            >
              Guimarães Rosa
            </button>
          </div>
        </div>
      </section>

      {/* Barra de Filtros de Disponibilidade & Ordenação */}
      <section className="filter-bar" id="catalogo">
        <div className="filter-container">
          <div className="status-pills">
            <span className="filter-label">
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                tune
              </span>
              Status:
            </span>

            <button
              className={`pill-btn ${selectedStatus === 'todos' ? 'active' : ''}`}
              onClick={() => setSelectedStatus('todos')}
              type="button"
            >
              Todos ({totalCount})
            </button>

            <button
              className={`pill-btn ${selectedStatus === 'disponivel' ? 'active' : ''}`}
              onClick={() => setSelectedStatus('disponivel')}
              type="button"
            >
              <span className="dot-available" />
              Disponível para Empréstimo ({availableCount})
            </button>

            <button
              className={`pill-btn ${selectedStatus === 'emprestado' ? 'active' : ''}`}
              onClick={() => setSelectedStatus('emprestado')}
              type="button"
            >
              <span className="dot-borrowed" />
              Emprestado ({borrowedCount})
            </button>
          </div>

          <div className="sort-and-count">
            <div className="sort-wrapper">
              <label htmlFor="sort-select">Ordenar por:</label>
              <select
                id="sort-select"
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
              >
                <option value="recentes">Recém-Chegados</option>
                <option value="az">Ordem Alfabética (A-Z)</option>
                <option value="za">Ordem Alfabética (Z-A)</option>
              </select>
            </div>

            <div className="book-count-badge">
              Mostrando <strong>{books.length}</strong> exemplares
            </div>
          </div>
        </div>
      </section>

      {/* Banner Informativo da Comunidade */}
      <section className="info-banner">
        <div className="banner-card">
          <div className="banner-left">
            <div className="banner-icon">
              <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
                local_library
              </span>
            </div>
            <div>
              <h4>Como funciona o empréstimo gratuito?</h4>
              <p>
                Qualquer morador da região pode retirar até 2 livros por vez pelo período de 15 dias
                renováveis. Basta apresentar um documento e comprovante de endereço.
              </p>
            </div>
          </div>

          <div className="banner-pill">
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
              schedule
            </span>
            <span>Devoluções até 18h30 no balcão</span>
          </div>
        </div>
      </section>

      {/* Grid de Livros do Catálogo */}
      <main className="catalog-grid-section">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <span
              className="material-symbols-outlined"
              style={{ fontSize: '36px', color: '#99582A', animation: 'spin 1.2s linear infinite' }}
            >
              autorenew
            </span>
            <p style={{ marginTop: '0.75rem', color: '#50443F' }}>
              Consultando os livros do acervo comunitário...
            </p>
          </div>
        ) : books.length === 0 ? (
          <EmptyState
            title="Nenhum exemplar localizado"
            description="Não encontramos livros correspondentes aos termos ou filtros aplicados. Tente buscar pelo sobrenome do autor ou mude o filtro de status."
            icon="auto_stories"
            actionText="Limpar Filtros e Ver Todo o Acervo"
            onAction={handleResetFilters}
          />
        ) : (
          <div className="books-grid">
            {books.map((book) => {
              const isAvailable = book.status === 'Disponível';

              return (
                <article key={book._id} className="book-card">
                  <div className="card-top-cover">
                    {/* Badge de Disponibilidade */}
                    <div className="status-badge-container">
                      <span className={`badge ${isAvailable ? 'badge-available' : 'badge-borrowed'}`}>
                        <span
                          style={{
                            width: '5px',
                            height: '5px',
                            borderRadius: '50%',
                            backgroundColor: isAvailable ? '#1B6E3F' : '#99582A',
                          }}
                        />
                        {book.status}
                      </span>
                    </div>

                    {/* Localização na Estante */}
                    {book.shelfLocation && (
                      <div className="shelf-badge-container">
                        <span className="shelf-pill">
                          <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>
                            location_on
                          </span>
                          {book.shelfLocation}
                        </span>
                      </div>
                    )}

                    {/* Capa com Proporção de Livro e Lombada */}
                    <div className="book-cover">
                      {book.coverUrl ? (
                        <Image
                          src={book.coverUrl}
                          alt={`Capa de ${book.title}`}
                          width={260}
                          height={280}
                          style={{ objectFit: 'cover' }}
                          unoptimized
                        />
                      ) : (
                        <div className="cover-fallback">
                          <span className="material-symbols-outlined fallback-icon">
                            auto_stories
                          </span>
                          <span className="fallback-title">{book.title}</span>
                          <span className="fallback-author">{book.author}</span>
                        </div>
                      )}
                      <div className="cover-gradient" />
                      <div className="cover-overlay-title">
                        <span className="category-tag">{book.category}</span>
                        <h4>{book.title}</h4>
                      </div>
                    </div>
                  </div>

                  <div className="card-body">
                    <div>
                      <div className="card-meta">
                        <span>{book.author}</span>
                        <span>
                          {book.publicationYear || 'Edição Especial'}
                          {book.pages ? ` · ${book.pages} págs.` : ''}
                        </span>
                      </div>

                      <h3 className="book-title" title={book.title}>
                        {book.title}
                      </h3>

                      <p className="book-synopsis">
                        {book.synopsis ||
                          'Exemplar físico sob custódia da biblioteca comunitária. Solicite a leitura no balcão de atendimento.'}
                      </p>
                    </div>

                    <div className="card-footer-action">
                      <div className="copies-info">
                        <span className="copies-available">
                          <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>
                            {isAvailable ? 'check_circle' : 'hourglass_top'}
                          </span>
                          {isAvailable ? 'Disponível no balcão' : 'Emprestado no momento'}
                        </span>
                        <span className="isbn-code">ISBN: {book.isbn.substring(0, 10)}...</span>
                      </div>

                      <button
                        className="btn-details"
                        onClick={() => handleOpenDetails(book)}
                        type="button"
                      >
                        <span>Ver Detalhes do Livro</span>
                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                          arrow_forward
                        </span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      {/* Modal de Detalhes do Livro Selecionado */}
      <BookModal
        book={selectedBook}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <Footer />
    </div>
  );
}
