import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  Users,
  LogOut,
  Zap,
  Flame,
  Crown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

import logo from '../assets/logo.png';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Projects & Tasks', path: '/tasks', icon: CheckSquare },
    { label: 'Employees', path: '/employees', icon: Users },
  ];

  return (
    <aside className="sidebar">
      <div>
        {/* Brand Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '10px 8px 24px 8px',
          marginBottom: '12px',
          borderBottom: '1px solid var(--border-color)'
        }}>
          <img
            src={logo}
            alt="Aljada Almushriqa Logo"
            style={{ width: '100%', maxWidth: '180px', height: 'auto', objectFit: 'contain', filter: 'invert(1)' }}
          />
        </div>

        {/* User Card inside Sidebar */}
        {user && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 12px',
            borderRadius: '12px',
            background: 'var(--bg-input)',
            border: '1px solid var(--border-color)',
            marginBottom: '20px'
          }}>
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
              alt={user.name}
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                objectFit: 'cover'
              }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: '0.84rem',
                fontWeight: 700,
                color: 'var(--text-main)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {user.name}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Admin Operations</div>
            </div>
          </div>
        )}

        {/* Main Navigation Section Header */}
        <div style={{
          fontSize: '0.7rem',
          fontWeight: 800,
          color: 'var(--text-dim)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          paddingLeft: '10px',
          marginBottom: '10px'
        }}>
          Navigation
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <NavLink
                key={item.label}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '11px 16px',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  fontSize: '0.88rem',
                  fontWeight: isActive ? 700 : 600,
                  transition: 'all 0.2s ease',
                  color: isActive ? '#ffffff' : 'var(--text-muted)',
                  background: isActive ? 'var(--gradient-orange)' : 'transparent',
                  boxShadow: isActive ? '0 6px 20px rgba(249, 115, 22, 0.4)' : 'none'
                }}
              >
                <Icon size={18} color={isActive ? '#ffffff' : 'currentColor'} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Upgrade to Pro Card & Logout */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>


        <button
          onClick={handleLogout}
          className="btn btn-secondary"
          style={{ width: '100%', justifyContent: 'center', padding: '9px 14px', fontSize: '0.82rem', borderRadius: '12px' }}
        >
          <LogOut size={16} color="#f87171" />
          <span style={{ color: '#f87171', fontWeight: 600 }}>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;


