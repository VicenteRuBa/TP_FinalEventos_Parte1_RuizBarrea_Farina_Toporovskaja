import React, { useContext, useState, useEffect  } from 'react';
import { AuthContext } from '../../AuthContext';
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
    const { user, token } = useContext(AuthContext);
    const [error, setError] = useState('');
  
    const handleChange = (e) => {
      setEventData({
        ...eventData,
        [e.target.name]: e.target.value,
      });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await axios.post(`${config.url}api/event`, { ...eventData, userId: user.id }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        alert('Evento creado con éxito');
      } catch (error) {
        console.error('Error creando evento:', error);
        setError('No se pudo crear el evento.');
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
                 <FormInput
                    label="Duración (en minutos)"
                    type="number"
                    name="duration_in_minutes"
                    value={eventData.duration_in_minutes}
                    onChange={handleChange}
                    required
                />
                <FormInput
                    label="Precio"
                    type="number"
                    name="price"
                    value={eventData.price}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Crear Evento</button>
            </form>
        </div>
    );
};

export default CargarEvento;
