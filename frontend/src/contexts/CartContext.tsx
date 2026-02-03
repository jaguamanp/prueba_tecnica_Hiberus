import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { CartItem, Product, Order, ShippingAddress } from '../types/index';
import { fetchOrders, createOrder as createOrderAPI } from '../services/api';

interface CartContextType {
  items: CartItem[];
  orders: Order[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number | string) => void;
  updateQuantity: (productId: number | string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  checkout: (customerId: string, shippingAddress: ShippingAddress) => Promise<Order>;
  getOrderById: (orderId: string) => Promise<Order | undefined>;
  loadOrders: (customerId: string, role: string) => Promise<void>;
  isLoadingOrders: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  const saveCart = (newItems: CartItem[]) => {
    setItems(newItems);
    localStorage.setItem('cart', JSON.stringify(newItems));
  };

  const addToCart = (product: Product, quantity: number = 1) => {
    const existingIndex = items.findIndex(item => item.product.id === product.id);
    
    if (existingIndex >= 0) {
      const newItems = [...items];
      newItems[existingIndex].quantity += quantity;
      saveCart(newItems);
    } else {
      saveCart([...items, { product, quantity }]);
    }
  };

  const removeFromCart = (productId: number | string) => {
    const newItems = items.filter(item => item.product.id !== productId);
    saveCart(newItems);
  };

  const updateQuantity = (productId: number | string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const newItems = items.map(item =>
      item.product.id === productId ? { ...item, quantity } : item
    );
    saveCart(newItems);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const getTotal = () => {
    return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  };

  const getItemCount = () => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  const checkout = useCallback(async (customerId: string, shippingAddress: ShippingAddress): Promise<Order> => {
    const itemsForOrder = items.map(item => ({
      productId: item.product.id,
      quantity: item.quantity
    }));

    try {
      const order = await createOrderAPI(customerId, itemsForOrder, shippingAddress);
      // Usar saveCart en lugar de clearCart directamente
      saveCart([]);
      return order;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Error creating order');
    }
  }, [items]);

  const getOrderById = useCallback(async (orderId: string): Promise<Order | undefined> => {
    return orders.find(order => order.id === orderId);
  }, [orders]);

  const loadOrders = useCallback(async (customerId: string, role: string = 'CLIENTE') => {
    try {
      setIsLoadingOrders(true);
      const fetchedOrders = await fetchOrders(customerId, role);
      setOrders(fetchedOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
      setOrders([]);
    } finally {
      setIsLoadingOrders(false);
    }
  }, []);

  const value: CartContextType = {
    items,
    orders,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotal,
    getItemCount,
    checkout,
    getOrderById,
    loadOrders,
    isLoadingOrders
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
}
