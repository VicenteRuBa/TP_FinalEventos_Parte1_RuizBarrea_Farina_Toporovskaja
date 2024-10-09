/*aca deben estar los detalles del evento seleccionado en el listado de eventos
en el listado esta el codigo del detalle evento por lo que esta ahi hay que ponerlo aca y crear un listado de eventos :)
*/

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config';
import FormInput from '../../components/FormInput'; 
import "./styles.css";
const DetalleEvento = ({ event = {} }) => {
    const [eventDetails, setEventDetails] = useState(null);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [error, setError] = useState('');
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        // Fetch event details
        const fetchEventDetails = async () => {
            try {
                const response = await axios.get(`${config.url}api/event`);
                setEventDetails(response.data);
                console.log(response)
            } catch (error) {
                console.error('Error fetching event details:', error);
            }
            
        };
        const fetchUserDetails = async () => {
            try {
                const userResponse = await axios.get(`${config.url}api/user/profile`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`  // Asegúrate de pasar el token JWT si estás utilizando autenticación basada en tokens
                    }
                });
                setUserId(userResponse.data.id);  // Ajusta esto según la estructura de la respuesta
            } catch (error) {
                console.error('Error fetching user details:', error);
                setError('No se pudo obtener la información del usuario.');
            }
        };

        fetchEventDetails();
        fetchUserDetails(); 

    }, []);


    return (
        <div>
            <h1>{event.name || "Sin nombre"}</h1>
            <p>{event.description || "Sin descripción"}</p>
            <p>{event.startDate || "Fecha no disponible"}</p>
            <p>{event.category || "Categoría no disponible"}</p>
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