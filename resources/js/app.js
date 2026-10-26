
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
  
    // Selección de ubicación para el reporte.
    const selectLocationButton = document.getElementById(
        'select-location-button'
    );

    const locationInput = document.getElementById('report-location');
    const latitudeInput = document.getElementById('report-latitude');
    const longitudeInput = document.getElementById('report-longitude');

    let locationMarker = null;
    let selectingLocation = false;

    // Marcador provisional que sigue el cursor.
    const previewIcon = L.divIcon({
        className: 'location-preview-icon',
        html: '<span class="location-pin"></span>',
        iconSize: [28, 36],
        iconAnchor: [14, 34]
    });

    let previewMarker = null;

    selectLocationButton?.addEventListener('click', () => {
        if (reportModal) {
            reportModal.hidden = true;
        }

        document.body.style.overflow = '';

        selectingLocation = true;
        mapElement.classList.add('map-selecting-location');

        if (!previewMarker) {
            previewMarker = L.marker(map.getCenter(), {
                icon: previewIcon,
                interactive: false,
                zIndexOffset: 1000
            }).addTo(map);
        } else {
            previewMarker.setLatLng(map.getCenter()).addTo(map);
        }

        mapElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    });

    // El icono sigue el cursor mientras se selecciona.
    map.on('mousemove', (event) => {
        if (selectingLocation && previewMarker) {
            previewMarker.setLatLng(event.latlng);
        }
    });

    // En móvil, el primer toque mueve el icono y el siguiente confirma.
    map.on('click', (event) => {
        if (!selectingLocation) {
            return;
        }

        const { lat, lng } = event.latlng;

        latitudeInput.value = lat.toFixed(7);
        longitudeInput.value = lng.toFixed(7);

        if (locationMarker) {
            locationMarker.setLatLng(event.latlng);
        } else {
            locationMarker = L.marker(event.latlng).addTo(map);
        }

        locationMarker
            .bindPopup('Ubicación seleccionada para el reporte')
            .openPopup();

        locationInput.value =
            `Latitud: ${lat.toFixed(5)}, Longitud: ${lng.toFixed(5)}`;

        selectingLocation = false;
        mapElement.classList.remove('map-selecting-location');

        if (previewMarker) {
            map.removeLayer(previewMarker);
        }

        if (reportModal) {
            reportModal.hidden = false;
            document.body.style.overflow = 'hidden';
        }
    });


    // El botón activa el modo de selección en el mapa.
    selectLocationButton?.addEventListener('click', () => {
        if (reportModal) {
            reportModal.hidden = true;
        }

        document.body.style.overflow = '';
        selectingLocation = true;

        mapElement.classList.add('map-selecting-location');

        map.getContainer().style.cursor = 'crosshair';

        mapElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    });

    // Al hacer clic en el mapa, se registra el punto elegido.
    map.on('click', (event) => {
        if (!selectingLocation) {
            return;
        }

        const { lat, lng } = event.latlng;

        latitudeInput.value = lat.toFixed(7);
        longitudeInput.value = lng.toFixed(7);

        if (locationMarker) {
            locationMarker.setLatLng(event.latlng);
        } else {
            locationMarker = L.marker(event.latlng).addTo(map);
        }

        locationMarker.bindPopup('Ubicación seleccionada para el reporte').openPopup();

        locationInput.value =
            `Latitud: ${lat.toFixed(5)}, Longitud: ${lng.toFixed(5)}`;

        selectingLocation = false;
        mapElement.classList.remove('map-selecting-location');

        map.getContainer().style.cursor = '';

        if (reportModal) {
            reportModal.hidden = false;
            document.body.style.overflow = 'hidden';
        }
    });

    
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


