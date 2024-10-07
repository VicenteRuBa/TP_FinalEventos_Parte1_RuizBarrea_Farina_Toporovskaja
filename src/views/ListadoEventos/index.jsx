import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config';
import FormInput from '../../components/FormInput'; 
import "./styles.css";

const DetalleEvento = ({ eventId }) => {
    const [eventDetails, setEventDetails] = useState(null);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        // Fetch event details
        const fetchEventDetails = async () => {
            try {
                const response = await axios.get(`${config.url}api/event/${eventId}`);
                setEventDetails(response.data);
            } catch (error) {
                console.error('Error fetching event details:', error);
            }
        };
        fetchEventDetails();
    }, [eventId]);

    const handleSubscribe = async () => {
        if (eventDetails.subscribers.length < eventDetails.capacity) {
            try {
                const userId = 0; /* Acá en vez de decir 0 debería decir el ID del usuario que se tiene que obtener */
                await axios.post(`${config.url}api/event/${eventId}/subscribe`, { userId });
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
