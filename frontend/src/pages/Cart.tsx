import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import CartItem from '../components/CartItem';

export default function Cart() {
  const { items, getTotal, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="empty-cart">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
          </svg>
          <h2>Tu carrito está vacío</h2>
          <p>¡Explora nuestro catálogo y encuentra productos increíbles!</p>
          <Link to="/catalog" className="btn-primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
            Ver Catálogo
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = getTotal();
  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = subtotal * 0.16;
  const total = subtotal + shipping + tax;

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
          </svg>
          Carrito de Compras
        </h1>
        <button className="clear-cart-btn" onClick={clearCart}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
          </svg>
          Vaciar Carrito
        </button>
      </div>

      <div className="cart-content">
        <div className="cart-items">
          {items.map(item => (
            <CartItem key={item.product.id} item={item} />
          ))}
        </div>

        <div className="cart-summary">
          <h2>Resumen del Pedido</h2>
          
          <div className="summary-row">
            <span>Subtotal ({items.length} artículo{items.length !== 1 ? 's' : ''})</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          
          <div className="summary-row">
            <span>Envío</span>
            <span className={shipping === 0 ? 'free-shipping' : ''}>
              {shipping === 0 ? '¡Gratis!' : `$${shipping.toFixed(2)}`}
            </span>
          </div>
          
          {subtotal < 100 && (
            <div className="shipping-notice">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              ¡Añade ${(100 - subtotal).toFixed(2)} más para envío gratis!
            </div>
          )}
          
          <div className="summary-row">
            <span>IVA (16%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          
          <div className="summary-total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <Link to="/checkout" className="checkout-btn">
            Proceder al Checkout
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>

          <Link to="/catalog" className="continue-shopping">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Continuar comprando
          </Link>
        </div>
      </div>
    </div>
  );
}
