import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../../config';
import Cookies from 'js-cookie';

function EditEvent() {
  const { id } = useParams();  // Obtener el ID del evento desde la URL
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);  // Estado para el evento actual
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [duration, setDuration] = useState('');
  const [price, setPrice] = useState('');
  const [maxAssistance, setMaxAssistance] = useState('');
  const [enabledForEnrollment, setEnabledForEnrollment] = useState(false);
  const [message, setMessage] = useState('');

  const userId = Cookies.get('userId');
  const token = Cookies.get('token');

  useEffect(() => {
    fetchEventDetails();  // Cargar los detalles del evento cuando el componente se monta
  }, []);

  // Función para obtener los detalles del evento
  const fetchEventDetails = async () => {
    try {
      const response = await axios.get(`${config.url}/api/event/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const eventData = response.data;

      // Verificar si el usuario es el creador del evento
      if (eventData.id_creator_user !== userId) {
        navigate('/');  // Redirigir a home si no es el creador
      }

      // Actualizar el estado con los datos del evento
      setEvent(eventData);
      setName(eventData.name);
      setDescription(eventData.description);
      setStartDate(eventData.start_date);
      setDuration(eventData.duration_in_minutes);
      setPrice(eventData.price);
      setMaxAssistance(eventData.max_assistance);
      setEnabledForEnrollment(eventData.enabled_for_enrollment);
    } catch (error) {
      console.error('Error al obtener los detalles del evento:', error);
      navigate('/');  // Redirigir si hay un error al obtener el evento
    }
  };

  // Función para manejar el envío del formulario de modificación
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(`${config.url}/api/event/${id}`, {
        name,
        description,
        start_date: startDate,
        duration_in_minutes: duration,
        price,
        max_assistance: maxAssistance,
        enabled_for_enrollment: enabledForEnrollment,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage('Evento modificado exitosamente');
      setTimeout(() => navigate('/'), 2000);  // Redirigir al home después de 2 segundos
    } catch (error) {
      setMessage('Error al modificar el evento');
      console.error('Error al modificar el evento:', error);
    }
  };

  return (
    <div>
      <h1>Modificar Evento</h1>
      {event ? (
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Nombre del Evento" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input 
            type="text" 
            placeholder="Descripción" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <input 
            type="datetime-local" 
            placeholder="Fecha de Inicio" 
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
          <input 
            type="number" 
            placeholder="Duración (en minutos)" 
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
          />
          <input 
            type="number" 
            placeholder="Precio" 
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
          <input 
            type="number" 
            placeholder="Capacidad Máxima" 
            value={maxAssistance}
            onChange={(e) => setMaxAssistance(e.target.value)}
            required
          />
          <label>
            <input 
              type="checkbox"
              checked={enabledForEnrollment}
              onChange={(e) => setEnabledForEnrollment(e.target.checked)}
            />
            Habilitar inscripciones
          </label>

          <button type="submit">Guardar Cambios</button>
        </form>
      ) : (
        <p>Cargando detalles del evento...</p>
      )}
      {message && <p>{message}</p>}
    </div>
  );
}

export default EditEvent;