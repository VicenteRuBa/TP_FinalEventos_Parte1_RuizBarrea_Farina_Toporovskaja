import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; 
import config from '../../config';
import { useNavigate } from 'react-router-dom';
import EventoCard from "../../components/EventoCard/eventoCard"
import Cookies from 'js-cookie';

const ListadoEventos = () => {
    const [eventos, setEventos] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true); 
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const userId = Cookies.get('userId'); // Obtener el ID del usuario
    
    
    useEffect(() => {
      fetchEvents();  
    }, []);
  
      const fetchEvents = async () => {
        try {
          const response = await axios.get(`${config.url}api/event`);  
          setEvents(response.data.collection); 
          setLoading(false);  
        } catch (error) {
          console.error('Error al obtener los eventos:', error);
          setError('Error al cargar los eventos');  
          setLoading(false);  
        }
      };
    
      if (loading) {
        return <p>Cargando eventos...</p>;
      }
    
      if (error) {
        return <p>{error}</p>;
      }


    return (
        <main>
        <h1 >Eventos Disponibles</h1>
        <div >
          {events.length > 0 ? (
            events.map((event) => (
              <EventoCard key={event.id} event={event} userId={userId} /> 
            ))
          ) : (
            <p>No hay eventos disponibles en este momento</p>
          )}
        </div>
        
      </main>
    );
};

export default ListadoEventos;