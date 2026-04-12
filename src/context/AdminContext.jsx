import { createContext, useState, useCallback } from "react";
import { axiosInstance } from "../utils/axios";

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  // =============== ORDERS ===============
  const getAllOrders = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/orders/");
      return res.data || [];
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      throw error;
    }
  }, []);

  const getOrderById = useCallback(async (orderId) => {
    try {
      const res = await axiosInstance.get(`/orders/${orderId}`);
      return res.data;
    } catch (error) {
      console.error("Failed to fetch order:", error);
      throw error;
    }
  }, []);

  const updateOrderStatus = useCallback(async (orderId, status) => {
    try {
      const res = await axiosInstance.put(`/orders/${orderId}`, { status });
      return res.data;
    } catch (error) {
      console.error("Failed to update order status:", error);
      throw error;
    }
  }, []);

  // =============== PRODUCTS ===============
  const getAllProducts = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/products/");
      return res.data || [];
    } catch (error) {
      console.error("Failed to fetch products:", error);
      throw error;
    }
  }, []);

  const createProduct = useCallback(async (productData) => {
    try {
      const res = await axiosInstance.post("/products/", productData);
      return res.data;
    } catch (error) {
      console.error("Failed to create product:", error);
      throw error;
    }
  }, []);

  const updateProduct = useCallback(async (productId, productData) => {
    try {
      const res = await axiosInstance.patch(
        `/products/${productId}`,
        productData,
      );
      return res.data;
    } catch (error) {
      console.error("Failed to update product:", error);
      throw error;
    }
  }, []);

  const deleteProduct = useCallback(async (productId) => {
    try {
      const res = await axiosInstance.delete(`/products/${productId}`);
      return res.data;
    } catch (error) {
      console.error("Failed to delete product:", error);
      throw error;
    }
  }, []);

  // =============== USERS ===============
  const getAllUsers = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/users/");
      return res.data || [];
    } catch (error) {
      console.error("Failed to fetch users:", error);
      throw error;
    }
  }, []);

  const getUserById = useCallback(async (userId) => {
    try {
      const res = await axiosInstance.get(`/users/${userId}`);
      return res.data;
    } catch (error) {
      console.error("Failed to fetch user:", error);
      throw error;
    }
  }, []);

  const updateUser = useCallback(async (userId, userData) => {
    try {
      const res = await axiosInstance.patch(`/users/${userId}`, userData);
      return res.data;
    } catch (error) {
      console.error("Failed to update user:", error);
      throw error;
    }
  }, []);

  const deleteUser = useCallback(async (userId) => {
    try {
      const res = await axiosInstance.delete(`/users/${userId}`);
      return res.data;
    } catch (error) {
      console.error("Failed to delete user:", error);
      throw error;
    }
  }, []);

  // =============== GALLERY ===============
  const getAllGallery = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/gallery/");
      return res.data || [];
    } catch (error) {
      console.error("Failed to fetch gallery:", error);
      throw error;
    }
  }, []);

  const createGalleryItem = useCallback(async (galleryData) => {
    try {
      const res = await axiosInstance.post("/gallery/", galleryData);
      return res.data;
    } catch (error) {
      console.error("Failed to create gallery item:", error);
      throw error;
    }
  }, []);

  const updateGalleryItem = useCallback(async (galleryId, galleryData) => {
    try {
      const res = await axiosInstance.patch(
        `/gallery/${galleryId}`,
        galleryData,
      );
      return res.data;
    } catch (error) {
      console.error("Failed to update gallery item:", error);
      throw error;
    }
  }, []);

  const deleteGalleryItem = useCallback(async (galleryId) => {
    try {
      const res = await axiosInstance.delete(`/gallery/${galleryId}`);
      return res.data;
    } catch (error) {
      console.error("Failed to delete gallery item:", error);
      throw error;
    }
  }, []);

  // =============== CONTACTS ===============
  const getAllContacts = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/contact/");
      return res.data || [];
    } catch (error) {
      console.error("Failed to fetch contacts:", error);
      throw error;
    }
  }, []);

  const updateContactStatus = useCallback(async (contactId, status) => {
    try {
      const res = await axiosInstance.patch(`/contact/${contactId}`, {
        status,
      });
      return res.data;
    } catch (error) {
      console.error("Failed to update contact status:", error);
      throw error;
    }
  }, []);

  const deleteContact = useCallback(async (contactId) => {
    try {
      const res = await axiosInstance.delete(`/contact/${contactId}`);
      return res.data;
    } catch (error) {
      console.error("Failed to delete contact:", error);
      throw error;
    }
  }, []);

  // =============== INVOICES ===============
  const getInvoices = useCallback(async (type) => {
    try {
      const params = type ? { type } : {};
      const res = await axiosInstance.get("/invoices/", { params });
      return res.data || [];
    } catch (error) {
      console.error("Failed to fetch invoices:", error);
      throw error;
    }
  }, []);

  const getInvoiceById = useCallback(async (invoiceId) => {
    try {
      const res = await axiosInstance.get(`/invoices/${invoiceId}`);
      return res.data;
    } catch (error) {
      console.error("Failed to fetch invoice:", error);
      throw error;
    }
  }, []);

  const getInvoiceDraftFromOrder = useCallback(async (orderId) => {
    try {
      const res = await axiosInstance.get(`/invoices/draft/${orderId}`);
      return res.data;
    } catch (error) {
      console.error("Failed to fetch invoice draft from order:", error);
      throw error;
    }
  }, []);

  const createInvoice = useCallback(async (invoiceData) => {
    try {
      const res = await axiosInstance.post("/invoices/", invoiceData);
      return res.data;
    } catch (error) {
      console.error("Failed to create invoice:", error);
      throw error;
    }
  }, []);

  const updateInvoice = useCallback(async (invoiceId, invoiceData) => {
    try {
      const res = await axiosInstance.patch(
        `/invoices/${invoiceId}`,
        invoiceData,
      );
      return res.data;
    } catch (error) {
      console.error("Failed to update invoice:", error);
      throw error;
    }
  }, []);

  const deleteInvoice = useCallback(async (invoiceId) => {
    try {
      const res = await axiosInstance.delete(`/invoices/${invoiceId}`);
      return res.data;
    } catch (error) {
      console.error("Failed to delete invoice:", error);
      throw error;
    }
  }, []);

  return (
    <AdminContext.Provider
      value={{
        // Orders
        getAllOrders,
        getOrderById,
        updateOrderStatus,
        // Products
        getAllProducts,
        createProduct,
        updateProduct,
        deleteProduct,
        // Users
        getAllUsers,
        getUserById,
        updateUser,
        deleteUser,
        // Gallery
        getAllGallery,
        createGalleryItem,
        updateGalleryItem,
        deleteGalleryItem,
        // Contacts
        getAllContacts,
        updateContactStatus,
        deleteContact,
        // Invoices
        getInvoices,
        getInvoiceById,
        getInvoiceDraftFromOrder,
        createInvoice,
        updateInvoice,
        deleteInvoice,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};
