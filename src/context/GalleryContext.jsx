import { createContext, useCallback } from "react";
import { axiosInstance } from "../utils/axios";

export const GalleryContext = createContext();

export const GalleryProvider = ({ children }) => {

    // Fetch all public gallery items
    const fetchGallery = useCallback(async () => {
        try {
            const res = await axiosInstance.get("/gallery");
            return res.data || [];
        } catch (error) {
            console.error("Failed to fetch gallery:", error);
            throw error;
        }
    }, []);

    // Fetch single gallery item
    const getGalleryById = useCallback(async (galleryId) => {
        try {
            const res = await axiosInstance.get(`/gallery/${galleryId}`);
            return res.data;
        } catch (error) {
            console.error("Failed to fetch gallery item:", error);
            throw error;
        }
    }, []);

    // Filter gallery by category
    const filterGallery = useCallback(async (category) => {
        try {
            const res = await axiosInstance.get("/gallery", { params: { category } });
            return res.data || [];
        } catch (error) {
            console.error("Failed to filter gallery:", error);
            throw error;
        }
    }, []);

    return (
        <GalleryContext.Provider value={{
            fetchGallery,
            getGalleryById,
            filterGallery,
        }}>
            {children}
        </GalleryContext.Provider>
    );
}
