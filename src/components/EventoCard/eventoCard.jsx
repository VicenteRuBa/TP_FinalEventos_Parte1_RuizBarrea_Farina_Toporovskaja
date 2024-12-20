import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import './style.css';
import config from '../../config';

const EventCard = ({ event, userId }) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [enrolledCount, setEnrolledCount] = useState(0);  // Almacenar cuántos están inscritos
  const [message, setMessage] = useState('');

  const token = Cookies.get('token');  // Obtener el token JWT de las cookies

  useEffect(() => {
    checkEnrollment();  // Obtener el número de inscritos
  }, []);

  const checkEnrollment = async () => {
    try {
      // Obtener el número de inscritos
      const countResponse = await axios.get(`${config.url}api/event/${event.id}/enrollment`, {
        headers: {
          Authorization: `Bearer ${token}`,  // Enviar el token en el encabezado Authorization
        },
      });

      // Asegurarse de que la respuesta contiene el dato esperado
      const enrolledCount = countResponse.data ? countResponse.data.total : 0;
      setEnrolledCount(enrolledCount);

      // Verificar si existe la lista de participantes antes de aplicar el método .some()
      const isUserEnrolled = countResponse.data && countResponse.data.rows
        ? countResponse.data.rows.some((participant) => participant.user.id === userId)
        : false;
      setIsSubscribed(isUserEnrolled);
      
    } catch (error) {
      console.error('Error al verificar el número de inscritos:', error);
    }
  };

  // Función para suscribirse al evento
  const handleSubscription = async () => {
    try {
      await axios.post(`${config.url}api/event/${event.id}/enrollment`, 
      { userId }, 
      {
        headers: {
          Authorization: `Bearer ${token}`,  // Enviar el token en el encabezado Authorization
        },
      });
      setIsSubscribed(true);
      setEnrolledCount((prevCount) => prevCount + 1);
      setMessage('¡Te has suscrito exitosamente!');
    } catch (error) {
      setMessage('Error al suscribirse al evento');
      console.error('Error al suscribirse al evento:', error);
    }
  };

  // Función para desuscribirse del evento
  const handleUnsubscription = async () => {
    try {
      await axios.delete(`${config.url}api/event/${event.id}/enrollment`, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
        params: {
          userId, 
        },
      });
      setIsSubscribed(false);
      setEnrolledCount((prevCount) => prevCount - 1);
      setMessage('Te has desuscrito del evento');
    } catch (error) {
      setMessage('Error al desuscribirse del evento');
      console.error('Error al desuscribirse del evento:', error);
    }
  };
  

  return (
    <div className="event-card">
      <h3>{event.name}</h3>
      <p>{event.description}</p>
      <p>Fecha: {new Date(event.start_date).toLocaleDateString()}</p>
      <p>Duración: {`${Math.floor(event.duration_in_minutes / 60)}H ${event.duration_in_minutes % 60}M`}</p>
      <p>Precio: ${event.price}</p>

      {event.enabled_for_enrollment ? (
        <p className="available">Entradas disponibles</p>
      ) : (
        <p className="sold-out">Entradas agotadas</p>
      )}

      {/* Mostrar el número de inscritos y capacidad máxima */}
      <p>{`Inscritos: ${enrolledCount}/${event.max_assistance}`}</p>

      {/* Mostrar botón de suscripción o desuscripción */}
      {event.id_creator_user === userId ? (
        <Link to={`/event/edit/${event.id}`}>
          <button className="modify-button">Modificar Evento</button>
        </Link>
      ) : (<p></p>)}

      
      {event.enabled_for_enrollment && enrolledCount < event.max_assistance ? (
        isSubscribed ? (
          <button onClick={handleUnsubscription} className="unsubscribe-button">
            Desuscribirse
          </button>
        ) : (
          <button onClick={handleSubscription} className="subscribe-button">
            Suscribirse
          </button>
        )
      ) : (
        <button disabled className="subscribe-button-disabled">
          {isSubscribed ? 'Ya estás suscrito' : 'No hay plazas disponibles'}
        </button>
      )}

      {message && <p>{message}</p>}
    </div>
  );
};

export default EventCard;
