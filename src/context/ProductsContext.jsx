import { createContext, useCallback, useState } from "react";
import { axiosInstance } from "../utils/axios";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    // Fetch all products
    const fetchProducts = useCallback(async () => {
        try {
            const res = await axiosInstance.get("/products");
            setProducts(res.data || []);
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

    // Search products locally from stored products
    const searchProducts = useCallback((searchTerm) => {
        if (!searchTerm || !searchTerm.trim()) {
            return products;
        }

        const term = searchTerm.toLowerCase().trim();
        return products.filter((product) => {
            const searchableText = (
                (product.name || '') + ' ' +
                (product.description || '') + ' ' +
                (product.category || '')
            ).toLowerCase();
            
            return term.split(' ').some((word) => searchableText.includes(word));
        });
    }, [products]);

    return (
        <ProductContext.Provider value={{
            fetchProducts,
            getProductById,
            filterProducts,
            searchProducts,
            products,
        }}>
            {children}
        </ProductContext.Provider>
    );
}   