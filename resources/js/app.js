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

    
    // Buscador de calles y lugares.
    const streetSearch = document.getElementById('street-search');

    let searchMarker = null;
    let searchTimeout = null;
    let searchResults = [];

    const searchResultsList = document.createElement('div');
    searchResultsList.className = 'street-search-results';
    searchResultsList.hidden = true;
    searchResultsList.setAttribute('role', 'listbox');

    streetSearch?.insertAdjacentElement('afterend', searchResultsList);

    const searchPlace = async (query) => {
        const searchText = query.trim();

        if (searchText.length < 3) {
            searchResultsList.hidden = true;
            searchResultsList.replaceChildren();
            return;
        }

        searchResultsList.hidden = false;
        searchResultsList.replaceChildren();

        const loading = document.createElement('div');
        loading.className = 'street-search-message';
        loading.textContent = 'Buscando lugares...';
        searchResultsList.appendChild(loading);

        try {
            const params = new URLSearchParams({
                q: `${searchText}, Paita, Piura, Peru`,
                format: 'jsonv2',
                limit: '5',
                countrycodes: 'pe'
            });

            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?${params}`
            );

            if (!response.ok) {
                throw new Error('Error al buscar lugares.');
            }

            const results = await response.json();

            searchResultsList.replaceChildren();
            searchResults = results;

            if (results.length === 0) {
                const empty = document.createElement('div');
                empty.className = 'street-search-message';
                empty.textContent = 'No se encontraron lugares.';
                searchResultsList.appendChild(empty);
                return;
            }

            results.forEach((place, index) => {
                const option = document.createElement('button');
                option.type = 'button';
                option.className = 'street-search-option';
                option.textContent = place.display_name;
                option.setAttribute('role', 'option');

                option.addEventListener('click', () => {
                    const coordinates = [
                        Number(place.lat),
                        Number(place.lon)
                    ];

                    map.setView(coordinates, 17);

                    if (!searchMarker) {
                        searchMarker = L.marker(coordinates).addTo(map);
                    } else {
                        searchMarker.setLatLng(coordinates);
                    }

                    searchMarker
                        .bindPopup(place.display_name)
                        .openPopup();

                    streetSearch.value = place.display_name;
                    searchResultsList.hidden = true;
                });

                searchResultsList.appendChild(option);
            });
        } catch (error) {
            console.error('Error en el buscador:', error);
            searchResultsList.replaceChildren();

            const message = document.createElement('div');
            message.className = 'street-search-message';
            message.textContent =
                'No se pudo realizar la búsqueda. Inténtalo nuevamente.';

            searchResultsList.appendChild(message);
        }
    };

    streetSearch?.addEventListener('input', () => {
        clearTimeout(searchTimeout);

        searchTimeout = setTimeout(() => {
            searchPlace(streetSearch.value);
        }, 700);
    });

    document.addEventListener('click', (event) => {
        if (
            !streetSearch?.contains(event.target) &&
            !searchResultsList.contains(event.target)
        ) {
            searchResultsList.hidden = true;
        }
    });

    
    // Botón para detectar la ubicación actual.
    const myLocationButton = document.getElementById(
        'my-location-button'
    );

    let currentLocationMarker = null;
    let currentAccuracyCircle = null;

    const currentLocationIcon = L.divIcon({
        className: 'current-location-icon',
        html: '<span class="current-location-dot"></span>',
        iconSize: [22, 22],
        iconAnchor: [11, 11]
    });

    myLocationButton?.addEventListener('click', () => {
        if (!navigator.geolocation) {
            alert('Tu navegador no permite detectar la ubicación.');
            return;
        }

        myLocationButton.disabled = true;

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude, accuracy } =
                    position.coords;

                const coordinates = [latitude, longitude];

                // Centrar el mapa donde está el usuario.
                map.setView(coordinates, 17);

                if (!currentLocationMarker) {
                    currentLocationMarker = L.marker(coordinates, {
                        icon: currentLocationIcon,
                        zIndexOffset: 2000
                    }).addTo(map);
                } else {
                    currentLocationMarker.setLatLng(coordinates);
                }

                currentLocationMarker
                    .bindPopup('Estás aquí')
                    .openPopup();

                // Círculo que representa el margen de precisión.
                if (!currentAccuracyCircle) {
                    currentAccuracyCircle = L.circle(
                        coordinates,
                        {
                            radius: accuracy,
                            color: '#2563eb',
                            weight: 1,
                            fillColor: '#3b82f6',
                            fillOpacity: 0.12,
                            interactive: false
                        }
                    ).addTo(map);
                } else {
                    currentAccuracyCircle
                        .setLatLng(coordinates)
                        .setRadius(accuracy);
                }

                myLocationButton.disabled = false;
            },
            (error) => {
                const messages = {
                    1: 'Debes permitir el acceso a tu ubicación.',
                    2: 'No se pudo determinar tu ubicación. Comprueba los servicios de ubicación.',
                    3: 'La detección tardó demasiado. Inténtalo nuevamente.'
                };

                alert(
                    messages[error.code] ||
                    'Ocurrió un error al detectar tu ubicación.'
                );

                myLocationButton.disabled = false;
            },
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 10000
            }
        );
    });


    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);

    // Capa independiente para los reportes guardados.
    const reportsLayer = L.layerGroup().addTo(map);

    // Colores según la gravedad del reporte.
    
    // Colores e iconos según la gravedad del reporte.
    const severityStyles = {
        low: {
            color: '#eab308',
            icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3C9.5 7 6 10.3 6 14a6 6 0 0 0 12 0c0-3.7-3.5-7-6-11Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
        },
        medium: {
            color: '#f97316',
            icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9c2.25-2 4.5-2 6.75 0s4.5 2 6.75 0S21 7 23 9M1 15c2.25-2 4.5-2 6.75 0s4.5 2 6.75 0 4.5-2 6.75 0 2.5 1 3.5 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
        },
        high: {
            color: '#ef4444',
            icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 22 21H2L12 3Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M12 9v5m0 3h.01" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>'
        }
    };

    // Consultar los reportes registrados en Laravel.
    const loadReports = async () => {
        try {
            const response = await fetch('/reportes', {
                headers: {
                    Accept: 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('No se pudieron cargar los reportes.');
            }

            const reports = await response.json();

            reportsLayer.clearLayers();

            reports.forEach((report) => {
                const latitude = Number(report.latitude);
                const longitude = Number(report.longitude);

                if (
                    !Number.isFinite(latitude) ||
                    !Number.isFinite(longitude) ||
                    latitude < -90 ||
                    latitude > 90 ||
                    longitude < -180 ||
                    longitude > 180
                ) {
                    return;
                }

                
                const style = severityStyles[report.severity] || {
                    color: '#64748b',
                    icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="7" fill="currentColor"/></svg>'
                };

                const markerIcon = L.divIcon({
                    className: 'flood-report-marker-wrapper',
                    html: `
                        <span class="flood-report-marker"
                            style="--marker-color: ${style.color}">
                            ${style.icon}
                        </span>
                    `,
                    iconSize: [38, 38],
                    iconAnchor: [19, 19],
                    popupAnchor: [0, -21]
                });

                const marker = L.marker(
                    [latitude, longitude],
                    { icon: markerIcon }
                );


                // Construir el popup sin insertar texto del usuario como HTML.
                const popup = document.createElement('div');

                const title = document.createElement('strong');
                title.textContent =
                    severityLabels[report.severity] || 'Reporte de inundación';

                const description = document.createElement('p');
                description.textContent = report.description || 'Sin descripción';

                const status = document.createElement('p');
                status.textContent = `Estado: ${report.status || 'Sin estado'}`;

                popup.append(title, description, status);

                if (report.created_at) {
                    const date = new Date(report.created_at);

                    const dateElement = document.createElement('p');
                    dateElement.textContent = Number.isNaN(date.getTime())
                        ? ''
                        : `Fecha: ${date.toLocaleString('es-PE')}`;

                    popup.appendChild(dateElement);
                }

                if (report.photo_path) {
                const photo = document.createElement('img');

                photo.src = report.photo_path;
                photo.alt = 'Fotografía del reporte de inundación';
                photo.loading = 'lazy';

                photo.style.display = 'block';
                photo.style.width = '100%';
                photo.style.maxHeight = '180px';
                photo.style.objectFit = 'cover';
                photo.style.borderRadius = '8px';
                photo.style.marginTop = '10px';
                photo.style.cursor = 'pointer';

                // Permitir abrir la imagen completa al pulsarla.    
                photo.addEventListener('click', () => {
                    const overlay = document.createElement('div');
                    overlay.className = 'photo-lightbox';

                    const fullImage = document.createElement('img');
                    fullImage.src = report.photo_path;
                    fullImage.alt = 'Fotografía ampliada del reporte de inundación';

                    const closeButton = document.createElement('button');
                    closeButton.type = 'button';
                    closeButton.className = 'photo-lightbox-close';
                    closeButton.textContent = '×';
                    closeButton.setAttribute('aria-label', 'Cerrar fotografía');

                    overlay.append(closeButton, fullImage);
                    document.body.appendChild(overlay);

                    const closeLightbox = () => overlay.remove();

                    closeButton.addEventListener('click', closeLightbox);

                    overlay.addEventListener('click', (event) => {
                        if (event.target === overlay) {
                            closeLightbox();
                        }
                    });

                    const handleEscape = (event) => {
                        if (event.key === 'Escape') {
                            closeLightbox();
                            document.removeEventListener('keydown', handleEscape);
                        }
                    };

                    document.addEventListener('keydown', handleEscape);
                });


                popup.appendChild(photo);
            }

                //marker.bindPopup(popup);
                marker.bindPopup(popup, {
                    maxWidth: 280,
                    minWidth: 220
                });
                marker.addTo(reportsLayer);
            });
        } catch (error) {
            console.error('Error al cargar los reportes:', error);
        }
    };

    // Mostrar los reportes existentes al abrir el mapa.
    loadReports();

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
    
    // Activar selección con la ubicación actual como punto inicial.
    selectLocationButton?.addEventListener('click', () => {
        if (!navigator.geolocation) {
            showFormMessage(
                'Tu navegador no permite detectar la ubicación.'
            );
            return;
        }

        selectLocationButton.disabled = true;
        showFormMessage('Obteniendo tu ubicación actual...');

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                const coordinates = [lat, lng];

                // Centrar el mapa en la ubicación detectada.
                map.setView(coordinates, 17);

                // Mostrar el marcador de ubicación.
                if (!previewMarker) {
                    previewMarker = L.marker(coordinates, {
                        icon: previewIcon,
                        draggable: false,
                        zIndexOffset: 3000
                    }).addTo(map);
                } else {
                    previewMarker.setLatLng(coordinates);

                    if (!map.hasLayer(previewMarker)) {
                        previewMarker.addTo(map);
                    }

                    previewMarker.setZIndexOffset(3000);
                }

                previewMarker
                    .bindPopup('Ubicación actual para el reporte', {
                        offset: [0, -10],
                        closeButton: true,
                        autoPan: false
                    })
                    .openPopup();

                previewMarker.getElement()?.classList.add('report-location-confirmed');

                // Guardar las coordenadas en el formulario.
                latitudeInput.value = lat.toFixed(7);
                longitudeInput.value = lng.toFixed(7);

                locationInput.value =
                    `Latitud: ${lat.toFixed(5)}, Longitud: ${lng.toFixed(5)}`;

                locationMarker = previewMarker;

                showFormMessage(
                    'Se está utilizando tu ubicación actual para registrar este reporte.'
                );

                showLocationSuccess(
                    '¡Ubicación detectada!'
                );

                selectLocationButton.disabled = false;
            },
            (error) => {
                const messages = {
                    1: 'Debes permitir el acceso a tu ubicación.',
                    2: 'No se pudo determinar tu ubicación.',
                    3: 'La detección tardó demasiado. Inténtalo nuevamente.'
                };

                showFormMessage(
                    messages[error.code] ||
                    'No se pudo obtener tu ubicación.'
                );

                selectLocationButton.disabled = false;
            },
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 10000
            }
        );
    });
    
    // Registrar la ubicación seleccionada.
    map.on('click', (event) => {
        if (!selectingLocation) return;

        const { lat, lng } = event.latlng;

        latitudeInput.value = lat.toFixed(7);
        longitudeInput.value = lng.toFixed(7);

        if (previewMarker) {
            previewMarker.setLatLng(event.latlng);
            locationMarker = previewMarker;
            previewMarker = null;
        } else if (locationMarker) {
            locationMarker.setLatLng(event.latlng);
        } else {
            locationMarker = L.marker(event.latlng, {
                icon: previewIcon
            }).addTo(map);
        }
        locationMarker
            .bindPopup('Ubicación seleccionada para el reporte')
            .openPopup();

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
    
    const showLocationSuccess = (message) => {
        const notification = document.createElement('div');

        notification.textContent = `✓ ${message}`;
        notification.setAttribute('role', 'status');
        notification.setAttribute('aria-live', 'polite');

        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#16a34a',
            color: '#ffffff',
            padding: '14px 20px',
            borderRadius: '10px',
            boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
            zIndex: '99999',
            width: 'max-content',
            maxWidth: '90%',
            fontSize: '14px',
            fontWeight: '600',
            textAlign: 'center'
        });

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3500);
    };

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

            if (!validTypes.includes(photo.type)) {
                showFormMessage(
                    'Solo se permiten fotografías JPG, PNG o WebP.'
                );
                return;
            }

            if (photo.size > 5 * 1024 * 1024) {
                showFormMessage(
                    'La fotografía no debe superar los 5 MB.'
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

                // Actualizar los marcadores con los datos guardados en el servidor.
                await loadReports();    

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
