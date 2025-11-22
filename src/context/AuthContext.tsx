import { createContext, useState, useContext, useEffect, type ReactNode } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

interface User {
    id: number;
    username: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    login: (username: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    const login = async (username: string, password: string) => {
        try {
            // 1. Perform Login
            await api.post('/api/auth/login', { username, password });

            // 2. Fetch User Details to get ID
            const userResponse = await api.get(`/api/users/username/${username}`);
            const userData = userResponse.data;

            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            toast.success(`Welcome back, ${username}!`);
        } catch (error: any) {
            console.error('Login failed', error);
            toast.error(error.response?.data?.message || error.response?.data?.error || 'Login failed');
            throw error;
        }
    };

    const register = async (username: string, email: string, password: string) => {
        try {
            await api.post('/api/auth/register', { username, email, password });
            toast.success('Registration successful! Please login.');
        } catch (error: any) {
            console.error('Registration failed', error);
            toast.error(error.response?.data?.message || error.response?.data?.error || 'Registration failed');
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token'); // Just in case
        toast.success('Logged out successfully');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
