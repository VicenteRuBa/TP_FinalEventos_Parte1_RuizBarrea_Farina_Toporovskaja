
const ConfirmModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Confirmación</h2>
                <p>Por favor, inicie sesión para suscribirse.</p>
                <div className="modal-buttons">
                    <button className="modal-button confirm" onClick={onConfirm}>Aceptar</button>
                    <button className="modal-button cancel" onClick={onClose}>Cancelar</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;