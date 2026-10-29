'use client';

import React from 'react';
import Modal from './Modal';
import Image from 'next/image';

export interface BookDetailData {
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
  totalCopies?: number;
  availableCopies?: number;
}

interface BookModalProps {
  book: BookDetailData | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function BookModal({ book, isOpen, onClose }: BookModalProps) {
  if (!book) return null;

  const isAvailable = book.status === 'Disponível';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Ficha Catalográfica do Exemplar"
      size="lg"
      footer={
        <button className="btn btn-outline" onClick={onClose} type="button">
          Fechar
        </button>
      }
    >
      <div className="book-details-modal">
        {/* Capa */}
        <div className="details-cover">
          {book.coverUrl ? (
            <Image
              src={book.coverUrl}
              alt={`Capa de ${book.title}`}
              width={200}
              height={290}
              style={{ objectFit: 'cover' }}
              unoptimized
            />
          ) : (
            <div className="details-cover-fallback">
              <span className="material-symbols-outlined" style={{ fontSize: '42px', marginBottom: '8px' }}>
                auto_stories
              </span>
              <p style={{ fontFamily: 'Playfair Display, serif', fontSize: '16px', color: '#ffffff' }}>
                {book.title}
              </p>
              <span style={{ fontSize: '12px', color: '#FFE6A7', marginTop: '4px' }}>
                {book.author}
              </span>
            </div>
          )}
        </div>

        {/* Informações */}
        <div className="details-info">
          <div className="details-header">
            <span className="details-category">{book.category}</span>
            <h2>{book.title}</h2>
            <p className="details-author">por {book.author}</p>
          </div>

          <div style={{ margin: '8px 0' }}>
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
          </div>

          {/* Grid de Metadados Catalográficos */}
          <div className="metadata-grid">
            <div className="meta-item">
              <span className="meta-label">Código ISBN</span>
              <span className="meta-value">{book.isbn}</span>
            </div>

            <div className="meta-item">
              <span className="meta-label">Localização</span>
              <span className="meta-value">{book.shelfLocation || 'Estante Geral'}</span>
            </div>

            <div className="meta-item">
              <span className="meta-label">Ano de Publicação</span>
              <span className="meta-value">{book.publicationYear || 'Edição Histórica'}</span>
            </div>

            <div className="meta-item">
              <span className="meta-label">Páginas</span>
              <span className="meta-value">{book.pages ? `${book.pages} págs.` : 'Não informado'}</span>
            </div>
          </div>

          {/* Sinopse */}
          <div className="synopsis-block">
            <h5>Sinopse da Obra</h5>
            <p>
              {book.synopsis ||
                'Exemplar físico pertencente ao acervo comunitário. Disponível para consulta local e empréstimo domiciliar mediante apresentação de cadastro de leitor.'}
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
}
