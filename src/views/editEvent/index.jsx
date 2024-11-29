import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../../config';
import { AuthContext } from "../../AuthContext";
import Dropdown from '../../components/Dropdown/dropdown';
import FormInput from '../../components/FormInput';

const EditarEvento = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isLoggedIn } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        id: "",
        name: '',
        description: '',
        date: '',
        time: '',
        duration_in_minutes: '',
        price: '',
        id_event_category: '',
        id_event_location: '',
        enabled_for_enrollment: false,
        max_assistance: '',
        //HAY QUE AGREGAR EL ID DE USUARIO.
    });

    const [categories, setCategories] = useState([]);
    const [locations, setLocations] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const token = localStorage.getItem('token');
    const userId = JSON.parse(localStorage.getItem('user'))?.id; // Obtener id del usuario

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
        } else {
            fetchEventDetail();
            fetchCategories();
            fetchLocations();
        }
    }, [isLoggedIn, id]);

    // Cargar detalles del evento
    const fetchEventDetail = async () => {
        try {
            const response = await axios.get(`${config.url}api/event/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            if (!response.data || response.data.length === 0) {
                throw new Error('El evento no existe o no se encontraron datos.');
            }
    
            const event = response.data[0]; // Ajusta esto según la estructura de tu API
    
            // Validar si event contiene todas las propiedades requeridas
            const [date, time] = event.start_date?.split('T') || ['', ''];
            console.log(event);
            setFormData({
                id: event.id || '',
                name: event.name || '',
                description: event.description || '',
                date: date || '',
                time: time?.slice(0, 5) || '', // Extrae hora en formato HH:MM
                duration_in_minutes: event.duration_in_minutes?.toString() || '',
                price: event.price?.toString() || '',
                id_event_category: event.id_event_category?.toString() || '',
                id_event_location: event.id_event_location?.toString() || '',
                enabled_for_enrollment: !!event.enabled_for_enrollment,
                max_assistance: event.max_assistance?.toString() || '',
                //HAY QUE AGREGAR EL ID DE USUARIO.
            });
        } catch (error) {
            console.error('Error al cargar los detalles del evento:', error);
            setErrorMessage('Error al cargar los detalles del evento. Verifica que el evento exista.');
        }
    };
    

    // Cargar categorías
    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${config.url}api/event-category?limit=100&offset=0`);
            setCategories(response.data.collection);
        } catch (error) {
            console.error('Error al cargar categorías:', error);
        }
    };

    // Cargar ubicaciones
    const fetchLocations = async () => {
        try {
            const response = await axios.get(`${config.url}api/event-location?limit=100&offset=0`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setLocations(response.data.collection);
        } catch (error) {
            console.error('Error al cargar ubicaciones:', error);
        }
    };

    // Manejo de cambios en el formulario
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    // Guardar cambios
    const handleSaveChanges = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');
    
        try {
            const formattedStartDate = `${formData.date}T${formData.time}:00`;
    
            const updatedData = {
                id: formData.id,
                name: formData.name,
                description: formData.description,
                start_date: formattedStartDate,
                id_event_category: parseInt(formData.id_event_category, 10),
                id_event_location: parseInt(formData.id_event_location, 10),
                duration_in_minutes: parseInt(formData.duration_in_minutes, 10),
                price: parseFloat(formData.price),
                enabled_for_enrollment: formData.enabled_for_enrollment,
                max_assistance: parseInt(formData.max_assistance, 10),
                id_creator_user: userId, // Incluyendo id del usuario

            };
    
            console.log('Datos enviados al servidor:', updatedData);
    
            const response = await axios.put(`${config.url}api/event`, updatedData, {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            if (response.status === 200 || response.status === 204) {
                setSuccessMessage('Evento actualizado correctamente.');
                setErrorMessage('');
            } else {
                throw new Error('No se pudo actualizar el evento.');
            }
        } catch (error) {
            console.error('Error al actualizar el evento:', error);
            setErrorMessage('Error al actualizar el evento. Verifica los datos o intenta nuevamente.');
        }
    };
    
    

    return (
        <div className="event-edit-container">
            <h1 className="event-title">Editar Evento</h1>
            <form onSubmit={handleSaveChanges}>
                {successMessage && <p className="success-message">{successMessage}</p>}
                {errorMessage && <p className="error-message">{errorMessage}</p>}

                <FormInput
                    label="Nombre del Evento"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                />
                <FormInput
                    label="Descripción"
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                />
                <FormInput
                    label="Fecha"
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                />
                <FormInput
                    label="Hora"
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    required
                />
                <FormInput
                    label="Duración (en minutos)"
                    type="number"
                    name="duration_in_minutes"
                    value={formData.duration_in_minutes}
                    onChange={handleInputChange}
                    required
                />
                <FormInput
                    label="Precio"
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                />
                <FormInput
                    label="Máximo de Asistencia"
                    type="number"
                    name="max_assistance"
                    value={formData.max_assistance}
                    onChange={handleInputChange}
                    required
                />
                <Dropdown
                    label="Categoría"
                    placeholder="Seleccione una Categoría"
                    value={formData.id_event_category}
                    onChange={(e) => setFormData({ ...formData, id_event_category: e.target.value })}
                    options={categories}
                    required
                />
                <Dropdown
                    label="Ubicación"
                    placeholder="Seleccione una Ubicación"
                    value={formData.id_event_location}
                    onChange={(e) => setFormData({ ...formData, id_event_location: e.target.value })}
                    options={locations}
                    required
                />
                <div className="form-group">
                    <label>
                        <input
                            type="checkbox"
                            name="enabled_for_enrollment"
                            checked={formData.enabled_for_enrollment}
                            onChange={handleInputChange}
                        />
                        Habilitar inscripción
                    </label>
                </div>
                <button type="submit" className="save-button">Guardar Cambios</button>
            </form>
        </div>
    );
};

export default EditarEvento;
