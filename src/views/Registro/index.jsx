import React, { useState } from 'react';
import axios from 'axios';
import FormInput from '../../components/FormInput'; 
import { useNavigate } from 'react-router-dom';
import './styles.css'; 
import { Link } from 'react-router-dom';
import config from '../../config';

const Registro = () => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        username: '',
        password: '',
    });
    const [errors, setErrors] = useState({
        first_name: '',
        last_name: '',
        username: '',
        password: '',
    });
    const [registerError, setRegisterError] = useState(''); 
    const navigate = useNavigate(); 
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };
    const validateForm = () => {
        let valid = true;
        let newErrors = { first_name: '', last_name: '', username: '', password: '' };
        if (formData.first_name.trim().length < 3) {
            newErrors.first_name = 'El nombre tiene que tener un minimo de 3 caracteres';
            valid = false;
        }
        if (formData.last_name.trim().length < 3) {
            newErrors.last_name = 'El apellido tiene que tener un minimo de 3 caracteres';
            valid = false;
        }
        if (!validarFormatoEmail(formData.username)) {
            newErrors.username = 'El email no es valido';
            valid = false;
        }
        if (formData.password.trim().length < 6) {
            newErrors.password = 'La contraseña tiene que tener un minimo de 6 caracteres';
            valid = false;
        }
        setErrors(newErrors);
        return valid;
    };
    const validarFormatoEmail = (email) => {
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regexEmail.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const response = await axios.post(`${config.url}api/user/register`, formData);
                if (response.status === 201) {
                    navigate('/login'); 
                }
            } catch (error) {
                if (error.response) {
                    setRegisterError(error.response.data);
                } else {
                    setRegisterError('Error al registrarse. Intenta nuevamente.');
                }
            }
        }
    };
    return (
        <div className="login-container">
            <h2>Registro</h2>
            <form onSubmit={handleSubmit}>
                <FormInput
                    label="Nombre"
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="Ingresa tu nombre"
                />
                {errors.first_name && <p className="error-text">{errors.first_name}</p>}

                <FormInput
                    label="Apellido"
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="Ingresa tu apellido"
                />
                {errors.last_name && <p className="error-text">{errors.last_name}</p>}

                <FormInput
                    label="Email"
                    type="email"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Ingresa tu email"
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

                {registerError && <p className="error-text">{registerError}</p>}
                
                <button type="submit" className="btn btn-primary">Registrarse</button>
                <p>¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link></p>
            </form>
        </div>
    );
}

export default Registro;
