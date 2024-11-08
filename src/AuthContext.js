import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        console.log(token);
        if (!token) {
            localStorage.setItem("token", "");
        } else if (token !== "") {
            setIsLoggedIn(true);
        }
    }, []);

    const ifIsLoggedIn = () => {
        if (!isLoggedIn) {
            // Si el usuario no está logueado, redirigir al login
            navigate("/login");
            return false;
        }
        return true;
    }

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, ifIsLoggedIn }}>
            {children}
        </AuthContext.Provider>
    );
};
