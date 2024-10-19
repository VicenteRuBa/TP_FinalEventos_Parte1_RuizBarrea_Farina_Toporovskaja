import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; 
import config from '../../config';

const ListadoEventos = () => {
    const [eventos, setEventos] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const fetchEventos = async () => {
            try {
                const response = await axios.get(`${config.url}api/event`);
                
                console.log('Respuesta de la API:', response); // Depuración: Verifica la respuesta completa
                console.log('Datos obtenidos:', response.data); // Depuración: Muestra los datos obtenidos

                if (response.data && response.data.length > 0) {
                    setEventos(response.data);
                    setError('');
                } else {
                    setError('No hay eventos disponibles en este momento.');
                }
            } catch (error) {
                console.error('Error al obtener eventos:', error); // Depuración: Imprime el error
                setError('No se pudieron cargar los eventos.');
            } finally {
                setLoading(false);
            }
        };

        fetchEventos();
    }, []);

    if (loading) {
        return <p>Cargando eventos...</p>;
    }

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
                                <p>{new Date(event.start_date).toLocaleString()}</p> {/* Ajusta la fecha */}
                                <p>{event.event_category ? event.event_category.name : "Categoría no disponible"}</p>
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
