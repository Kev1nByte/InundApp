
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

    
    // Validación del formulario de inundaciones.
    const reportMessage = document.getElementById('report-form-message');
    const photoInput = document.getElementById('report-photo');

    
    const reportStepData = document.getElementById('report-step-data');
    const reportStepReview = document.getElementById('report-step-review');

    const backToReport = document.getElementById('back-to-report');
    const confirmReport = document.getElementById('confirm-report');

    const reviewLocation = document.getElementById('review-location');
    const reviewCoordinates = document.getElementById('review-coordinates');
    const reviewSeverity = document.getElementById('review-severity');
    const reviewDescription = document.getElementById('review-description');

    const reviewPhotoContainer = document.getElementById('review-photo-container');
    const reviewPhoto = document.getElementById('review-photo');
    const reviewMessage = document.getElementById('review-message');

    const severityLabels = {
        low: 'Agua acumulada',
        medium: 'Inundación importante',
        high: 'Intransitable'
    };

    let reviewPhotoUrl = null;

    const showReviewMessage = (text) => {
        reviewMessage.textContent = text;
        reviewMessage.hidden = false;
    };

    reportForm?.addEventListener('submit', (event) => {
        event.preventDefault();

        if (!reportForm.reportValidity()) {
            return;
        }

        const latitude = latitudeInput.value;
        const longitude = longitudeInput.value;
        const severity = document.getElementById('report-severity').value;
        const description = document.getElementById('report-description').value.trim();
        const photo = document.getElementById('report-photo').files[0];

        if (
            !locationInput.value.trim() ||
            latitude === '' ||
            longitude === '' ||
            !Number.isFinite(Number(latitude)) ||
            !Number.isFinite(Number(longitude)) ||
            Number(latitude) < -90 ||
            Number(latitude) > 90 ||
            Number(longitude) < -180 ||
            Number(longitude) > 180
        ) {
            const message = document.getElementById('report-form-message');
            message.textContent = 'Selecciona una ubicación válida en el mapa.';
            message.hidden = false;
            return;
        }

        if (!severityLabels[severity] || !description) {
            return;
        }

        if (photo) {
            const validTypes = ['image/jpeg', 'image/png', 'image/webp'];

            if (!validTypes.includes(photo.type) ||
                photo.size > 5 * 1024 * 1024) {
                const message = document.getElementById('report-form-message');
                message.textContent =
                    'Selecciona una imagen JPG, PNG o WebP de máximo 5 MB.';
                message.hidden = false;
                return;
            }
        }

        // Preparar el resumen de revisión.
        reviewLocation.textContent = locationInput.value;
        reviewCoordinates.textContent =
            `Latitud: ${latitude} · Longitud: ${longitude}`;

        reviewSeverity.textContent = severityLabels[severity];
        reviewDescription.textContent = description;

        if (reviewPhotoUrl) {
            URL.revokeObjectURL(reviewPhotoUrl);
            reviewPhotoUrl = null;
        }

        if (photo) {
            reviewPhotoUrl = URL.createObjectURL(photo);

            reviewPhoto.onload = () => {
                reviewPhotoContainer.hidden = false;
            };

            reviewPhoto.onerror = () => {
                reviewPhotoContainer.hidden = true;
                showReviewMessage('No se pudo mostrar la fotografía seleccionada.');
            };

            reviewPhoto.src = reviewPhotoUrl;
        } else {
            reviewPhoto.removeAttribute('src');
            reviewPhotoContainer.hidden = true;
        }

        document.getElementById('report-form-message').hidden = true;
        reviewMessage.hidden = true;

        reportStepData.hidden = true;
        reportStepReview.hidden = false;

        document.getElementById('report-modal-title').textContent =
            'Revisar reporte';

        reportStepReview.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });

    // Regresar al formulario sin perder los datos.
    backToReport?.addEventListener('click', () => {
        reportStepReview.hidden = true;
        reportStepData.hidden = false;

        document.getElementById('report-modal-title').textContent =
            'Reportar inundación';

        document.getElementById('report-description').focus();
    });

    // Confirmación provisional: todavía no guarda en la base de datos.
    confirmReport?.addEventListener('click', () => {
        showReviewMessage(
            'La revisión está lista. El siguiente paso es conectar la confirmación con el guardado del reporte.'
        );
    });


    document.addEventListener('DOMContentLoaded', () => {
        const evidence = document.getElementById('evidence');
        const preview = document.getElementById('photo-preview');
        const form = document.getElementById('flood-report-form');
        const message = document.getElementById('report-message');

        if (evidence && preview) {
            let previewUrl = null;

            evidence.addEventListener('change', () => {
                if (previewUrl) {
                    URL.revokeObjectURL(previewUrl);
                    previewUrl = null;
                }

                const file = evidence.files[0];

                if (!file) {
                    preview.removeAttribute('src');
                    preview.hidden = true;
                    return;
                }

                if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
                    evidence.value = '';
                    preview.removeAttribute('src');
                    preview.hidden = true;

                    if (message) {
                        message.textContent = 'Selecciona una imagen JPG, PNG o WEBP.';
                    }
                    return;
                }

                if (file.size > 5 * 1024 * 1024) {
                    evidence.value = '';
                    preview.removeAttribute('src');
                    preview.hidden = true;

                    if (message) {
                        message.textContent = 'La imagen no debe superar los 5 MB.';
                    }
                    return;
                }

                if (message) {
                    message.textContent = '';
                }

                previewUrl = URL.createObjectURL(file);
                preview.src = previewUrl;
                preview.hidden = false;
            });
        }

        if (form) {
            form.addEventListener('submit', (event) => {
                event.preventDefault();

                if (!form.reportValidity()) {
                    return;
                }

                if (message) {
                    message.textContent =
                        'El formulario está validado, pero todavía falta implementar el guardado del reporte.';
                }
            });
        }
    });


});


