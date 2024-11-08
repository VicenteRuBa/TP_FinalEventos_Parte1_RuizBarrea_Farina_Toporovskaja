import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from './components/Modal';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
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
            setIsModalOpen(true); // Abre el modal
            return false;
        }
        else{
            return true;
        }
    }

    const handleConfirm = () => {
        navigate("/login");
        setIsModalOpen(false); // Cierra el modal
    };

    const handleClose = () => {
        setIsModalOpen(false); // Cierra el modal sin hacer nada
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, ifIsLoggedIn }}>
            {children}
            <Modal isOpen={isModalOpen} onClose={handleClose} onConfirm={handleConfirm} />
        </AuthContext.Provider>
    );
};