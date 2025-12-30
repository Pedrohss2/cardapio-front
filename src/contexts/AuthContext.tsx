"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../functions/axios";

import { User, Company } from "../interfaces";

// Removed local User and Company interfaces

interface AuthContextData {
    isAuthenticated: boolean;
    token: string | null;
    user: User | null;
    company: Company | null;
    loading: boolean;
    login: (token: string, company?: Company) => void;
    logout: () => void;
    updateCompany: (company: Company) => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [company, setCompany] = useState<Company | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem("accessToken");
        const storedCompany = localStorage.getItem("company");

        if (storedToken) {
            setToken(storedToken);
            api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
            // Optionally fetch user profile here if needed
        }
        if (storedCompany) {
            setCompany(JSON.parse(storedCompany));
        }
        setLoading(false);
    }, []);

    const login = (accessToken: string, companyData?: Company) => {
        localStorage.setItem("accessToken", accessToken);
        setToken(accessToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

        if (typeof document !== 'undefined') {
            const maxAge = 60 * 60 * 24 * 30; // 30 days
            document.cookie = `accessToken=${accessToken}; path=/; max-age=${maxAge}; SameSite=Lax`;
        }

        if (companyData) {
            localStorage.setItem("company", JSON.stringify(companyData));
            setCompany(companyData);
        }
    };

    const updateCompany = (companyData: Company) => {
        localStorage.setItem("company", JSON.stringify(companyData));
        setCompany(companyData);
    };

    const logout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("company");
        setToken(null);
        setCompany(null);
        setUser(null);
        delete api.defaults.headers.common['Authorization'];

        if (typeof document !== 'undefined') {
            document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        }
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated: !!token,
                token,
                user,
                company,
                loading,
                login,
                logout,
                updateCompany
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
