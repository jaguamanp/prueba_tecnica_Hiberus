export type UserRole = 'CLIENTE' | 'ADMIN';

export interface User {
  customerId: string;
  role: UserRole;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string | number;
  customerId: string;
  items: CartItem[];
  total: number;
  date: Date | string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  shippingAddress: ShippingAddress;
}

export interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
}
