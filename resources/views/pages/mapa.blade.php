
@extends('layouts.app')

@section('title', 'InundApp | Mapa de inundaciones')

@section('content')
    <header class="app-header">
        <div class="brand">Inund<span>App</span></div>

        <p class="subtitle">
            Mapa colaborativo de calles inundadas en Paita
        </p>

        <label class="sr-only" for="street-search">
            Buscar una calle
        </label>

        <input
            id="street-search"
            class="search-input"
            type="search"
            placeholder="Buscar una calle..."
            autocomplete="off"
        >
    </header>

    
    <nav class="map-legend" aria-label="Niveles de inundación">
        <span class="legend-item">
            <i class="legend-icon legend-icon--high" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                    <path d="M12 3 22 21H2L12 3Z"
                        fill="none" stroke="currentColor"
                        stroke-width="2" stroke-linejoin="round"/>
                    <path d="M12 9v5m0 3h.01"
                        fill="none" stroke="currentColor"
                        stroke-width="2.5" stroke-linecap="round"/>
                </svg>
            </i>
            Intransitable
        </span>

        <span class="legend-item">
            <i class="legend-icon legend-icon--medium" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                    <path d="M3 9c2.25-2 4.5-2 6.75 0s4.5 2 6.75 0S21 7 23 9M1 15c2.25-2 4.5-2 6.75 0s4.5 2 6.75 0 4.5-2 6.75 0 2.5 1 3.5 0"
                        fill="none" stroke="currentColor"
                        stroke-width="2" stroke-linecap="round"/>
                </svg>
            </i>
            Inundación importante
        </span>

        <span class="legend-item">
            <i class="legend-icon legend-icon--low" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                    <path d="M12 3C9.5 7 6 10.3 6 14a6 6 0 0 0 12 0c0-3.7-3.5-7-6-11Z"
                        fill="none" stroke="currentColor"
                        stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round"/>
                </svg>
            </i>
            Agua acumulada
        </span>
    </nav>


    <main class="map-page">
        <h1 class="map-title">Mapa de zonas afectadas</h1>

        
    <div class="map-container">
        <div
            id="map"
            role="application"
            aria-label="Mapa interactivo de Paita"
        ></div>

        <button
            id="my-location-button"
            class="my-location-button"
            type="button"
            aria-label="Encontrar mi ubicación"
            title="Encontrar mi ubicación"
        >
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle
                    cx="12" cy="12" r="8"
                    fill="none" stroke="currentColor"
                    stroke-width="2"
                />
                <circle
                    cx="12" cy="12" r="2.5"
                    fill="currentColor"
                />
                <path
                    d="M12 2v3m0 14v3M2 12h3m14 0h3"
                    fill="none" stroke="currentColor"
                    stroke-width="2" stroke-linecap="round"
                />
            </svg>
        </button>
    </div>


        <section class="notice" aria-label="Información importante">
            <h2>Consulta ciudadana</h2>
            <p>
                Consulta los reportes de inundación antes de desplazarte.
                Verifica la fecha y el estado de cada reporte.
            </p>
        </section>
    </main>

    <button
        id="report-button"
        class="report-button"
        type="button"
    >
        + Reportar inundación
    </button>
    
@include('pages.reporte-modal')
@endsection
