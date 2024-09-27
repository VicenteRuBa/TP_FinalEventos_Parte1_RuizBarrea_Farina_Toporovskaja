import { Link } from "react-router-dom";
import logo from "../../vendor/logo.jpg";
import userPhoto from "../../vendor/userPhoto.png";
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
                const response = await axios.get(`${config.url}api/user/username`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUsername(response.data.username);
                setHasFetchedUsername(true);
            } catch (error) {
                console.error('Error fetching username:', error);
            }
        };

        if (isLoggedIn && !hasFetchedUsername) {
            fetchUsername();
        }
    }, [isLoggedIn, hasFetchedUsername]);

    const handleCloseSession = () => {
        localStorage.setItem('token', '');
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
                        <span>{username}</span>
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
