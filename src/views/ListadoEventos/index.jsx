import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import config from '../../config';
import FormInput from '../../components/FormInput';
import "./styles.css";
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from "../../AuthContext";

// Listado de Eventos
const ListadoEventos = () => {
    const [events, setEvents] = useState([]);
    const [page, setPage] = useState(1);
    const [limit] = useState(2);
    const [total, setTotal] = useState(0);
    const [filters, setFilters] = useState({
        tag: '',
        startDate: '',
        name: '',
        category: ''
    });
    const [applyFilters, setApplyFilters] = useState(false);
    const { ifIsLoggedIn } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.setItem("navigationHistory", false);
    }, []);

    // Función para obtener los eventos
    const fetchEvents = async () => {
        const { name = '', tag = '', category = '' } = filters;
        let queryParams = [];

        if (name.trim()) queryParams.push(`name=${encodeURIComponent(name)}`);
        if (tag.trim()) queryParams.push(`tag=${encodeURIComponent(tag)}`);
        if (filters.startDate.trim()) {
            const formattedDate = new Date(filters.startDate).toISOString().split('T')[0];
            queryParams.push(`startdate=${formattedDate}`);
        }
        if (category.trim()) queryParams.push(`category=${encodeURIComponent(category)}`);
        queryParams.push(`page=${page}`);
        queryParams.push(`limit=${limit}`);

        const queryString = queryParams.length ? `?${queryParams.join('&')}` : '';
        console.log('Fetching data with query:', `${config.url}api/event${queryString}`);

        try {
            const response = await axios.get(`${config.url}api/event${queryString}`);
            const eventsData = response?.data?.collection || [];
            setEvents(eventsData);

            const totalEvents = response?.data?.pagination?.total || 0;
            setTotal(totalEvents);
        } catch (error) {
            console.error('Error fetching events:', error);
            setEvents([]);
            setTotal(0);
        }
    };

    useEffect(() => {
        fetchEvents();
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, [page, applyFilters]);

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    const handleApplyFilters = () => {
        setPage(1);  
        setApplyFilters(!applyFilters); 
    };

    const handleNextPage = () => {
        if (page * limit < parseInt(total)) {
            setPage(page + 1);
        }
    };

    const handlePreviousPage = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    };

    const handleCreateEventClick = (e) => {
        e.preventDefault();
        if (!ifIsLoggedIn()) {
            return null;
        }
        navigate('/crearEvento');
    };

    // Función para filtrar los eventos basados en los filtros aplicados
    const filterEvents = (event) => {
        const { name, tag, category } = filters;

        // Normaliza el texto (minúsculas) para la comparación insensible a mayúsculas
        const lowerName = event.name ? event.name.toLowerCase() : '';
        const lowerDescription = event.description ? event.description.toLowerCase() : '';
        const lowerCategory = event.event_category?.name ? event.event_category.name.toLowerCase() : '';
        const lowerLocation = event.event_location?.full_address ? event.event_location.full_address.toLowerCase() : '';
        const lowerTags = event.tags ? event.tags.map(t => t.name.toLowerCase()).join(' ') : '';

        // Verifica si los filtros coinciden con las propiedades del evento (sin importar mayúsculas/minúsculas)
        const matchesName = name ? lowerName.includes(name.toLowerCase()) : true;
        const matchesCategory = category ? lowerCategory.includes(category.toLowerCase()) : true;
        const matchesTag = tag ? lowerTags.includes(tag.toLowerCase()) : true;

        // Asegura que si al menos uno de los filtros tiene texto, el filtro se aplique correctamente.
        return matchesName && matchesCategory && matchesTag;
    };

    return (
        <div className="event-list">
            <div>
                <h1>Listado de Eventos</h1>
                <button onClick={handleCreateEventClick}>Crear</button>
            </div>

            <div className="filters">
                <FormInput
                    label="Buscar por nombre"
                    type="text"
                    name="name"
                    value={filters.name}
                    onChange={handleFilterChange}
                    placeholder="Buscar por nombre"
                />
                <FormInput
                    label="Categoría"
                    type="text"
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                    placeholder="Categoría"
                />
                <FormInput
                    label="Tags"
                    type="text"
                    name="tag"
                    value={filters.tag}
                    onChange={handleFilterChange}
                    placeholder="Tags"
                />
                <FormInput
                    label="Fecha de inicio"
                    type="date"
                    name="startDate"
                    value={filters.startDate}
                    onChange={handleFilterChange}
                />
                <button onClick={handleApplyFilters}>Aplicar Filtros</button>
            </div>

            <ul>
                {events.length > 0 ? (
                    events.filter(filterEvents).map(event => (
                        <div key={event.id}>
                            <li>
                                <div>
                                    <h2>{event.name}</h2>
                                    <p>{event.description}</p>
                                    <p>Categoría: {event.event_category.name}</p>
                                    <p>Ubicación: {event.event_location.full_address}</p>
                                    <p>Fecha de inicio: {new Date(event.start_date).toLocaleString()}</p>
                                    <p>Tags: {event.tags ? event.tags.map(tag => tag.name).join(', ') : 'N/A'}</p>
                                </div>
                                <div>
                                    <Link to={`/detalleevento/${event.id}`}>Ver detalle</Link>
                                </div>
                            </li>
                        </div>
                    ))
                ) : (
                    <p>No hay eventos disponibles</p>
                )}
            </ul>

            <div className="pagination">
                <button onClick={handlePreviousPage} disabled={page === 1}>Anterior</button>
                <span>Página {page}</span>
                <button onClick={handleNextPage} disabled={page * limit >= total}>Siguiente</button>
            </div>
        </div>
    );
};

export default ListadoEventos;
