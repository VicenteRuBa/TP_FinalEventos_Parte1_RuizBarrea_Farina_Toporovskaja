import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import config from '../../config';
import { AuthContext } from "../../AuthContext";

const EditarEvento = () => {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        start_date: '',
        duration_in_minutes: '',
        price: '',
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const { isLoggedIn } = useContext(AuthContext);

    useEffect(() => {
        const fetchEventDetail = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get(`${config.url}api/event/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const event = response.data[0];
                setFormData({
                    name: event.name,
                    description: event.description,
                    start_date: event.start_date.split('T')[0], // Formatear fecha para el input
                    duration_in_minutes: event.duration_in_minutes,
                    price: event.price,
                });
            } catch (error) {
                console.error('Error fetching event details:', error);
                setErrorMessage('Error al cargar los detalles del evento.');
            }
        };

        fetchEventDetail();
    }, [id, isLoggedIn]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSaveChanges = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const response = await axios.put(`${config.url}api/event/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                setSuccessMessage('Evento actualizado correctamente.');
                setErrorMessage('');
            }
        } catch (error) {
            console.error('Error updating event:', error);
            setErrorMessage('Error al actualizar el evento. Por favor, inténtelo de nuevo.');
            setSuccessMessage('');
        }
    };

    return (
        <div className="event-edit-container">
            <h1 className="event-title">Editar Evento</h1>
            <form onSubmit={handleSaveChanges}>
                <div className="form-group">
                    <label htmlFor="name">Nombre del Evento:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Descripción:</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="start_date">Fecha de Inicio:</label>
                    <input
                        type="date"
                        id="start_date"
                        name="start_date"
                        value={formData.start_date}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="duration_in_minutes">Duración (minutos):</label>
                    <input
                        type="number"
                        id="duration_in_minutes"
                        name="duration_in_minutes"
                        value={formData.duration_in_minutes}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="price">Precio:</label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <button type="submit" className="save-button">Guardar Cambios</button>
            </form>
            {successMessage && <p className="success-message">{successMessage}</p>}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
    );
};

export default EditarEvento;
