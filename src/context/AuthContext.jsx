import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            if (token) {
                try {
                    const response = await api.get('/auth/profile');
                    setUser(response.data);
                } catch (error) {
                    // Token is invalid
                    localStorage.removeItem('token');
                    setToken(null);
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, [token]);

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            setUser(response.data.user);
            setToken(response.data.access_token);
            localStorage.setItem('token', response.data.access_token);
            return { success: true };
        } catch (error) {
            const errorMsg = error.response?.data?.error;
            const finalError = typeof errorMsg === 'string' ? errorMsg : 'Login failed';
            return { success: false, error: finalError };
        }
    };

    const register = async (username, email, password) => {
        try {
            const response = await api.post('/auth/register', { username, email, password });
            setUser(response.data.user);
            setToken(response.data.access_token);
            localStorage.setItem('token', response.data.access_token);
            return { success: true };
        } catch (error) {
            const errorMsg = error.response?.data?.error;
            const finalError = typeof errorMsg === 'string' ? errorMsg : 'Registration failed';
            return { success: false, error: finalError };
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
    };

    const value = {
        user,
        token,
        loading,
        login,
        register,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 