import React, { createContext, useState, useContext, useEffect } from 'react';

export const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

const CART_STORAGE_KEY = 'radhana_art_cart';

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(Array.isArray(parsedCart) ? parsedCart : []);
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
      setCartItems([]);
    }
    setIsLoaded(true);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
      } catch (error) {
        console.error('Failed to save cart to localStorage:', error);
      }
    }
  }, [cartItems, isLoaded]);

  const addToCart = (product) => {
    if (!product) {
      console.error('Product is required to add to cart');
      return;
    }

    setCartItems((prevItems) => {
      // Use _id (MongoDB) or id (fallback) as unique identifier
      const productId = product._id || product.id;
      
      if (!productId) {
        console.error('Product must have an _id or id field');
        return prevItems;
      }

      const existingItem = prevItems.find((item) => (item._id || item.id) === productId);
      
      if (existingItem) {
        return prevItems.map((item) =>
          (item._id || item.id) === productId ? { ...item, qty: (item.qty || 1) + 1 } : item
        );
      }
      
      // Ensure product has all required fields
      return [...prevItems, { 
        ...product, 
        _id: product._id || product.id, 
        qty: 1,
        price: product.price || 0,
        name: product.name || 'Unknown Product'
      }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => 
      prevItems.filter((item) => (item._id || item.id) !== productId)
    );
  };

  const updateQuantity = (productId, amount) => {
    setCartItems((prevItems) => {
      const result = prevItems.map((item) => {
        if ((item._id || item.id) === productId) {
          const newQty = (item.qty || 1) + amount;
          return { ...item, qty: newQty > 0 ? newQty : 0 };
        }
        return item;
      });
      return result.filter((item) => item.qty > 0);
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + ((item.price || 0) * (item.qty || 1)), 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + (item.qty || 1), 0);
  };

  // Get cart summary for display
  const getCartSummary = () => {
    return {
      items: cartItems,
      itemCount: cartItems.length,
      totalQuantity: getCartCount(),
      totalPrice: getCartTotal(),
      isLoaded: isLoaded,
    };
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        getCartSummary,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
