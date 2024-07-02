// src/AuthContext.js

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { jwtDecode } from "jwt-decode";
import api from './api';
import { ACCESS_TOKEN, REFRESH_TOKEN, USERNAME } from './constants';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); //the user's data
    const [loading, setLoading] = useState(true); //loading state

    //when you need to refresh token (when access token expires)
    const refreshToken = useCallback(async () => {
        const refresh_token = localStorage.getItem(REFRESH_TOKEN); //get refresh token from constants.js
        if (!refresh_token) { //if no refresh token, something is wrong, just exit throw error
            setUser(null);
            setLoading(false);
            return;
        }

        //try to get a new access token, access api to get the new access token by giving refresh token
        try {
            const response = await api.post("/catalog/token/refresh/", {
                refresh: refresh_token
            });

            //if successful, set the new access token to the response data's access token
            if (response.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, response.data.access);
                // After successfully refreshing the token, fetch user info
                try {
                    const userInfoResponse = await api.get('catalog/user-info/');
                    setUser(userInfoResponse.data);
                    localStorage.setItem(USERNAME, userInfoResponse.data.username);
                } catch (userInfoError) {
                    console.error("Error fetching user info after token refresh:", userInfoError);
                    setUser(null);
                }
            } else {
                alert("Unable to get new access token from /catalog/token/refresh/")
            }
        } catch (error) {
            console.error("Error refreshing token:", error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    //When app loads, checks for existing tokens and tries to authenticate the user
    const checkAuthStatus = useCallback(async () => {
        //if no access token exists, no user logged in
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
            //if tokens exist but are expired, get new access token
            if (token_expiration < now) {
                await refreshToken();
            } else {
                // Token is valid, fetch user data
                const response = await api.get('catalog/user-info/'); // Adjust this endpoint as needed
                setUser(response.data);

                //-------------------------------------
                console.log(response.data); //TEST DEBUGGING
                //-------------------------------------
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