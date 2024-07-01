// src/AuthContext.js

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { jwtDecode } from "jwt-decode";
import api from './api';
import { ACCESS_TOKEN, REFRESH_TOKEN, USERNAME } from './constants';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const refreshToken = useCallback(async () => {
        const refresh_token = localStorage.getItem(REFRESH_TOKEN);
        if (!refresh_token) {
            setUser(null);
            setLoading(false);
            return;
        }

        try {
            const response = await api.post("/catalog/token/refresh/", {
                refresh: refresh_token
            });

            if (response.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, response.data.access);
                setUser(response.data); // Assuming the response includes user data
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error("Error refreshing token:", error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    const checkAuthStatus = useCallback(async () => {
        const auth_token = localStorage.getItem(ACCESS_TOKEN);
        if (!auth_token) {
            setUser(null);
            setLoading(false);
            return;
        }

        try {
            const decodedToken = jwtDecode(auth_token);
            const token_expiration = decodedToken.exp;
            const now = Date.now() / 1000;

            if (token_expiration < now) {
                await refreshToken();
            } else {
                // Token is valid, fetch user data
                const response = await api.get('catalog/user-info/'); // Adjust this endpoint as needed
                setUser(response.data);
            }
        } catch (error) {
            console.error("Error checking auth status:", error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, [refreshToken]);

    useEffect(() => {
        checkAuthStatus();
    }, [checkAuthStatus]);

    const login = useCallback(async (userData) => {
        localStorage.setItem(ACCESS_TOKEN, userData.access);
        localStorage.setItem(REFRESH_TOKEN, userData.refresh);
        
        // Fetch user data after successful login
        try {
            const response = await api.get('/catalog/user-info/');
            localStorage.setItem(USERNAME, response.data.username)
            setUser(response.data);
        } catch (error) {
            console.error("Error fetching user data after login:", error);
            setUser(null);
        }
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem(REFRESH_TOKEN);
        localStorage.removeItem(USERNAME)
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout, refreshToken, checkAuthStatus, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);