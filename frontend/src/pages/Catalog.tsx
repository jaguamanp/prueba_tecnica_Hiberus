import { useState, useEffect, useMemo } from 'react';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../contexts/AuthContext';
import { fetchProducts, fetchCategories } from '../services/api';
import { Product } from '../types/index';

export default function Catalog() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { isAdmin } = useAuth();

  // Cargar productos
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const sortField = sortBy === 'name' ? 'name' : sortBy.split('-')[0];
        const sortOrder = sortBy.endsWith('-desc') ? 'DESC' : 'ASC';
        
        const data = await fetchProducts(
          page,
          10,
          searchTerm || undefined,
          selectedCategory !== 'all' ? selectedCategory : undefined,
          sortField,
          sortOrder
        );

        setProducts(data.items);
        setTotalPages(data.pages);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar productos');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [page, searchTerm, selectedCategory, sortBy]);

  // Cargar categorías
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(['all', ...data.sort()]);
      } catch (err) {
        console.error('Error loading categories:', err);
      }
    };

    loadCategories();
  }, []);

  const filteredProducts = useMemo(() => {
    return products;
  }, [products]);

  return (
    <div className="catalog-page">
      <div className="catalog-header">
        <div className="catalog-title">
          <h1>Catálogo de Productos</h1>
          <p>{filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}</p>
        </div>

        {isAdmin && (
          <div className="admin-banner">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            Modo Administrador - Visualización completa de stock e IDs
          </div>
        )}
      </div>

      <div className="catalog-filters">
        <div className="search-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-search" onClick={() => setSearchTerm('')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>

        <div className="filter-group">
          <label htmlFor="category">Categoría</label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'Todas' : cat}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="sort">Ordenar por</label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">Nombre</option>
            <option value="price-asc">Precio: Menor a Mayor</option>
            <option value="price-desc">Precio: Mayor a Menor</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="error-message" style={{ padding: '20px', background: '#fee', borderRadius: '8px', marginBottom: '20px' }}>
          <strong>Error:</strong> {error}
          <button onClick={() => window.location.reload()} style={{ marginLeft: '10px' }}>
            Reintentar
          </button>
        </div>
      )}

      {loading ? (
        <div className="loading" style={{ textAlign: 'center', padding: '40px' }}>
          <p>Cargando productos...</p>
        </div>
      ) : filteredProducts.length > 0 ? (
        <>
          <div className="products-grid">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          {totalPages > 1 && (
            <div className="pagination" style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '30px' }}>
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))} 
                disabled={page === 1}
              >
                Anterior
              </button>
              <span style={{ padding: '10px' }}>
                Página {page} de {totalPages}
              </span>
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
                disabled={page === totalPages}
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="no-results">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="8" y1="8" x2="14" y2="14" />
            <line x1="14" y1="8" x2="8" y2="14" />
          </svg>
          <h2>No se encontraron productos</h2>
          <p>Intenta con otros términos de búsqueda o cambia los filtros</p>
          <button onClick={() => { setSearchTerm(''); setSelectedCategory('all'); setPage(1); }}>
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  );
}
