import { createContext, useState, useEffect } from "react";
import { axiosInstance } from "../utils/axios";

export const AuthContext = createContext();

// Helper function to extract token from cookies
const getTokenFromCookie = () => {
    const name = "authToken=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
    
    for (let cookie of cookieArray) {
        cookie = cookie.trim();
        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length);
        }
    }
    return null;
};

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        const stored = localStorage.getItem('isLoggedIn');
        return stored ? JSON.parse(stored) : false;
    });
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem('user');
        return stored ? JSON.parse(stored) : null;
    });
    const [loading, setLoading] = useState(true);
    
    // Fetch user profile from backend
    const fetchUserProfile = async () => {
        try {
            const res = await axiosInstance.get("/users/profile");
            setUser(res.data);
            setIsLoggedIn(true);
            localStorage.setItem('user', JSON.stringify(res.data));
            localStorage.setItem('isLoggedIn', JSON.stringify(true));
        } catch (error) {
            console.error("Failed to fetch user profile:", error);
            setUser(null);
            setIsLoggedIn(false);
            localStorage.removeItem('user');
            localStorage.removeItem('isLoggedIn');
        } finally {
            setLoading(false);
        }
    };
    
    // Check if user is already logged in on mount
    useEffect(() => {
        const token = getTokenFromCookie();
        const storedUser = localStorage.getItem('user');
        
        // If there's a stored user, set it immediately for better UX
        if (storedUser) {
            setUser(JSON.parse(storedUser));
            setIsLoggedIn(true);
            
            // Then verify with backend
            if (token) {
                fetchUserProfile();
            } else {
                // Token missing but user is stored - just stop loading
                // Don't logout immediately, token might be there
                setLoading(false);
            }
        } else {
            // No stored user - only verify if there's a token
            if (token) {
                fetchUserProfile();
            } else {
                // No stored user AND no token - definitely logged out
                setUser(null);
                setIsLoggedIn(false);
                localStorage.removeItem('user');
                localStorage.removeItem('isLoggedIn');
                setLoading(false);
            }
        }
    }, []);
    
    const loginUser = async (email, password) => {
        const res = await axiosInstance.post("/auth/login", { email, password });
        setIsLoggedIn(true);
        localStorage.setItem('isLoggedIn', JSON.stringify(true));
        // Fetch user profile after login
        await fetchUserProfile();
        return res.data;
    };

    const registerUser = async (name, email, phone, password, confirmPassword) => {
        const res = await axiosInstance.post("/auth/register", { name, email, phone, password, confirmPassword });
        setIsLoggedIn(true);
        localStorage.setItem('isLoggedIn', JSON.stringify(true));
        // Fetch user profile after register
        await fetchUserProfile();
        return res.data;
    };

    const logout = () => {
        setUser(null);
        setIsLoggedIn(false);
        localStorage.removeItem('user');
        localStorage.removeItem('isLoggedIn');
    };

    return (
        <AuthContext.Provider value={{ loginUser, registerUser, isLoggedIn, getTokenFromCookie, user, loading, logout, fetchUserProfile }}>
            {children}
        </AuthContext.Provider>
    );
};