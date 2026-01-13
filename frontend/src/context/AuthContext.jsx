import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load user from localStorage on initial render
    useEffect(() => {

        const savedUser = localStorage.getItem("user")

        if (savedUser) {
            setUser(JSON.parse(savedUser))
        }
        setIsLoading(false);


    }, []);

    const register = async (userData) => {
        try {
            const res = await fetch("http://127.0.0.1:8000/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(
                    userData
                )
            });

            const data = await res.json();
            console.log("request send successfully")

            // fetch DOES NOT throw on 4xx / 5xx
            if (!res.ok) {
                throw new Error(data.message || "Login failed");
            }

            // Save user
            setUser(data);
            localStorage.setItem("user", JSON.stringify(data));

            return data;   // same as axios res.data
        } catch (err) {
            console.error("Login failed:", err.message);
            return null;
        }
    };

    const login = async (email, password) => {
        try {
            const res = await fetch("http://127.0.0.1:8000/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            const data = await res.json();

            // fetch DOES NOT throw on 4xx / 5xx
            if (!res.ok) {
                throw new Error(data.message || "Login failed");
            }

            // Save user
            setUser(data);
            localStorage.setItem("user", JSON.stringify(data));

            return data;   // same as axios res.data
        } catch (err) {
            console.error("Login failed:", err.message);
            return null;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                register,
                login,
                logout,
            }}
        >

            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);