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
            } catch (error) {
                console.error('Error fetching event details:', error);
                setErrorMessage('Error fetching event details. Please try again.');
            }
        };

        fetchEventDetail();
    }, [id, isLoggedIn]);

    const handleSuscribeToEvent = async (e) => {
        e.preventDefault();
        if (!ifIsLoggedIn()) {
            return;
        }

        const token = localStorage.getItem('token');
        try {
            const response = await axios.post(`${config.url}api/event/${id}/enrollment`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.status === 200) {
                setErrorMessage('');
            }
        } catch (error) {
            console.error('Error enrolling to event:', error);
            setErrorMessage(error.response?.data || 'Error enrolling to event. Please try again.');
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
                    <button className="subscribe-button" onClick={handleSuscribeToEvent}>Suscribirme</button>
                </>
            ) : (
                <p>Cargando detalles del evento...</p>
            )}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
    );
};

export default DetalleEvento;