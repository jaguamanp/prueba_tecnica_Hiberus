import { useState } from 'react';
import { Product } from '../types/index';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();
  const { isAdmin } = useAuth();

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="product-card">
      <div className="product-image">
        <img src={product.image} alt={product.name} loading="lazy" />
        <span className="product-category">{product.category}</span>
        {product.stock < 10 && (
          <span className="product-stock-low">¡Quedan {product.stock}!</span>
        )}
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        
        <div className="product-footer">
          <div className="product-price">
            <span className="price-currency">$</span>
            <span className="price-amount">{product.price.toFixed(2)}</span>
          </div>
          
          <button 
            className={`add-to-cart-btn ${added ? 'added' : ''}`}
            onClick={handleAddToCart}
            disabled={added}
          >
            {added ? (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Añadido
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Añadir
              </>
            )}
          </button>
        </div>

        {isAdmin && (
          <div className="admin-info">
            <span>Stock: {product.stock} unidades</span>
            <span>ID: {product.id}</span>
          </div>
        )}
      </div>
    </div>
  );
}
