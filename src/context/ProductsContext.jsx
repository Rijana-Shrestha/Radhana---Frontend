import { createContext, useCallback } from "react";
import { axiosInstance } from "../utils/axios";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {

    // Fetch all products
    const fetchProducts = useCallback(async () => {
        try {
            const res = await axiosInstance.get("/products");
            return res.data || [];
        } catch (error) {
            console.error("Failed to fetch products:", error);
            throw error;
        }
    }, []);

    // Fetch single product
    const getProductById = useCallback(async (productId) => {
        try {
            const res = await axiosInstance.get(`/products/${productId}`);
            return res.data;
        } catch (error) {
            console.error("Failed to fetch product:", error);
            throw error;
        }
    }, []);

    // Filter products
    const filterProducts = useCallback(async (filters) => {
        try {
            const res = await axiosInstance.get("/products/", { params: filters });
            return res.data || [];
        } catch (error) {
            console.error("Failed to filter products:", error);
            throw error;
        }
    }, []);

    // Search products
    const searchProducts = useCallback(async (searchTerm) => {
        try {
            const res = await axiosInstance.get("/products/", { params: { search: searchTerm } });
            return res.data || [];
        } catch (error) {
            console.error("Failed to search products:", error);
            throw error;
        }
    }, []);

    return (
        <ProductContext.Provider value={{
            fetchProducts,
            getProductById,
            filterProducts,
            searchProducts,
        }}>
            {children}
        </ProductContext.Provider>
    );
}   