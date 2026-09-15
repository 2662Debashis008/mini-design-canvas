'use client';

import Link from 'next/link';
import { Layout, ArrowLeft, Save, Download, LogIn, LogOut, User as UserIcon } from 'lucide-react';
import Button from './Button';
import { SAVE_STATUS } from '../../utils/constants';
import { useAuth } from '../../context/AuthContext';

export default function Header({
  isEditor = false,
  canvasName = '',
  saveStatus = '',
  onSave,
  onExportPng
}) {
  const { user, isAuthenticated, logout } = useAuth();

  const getStatusClass = (status) => {
    switch (status) {
      case SAVE_STATUS.SAVED:
        return 'status-saved';
      case SAVE_STATUS.SAVING:
        return 'status-saving';
      case SAVE_STATUS.UNSAVED:
        return 'status-unsaved';
      case SAVE_STATUS.ERROR:
        return 'status-error';
      default:
        return 'status-saved';
    }
  };

  return (
    <header className="app-header">
      <div className="header-left">
        {isEditor ? (
          <Link href="/" className="btn btn-secondary btn-sm" title="Back to Dashboard">
            <ArrowLeft size={16} />
            <span>Dashboard</span>
          </Link>
        ) : (
          <Link href="/" className="logo-text">
            <Layout size={20} color="#2563eb" />
            <span>Mini Design Canvas</span>
            <span className="logo-badge">Glazia</span>
          </Link>
        )}
        {isEditor && (
          <div className="logo-text" style={{ fontSize: '1rem' }}>
            <Layout size={18} color="#2563eb" />
            <span>Mini Canvas</span>
          </div>
        )}
      </div>

      {isEditor ? (
        <>
          <div className="header-center">
            <span className="canvas-title">{canvasName || 'Untitled Canvas'}</span>
            {saveStatus && (
              <span className={`save-badge ${getStatusClass(saveStatus)}`}>
                {saveStatus}
              </span>
            )}
          </div>

          <div className="header-right">
            {onExportPng && (
              <Button
                variant="secondary"
                size="sm"
                onClick={onExportPng}
                title="Export Canvas as PNG image"
              >
                <Download size={15} />
                <span>Export PNG</span>
              </Button>
            )}
            {onSave && (
              <Button
                variant="primary"
                size="sm"
                onClick={onSave}
                disabled={saveStatus === SAVE_STATUS.SAVING}
                title="Save changes to MongoDB"
              >
                <Save size={15} />
                <span>Save</span>
              </Button>
            )}
          </div>
        </>
      ) : (
        <div className="header-right">
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: 'var(--text-primary)'
                }}
              >
                <span
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary-light)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.75rem'
                  }}
                >
                  {user?.name ? user.name.charAt(0).toUpperCase() : <UserIcon size={14} />}
                </span>
                <span>{user?.name || 'User'}</span>
              </div>
              <Button variant="secondary" size="sm" onClick={logout} title="Log Out">
                <LogOut size={14} />
                <span>Log Out</span>
              </Button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link href="/login">
                <Button variant="secondary" size="sm">
                  <LogIn size={14} />
                  <span>Log In</span>
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" size="sm">
                  <span>Sign Up</span>
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
