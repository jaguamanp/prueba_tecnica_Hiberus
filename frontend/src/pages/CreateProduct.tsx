import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { createProduct } from '../services/api';
import { Product } from '../types/index';
import '../styles/CreateProduct.css';

interface FormData {
  name: string;
  description: string;
  price: string;
  category: string;
  stock: string;
  image: string;
}

interface FormErrors {
  name?: string;
  description?: string;
  price?: string;
  category?: string;
  stock?: string;
  image?: string;
}

export function CreateProduct() {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    image: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Redirigir si no es admin
  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
  }, [isAdmin, navigate]);

  // Validar formulario
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validar nombre
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre del producto es requerido';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'El nombre debe tener al menos 3 caracteres';
    } else if (formData.name.trim().length > 100) {
      newErrors.name = 'El nombre no debe exceder 100 caracteres';
    }

    // Validar descripción
    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'La descripción debe tener al menos 10 caracteres';
    } else if (formData.description.trim().length > 500) {
      newErrors.description = 'La descripción no debe exceder 500 caracteres';
    }

    // Validar precio
    if (!formData.price) {
      newErrors.price = 'El precio es requerido';
    } else {
      const priceNum = parseFloat(formData.price);
      if (isNaN(priceNum) || priceNum <= 0) {
        newErrors.price = 'El precio debe ser un número mayor a 0';
      } else if (priceNum > 999999.99) {
        newErrors.price = 'El precio no puede exceder 999999.99';
      }
    }

    // Validar stock
    if (!formData.stock) {
      newErrors.stock = 'El stock es requerido';
    } else {
      const stockNum = parseInt(formData.stock, 10);
      if (isNaN(stockNum) || stockNum < 0) {
        newErrors.stock = 'El stock debe ser un número mayor o igual a 0';
      } else if (stockNum > 999999) {
        newErrors.stock = 'El stock no puede exceder 999999';
      }
    }

    // Validar imagen URL
    if (!formData.image.trim()) {
      newErrors.image = 'La URL de la imagen es requerida';
    } else {
      try {
        new URL(formData.image);
      } catch {
        newErrors.image = 'La URL de la imagen no es válida';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Limpiar error del campo cuando el usuario comienza a escribir
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'> = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        category: formData.category,
        stock: parseInt(formData.stock, 10),
        image: formData.image.trim(),
      };

      const newProduct = await createProduct(
        productData,
        user?.customerId || '',
        'ADMIN'
      );

      setSuccessMessage(
        `Producto "${newProduct.name}" creado exitosamente con ID: ${newProduct.id}`
      );

      // Limpiar formulario
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        image: '',
      });

      // Redirigir al catálogo después de 2 segundos
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Error al crear el producto'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="create-product-container">
      <div className="create-product-card">
        <h1>Crear Nuevo Producto</h1>
        <p className="admin-badge">Operación solo disponible para Administradores</p>

        {successMessage && (
          <div className="alert alert-success">{successMessage}</div>
        )}

        {errorMessage && (
          <div className="alert alert-error">{errorMessage}</div>
        )}

        <form onSubmit={handleSubmit} className="create-product-form">
          {/* Nombre del Producto */}
          <div className="form-group">
            <label htmlFor="name">Nombre del Producto *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ej: Laptop Dell XPS 13"
              className={errors.name ? 'input-error' : ''}
              maxLength={100}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
            <span className="char-count">{formData.name.length}/100</span>
          </div>

          {/* Descripción */}
          <div className="form-group">
            <label htmlFor="description">Descripción *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe las características del producto..."
              rows={5}
              className={errors.description ? 'input-error' : ''}
              maxLength={500}
            />
            {errors.description && (
              <span className="error-message">{errors.description}</span>
            )}
            <span className="char-count">{formData.description.length}/500</span>
          </div>

          {/* Precio */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Precio (USD) *</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="99.99"
                step="0.01"
                min="0"
                className={errors.price ? 'input-error' : ''}
              />
              {errors.price && (
                <span className="error-message">{errors.price}</span>
              )}
            </div>

            {/* Stock */}
            <div className="form-group">
              <label htmlFor="stock">Stock *</label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="10"
                min="0"
                className={errors.stock ? 'input-error' : ''}
              />
              {errors.stock && (
                <span className="error-message">{errors.stock}</span>
              )}
            </div>
          </div>

          {/* URL de Imagen */}
          <div className="form-group">
            <label htmlFor="image">URL de Imagen *</label>
            <input
              type="url"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://ejemplo.com/imagen.jpg"
              className={errors.image ? 'input-error' : ''}
            />
            {errors.image && (
              <span className="error-message">{errors.image}</span>
            )}
            {formData.image && !errors.image && (
              <div className="image-preview">
                <img src={formData.image} alt="Preview" />
              </div>
            )}
          </div>

          {/* Botones */}
          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Creando producto...' : 'Crear Producto'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/')}
              disabled={loading}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
