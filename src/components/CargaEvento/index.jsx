import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import { styles } from './style.jsx';
import Header from '../../components/header/header.jsx';
import Input from '../../components/Input/input.jsx';
import Dropdown from '../../components/Dropdown/dropdown.jsx';
import config from '../../config.js'

function CreateEvent() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [duration, setDuration] = useState('');
  const [price, setPrice] = useState('');
  const [maxAssistance, setMaxAssistance] = useState('');
  const [categories, setCategories] = useState([]);  // Estado para categorías
  const [locations, setLocations] = useState([]);    // Estado para locaciones
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [message, setMessage] = useState('');

  const userId = Cookies.get('userId');
  const token = Cookies.get('token');
  const navigate = useNavigate();

  // Obtener categorías y locaciones al montar el componente
  useEffect(() => {
    fetchCategories();
    fetchLocations();
  }, []);

  // Obtener categorías de la API
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${config.url}api/event-category?limit=100&offset=0`, {
        headers: {
          Authorization: `Bearer ${token}`,  // Autenticación con token
        },
      });
      setCategories(response.data.collection);  // Accedemos a collection que tiene las categorías
    } catch (error) {
      console.error('Error al obtener las categorías:', error);
    }
  };

  // Obtener locaciones de la API
  const fetchLocations = async () => {
    try {
      const response = await axios.get(`${config.url}api/event-location?limit=100&offset=0`, {
        headers: {
          Authorization: `Bearer ${token}`,  // Autenticación con token
        },
      });
      setLocations(response.data.collection);  // Accedemos a collection que tiene las locaciones
    } catch (error) {
      console.error('Error al obtener las locaciones:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${config.url}api/event`, {
        name,
        description,
        start_date: startDate,
        duration_in_minutes: duration,
        price,
        id_event_category: selectedCategory,  // Enviamos la categoría seleccionada
        id_event_location: selectedLocation,  // Enviamos la locación seleccionada
        id_creator_user: userId,
        enabled_for_enrollment: true,
        max_assistance: maxAssistance,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      setMessage('Evento creado exitosamente');
      setTimeout(() => navigate('/home'), 2000);  // Redirigir al home después de 2 segundos
    } catch (error) {
      setMessage('Error al crear el evento');
      console.error('Error al crear evento:', error);
    }
  };

  return (
    <div style={styles.body}>
      <Header/>
      {/* Botón para volver atrás */}
      
      <h1 style={styles.h1}>Crear Evento</h1>
      
      <main style={styles.main}>
          <form onSubmit={handleSubmit} style={styles.form}>
          <Input 
            type="text"
            label="Nombre del Evento"
            placeholder="Ingrese el nombre del evento"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            type="text"
            label="Descripción"
            placeholder="Ingrese la descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <Input
            type="datetime-local"
            label="Fecha de Inicio"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />

          <Input
            type="number"
            label="Duración"
            placeholder="Duración en minutos"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
            min={0}
          />

          <Input
            type="number"
            label="Precio"
            placeholder="Ingrese el precio"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            min={0}
          />

          <Input
            type="number"
            label="Capacidad Máxima"
            placeholder="Ingrese la capacidad máxima"
            value={maxAssistance}
            onChange={(e) => setMaxAssistance(e.target.value)}
            required
            min={1}
          />
            {/* Dropdown de categorías */}
            <Dropdown 
              label="Categoría"
              placeholder="Seleccione una Categoría"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              options={categories}
              required
            />

            <Dropdown 
              label="Ubicación"
              placeholder="Seleccione una Locación"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              options={locations}
              required
            />
            

            <button type="submit" style={styles.buttonCreate}>Crear Evento</button>
            
          </form>
      </main>
      {message && <p>{message}</p>}
    </div>
  );
}

export default CreateEvent;