import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import config from '../../config';
import { AuthContext } from "../../AuthContext";
import './styles.css';

const DetalleEvento = () => {
    const { id } = useParams();
    const [eventData, setEventData] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [isSubscribed, setIsSubscribed] = useState(false); // Estado para manejar la suscripción
    const { isLoggedIn, ifIsLoggedIn } = useContext(AuthContext);

    useEffect(() => {
        const fetchEventDetail = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get(`${config.url}api/event/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log(response.data[0]);
                setEventData(response.data[0]);
                
                // Verificar si el usuario está suscrito al evento
                const userId = JSON.parse(localStorage.getItem('user'))?.id;
                const isUserSubscribed = response.data[0].enrolled_users.some(user => user.id === userId);
                setIsSubscribed(isUserSubscribed); // Establecer si el usuario está suscrito
            } catch (error) {
                console.error('Error fetching event details:', error);
            }
        };

        fetchEventDetail();
    }, [id, isLoggedIn]);

    const handleSubscriptionToggle = async (e) => {
        e.preventDefault();
        if (!ifIsLoggedIn()) {
            return;
        }

        const token = localStorage.getItem('token');
        const endpoint = isSubscribed ? 'unsubscription' : 'enrollment'; // Cambiar según el estado de suscripción

        try {
            const response = await axios.post(`${config.url}api/event/${id}/${endpoint}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                setIsSubscribed(!isSubscribed); // Alternar el estado de suscripción
                setErrorMessage(''); // Limpiar mensaje de error si la acción fue exitosa
            }
        } catch (error) {
            if (error.response?.data === "El usuario ya se encuentra registrado en el evento") {
                setIsSubscribed(true); // Si ya está inscrito, cambiar el estado a "suscrito"
                setErrorMessage("Ya estás inscrito en este evento.");
            } else {
                console.error('Error toggling subscription:', error);
                setErrorMessage(error.response?.data || 'Error toggling subscription. Please try again.');
            }
        }
    };

    return (
        <div className="event-detail-container">
            {eventData ? (
                <>
                    <h1 className="event-title">{eventData.name}</h1>
                    <p className="event-description">{eventData.description}</p>
                    <div className="event-info">
                        <p><strong>Fecha de Inicio:</strong> {new Date(eventData.start_date).toLocaleDateString()}</p>
                        <p><strong>Duración:</strong> {eventData.duration_in_minutes} minutos</p>
                        <p><strong>Precio:</strong> ${eventData.price}</p>
                        <p><strong>Creador:</strong> {eventData.creator_user.first_name} {eventData.creator_user.last_name}</p>
                    </div>
                    <button className="subscribe-button" onClick={handleSubscriptionToggle}>
                        {isSubscribed ? 'Desuscribirme' : 'Suscribirme'}
                    </button>
                </>
            ) : (
                <p>Cargando detalles del evento...</p>
            )}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
    );
};

export default DetalleEvento;
