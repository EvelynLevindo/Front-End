'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

interface AdminSidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export default function AdminSidebar({ mobileOpen = false, onCloseMobile }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [delayedCount, setDelayedCount] = useState<number>(0);

  useEffect(() => {
    // Buscar contagem de devoluções atrasadas para o badge de alerta
    fetch('/api/loans/delayed')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.delayedLoans) {
          setDelayedCount(data.delayedLoans.length);
        }
      })
      .catch(() => {});
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch {
      router.push('/login');
    }
  };

  const navItems = [
    {
      label: 'Painel Principal',
      icon: 'dashboard',
      href: '/admin',
      exact: true,
    },
    {
      label: 'Gerenciar Livros',
      icon: 'menu_book',
      href: '/admin/livros',
      exact: false,
    },
    {
      label: 'Gerenciar Membros',
      icon: 'group',
      href: '/admin/membros',
      exact: false,
    },
    {
      label: 'Empréstimos e Devoluções',
      icon: 'swap_horiz',
      href: '/admin/emprestimos',
      exact: false,
    },
    {
      label: 'Devoluções Atrasadas',
      icon: 'warning',
      href: '/admin/atrasados',
      exact: false,
      badge: delayedCount > 0 ? `${delayedCount} pendentes` : undefined,
      alert: delayedCount > 0,
    },
  ];

  return (
    <aside className={`admin-sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-top">
        {/* Brand */}
        <div className="sidebar-brand">
          <div className="brand-icon">
            <span className="material-symbols-outlined">local_library</span>
          </div>
          <div>
            <div className="brand-title">Lumine</div>
            <div className="brand-sub">Gestão Bibliotecária</div>
          </div>
        </div>

        {/* Status do Acervo */}
        <div className="sidebar-stats-badge">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="status-dot" />
            <span>Sistema Conectado</span>
          </div>
          <strong>v2.4</strong>
        </div>

        {/* Navegação Mestra */}
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={onCloseMobile}
              >
                <div className="nav-label-group">
                  <span className="material-symbols-outlined">{item.icon}</span>
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`counter-badge ${item.alert ? 'badge-alert' : ''}`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="sidebar-bottom">
        <Link href="/" className="nav-item">
          <span className="material-symbols-outlined">public</span>
          <span>Ver Consulta Pública</span>
        </Link>

        <button className="nav-item logout-btn" onClick={handleLogout} type="button">
          <span className="material-symbols-outlined">logout</span>
          <span>Sair do Sistema</span>
        </button>
      </div>
    </aside>
  );
}
