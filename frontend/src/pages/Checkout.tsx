import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { ShippingAddress } from '../types/index';

export default function Checkout() {
  const { items, getTotal, checkout } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<ShippingAddress>({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    phone: ''
  });

  const [errors, setErrors] = useState<Partial<ShippingAddress>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  if (items.length === 0) {
    return (
      <div className="checkout-page">
        <div className="empty-checkout">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          <h2>No hay productos en tu carrito</h2>
          <p>Agrega productos antes de realizar el checkout</p>
          <Link to="/catalog" className="btn-primary">Ir al Catálogo</Link>
        </div>
      </div>
    );
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<ShippingAddress> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'El nombre es requerido';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'La dirección es requerida';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'La ciudad es requerida';
    }
    if (!formData.postalCode.trim()) {
      newErrors.postalCode = 'El código postal es requerido';
    } else if (!/^\d{5}$/.test(formData.postalCode)) {
      newErrors.postalCode = 'Código postal inválido (5 dígitos)';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Teléfono inválido (10 dígitos)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof ShippingAddress]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsProcessing(true);

    try {
      const order = await checkout(user!.customerId, formData);
      navigate(`/order/${order.id}`);
    } catch (error) {
      setErrors({
        fullName: error instanceof Error ? error.message : 'Error al procesar el pedido'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const subtotal = getTotal();
  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = subtotal * 0.16;
  const total = subtotal + shipping + tax;

  return (
    <div className="checkout-page">
      <div className="checkout-header">
        <Link to="/cart" className="back-link">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Volver al carrito
        </Link>
        <h1>Checkout</h1>
      </div>

      <div className="checkout-content">
        <form onSubmit={handleSubmit} className="checkout-form">
          <section className="form-section">
            <h2>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              Dirección de Envío
            </h2>

            <div className="form-grid">
              <div className={`form-field full-width ${errors.fullName ? 'error' : ''}`}>
                <label htmlFor="fullName">Nombre Completo</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Juan Pérez García"
                />
                {errors.fullName && <span className="error-text">{errors.fullName}</span>}
              </div>

              <div className={`form-field full-width ${errors.address ? 'error' : ''}`}>
                <label htmlFor="address">Dirección</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Calle Principal #123, Col. Centro"
                />
                {errors.address && <span className="error-text">{errors.address}</span>}
              </div>

              <div className={`form-field ${errors.city ? 'error' : ''}`}>
                <label htmlFor="city">Ciudad</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Ciudad de México"
                />
                {errors.city && <span className="error-text">{errors.city}</span>}
              </div>

              <div className={`form-field ${errors.postalCode ? 'error' : ''}`}>
                <label htmlFor="postalCode">Código Postal</label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  placeholder="12345"
                  maxLength={5}
                />
                {errors.postalCode && <span className="error-text">{errors.postalCode}</span>}
              </div>

              <div className={`form-field full-width ${errors.phone ? 'error' : ''}`}>
                <label htmlFor="phone">Teléfono</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="5512345678"
                  maxLength={10}
                />
                {errors.phone && <span className="error-text">{errors.phone}</span>}
              </div>
            </div>
          </section>

          <section className="form-section payment-section">
            <h2>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
              Método de Pago
            </h2>
            <div className="payment-notice">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <p>Este es un checkout simulado. El pago se procesará automáticamente al confirmar el pedido.</p>
            </div>
          </section>

          <button 
            type="submit" 
            className={`submit-order-btn ${isProcessing ? 'processing' : ''}`}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <span className="spinner"></span>
                Procesando...
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                Confirmar Pedido - ${total.toFixed(2)}
              </>
            )}
          </button>
        </form>

        <div className="order-summary-sidebar">
          <h2>Resumen del Pedido</h2>
          
          <div className="summary-items">
            {items.map(item => (
              <div key={item.product.id} className="summary-item">
                <div className="item-image">
                  <img src={item.product.image} alt={item.product.name} />
                  <span className="item-quantity">{item.quantity}</span>
                </div>
                <div className="item-info">
                  <span className="item-name">{item.product.name}</span>
                  <span className="item-price">${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="summary-totals">
            <div className="summary-line">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-line">
              <span>Envío</span>
              <span className={shipping === 0 ? 'free' : ''}>{shipping === 0 ? 'Gratis' : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="summary-line">
              <span>IVA (16%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="summary-line total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
