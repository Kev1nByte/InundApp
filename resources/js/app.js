
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
});
