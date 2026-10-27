
import './bootstrap';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

document.addEventListener('DOMContentLoaded', () => {
    const mapElement = document.getElementById('map');

    // Esta página no necesita inicializar el mapa si no lo contiene.
    if (!mapElement) {
        return;
    }

    // Mapa centrado en Paita, Piura.
    const paitaCoordinates = [-5.0892, -81.1144];

    const map = L.map(mapElement).setView(paitaCoordinates, 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);

    // Elementos del mapa y selección de ubicación.
    const selectLocationButton = document.getElementById(
        'select-location-button'
    );

    const locationInput = document.getElementById('report-location');
    const latitudeInput = document.getElementById('report-latitude');
    const longitudeInput = document.getElementById('report-longitude');

    const reportButton = document.getElementById('report-button');
    const reportModal = document.getElementById('report-modal');
    const closeReportModal = document.getElementById('close-report-modal');
    const reportForm = document.getElementById('flood-report-form');

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

    const reviewPhotoContainer = document.getElementById(
        'review-photo-container'
    );
    const reviewPhoto = document.getElementById('review-photo');
    const reviewMessage = document.getElementById('review-message');

    const severityLabels = {
        low: 'Agua acumulada',
        medium: 'Inundación importante',
        high: 'Intransitable'
    };

    let locationMarker = null;
    let previewMarker = null;
    let selectingLocation = false;
    let reviewPhotoUrl = null;

    const showReviewMessage = (message) => {
        if (!reviewMessage) return;

        reviewMessage.textContent = message;
        reviewMessage.hidden = false;
    };

    const showFormMessage = (message) => {
        if (!reportMessage) return;

        reportMessage.textContent = message;
        reportMessage.hidden = false;
    };

    // Icono provisional para seleccionar una ubicación.
    const previewIcon = L.divIcon({
        className: 'location-preview-icon',
        html: '<span class="location-pin"></span>',
        iconSize: [28, 36],
        iconAnchor: [14, 34]
    });

    // Abrir el formulario.
    reportButton?.addEventListener('click', () => {
        if (!reportModal) return;

        reportModal.hidden = false;
        document.body.style.overflow = 'hidden';
        closeReportModal?.focus();
    });

    // Cerrar el formulario.
    const closeModal = () => {
        if (!reportModal) return;

        reportModal.hidden = true;
        document.body.style.overflow = '';
        reportButton?.focus();
    };

    closeReportModal?.addEventListener('click', closeModal);

    reportModal?.addEventListener('click', (event) => {
        if (event.target === reportModal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (
            event.key === 'Escape' &&
            reportModal &&
            !reportModal.hidden
        ) {
            closeModal();
        }
    });

    // Activar el modo de selección de ubicación.
    selectLocationButton?.addEventListener('click', () => {
        if (reportModal) {
            reportModal.hidden = true;
        }

        document.body.style.overflow = '';
        selectingLocation = true;

        mapElement.classList.add('map-selecting-location');
        map.getContainer().style.cursor = 'crosshair';

        if (!previewMarker) {
            previewMarker = L.marker(map.getCenter(), {
                icon: previewIcon,
                interactive: false,
                zIndexOffset: 1000
            }).addTo(map);
        } else {
            previewMarker
                .setLatLng(map.getCenter())
                .addTo(map);
        }

        mapElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    });

    // El marcador provisional sigue el cursor.
    map.on('mousemove', (event) => {
        if (selectingLocation && previewMarker) {
            previewMarker.setLatLng(event.latlng);
        }
    });

    // Registrar la ubicación seleccionada.
    map.on('click', (event) => {
        if (!selectingLocation) return;

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
        map.getContainer().style.cursor = '';

        if (previewMarker) {
            map.removeLayer(previewMarker);
        }

        if (reportModal) {
            reportModal.hidden = false;
            document.body.style.overflow = 'hidden';
        }
    });

    // Preparar la revisión del reporte.
    reportForm?.addEventListener('submit', (event) => {
        event.preventDefault();

        if (!reportForm.reportValidity()) return;

        const latitude = latitudeInput.value;
        const longitude = longitudeInput.value;
        const severity = document.getElementById(
            'report-severity'
        ).value;
        const description = document.getElementById(
            'report-description'
        ).value.trim();
        const photo = photoInput?.files[0];

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
            showFormMessage(
                'Selecciona una ubicación válida en el mapa.'
            );
            return;
        }

        if (!severityLabels[severity] || !description) {
            showFormMessage(
                'Completa el nivel de inundación y la descripción.'
            );
            return;
        }

        if (photo) {
            const validTypes = [
                'image/jpeg',
                'image/png',
                'image/webp'
            ];

            if (
                !validTypes.includes(photo.type) ||
                photo.size > 5 * 1024 * 1024
            ) {
                showFormMessage(
                    'Selecciona una imagen JPG, PNG o WebP de máximo 5 MB.'
                );
                return;
            }
        }

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
            reviewPhoto.src = reviewPhotoUrl;
            reviewPhotoContainer.hidden = false;
        } else {
            reviewPhoto.removeAttribute('src');
            reviewPhotoContainer.hidden = true;
        }

        reportMessage.hidden = true;
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

    // Volver a editar sin perder los datos.
    backToReport?.addEventListener('click', () => {
        reportStepReview.hidden = true;
        reportStepData.hidden = false;

        document.getElementById('report-modal-title').textContent =
            'Reportar inundación';

        reviewMessage.hidden = true;

        document.getElementById('report-description').focus();
    });

    // Confirmar y enviar el reporte al backend.
    confirmReport?.addEventListener('click', async () => {
        const storeUrl = reportForm?.dataset.storeUrl;

        if (!storeUrl) {
            showReviewMessage(
                'No se encontró la ruta para guardar el reporte. ' +
                'Revisa la configuración del formulario.'
            );
            return;
        }

        const csrfToken =
            reportForm.querySelector('input[name="_token"]')?.value ||
            document.querySelector('meta[name="csrf-token"]')?.content;

        if (!csrfToken) {
            showReviewMessage(
                'No se encontró el token de seguridad. ' +
                'Recarga la página e inténtalo nuevamente.'
            );
            return;
        }

        const formData = new FormData(reportForm);

        // Asegurar los nombres esperados por Laravel.
        formData.set('latitude', latitudeInput.value);
        formData.set('longitude', longitudeInput.value);
        formData.set(
            'severity',
            document.getElementById('report-severity').value
        );
        formData.set(
            'description',
            document.getElementById('report-description').value.trim()
        );

        if (photoInput?.files[0]) {
            formData.set('photo', photoInput.files[0]);
        } else {
            formData.delete('photo');
        }

        confirmReport.disabled = true;
        confirmReport.textContent = 'Guardando reporte...';
        reviewMessage.hidden = true;

        try {
            const response = await fetch(storeUrl, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': csrfToken
                },
                body: formData
            });

            const result = await response.json();

            if (!response.ok) {
                if (response.status === 422 && result.errors) {
                    const errors = Object.values(result.errors).flat();
                    throw new Error(errors.join(' '));
                }

                throw new Error(
                    result.message ||
                    'No se pudo guardar el reporte.'
                );
            }

            
            const successMessage =
                result.message || 'Reporte registrado correctamente.';

            // Liberar la URL temporal de la vista previa.
            if (reviewPhotoUrl) {
                URL.revokeObjectURL(reviewPhotoUrl);
                reviewPhotoUrl = null;
            }

            // Limpiar el formulario para el siguiente reporte.
            reportForm.reset();

            reviewPhoto.removeAttribute('src');
            reviewPhotoContainer.hidden = true;

            // Regresar al primer paso.
            reportStepReview.hidden = true;
            reportStepData.hidden = false;

            document.getElementById('report-modal-title').textContent =
                'Reportar inundación';

            // Cerrar el modal.
            if (reportModal) {
                reportModal.hidden = true;
                document.body.style.overflow = '';
            }

            // Mostrar el mensaje de éxito fuera del modal.
            showFormMessage(successMessage);

            // Restaurar el botón para futuros reportes.
            confirmReport.disabled = false;
            confirmReport.textContent = 'Confirmar reporte';


        } catch (error) {
            showReviewMessage(
                error.message ||
                'Ocurrió un error al guardar el reporte.'
            );

            confirmReport.disabled = false;
            confirmReport.textContent = 'Confirmar reporte';
        }
    });
});
