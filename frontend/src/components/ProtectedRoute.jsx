import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

function ProtectedRoute({ children }) {
    const { user, refreshToken, checkAuthStatus } = useAuth();

    useEffect(() => {
        if (!user) {
            checkAuthStatus();
        }
    }, [user, checkAuthStatus]);

    if (user === null) {
        return <div>Loading...</div>;
    }

    return user ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;