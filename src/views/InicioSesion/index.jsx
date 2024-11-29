import React, { useState } from 'react';
import axios from 'axios';
import FormInput from '../../components/FormInput';
import config from '../../config';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import "./styles.css";
import { Link } from 'react-router-dom';

const InicioSesion = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const [errors, setErrors] = useState({
        username: '',
        password: ''
    });

    const [loginError, setLoginError] = useState(''); // Para manejar errores de login

    const navigate = useNavigate(); // Crea una instancia de useNavigate

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const validateForm = () => {
        let valid = true;
        let newErrors = { username: '', password: '' };
        if (formData.username.trim().length < 3) {
            newErrors.username = 'El nombre del usuario tiene que tener un minimo de 3 caracteres';
            valid = false;
        }
        if (formData.password.trim().length < 6) {
            newErrors.password = 'La contraseña tiene que tener un minimo de 6 caracteres';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const response = await axios.post(`${config.url}api/user/login`, formData);
                console.log('Respuesta del servidor:', response.data);
                if (response.data.success) {
                    console.log('Inicio de sesión exitoso');
                    localStorage.setItem("token", response.data.token);
                    const username = await axios.get(`${config.url}api/user/username`,{
                        headers: {
                            Authorization: `Bearer ${response.data.token}`,
                        },
                    })
                    console.log("useranme",username)
                    localStorage.setItem("username",username.data.username)
                    console.log('Token guardado en localStorage:', response.data.token);
                    navigate("/"); 
                    window.location.reload();
                } else {
                    setLoginError(response.data.message);
                }
            } catch (error) {
                console.error('Error en la solicitud:', error);
                setLoginError('Error al iniciar sesión. Intentelo de nuevo.');
            }
        }
    };

    return (
        <div className="login-container">
            <h2>Inicio de Sesión</h2>
            <form onSubmit={handleSubmit}>
                <FormInput
                    label="Nombre de Usuario"
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Ingresa tu nombre de usuario"
                />
                {errors.username && <p className="error-text">{errors.username}</p>}
                
                <FormInput
                    label="Contraseña"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Ingresa tu contraseña"
                />
                {errors.password && <p className="error-text">{errors.password}</p>}

                {loginError && <p className="error-text">{loginError}</p>}
                
                <button type="submit" className="btn btn-primary">Iniciar Sesión</button>
                <p>¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link></p>
            </form>
        </div> 
    );
}

export default InicioSesion;
