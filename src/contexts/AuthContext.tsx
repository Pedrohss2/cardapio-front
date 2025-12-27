"use client";
import { createContext, useContext, useState, useEffect } from "react";

interface AuthContextData {
    isAuthenticated: boolean;
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem("accessToken");
        if (storedToken) setToken(storedToken);
    }, []);

    const login = (accessToken: string) => {
        localStorage.setItem("accessToken", accessToken);
        // also set cookie so server-side middleware can read it
        if (typeof document !== 'undefined') {
            document.cookie = `accessToken=${accessToken}; path=/`;
        }
        setToken(accessToken);
    };

    const logout = () => {
        localStorage.removeItem("accessToken");
        if (typeof document !== 'undefined') {
            document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        }
        setToken(null);
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated: !!token,
                token,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
