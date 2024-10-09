import './App.css';
import React from "react";
import { Route, Routes } from "react-router-dom";
import NavBar from './components/NavBar/index.jsx';
import ListadoEventos from './views/ListadoEventos/index.jsx';
import DetalleEvento from './views/DetalleEventos/index.jsx';
import InicioSesion from './views/InicioSesion/index.jsx';
import Registro from './views/Registro/index.jsx';
import { AuthProvider } from "./AuthContext"; 
import Footer from './components/Footer/index.jsx';

function App() {
  return (
    <AuthProvider>
      <header>
        <NavBar />
      </header>
      <main> 
        <Routes>
          <Route exact path="/" element={<ListadoEventos />} />
          <Route exact path="/login" element={<InicioSesion />} />
          <Route exact path="/register" element={<Registro />} />
          <Route exact path="/event/:id" element={<DetalleEvento />} /> {/* Ruta para DetalleEvento */}
        </Routes>   
      </main>
      <footer>
        <Footer />
      </footer>
    </AuthProvider>
  );
}

export default App;
