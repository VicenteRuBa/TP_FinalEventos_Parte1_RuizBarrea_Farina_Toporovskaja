/*aca deben estar los detalles del evento seleccionado en el listado de evento*/
import React, { useState, useEffect, useContext } from 'react';  // Agrega useContext
import axios from 'axios';
import config from '../../config';
import { AuthContext } from '../../AuthContext';  // Importa AuthContext
import "./styles.css";

const DetalleEvento = ({ match }) => {
    const { id } = match.params;
    const [eventDetails, setEventDetails] = useState(null);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [error, setError] = useState('');
    const { user, token } = useContext(AuthContext);  // Usa AuthContext para obtener el usuario y el token

    useEffect(() => {
      const fetchEventDetails = async () => {
        try {
          const response = await axios.get(`${config.url}api/event/${id}`);
          console.log("Detalle del Evento:", response.data);
          setEventDetails(response.data);
        } catch (error) {
          console.error('Error al obtener el detalle del evento:', error);
          setError('No se pudo cargar el evento.');
        }
      };

      fetchEventDetails();
    }, [id]);

    const handleSubscribe = async () => {
      if (eventDetails.subscribers.length < eventDetails.max_assistance) {  // Verifica la capacidad
        try {
          await axios.post(`${config.url}api/event/${id}/subscribe`, 
            { userId: user.id },  // Usa el ID del usuario autenticado
            {
              headers: {
                Authorization: `Bearer ${token}`  // Añade el token para autenticación
              }
            }
          );
          setIsSubscribed(true);
          setError('');
        } catch (error) {
          console.error('Error subscribing to event:', error);
          setError('No se pudo suscribir al evento.');
        }
      } else {
        setError('No hay plazas disponibles para este evento.');
      }
    };

    return (
      <div>
        {eventDetails ? (
          <>
            <h1>{eventDetails.name}</h1>
            <p>{eventDetails.description}</p>
            <p>Fecha de inicio: {new Date(eventDetails.start_date).toLocaleString()}</p>
            {/* Mostrar la categoría del evento */}
            <p>Categoría: {eventDetails.event_category ? eventDetails.event_category.name : "Categoría no disponible"}</p>
            <p>Plazas disponibles: {eventDetails.max_assistance - eventDetails.subscribers.length}</p>
            <button onClick={handleSubscribe} disabled={isSubscribed}>
              {isSubscribed ? 'Inscripto' : 'Suscribirse'}
            </button>
            {error && <p>{error}</p>}
          </>
        ) : (
          <p>Cargando detalles del evento...</p>
        )}
      </div>
    );
  };

export default DetalleEvento;

/*const DetalleEvento = ({ eventId }) => {


 

    const handleSubscribe = async () => {
        if (eventDetails.subscribers.length < eventDetails.capacity) {
            try {
                //const userId=0;
                await axios.post(`${config.url}api/event/${eventId}/subscribe`, { userId });
                setIsSubscribed(true);
                setError('');
            } catch (error) {
                console.error('Error subscribing to event:', error);
                setError('No se pudo suscribir al evento.');
            }
        } else if (!userId) {
            setError('No se pudo obtener el ID del usuario.');
        } else {
            setError('No hay plazas disponibles para este evento.');
        }
    };

    return (
        <div className="event-detail">
            {eventDetails ? (
                <>
                    <h1>{eventDetails.name}</h1>
                    <p>{eventDetails.description}</p>
                    <p>Categoría: {eventDetails.event_category.name}</p>
                    <p>Locación: {eventDetails.event_location.full_address}</p>
                    <p>Fecha de inicio: {new Date(eventDetails.start_date).toLocaleString()}</p>
                    <p>Plazas disponibles: {eventDetails.capacity - eventDetails.subscribers.length}</p>
                    <button onClick={handleSubscribe} disabled={isSubscribed || eventDetails.subscribers.length >= eventDetails.capacity}>
                        {isSubscribed ? 'Inscripto' : 'Suscribirse'}
                    </button>
                    {error && <p className="error">{error}</p>}
                </>
            ) : (
                <p>Cargando detalles del evento...</p>
            )}
        </div>
    );
};

export default DetalleEvento;
*/