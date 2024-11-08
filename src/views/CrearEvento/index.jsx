import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import FormInput from "../../components/FormInput"; 
import config from '../../config';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../../AuthContext";

const FormularioEvento = () => {
    const [eventData, setEventData] = useState({
        name: '',
        description: '',
        id_event_category: '',
        id_event_location: '',
        start_date: '',
        duration_in_minutes: '',
        price: '',
        enabled_for_enrollment: false,
        max_assistance: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { isLoggedIn } = useContext(AuthContext);
    const navigate = useNavigate();

    // Maneja cambios en el formulario
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEventData({
            ...eventData,
            [name]: type === 'checkbox' ? checked : value,
        });
        setError('');
    };
    
    useEffect(() => {
        if (!isLoggedIn) {
            navigate(-1);
        }
    }, [isLoggedIn, navigate]);

    // Maneja la solicitud para crear el evento
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const token = localStorage.getItem('token');
        console.log(localStorage.getItem('token'));
        if (!token) {
            setError('No se encontró el token de autenticación. Inicia sesión nuevamente.');
            return;
        }

        // Formato de la fecha para envío
        const formattedStartDate = new Date(eventData.start_date).toISOString();
        
        const formattedEventData = {
            name: eventData.name,
            description: eventData.description,
        id_event_category: parseInt(eventData.id_event_category) || 1, // usa 1 o el ID correcto si es numérico
        id_event_location: parseInt(eventData.id_event_location) || 2, // usa 2 o el ID correcto si es numérico
        start_date: formattedStartDate,
        duration_in_minutes: parseInt(eventData.duration_in_minutes),
        price: parseFloat(eventData.price),
        enabled_for_enrollment: eventData.enabled_for_enrollment,
        max_assistance: parseInt(eventData.max_assistance)
        };

        try {
            const response = await axios.post(`${config.url}api/event`, formattedEventData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setSuccess('¡Evento creado con éxito!');
            console.log('Respuesta del servidor:', response.data);
        
            // Resetea el formulario
            setEventData({
                name: '',
                description: '',
                id_event_category: '',
                id_event_location: '',
                start_date: '',
                duration_in_minutes: '',
                price: '',
                enabled_for_enrollment: false,
                max_assistance: '',
            });
        } catch (error) {
            console.log('Error status:', error.response.status);
            console.error('Error al crear el evento:', error);

            // Desglose detallado de errores
            if (error.response) {
                if (error.response.status === 401) {
                    setError('No tienes autorización para crear el evento. Revisa tus credenciales.');
                } else if (error.response.status === 400) {
                    setError('Datos inválidos. Por favor, revisa el formulario y asegúrate de que todos los campos estén llenos correctamente.');
                } else if (error.response.status === 500) {
                    setError('Error en el servidor. Intenta nuevamente más tarde.');
                } else {
                    setError(error.response.data.message || error.response.data.detail || 'Ocurrió un error desconocido en el servidor.');
                }
            } else {
                setError('No se pudo conectar al servidor. Verifica tu conexión o la configuración del servidor.');
            }
        }
    };

    return (
        <div className="container">
            <h2>Crear Evento</h2>
            <form onSubmit={handleSubmit}>
                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}
                
                {/* Todos los campos del formulario */}
                <FormInput
                    label="Nombre del Evento"
                    type="text"
                    name="name"
                    value={eventData.name}
                    onChange={handleChange}
                    placeholder="Ingresa el nombre del evento"
                    className="form-control"
                />
                <FormInput
                    label="Descripción"
                    type="text"
                    name="description"
                    value={eventData.description}
                    onChange={handleChange}
                    placeholder="Ingresa una descripción del evento"
                    className="form-control"
                />
                <FormInput
                    label="Categoría del Evento"
                    type="text"
                    name="id_event_category"
                    value={eventData.id_event_category}
                    onChange={handleChange}
                    placeholder="Ingresa la categoría del evento"
                    className="form-control"
                />
                <FormInput
                    label="Ubicación del Evento"
                    type="text"
                    name="id_event_location"
                    value={eventData.id_event_location}
                    onChange={handleChange}
                    placeholder="Ingresa la ubicación del evento"
                    className="form-control"
                />
                <FormInput
                    label="Fecha de Inicio"
                    type="date"
                    name="start_date"
                    value={eventData.start_date}
                    onChange={handleChange}
                    className="form-control"
                />
                <FormInput
                    label="Duración (en minutos)"
                    type="number"
                    name="duration_in_minutes"
                    value={eventData.duration_in_minutes}
                    onChange={handleChange}
                    placeholder="Ingresa la duración del evento"
                    className="form-control"
                />
                <FormInput
                    label="Precio"
                    type="number"
                    name="price"
                    value={eventData.price}
                    onChange={handleChange}
                    placeholder="Ingresa el precio del evento"
                    className="form-control"
                />
                <div className="form-group">
                    <label>
                        <input
                            type="checkbox"
                            name="enabled_for_enrollment"
                            checked={eventData.enabled_for_enrollment}
                            onChange={handleChange}
                        />
                        Habilitar inscripción
                    </label>
                </div>
                <FormInput
                    label="Máximo de Asistencia"
                    type="number"
                    name="max_assistance"
                    value={eventData.max_assistance}
                    onChange={handleChange}
                    placeholder="Ingresa el máximo de asistencia"
                    className="form-control"
                />
                <button type="submit" className="btn">Crear Evento</button>
            </form>
        </div>
    );
};

export default FormularioEvento;