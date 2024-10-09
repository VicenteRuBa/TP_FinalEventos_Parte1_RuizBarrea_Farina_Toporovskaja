import React, { useState, useEffect  } from 'react';
import axios from 'axios';
import config from '../../config';
import FormInput from '../../components/FormInput'; 
import "./styles.css";

const CargarEvento = () => {
    const [eventData, setEventData] = useState({
        name: '',
        description: '',
        startDate: '',
        category: '',
        capacity: 0,
    });
    const [userId, setUserId] = useState(null); // Estado para almacenar el userId del usuario logueado
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const response = await axios.get(`${config.url}api/user/profile`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}` // Asegúrate de que el token esté almacenado y disponible
                    }
                });
                setUserId(response.data.id); // Ajusta esto según la estructura de tu respuesta
            } catch (error) {
                console.error('Error fetching user ID:', error);
                setError('No se pudo obtener la información del usuario.');
            }
        };

        fetchUserId();
    }, []);

    const handleChange = (e) => {
        setEventData({
            ...eventData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            //const userId=0;
            await axios.post(`${config.url}api/event`, { ...eventData, userId });
            alert('Evento creado con éxito');
        } catch (error) {
            console.error('Error creando evento:', error);
            alert('No se pudo crear el evento.');
        }
    };

    return (
        <div className="event-form">
            <h1>Cargar Evento</h1>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <FormInput
                    label="Nombre del Evento"
                    type="text"
                    name="name"
                    value={eventData.name}
                    onChange={handleChange}
                    required
                />
                <FormInput
                    label="Descripción"
                    type="text"
                    name="description"
                    value={eventData.description}
                    onChange={handleChange}
                    required
                />
                <FormInput
                    label="Fecha de Inicio"
                    type="date"
                    name="startDate"
                    value={eventData.startDate}
                    onChange={handleChange}
                    required
                />
                <FormInput
                    label="Categoría"
                    type="text"
                    name="category"
                    value={eventData.category}
                    onChange={handleChange}
                    required
                />
                <FormInput
                    label="Capacidad"
                    type="number"
                    name="capacity"
                    value={eventData.capacity}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Crear Evento</button>
            </form>
        </div>
    );
};

export default CargarEvento;
