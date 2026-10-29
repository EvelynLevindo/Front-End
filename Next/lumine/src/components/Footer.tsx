import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="public-footer" id="sobre">
      <div className="footer-container">
        {/* Coluna 1: Sobre */}
        <div className="footer-brand">
          <h3>Lumine · Ler é Viver</h3>
          <p>
            Preservamos a magia do livro físico e democratizamos o saber. Um espaço
            público de acolhimento, cultura e incentivo à leitura comunitária.
          </p>
          <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
            <span className="badge badge-vintage" style={{ fontSize: '11px' }}>
              Acesso Gratuito
            </span>
            <span className="badge badge-vintage" style={{ fontSize: '11px' }}>
              Acervo Aberto
            </span>
          </div>
        </div>

        {/* Coluna 2: Horários & Local */}
        <div className="footer-col" id="regras">
          <h4>Atendimento & Regras</h4>
          <ul>
            <li>Segunda a Sexta: 08h às 18h30</li>
            <li>Sábados: 09h às 14h</li>
            <li>Empréstimos: até 2 exemplares</li>
            <li>Prazo: 15 dias renováveis</li>
            <li>Devoluções no balcão central</li>
          </ul>
        </div>

        {/* Coluna 3: Links Úteis */}
        <div className="footer-col">
          <h4>Navegação</h4>
          <ul>
            <li>
              <Link href="/">Consulta Pública do Acervo</Link>
            </li>
            <li>
              <Link href="/login">Portal do Bibliotecário</Link>
            </li>
            <li>
              <a href="#catalogo">Catálogo de Obras</a>
            </li>
            <li>
              <span style={{ opacity: 0.8 }}>Bairro da Paz · Centro Comunitário</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div>
          © 2026 Lumine — Sistema de Gestão Bibliotecária Comunitária.
        </div>
        <div>
          Desenvolvido com Next.js, MongoDB & SCSS · Conforme Diretrizes do Stitch.
        </div>
      </div>
    </footer>
  );
}
