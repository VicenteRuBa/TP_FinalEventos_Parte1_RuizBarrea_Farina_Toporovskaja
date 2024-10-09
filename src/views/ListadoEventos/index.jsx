import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Importa Link para la navegación
import config from '../../config';

const ListadoEventos = () => {
    const [eventos, setEventos] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchEventos = async () => {
            try {
                const response = await axios.get(`${config.url}api/event`);
                setEventos(response.data);
            } catch (error) {
                console.error('Error fetching events:', error);
                setError('No se pudieron cargar los eventos.');
            }
        };

        fetchEventos();
    }, []);

    return (
        <div>
            <h1>Listado de Eventos</h1>
            {error && <p>{error}</p>}
            <ul>
                {eventos.length > 0 ? (
                    eventos.map(event => (
                        <li key={event.id}>
                            <Link to={`/event/${event.id}`}>
                                <h2>{event.name}</h2>
                                <p>{event.description}</p>
                                <p>{event.startDate}</p>
                                <p>{event.category}</p>
                            </Link>
                        </li>
                    ))
                ) : (
                    <p>No hay eventos disponibles.</p>
                )}
            </ul>
        </div>
    );
};

export default ListadoEventos;
