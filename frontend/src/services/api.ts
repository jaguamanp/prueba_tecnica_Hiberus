import { Product, Order, ShippingAddress } from '../types/index';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

// Obtener headers de autenticación
function getAuthHeaders(customerId?: string, role: string = 'CLIENTE'): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (customerId) {
    headers['X-Customer-Id'] = customerId;
  }
  headers['X-User-Role'] = role;

  return headers;
}

// Productos
export async function fetchProducts(
  page: number = 1,
  limit: number = 10,
  search?: string,
  category?: string,
  sort: string = 'name',
  order: string = 'ASC'
): Promise<PaginatedResponse<Product>> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    sort,
    order,
  });

  if (search) params.append('search', search);
  if (category && category !== 'all') params.append('category', category);

  const response = await fetch(
    `${API_BASE_URL}/products?${params.toString()}`,
    { headers: getAuthHeaders() }
  );

  if (!response.ok) throw new Error('Error fetching products');

  const json: ApiResponse<PaginatedResponse<Product>> = await response.json();
  if (!json.success) throw new Error(json.error || 'Error fetching products');

  return json.data!;
}

export async function fetchProductById(id: string): Promise<Product> {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) throw new Error('Error fetching product');

  const json: ApiResponse<Product> = await response.json();
  if (!json.success) throw new Error(json.error || 'Error fetching product');

  return json.data!;
}

export async function fetchCategories(): Promise<string[]> {
  const response = await fetch(`${API_BASE_URL}/products/categories`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) throw new Error('Error fetching categories');

  const json: ApiResponse<string[]> = await response.json();
  if (!json.success) throw new Error(json.error || 'Error fetching categories');

  return json.data || [];
}

export async function createProduct(
  product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>,
  customerId: string,
  role: string = 'ADMIN'
): Promise<Product> {
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: getAuthHeaders(customerId, role),
    body: JSON.stringify(product),
  });

  if (!response.ok) throw new Error('Error creating product');

  const json: ApiResponse<Product> = await response.json();
  if (!json.success) throw new Error(json.error || 'Error creating product');

  return json.data!;
}

// Órdenes
export async function fetchOrders(
  customerId: string,
  role: string = 'CLIENTE'
): Promise<Order[]> {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    headers: getAuthHeaders(customerId, role),
  });

  if (!response.ok) throw new Error('Error fetching orders');

  const json: ApiResponse<PaginatedResponse<Order>> = await response.json();
  if (!json.success) throw new Error(json.error || 'Error fetching orders');

  return json.data?.items || [];
}

export async function fetchOrderById(
  orderId: string,
  customerId: string,
  role: string = 'CLIENTE'
): Promise<Order> {
  const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
    headers: getAuthHeaders(customerId, role),
  });

  if (!response.ok) throw new Error('Error fetching order');

  const json: ApiResponse<Order> = await response.json();
  if (!json.success) throw new Error(json.error || 'Error fetching order');

  return json.data!;
}

export async function createOrder(
  customerId: string,
  items: Array<{ productId: number | string; quantity: number }>,
  shippingAddress: ShippingAddress,
  role: string = 'CLIENTE'
): Promise<Order> {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: getAuthHeaders(customerId, role),
    body: JSON.stringify({
      items: items.map(item => ({
        productId: Number(item.productId),
        quantity: item.quantity
      })),
      shippingAddress,
    }),
  });

  if (!response.ok) throw new Error('Error creating order');

  const json: ApiResponse<Order> = await response.json();
  if (!json.success) throw new Error(json.error || 'Error creating order');

  return json.data!;
}

export async function checkoutOrder(
  orderId: string,
  customerId: string,
  role: string = 'CLIENTE'
): Promise<Order> {
  const response = await fetch(`${API_BASE_URL}/orders/${orderId}/checkout`, {
    method: 'POST',
    headers: getAuthHeaders(customerId, role),
  });

  if (!response.ok) throw new Error('Error checking out order');

  const json: ApiResponse<Order> = await response.json();
  if (!json.success) throw new Error(json.error || 'Error checking out order');

  return json.data!;
}
