import { createContext, useContext, useState, type ReactNode } from "react";
import type { User, LoginResponse } from "../api/auth";

interface AuthContextType {
    user: User | null;
    login: (data: LoginResponse) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : null;
    });

    // Check token existence separately if needed, but relying on user object for now is fine
    // assuming token is treated in tandem.
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
        return !!localStorage.getItem("token");
    });

    const login = (data: LoginResponse) => {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setIsAuthenticated(false);
        // Ideally, we might want to redirect here, but better to let the components handle it or use a protected route that listens to auth state
        window.location.href = "/login";
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
