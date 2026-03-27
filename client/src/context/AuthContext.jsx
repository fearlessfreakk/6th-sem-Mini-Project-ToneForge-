import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                // Check if token is expired
                if (decoded.exp * 1000 < Date.now()) {
                    localStorage.removeItem('token');
                    setUser(null);
                } else {
                    setUser({ token, ...decoded });
                }
            } catch (error) {
                console.error("Invalid token:", error);
                localStorage.removeItem('token');
                setUser(null);
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/login`, { email, password });
            const { token, email: userEmail, _id } = response.data;
            localStorage.setItem('token', token);
            const decoded = jwtDecode(token);
            setUser({ token, email: userEmail, id: _id, ...decoded });
            return response.data;
        } catch (error) {
            throw error.response?.data?.error || 'Login failed';
        }
    };

    const signup = async (email, password) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/signup`, { email, password });
            const { token, email: userEmail, _id } = response.data;
            if (token) {
                localStorage.setItem('token', token);
                const decoded = jwtDecode(token);
                setUser({ token, email: userEmail, id: _id, ...decoded });
            }
            return response.data;
        } catch (error) {
            throw error.response?.data?.error || 'Signup failed';
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const value = {
        user,
        login,
        signup,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
