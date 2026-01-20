import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);

    // ✅ REGISTER
    const register = async (userData) => {
        try {
            const response = await fetch('http://localhost:8000/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: userData.name,
                    email: userData.email,
                    password: userData.password,
                    password_confirmation: userData.confirmPassword,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                return { success: false, error: data.message || 'Registration failed' };
            }

            return { success: true };
        } catch (err) {
            console.error('Register error:', err);
            return { success: false, error: 'Registration failed' };
        }
    };

    // ✅ LOGIN
    const login = async (userData) => {
    try {
        const response = await fetch('http://localhost:8000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });

        const data = await response.json();

        // ✅ FIX: use data.error (not data.message)
        if (!data.success) {
            return { success: false, error: data.error || 'Login failed' };
        }

        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.user);

        return { success: true, user: data.user };
    } catch (err) {
        console.error('Login error:', err);
        return { success: false, error: 'Login failed' };
    }
};


    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
