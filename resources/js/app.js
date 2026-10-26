
import './bootstrap';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

document.addEventListener('DOMContentLoaded', () => {
    const mapElement = document.getElementById('map');

    // Evitar inicializar el mapa en páginas que no lo contienen.
    if (!mapElement) {
        return;
    }

    // Coordenadas aproximadas del centro de Paita, Piura.
    const paitaCoordinates = [-5.0892, -81.1144];

    const map = L.map(mapElement).setView(paitaCoordinates, 14);

    // Mapa base de OpenStreetMap.
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);

    // Marcador provisional para comprobar que el mapa funciona.
    L.marker(paitaCoordinates)
        .addTo(map)
        .bindPopup('Paita, Piura')
        .openPopup();
    
    // Elementos del formulario modal.
    const reportButton = document.getElementById('report-button');
    const reportModal = document.getElementById('report-modal');
    const closeReportModal = document.getElementById('close-report-modal');
    const reportForm = document.getElementById('flood-report-form');

    // Abrir el modal.
    reportButton?.addEventListener('click', () => {
        if (!reportModal) return;

        reportModal.hidden = false;
        document.body.style.overflow = 'hidden';

        closeReportModal?.focus();
    });

    // Cerrar el modal.
    const closeModal = () => {
        if (!reportModal) return;

        reportModal.hidden = true;
        document.body.style.overflow = '';
        reportButton?.focus();
    };

    closeReportModal?.addEventListener('click', closeModal);

    // Cerrar al pulsar fuera del formulario.
    reportModal?.addEventListener('click', (event) => {
        if (event.target === reportModal) {
            closeModal();
        }
    });

    // Cerrar con la tecla Escape.
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && reportModal && !reportModal.hidden) {
            closeModal();
        }
    });

    // Por ahora, validar visualmente sin guardar datos.
    reportForm?.addEventListener('submit', (event) => {
        event.preventDefault();

        const message = document.getElementById('report-form-message');

        if (message) {
            message.textContent =
                'Formulario validado visualmente. El envío se habilitará en el siguiente paso.';
            message.hidden = false;
        }
    });

});


