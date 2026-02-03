import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types/index';

export default function Login() {
  const [customerId, setCustomerId] = useState('');
  const [role, setRole] = useState<UserRole>('CLIENTE');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!customerId.trim()) {
      setError('Por favor, ingresa un ID de cliente');
      return;
    }

    if (customerId.trim().length < 3) {
      setError('El ID de cliente debe tener al menos 3 caracteres');
      return;
    }

    const success = login(customerId, role);
    if (success) {
      navigate('/catalog');
    } else {
      setError('Error al iniciar sesión. Intenta de nuevo.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
          </div>
          <h1>Prueba técnica PHP</h1>
          <p className="login-subtitle">Inicia sesión para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="customerId">ID de Cliente</label>
            <input
              type="text"
              id="customerId"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              placeholder="Ingresa tu ID de cliente (ej. user123)"
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Tipo de Usuario</label>
            <div className="role-selector">
              <button
                type="button"
                className={`role-option ${role === 'CLIENTE' ? 'active' : ''}`}
                onClick={() => setRole('CLIENTE')}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                Cliente
              </button>
              <button
                type="button"
                className={`role-option ${role === 'ADMIN' ? 'active' : ''}`}
                onClick={() => setRole('ADMIN')}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                Admin
              </button>
            </div>
          </div>

          <button type="submit" className="login-button">
            Iniciar Sesión
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </form>

        <div className="login-info">
          <p>
            <strong>Nota:</strong> Este es un login simulado. Puedes usar cualquier ID
            de cliente con al menos 3 caracteres.
          </p>
        </div>
      </div>
    </div>
  );
}
