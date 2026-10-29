import React from 'react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: string;
  actionText?: string;
  onAction?: () => void;
}

export default function EmptyState({
  title = 'Nenhum registro encontrado',
  description = 'Não localizamos itens correspondentes aos critérios de busca ou filtros selecionados.',
  icon = 'menu_book',
  actionText,
  onAction,
}: EmptyStateProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
        textAlign: 'center',
        backgroundColor: '#FCF9F4',
        borderRadius: '12px',
        border: '1px dashed #EADCC9',
        margin: '1.5rem 0',
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: '#F0EDE9',
          color: '#BB9457',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1rem',
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>
          {icon}
        </span>
      </div>

      <h3 style={{ fontSize: '1.25rem', color: '#432818', marginBottom: '0.35rem' }}>
        {title}
      </h3>

      <p style={{ maxWidth: '420px', color: '#50443F', fontSize: '0.9375rem', marginBottom: '1.25rem' }}>
        {description}
      </p>

      {actionText && onAction && (
        <button className="btn btn-secondary btn-sm" onClick={onAction} type="button">
          {actionText}
        </button>
      )}
    </div>
  );
}
