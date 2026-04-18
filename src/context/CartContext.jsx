import React, { createContext, useState, useContext, useEffect } from 'react';
import { axiosInstance } from '../utils/axios';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

const CART_STORAGE_KEY = 'radhana_art_cart';

export const CartProvider = ({ children }) => {
  const { isLoggedIn, loading: authLoading } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Load cart from localStorage or API on mount
  useEffect(() => {
    const loadCart = async () => {
      try {
        if (authLoading) return; // Wait for auth to load
        
        if (isLoggedIn) {
          // Check if there are items in localStorage (from before login)
          let localCart = [];
          try {
            const savedCart = localStorage.getItem(CART_STORAGE_KEY);
            if (savedCart) {
              localCart = JSON.parse(savedCart);
            }
          } catch (e) {
            console.error('Failed to parse localStorage cart:', e);
          }

          // Fetch cart from API
          try {
            const response = await axiosInstance.get("/cart");
            const apiCart = response.data?.items || [];
            
            // If user has items in localStorage but not in API, sync them
            if (localCart.length > 0 && apiCart.length === 0) {
              for (const item of localCart) {
                try {
                  await axiosInstance.post("/cart/add", {
                    product: item._id || item.id,
                    price: item.price || 0,
                    name: item.name || 'Unknown Product',
                    quantity: item.qty || 1,
                  });
                } catch (e) {
                  console.error(`Failed to sync item ${item.name} to cart:`, e.message);
                }
              }
              // Fetch the updated cart after syncing
              const updatedResponse = await axiosInstance.get("/cart");
              setCartItems(updatedResponse.data?.items || []);
            } else {
              setCartItems(apiCart);
            }
            
            // Clear localStorage after successful login
            localStorage.removeItem(CART_STORAGE_KEY);
          } catch (error) {
            console.error('Failed to load cart from API:', error.message);
            // Fallback to localStorage if API fails
            setCartItems(Array.isArray(localCart) ? localCart : []);
          }
        } else {
          // Load from localStorage for non-logged-in users
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
        }
      } finally {
        setIsLoaded(true);
      }
    };

    loadCart();
  }, [isLoggedIn, authLoading]);

  // Save cart to localStorage (for non-logged-in users)
  useEffect(() => {
    if (isLoaded && !isLoggedIn) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
      } catch (error) {
        console.error('Failed to save cart to localStorage:', error);
      }
    }
  }, [cartItems, isLoaded, isLoggedIn]);

  // Add to cart
  const addToCart = async (product) => {
    if (!product) {
      console.error('Product is required to add to cart');
      return;
    }

    const productId = product._id || product.id;
    if (!productId) {
      console.error('Product must have an _id or id field');
      return;
    }

    try {
      setIsSyncing(true);
      
      if (isLoggedIn) {
        // Use API for logged-in users
        const response = await axiosInstance.post("/cart/add", {
          product: productId,
          price: product.price || 0,
          name: product.name || 'Unknown Product',
          quantity: 1,
        });
        setCartItems(response.data?.items || []);
      } else {
        // Local storage for non-logged-in users
        setCartItems((prevItems) => {
          const existingItem = prevItems.find((item) => (item._id || item.id) === productId);
          
          if (existingItem) {
            return prevItems.map((item) =>
              (item._id || item.id) === productId ? { ...item, qty: (item.qty || 1) + 1 } : item
            );
          }
          
          return [...prevItems, { 
            ...product, 
            _id: product._id || product.id, 
            qty: 1,
            price: product.price || 0,
            name: product.name || 'Unknown Product'
          }];
        });
      }
    } catch (error) {
      console.error('Failed to add to cart:', error.message);
      // Fallback: add to local state if API fails
      setCartItems((prevItems) => {
        const existingItem = prevItems.find((item) => (item._id || item.id) === productId);
        if (existingItem) {
          return prevItems.map((item) =>
            (item._id || item.id) === productId ? { ...item, qty: (item.qty || 1) + 1 } : item
          );
        }
        return [...prevItems, { ...product, _id: productId, qty: 1 }];
      });
    } finally {
      setIsSyncing(false);
    }
  };

  // Remove from cart
  const removeFromCart = async (productId) => {
    try {
      setIsSyncing(true);
      
      if (isLoggedIn) {
        // Use API for logged-in users
        const response = await axiosInstance.delete("/cart/remove", {
          data: { productId },
        });
        setCartItems(response.data?.items || []);
      } else {
        // Local storage for non-logged-in users
        setCartItems((prevItems) => 
          prevItems.filter((item) => (item._id || item.id) !== productId)
        );
      }
    } catch (error) {
      console.error('Failed to remove from cart:', error.message);
      // Fallback: remove from local state if API fails
      setCartItems((prevItems) => 
        prevItems.filter((item) => (item._id || item.id) !== productId)
      );
    } finally {
      setIsSyncing(false);
    }
  };

  // Update quantity
  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) {
      await removeFromCart(productId);
      return;
    }

    try {
      setIsSyncing(true);
      
      if (isLoggedIn) {
        // Use API for logged-in users
        const response = await axiosInstance.put("/cart/update", {
          productId,
          quantity: newQuantity,
        });
        setCartItems(response.data?.items || []);
      } else {
        // Local storage for non-logged-in users
        setCartItems((prevItems) => {
          const result = prevItems.map((item) => {
            if ((item._id || item.id) === productId) {
              return { ...item, qty: newQuantity };
            }
            return item;
          });
          return result.filter((item) => item.qty > 0);
        });
      }
    } catch (error) {
      console.error('Failed to update cart quantity:', error.message);
      // Fallback: update local state if API fails
      setCartItems((prevItems) => {
        const result = prevItems.map((item) => {
          if ((item._id || item.id) === productId) {
            return { ...item, qty: newQuantity };
          }
          return item;
        });
        return result.filter((item) => item.qty > 0);
      });
    } finally {
      setIsSyncing(false);
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      setIsSyncing(true);
      
      if (isLoggedIn) {
        // Use API for logged-in users
        await axiosInstance.delete("/cart/clear");
      }
      setCartItems([]);
    } catch (error) {
      console.error('Failed to clear cart:', error.message);
      // Fallback: clear local state if API fails
      setCartItems([]);
    } finally {
      setIsSyncing(false);
    }
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
        isSyncing,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
