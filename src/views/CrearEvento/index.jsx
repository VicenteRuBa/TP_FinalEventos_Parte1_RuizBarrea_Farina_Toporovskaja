import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import FormInput from "../../components/FormInput";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../../AuthContext";
import config from '../../config';
import Dropdown from '../../components/Dropdown/dropdown';

const FormularioEvento = () => {
    const [eventData, setEventData] = useState({
        name: '',
        description: '',
        id_event_category: '', // Añadir el estado para la categoría
        id_event_location: '', // Añadir el estado para la ubicación
        date: '',
        time: '',
        duration_in_minutes: '',
        price: '',
        enabled_for_enrollment: false,
        max_assistance: '',
    });
    const [categories, setCategories] = useState([]);
    const [locations, setLocations] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { isLoggedIn } = useContext(AuthContext);
    const navigate = useNavigate();

    // Obtener categorías y locaciones
    useEffect(() => {
        if (!isLoggedIn) {
            navigate(-1);
        } else {
            fetchCategories();
            fetchLocations();
        }
    }, [isLoggedIn, navigate]);

    // Obtener categorías desde la API
    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${config.url}api/event-category?limit=100&offset=0`);
            setCategories(response.data.collection);
        } catch (error) {
            console.error('Error al obtener las categorías:', error);
        }
    };

    // Obtener locaciones desde la API
    const fetchLocations = async () => {
        try {
            const response = await axios.get(`${config.url}api/event-location?limit=100&offset=0`);
            setLocations(response.data.collection);
        } catch (error) {
            console.error('Error al obtener las locaciones:', error);
        }
    };

    // Maneja los cambios en el formulario
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEventData({
            ...eventData,
            [name]: type === 'checkbox' ? checked : value,
        });
        setError('');
    };

    // Maneja la solicitud para crear el evento
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const token = localStorage.getItem('token');
        if (!token) {
            setError('No se encontró el token de autenticación. Inicia sesión nuevamente.');
            return;
        }

        let formattedStartDate = `${eventData.date}T${eventData.time}`;
        formattedStartDate = formattedStartDate + ":00";  // Aseguramos el formato correcto

        const formattedEventData = {
            name: eventData.name,
            description: eventData.description,
            id_event_category: parseInt(eventData.id_event_category) || 1,
            id_event_location: parseInt(eventData.id_event_location) || 2,
            start_date: formattedStartDate,
            duration_in_minutes: parseInt(eventData.duration_in_minutes),
            price: parseFloat(eventData.price),
            enabled_for_enrollment: eventData.enabled_for_enrollment,
            max_assistance: parseInt(eventData.max_assistance),
        };

        try {
            const response = await axios.post(`${config.url}api/event`, formattedEventData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setSuccess('¡Evento creado con éxito!');
            // Resetea el formulario
            setEventData({
                name: '',
                description: '',
                id_event_category: '',
                id_event_location: '',
                date: '',
                time: '',
                duration_in_minutes: '',
                price: '',
                enabled_for_enrollment: false,
                max_assistance: '',
            });
        } catch (error) {
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

                {/* Campos del formulario */}
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
                
                {/* Dropdown de categorías */}
                <Dropdown 
                    label="Categoría"
                    placeholder="Seleccione una Categoría"
                    value={eventData.id_event_category}
                    onChange={(e) => setEventData({...eventData, id_event_category: e.target.value})}
                    options={categories}
                    required
                />

                {/* Dropdown de locaciones */}
                <Dropdown 
                    label="Ubicación"
                    placeholder="Seleccione una Locación"
                    value={eventData.id_event_location}
                    onChange={(e) => setEventData({...eventData, id_event_location: e.target.value})}
                    options={locations}
                    required
                />

                <FormInput
                    label="Fecha"
                    type="date"
                    name="date"
                    value={eventData.date}
                    onChange={handleChange}
                    className="form-control"
                />
                <FormInput
                    label="Hora"
                    type="time"
                    name="time"
                    value={eventData.time}
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
