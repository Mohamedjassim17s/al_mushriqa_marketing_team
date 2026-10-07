import React from 'react';
import { Search, Settings, HelpCircle, Bell, Plus, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = ({ title, subtitle, activeTab = 'Week', onTabChange, onAddAction }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="page-header" style={{
      display: 'flex',
      alignItems: 'center',
      justify: 'space-between',
      padding: '20px 32px 12px 32px',
      gap: '20px',
      flexWrap: 'wrap'
    }}>
      {/* Title & Subtitle */}
      <div>
        <h1 style={{
          fontSize: '1.75rem',
          fontWeight: 800,
          color: 'var(--text-main)',
          margin: 0,
          letterSpacing: '-0.03em'
        }}>
          {title || 'Time Tracker'}
        </h1>
        {subtitle && (
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '2px', margin: 0 }}>
            {subtitle}
          </p>
        )}
      </div>

      {/* Right Action Cluster */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>


        {/* Avatar Stack with Add Employee */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>


          <button
            onClick={() => onAddAction ? onAddAction() : navigate('/employees')}
            className="btn btn-secondary btn-sm"
            style={{ borderRadius: 'var(--radius-full)', fontWeight: 700, padding: '8px 14px' }}
          >
            <UserPlus size={14} color="var(--accent-orange)" />
            <span>+ Add Employee</span>
          </button>
        </div>


      </div>
    </header>
  );
};

export default Header;

