import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

export default function Orders() {
  const { orders, loadOrders, isLoadingOrders } = useCart();
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    if (user) {
      loadOrders(user.customerId, user.role);
    }
  }, [user, loadOrders]);

  // Filtrar pedidos según el rol
  const filteredOrders = isAdmin 
    ? orders 
    : orders.filter(order => order.customerId === user?.customerId);

  const sortedOrders = [...filteredOrders].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const statusConfig = {
    pending: { label: 'Pendiente', className: 'status-pending' },
    processing: { label: 'Procesando', className: 'status-processing' },
    completed: { label: 'Completado', className: 'status-completed' },
    cancelled: { label: 'Cancelado', className: 'status-cancelled' }
  };

  if (isLoadingOrders) {
    return (
      <div className="orders-page">
        <div className="orders-header">
          <h1>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            Mis Pedidos
          </h1>
        </div>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>Cargando pedidos...</p>
        </div>
      </div>
    );
  }

  if (sortedOrders.length === 0) {
    return (
      <div className="orders-page">
        <div className="orders-header">
          <h1>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            Mis Pedidos
          </h1>
        </div>
        <div className="empty-orders">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          <h2>No tienes pedidos aún</h2>
          <p>Cuando realices tu primera compra, aparecerá aquí</p>
          <Link to="/catalog" className="btn-primary">
            Ir al Catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-header">
        <h1>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
          {isAdmin ? 'Todos los Pedidos' : 'Mis Pedidos'}
        </h1>
        <span className="orders-count">{sortedOrders.length} pedido{sortedOrders.length !== 1 ? 's' : ''}</span>
      </div>

      {isAdmin && (
        <div className="admin-orders-banner">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          Vista de Administrador - Mostrando todos los pedidos del sistema
        </div>
      )}

      <div className="orders-list">
        {sortedOrders.map(order => {
          const status = statusConfig[order.status];
          return (
            <Link to={`/order/${order.id}`} key={order.id} className="order-card">
              <div className="order-card-header">
                <div className="order-card-id">
                  <span className="label">Pedido</span>
                  <span className="value">{order.id}</span>
                </div>
                <span className={`order-status-badge ${status.className}`}>
                  {status.label}
                </span>
              </div>

              <div className="order-card-body">
                <div className="order-items-preview">
                  {order.items.slice(0, 3).map(item => (
                    <div key={item.product.id} className="item-thumb">
                      <img src={item.product.image} alt={item.product.name} />
                      {item.quantity > 1 && (
                        <span className="quantity-badge">{item.quantity}</span>
                      )}
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <div className="more-items">+{order.items.length - 3}</div>
                  )}
                </div>

                <div className="order-card-info">
                  <div className="info-row">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    {formatDate(order.date)}
                  </div>
                  {isAdmin && (
                    <div className="info-row customer">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      {order.customerId}
                    </div>
                  )}
                  <div className="info-row items">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                      <line x1="3" y1="6" x2="21" y2="6" />
                    </svg>
                    {order.items.reduce((sum, item) => sum + item.quantity, 0)} artículo{order.items.reduce((sum, item) => sum + item.quantity, 0) !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>

              <div className="order-card-footer">
                <span className="order-total">${order.total.toFixed(2)}</span>
                <span className="view-details">
                  Ver detalles
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
