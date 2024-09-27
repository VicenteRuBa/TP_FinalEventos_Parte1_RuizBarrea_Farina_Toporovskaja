import React from 'react';
import './styles.css'; 
const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <p>&copy; 2024 TuNombre. Todos los derechos reservados.</p>
                <div className="footer-links">
                    <a href="#">Sobre nosotros</a>
                    <a href="#">Contacto</a>
                    <a href="#">Política de privacidad</a>
                </div>
                <div className="social-media">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
                </div>
            </div>
        </footer>
    );
};
export default Footer;
