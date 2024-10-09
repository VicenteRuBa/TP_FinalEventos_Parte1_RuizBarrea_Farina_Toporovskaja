import { Link } from "react-router-dom";
import logo from "../../fotos/logo.jpg";
import userPhoto from "../../fotos/userPhoto.png";
import { AuthContext } from "../../AuthContext";
import React, { useContext, useState, useEffect } from 'react';
import axios from "axios";
import config from "../../config";
import './styles.css'; 

const NavBar = () => {
    const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
    const [username, setUsername] = useState(null);
    const [hasFetchedUsername, setHasFetchedUsername] = useState(false);

    useEffect(() => {
        const fetchUsername = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token || token === '') {
                    return;
                }

                const response = await axios.get(`${config.url}api/user/username`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUsername(response.data.username);
                setHasFetchedUsername(true);
            } catch (error) {
                console.error('Error fetching username:', error);
                setIsLoggedIn(false);  // Deslogea si no puede obtener el username
                localStorage.removeItem('token');  // Elimina el token inválido
            }
        };

        if (isLoggedIn && !hasFetchedUsername) {
            fetchUsername();
        }
    }, [isLoggedIn, hasFetchedUsername, setIsLoggedIn]);

    const handleCloseSession = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setHasFetchedUsername(false);
        window.location.reload();
    };

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-logo">
                <img src={logo} alt="Logo" />
            </Link>
            <div className="navbar-links">
                <Link to="/">Home</Link>
                {isLoggedIn ? (
                    <div className="user-info">
                        <img src={userPhoto} alt="User" className="user-photo" />
                        <span>{username || 'Usuario'}</span>
                        <button onClick={handleCloseSession} className="logout-button">Cerrar sesión</button>
                    </div>
                ) : (
                    <Link to="/login" className="login-button">Ingresar</Link>
                )}
            </div>
        </nav>
    );
};

export default NavBar;
