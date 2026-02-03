import { useParams, Link, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Order } from '../types/index';
import { fetchOrderById } from '../services/api';

export default function OrderDetail() {
  const { orderId } = useParams<{ orderId: string }>();
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOrder = async () => {
      if (!orderId || !user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const fetchedOrder = await fetchOrderById(orderId, user.customerId, user.role);
        setOrder(fetchedOrder);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar el pedido');
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [orderId, user]);

  if (loading) {
    return (
      <div className="order-detail-page">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>Cargando pedido...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-detail-page">
        <div style={{ textAlign: 'center', padding: '40px', color: '#ef4444' }}>
          <p><strong>Error:</strong> {error}</p>
          <Link to="/orders" className="btn-primary" style={{ marginTop: '20px' }}>
            Volver a Pedidos
          </Link>
        </div>
      </div>
    );
  }

  if (!order) {
    return <Navigate to="/orders" replace />;
  }

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('es-MX', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const statusConfig = {
    pending: { label: 'Pendiente', color: '#f59e0b', icon: 'clock' },
    processing: { label: 'Procesando', color: '#3b82f6', icon: 'loader' },
    completed: { label: 'Completado', color: '#10b981', icon: 'check' },
    cancelled: { label: 'Cancelado', color: '#ef4444', icon: 'x' }
  };

  const status = statusConfig[order.status];

  return (
    <div className="order-detail-page">
      <div className="order-success-banner">
        <div className="success-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
        <h1>¡Pedido Confirmado!</h1>
        <p>Gracias por tu compra. Hemos recibido tu pedido correctamente.</p>
      </div>

      <div className="order-detail-content">
        <div className="order-main">
          <div className="order-header-card">
            <div className="order-id-section">
              <span className="order-label">Número de Pedido</span>
              <span className="order-id">{order.id}</span>
            </div>
            <div className="order-status" style={{ '--status-color': status.color } as React.CSSProperties}>
              <span className="status-badge">{status.label}</span>
            </div>
          </div>

          <div className="order-info-card">
            <h2>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              Información del Pedido
            </h2>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Fecha</span>
                <span className="info-value">{formatDate(order.date)}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Cliente</span>
                <span className="info-value">{order.customerId}</span>
              </div>
            </div>
          </div>

          <div className="order-shipping-card">
            <h2>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              Dirección de Envío
            </h2>
            <div className="shipping-details">
              <p className="shipping-name">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.address}</p>
              <p>{order.shippingAddress.city}, CP {order.shippingAddress.postalCode}</p>
              <p>Tel: {order.shippingAddress.phone}</p>
            </div>
          </div>

          <div className="order-items-card">
            <h2>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              Productos ({order.items.length})
            </h2>
            <div className="items-list">
              {order.items.map(item => (
                <div key={item.product.id} className="order-item">
                  <img src={item.product.image} alt={item.product.name} />
                  <div className="item-details">
                    <h3>{item.product.name}</h3>
                    <p className="item-category">{item.product.category}</p>
                    <p className="item-qty">Cantidad: {item.quantity}</p>
                  </div>
                  <div className="item-price">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="order-sidebar">
          <div className="payment-summary-card">
            <h2>Resumen de Pago</h2>
            <div className="payment-lines">
              <div className="payment-line">
                <span>Subtotal</span>
                <span>${(order.total / 1.16 - (order.total > 116.66 ? 0 : 9.99)).toFixed(2)}</span>
              </div>
              <div className="payment-line">
                <span>Envío</span>
                <span>{order.total > 116.66 ? 'Gratis' : '$9.99'}</span>
              </div>
              <div className="payment-line">
                <span>IVA (16%)</span>
                <span>${(order.total * 0.16 / 1.16).toFixed(2)}</span>
              </div>
              <div className="payment-line total">
                <span>Total Pagado</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="order-actions">
            <Link to="/catalog" className="action-btn primary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
              Seguir Comprando
            </Link>
            <Link to="/orders" className="action-btn secondary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
              Ver Mis Pedidos
            </Link>
          </div>

          <div className="help-card">
            <h3>¿Necesitas ayuda?</h3>
            <p>Si tienes alguna pregunta sobre tu pedido, no dudes en contactarnos.</p>
            <a href="mailto:soporte@techstore.com" className="help-link">
              soporte@techstore.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
